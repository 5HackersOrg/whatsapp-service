import {
  Application,
  type ApplicationStatus,
  type ApplicationType,
} from "../../sequelize/models/application/Application.js";
import { SideGigProposal } from "../../sequelize/models/application/SideGigProposal.js";
import { Posted } from "../../sequelize/models/jobs/Posted.js";
import { CandidateRisk } from "../../sequelize/models/user/CandidateRisk.js";
import { CandidateStrength } from "../../sequelize/models/user/CandidateStrength.js";
import {
  RecruiterAdvice,
  type InterviewPriority,
} from "../../sequelize/models/user/RecruiterAdvice.js";
import { DBConnection } from "../../sequelize/setup.js";
import { sendMaxApplicantsReachedMessage } from "../../services/twillio/whatsappMessages/sendWhatsappMessage.js";
import { readJsonFileFromGCP } from "../../utils/gcp/bucketHelper.js";
import { promptAI } from "../../utils/genModel/genModel.js";
import { generateRecruiterAdvicePrompt } from "../../utils/prompts/generations/recruiterAdvicePrompt.js";
import { getEventDbMethods } from "../events/EventsDb.js";
import { getJobsDbMethods } from "../jobs/JobsDb.js";
import { getRecruiterDbMethods } from "../users/recruiters/RecruiterDb.js";
import { UserDb } from "../users/user/UserDb.js";
const eventDb = getEventDbMethods();
const recruiterDb = getRecruiterDbMethods();
const dbInstance = new DBConnection();
const db = dbInstance.getDb();
type aiInsights = {
  decision_drivers: {
    critical_gaps_and_risks: string[];
    strengths_to_leverage: string[];
  };
  interview_priority: InterviewPriority;
  suitability_rating: number;
  recruiter_headline: string;
  role_fit_analysis: string;
  thrive_potential_rating: number;
};
export class ApplicationsDb extends UserDb {
  constructor() {
    super("Applications Database");
  }

  async apply(
    targetId: string,
    userId: string,
    type: ApplicationType,
    jobId: string,
  ) {
    return await this.run("apply", async () => {
      const job = await getJobsDbMethods().getPostedJobInnfo(targetId);
      if (!job) throw new Error("Job not found");
      //@ts-ignore
      if (job.Posted.maxApplications <= 0) {
        const user = await this.getUserById(userId);
        if (!user) throw new Error("User not found");
        sendMaxApplicantsReachedMessage(job.title, user.phoneNumber!);
        return;
      }
      await Application.create({
        targetId,
        JobId: jobId,
        JobSeekerUserId: userId,
        type,
        status: "applied",
      });
      const recruiterId = await recruiterDb.getRecruiterIdFromJob(targetId);
      await eventDb.logEvent(
        recruiterId,
        targetId,
        "JOB",
        "UPDATE",
        "new application",
      );
      await this.descreaseJobMaxApplicationsNumber(targetId);
      const email = await this.getUserEmail(userId);
      const data = (await this.generateAiInsights(
        targetId,
        email!,
      )) as aiInsights;
      await this.createRecruiterAdvice(userId, data, targetId, recruiterId);
      return true;
    });
  }
  async createRecruiterAdvice(
    userId: string,
    data: aiInsights,
    jobId: string,
    recruiterId: string,
  ) {
    const transaction = await db.transaction();
    try {
      const recruiterAdvice = await RecruiterAdvice.create(
        {
          interviewPriority: data.interview_priority,
          JobId: jobId,
          JobSeekerId: userId,
          suitabilityRating: data.suitability_rating,
          thrivePotentialRating: data.thrive_potential_rating,
          recruiterHeadline: data.recruiter_headline,
          RecruiterId: recruiterId,
          RoleFitAnalysis: data.role_fit_analysis,
        },
        { transaction },
      );
      await CandidateStrength.bulkCreate(
        data.decision_drivers.strengths_to_leverage.map((s) => ({
          risk: s,
          RecruiterAdviceId: recruiterAdvice.dataValues.id!,
        })),
        { transaction },
      );
      await CandidateRisk.bulkCreate(
        data.decision_drivers.critical_gaps_and_risks.map((s) => ({
          risk: s,
          RecruiterAdviceId: recruiterAdvice.dataValues.id!,
        })),
        { transaction },
      );
      await transaction.commit();
      return recruiterAdvice;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw error;
    }
  }

  async updateStatus(
    targetId: string,
    userId: string,
    status: ApplicationStatus,
  ) {
    return await this.run("updateStatus", async () => {
      const app = await Application.findOne({
        where: { targetId, JobSeekerUserId: userId },
      });
      if (!app) throw new Error("Application not found");
      app.status = status;
      await app.save();
      return app;
    });
  }

  async getUserApplications(userId: string) {
    return await this.run("getUserApplications", () =>
      Application.findAll({ where: { JobSeekerUserId: userId } }),
    );
  }

  async getUserApplicationsByType(userId: string, type: ApplicationType) {
    return await this.run("getUserApplicationsByType", () =>
      Application.findAll({ where: { JobSeekerUserId: userId, type } }),
    );
  }
  async hasAppliedToJob(userId: string, jobId: string) {
    return await this.run("hasAppliedToJob", async () => {
      const app = await Application.findOne({
        where: { targetId: jobId, JobSeekerUserId: userId },
      });
      return app !== null;
    });
  }

  async createProposal(applicationId: string, userId: string, message: string) {
    return this.run(
      "createProposal DB Query",
      async () => {
        const existing = await SideGigProposal.findOne({
          where: { ApplicationId: applicationId },
        });
        if (existing)
          throw new Error("Proposal already exists for this application");
        const proposal = await SideGigProposal.create({
          ApplicationId: applicationId,
          UserId: userId,
          message,
        });

        return proposal;
      },
      "error",
    );
  }
  async descreaseJobMaxApplicationsNumber(jobId: string) {
    return await this.run(
      "descreaseJobMaxApplicationsNumber DB Query",
      async () => {
        const job = await Posted.findOne({ where: { JobId: jobId } });
        if (!job) throw new Error("Job not found");
        job.update({
          maxApplications: job.maxApplications - 1,
        });
      },
      "error",
    );
  }

  async getProposalsByUser(userId: string) {
    return await this.run("getProposalsByUser DB Query", async () => {
      const proposals = await SideGigProposal.findAll({
        where: { UserId: userId },
        order: [["createdAt", "DESC"]],
      });

      return proposals;
    });
  }
  async generateAiInsights(jobId: string, email: string) {
    return await this.run("generateAiInsights DB Query", async () => {
      const job = await getJobsDbMethods().getPostedJobInnfo(jobId);
      if (!job) throw new Error("Job not found");
      let jsonContent = await readJsonFileFromGCP(email);
      if (!jsonContent) throw new Error("json content not found");
      jsonContent = JSON.parse(jsonContent);
      const description = job.description;
      const prompt = generateRecruiterAdvicePrompt(description, jsonContent);
      const result = await promptAI({
        prompt: prompt,
        action: "generating ai insights",
        company_id: null,
        user_id: null,
        recruiterAdvice: true,
      });
      return result;
    });
  }

  async getProposalByApplication(applicationId: string) {
    return await this.run("getProposalByApplication DB Query", async () => {
      const proposal = await SideGigProposal.findOne({
        where: { ApplicationId: applicationId },
      });

      return proposal;
    });
  }
}

export const getApplicationsDbMethods = () => {
  return new ApplicationsDb();
};
