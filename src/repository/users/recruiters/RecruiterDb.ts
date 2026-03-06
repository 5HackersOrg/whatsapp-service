import { Job } from "../../../sequelize/models/jobs/Job.js";
import {
  Posted,
  type employmentType,
  type ProgramType,
} from "../../../sequelize/models/jobs/Posted.js";
import { ShortlistDb } from "../../applications/ShortlistDb.js";
import { RecruiterAudit } from "../../../sequelize/models/user/audit/RecruiterAudit.js";
import {
  Interview,
  type InterviewStatus,
} from "../../../sequelize/models/user/Interview.js";
import { User } from "../../../sequelize/models/user/Users.js";
import { getEventDbMethods } from "../../events/EventsDb.js";
import { Recruiter } from "../../../sequelize/models/user/Recruiter.js";
import { Company } from "../../../sequelize/models/company/Company.js";

const eventDb = getEventDbMethods();

export class RecruiterDb extends ShortlistDb {
  constructor() {
    super("Recruiter");
  }
  async getRecruiterIdFromJob(jobId: string) {
    return await this.run("getRecruiterIdFromJob DB Query", async () => {
      const job = await Job.findByPk(jobId, {
        attributes: ["id"],
        include: [
          {
            model: Posted,
            attributes: ["RecruiterUserid"],
          },
        ],
        raw: true,
        nest: true,
      });
      //@ts-ignore
      if (!job || !job.Posted) {
        throw new Error("Job not found or recruiter not assigned");
      }
      //@ts-ignore
      return job.Posted.RecruiterUserid;
    });
  }
  async getRecruiterCompanyId(recruiterId: string) {
    return await this.run("getRecruiterCompanyIds DB Query", async () => {
      const recruiter = await Recruiter.findByPk(recruiterId);
      if (!recruiter) throw new Error("Recruiter not found");
      return recruiter.dataValues.CompanyId;
    });
  }

  async suspendRecruiter(userId: string, adminId: string) {
    return await this.run("suspendRecruiter DB Query", async () => {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");

      if (user.suspended) {
        console.log("User is already suspended");
        return user;
      }
      user.suspended = true;
      await user.save();

      await RecruiterAudit.create({
        action: "disabled recruiter",
        event: "UPDATE",
        targetType: "RECRUITER",
        targetId: userId,
        performedBy: adminId,
      });
      await eventDb.logEvent(
        adminId,
        userId,
        "IAM",
        "UPDATE",
        "disabled recruiter",
      );

      return user;
    });
  }
  async getRecruiterCompany(recruiterId: string) {
    return await this.run("getRecruiterCompany DB Query", async () => {
      const recruiter = await Recruiter.findByPk(recruiterId, {
        include: [
          {
            model: Company,
            attributes: ["website", "logo", "name"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (!recruiter) throw new Error("Recruiter not found");
      //@ts-ignore
      if (!recruiter.Company) throw new Error("Company not found");
      //@ts-ignore
      return recruiter?.Company;
    });
  }

  async scheduleInterview(data: {
    CompanyId: string;
    RecruiterId: string;
    UserId: string;
    position: string;
    date: string;
    is_remote: boolean;
    location?: string;
    link?: string;
    metaData?: string;
  }) {
    return await this.run("scheduleInterview DB Query", async () => {
      await eventDb.logEvent(
        data.RecruiterId,
        data.UserId,
        "INTERVIEW",
        "CREATE",
        "created interview",
      );
      return Interview.create({
        ...data,
        status: "scheduled",
      });
    });
  }

  async rescheduleInterview(
    interviewId: string,
    newDate: string,
    newLocation?: string,
    newLink?: string,
  ) {
    return await this.run(
      "rescheduleInterview DB Query",
      async () => {
        const interview = await Interview.findByPk(interviewId);
        if (!interview) throw new Error("Interview not found");

        interview.date = newDate;
        if (newLocation !== undefined) interview.location = newLocation;
        if (newLink !== undefined) interview.link = newLink;

        // Optionally reset status to scheduled if it was cancelled or completed
        if (interview.status !== "scheduled") interview.status = "scheduled";

        return interview;
      },
      "error",
    );
  }

  async updateInterview(interviewId: string, updates: Partial<Interview>) {
    return await this.run("updateInterview DB Query", async () => {
      const interview = await Interview.findByPk(interviewId);
      if (!interview) throw new Error("Interview not found");

      Object.assign(interview, updates);
      await interview.save();
      return interview;
    });
  }

  async changeInterviewStatus(interviewId: string, status: InterviewStatus) {
    return await this.run("changeInterviewStatus DB Query", async () => {
      const interview = await Interview.findByPk(interviewId);
      if (!interview) throw new Error("Interview not found");

      interview.status = status;
      await interview.save();
      return interview;
    });
  }

  async addFeedback(interviewId: string, feedback: string) {
    return await this.run("addFeedback DB Query", async () => {
      const interview = await Interview.findByPk(interviewId);
      if (!interview) throw new Error("Interview not found");

      interview.feedback = feedback;
      await interview.save();
      return interview;
    });
  }

  async getInterview(interviewId: string) {
    return await this.run("getInterview DB Query", async () => {
      const interview = await Interview.findByPk(interviewId);
      if (!interview) throw new Error("Interview not found");
      return interview;
    });
  }

  async getInterviewsByRecruiter(recruiterId: string) {
    return await this.run("getInterviewsByRecruiter DB Query", async () => {
      return Interview.findAll({ where: { RecruiterId: recruiterId } });
    });
  }

  async getInterviewsByCandidate(userId: string) {
    return await this.run("getInterviewsByCandidate DB Query", async () => {
      return Interview.findAll({ where: { UserId: userId } });
    });
  }

  async getInterviewsByCompany(companyId: string) {
    return await this.run("getInterviewsByCompany DB Query", async () => {
      return Interview.findAll({ where: { CompanyId: companyId } });
    });
  }
  async disableJob(jobId: string) {
    return await this.run("disableJob DB Query", async () => {
      const job = await Job.findByPk(jobId);
      if (!job) throw new Error("Job not found");
      job.status = "DISABLED";
      await job.save();

      return job;
    });
  }
}
export const getRecruiterDbMethods = () => {
  return new RecruiterDb();
};
