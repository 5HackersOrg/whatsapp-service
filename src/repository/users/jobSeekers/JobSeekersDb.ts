import { Op } from "sequelize";
import { Job } from "../../../sequelize/models/jobs/Job.js";
import {
  Report,
  type ReportReason,
} from "../../../sequelize/models/jobs/Reports.js";
import { JobSeeker } from "../../../sequelize/models/user/JobSeeker.js";
import { User } from "../../../sequelize/models/user/Users.js";
import { UserWhatsappSession } from "../../../sequelize/models/user/UserWhatsappSession.js";
import { Verification } from "../../../sequelize/models/verification/verification.js";
import { DBConnection } from "../../../sequelize/setup.js";
import type { WhatsappSessionState } from "../../../utils/types/user/iUserDabase.js";
import { generateRefCode } from "../../../utils/types/whatsapp/allFunctions.js";
import { UserDb } from "../user/UserDb.js";
import { sendPostedJobMessage } from "../../../services/twillio/whatsappMessages/sendWhatsappMessage.js";
import { cosineSimilarity } from "../../../utils/embeddings/calculateSimillarity.js";
import { UserRole } from "../../../sequelize/models/user/UserRole.js";
import { Role } from "../../../sequelize/models/user/Role.js";
import type { Posted } from "../../../sequelize/models/jobs/Posted.js";
import { get } from "node:http";
import { getJobsDbMethods } from "../../jobs/JobsDb.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

const EMPTY_WHATSAPP_STATE: WhatsappSessionState = {
  email: null,
  otp: null,
  redeemded: false,
  password: "",
  referredCode: "",
  state: null,
  userId: null,
};

export class JobSeekerDb extends UserDb {
  constructor() {
    super("Job Seeker Database");
  }

  async getUserWhatsappState(
    phone_number: string,
  ): Promise<WhatsappSessionState> {
    const result = await this.run(
      "Get User Whatsapp State DB Query",
      async () => {
        const found_state = await UserWhatsappSession.findByPk(phone_number);
        if (!found_state) return EMPTY_WHATSAPP_STATE;

        const {
          customerWindowTimeout,
          redeemed,
          state,
          email,
          password,
          otp,
          referredCode,
          userId,
        } = found_state.dataValues;

        return {
          email,
          otp,
          password,
          redeemded: redeemed,
          referredCode,
          state,
          userId,
          customerServiceTimeout: customerWindowTimeout,
        };
      },
    );

    return result ?? EMPTY_WHATSAPP_STATE;
  }

  async updateUserWhatsappState(
    phone_number: string,
    data: WhatsappSessionState,
    create?: boolean,
  ) {
    await this.run("Update User Whatsapp State DB Query", async () => {
      const {
        customerServiceTimeout,
        email,
        password,
        otp,
        redeemded,
        referredCode,
        state,
        userId,
      } = data;

      const payload = {
        customerWindowTimeout: customerServiceTimeout ?? null,
        email: email ?? null,
        otp: otp ?? null,
        phoneNumber: phone_number,
        password: password ?? "",
        redeemed: redeemded ?? false,
        state: state ?? "",
        referredCode: referredCode ?? null,
        userId: userId ?? null,
      };

      if (create) {
        await UserWhatsappSession.create(payload);
      } else {
        await UserWhatsappSession.update(payload, {
          where: { phoneNumber: phone_number },
        });
      }
    });
  }

  async setUserName(userId: string, name: string) {
    await this.run("Set User Name DB Query", async () => {
      const user = await User.findByPk(userId);
      await user?.update({ name });
    });
  }

  async createJobSeeker(phoneNumber: string, data: WhatsappSessionState) {
    const transaction = await db.transaction();
    try {
      const user = await User.create(
        {
          email: data.email!,
          phoneNumber,
          password: data.password!,
        },
        { transaction },
      );
      const role = await Role.findOne({ where: { name: "jobSeeker" } });
      await UserRole.create(
        {
          RoleId: role?.dataValues.id!,
          UserId: user.dataValues.id,
        },
        { transaction },
      );
      const verification = await Verification.create(
        {
          target_type: "user",
          type: "identity",
          status: "pending",
        },
        { transaction },
      );

      const refCode = generateRefCode();
      await JobSeeker.create(
        {
          UserId: user.dataValues.id,
          averageRating: 0.0,
          coverLetterTemplate: "Basic",
          credits: 6,
          foundJobsToday: 0,
          optInForSideGigs: false,
          referredBy: data.referredCode ?? null,
          refCode,
          totalReferrals: 0,
          resumeTemplate: "Minimal",
          scrappedJobs: 0,
          subscriptionValid: false,
          subscriptionTier: "Free",
          verifiedId: verification.dataValues.id,
        },
        { transaction },
      );

      await transaction.commit();
      data.userId = user.dataValues.id;
      await this.updateUserWhatsappState(phoneNumber, data);
    } catch (error) {
      await transaction.rollback();
      await this.log("Create JobSeeker DB Query", error);
    }
  }
  async setJobSeekerEmbedding(userId: string, embedding: string) {
    return await this.run(
      "Set JobSeeker Embedding DB Query",
      async () => {
        console.log("embedding", embedding);
        const jobSeeker = await JobSeeker.findOne({
          where: { UserId: userId },
        });
        if (!jobSeeker) throw new Error("JobSeeker not found");
        jobSeeker.update({
          embedding: embedding,
        });
        console.log("embedding set");
      },
      "critical",
    );
  }
  private async filterUsers(
    jobXp: number,
    jobEd: number,
    jobInd: string,
    embedding: string,
  ) {
    return this.run(
      "Filter Users For Job Posting Notification DB Query",
      async () => {
        const users = await User.findAll({
          include: [
            {
              model: JobSeeker,
              required: true,
              where: {
                experience: {
                  [Op.gte]: jobXp,
                },
                educationLevel: {
                  [Op.gte]: jobEd,
                },
                industry: {
                  [Op.like]: `%${jobInd}%`,
                },
              },
            },
          ],
          raw: true,
          nest: true,
        });
        console.log("pre users filtered :", users);
        const qualifiedUsers = users
          .filter((user) => {
            //@ts-ignore
            const userEmbedding = JSON.parse(user.JobSeeker.embedding);
            const jobEmbedding = JSON.parse(embedding);
            const simillarity = cosineSimilarity(userEmbedding, jobEmbedding);
            console.log("simillarity:", simillarity);
            if (simillarity > 0.66) {
              return user;
            } else {
              return null;
            }
          })
          .filter((user) => user !== null);
        console.log("qulaified users:", qualifiedUsers);
        return qualifiedUsers;
      },
    );
  }
  private async sendNotificationMessage(
    userId: string,
    number: string,
    job: any,
  ) {
    return this.run("Send Notification Message DB Query", async () => {
      await sendPostedJobMessage(number, job);
      await getJobsDbMethods().createUserSentJob(userId, job.id);
    });
  }
  async notifyJobSeekerAboutNewJobPosting(
    posted: Posted[],
    createdJobs: Job[],
    company: any,
  ) {
    return await this.run(
      "Notify JobSeeker About New Job Posting DB Query",
      async () => {
        if (!posted.length || !createdJobs.length) return;

        // Safety check
        if (posted.length !== createdJobs.length) {
          throw new Error("Posted and createdJobs length mismatch");
        }

        for (let i = 0; i < createdJobs.length; i++) {
          const job = createdJobs[i];
          const post = posted[i];
          if (!post || !job) continue;

          const formattedJob = {
            id: job.dataValues.id,
            title: job.dataValues.title,
            companyLogo: company.logo,
            companyName: company.name,
            programeType: post.dataValues.programType,
            employmentType: post.dataValues.employmentType,
            salary: job.dataValues.salary ?? null,
            website: company.website??null,
            industry: company.industry,
            company: post.dataValues.companyName,
            location: post.dataValues.location,
            description: job.dataValues.description,
          };

          const requiredExperience = post.dataValues.experience;
          const requiredEducation = post.dataValues.educationLevel;
          const jobIndustry = post.dataValues.industry;
          const jobEmbedding = post.dataValues.embedding;

          const qualifiedUsers = await this.filterUsers(
            requiredExperience,
            requiredEducation,
            jobIndustry,
            jobEmbedding,
          );

          if (!qualifiedUsers) continue;

          for (const user of qualifiedUsers) {
            await this.sendNotificationMessage(
              user.id,
              user.phoneNumber!,
              formattedJob,
            );
          }
        }
      },
    );
  }

  async getJobSeekerById(userId: string) {
    return await this.run(
      "Get JobSeeker By ID DB Query",
      async () =>
        await User.findOne({
          include: {
            model: JobSeeker,
            required: true,
            where: { UserId: userId },
          },
          raw: true,
          nest: true,
        }),
    );
  }

  async updateScrappedJobs(userid: string, count: number) {
    await this.run(
      "Update Scrapped Jobs DB Query",
      async () =>
        await JobSeeker.update(
          { scrappedJobs: count },
          { where: { UserId: userid } },
        ),
    );
  }
  async setEducationAndExperinenceAndIndustry(
    userId: string,
    educationLevel: number,
    experience: number,
    industry: string,
  ) {
    await this.run("Set Education And Experinence DB Query", async () => {
      const jobSeeker = await JobSeeker.findByPk(userId);
      if (!jobSeeker) throw new Error("JobSeeker not found");
      jobSeeker.update({
        educationLevel,
        experience,
        industry,
      });
    });
  }

  async updateUserProfileCredits(userId: string, credit: number) {
    await this.run("Update User Profile Credits DB Query", async () => {
      const jobSeeker = await JobSeeker.findByPk(userId);
      await jobSeeker?.update({
        credits: jobSeeker.dataValues.credits + credit,
      });
    });
  }
  async reportJob(jobId: string, reason: ReportReason) {
    return await this.run("reportJob DB Query", async () => {
      const job = await Job.findByPk(jobId);
      if (!job) throw new Error("Job not found");

      const report = await Report.create({
        JobId: job.id,
        reason,
      });

      return report;
    });
  }
  async getParsedUserEmbedding(userId: string) {
    return this.run("getParsedUserEmbedding DB Query", async () => {
      const jobSeeker = await JobSeeker.findByPk(userId, {
        attributes: ["embedding"],
      });

      if (!jobSeeker) throw new Error("JobSeeker not found");

      if (!jobSeeker.dataValues.embedding) return null;

      try {
        return JSON.parse(jobSeeker.dataValues.embedding) as number[];
      } catch {
        throw new Error("Invalid embedding format");
      }
    });
  }
}
export const getJobSeekerDbMethods = () => {
  return new JobSeekerDb();
};
