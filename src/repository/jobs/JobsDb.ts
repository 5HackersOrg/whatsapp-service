import { JobCache } from "../../sequelize/models/jobs/cache/JobCache.js";
import { JobRoleCache } from "../../sequelize/models/jobs/cache/JobRoleCache.js";
import { Job } from "../../sequelize/models/jobs/Job.js";
import { Scrapped } from "../../sequelize/models/jobs/Scrapped.js";
import type {
  IScrappedJobWithId,
  PostedJobData,
} from "../../utils/types/jobs/IJob.js";
import { DBConnection } from "../../sequelize/setup.js";
import { UserDb } from "../users/user/UserDb.js";
import { UserSentJobs } from "../../sequelize/models/user/UserSentJobs.js";
import {
  Posted,
  type employmentType,
  type ProgramType,
} from "../../sequelize/models/jobs/Posted.js";
import { Op } from "sequelize";
import { getEventDbMethods } from "../events/EventsDb.js";
import { RecruiterAudit } from "../../sequelize/models/user/audit/RecruiterAudit.js";
import { createTextEmbedding } from "../../services/ai/embeddings/embedding.js";
import { getJobSeekerDbMethods } from "../users/jobSeekers/JobSeekersDb.js";
import { getRecruiterDbMethods } from "../users/recruiters/RecruiterDb.js";
import { getCompanyDbMethods } from "../company/CompanyDb.js";
import { Recruiter } from "../../sequelize/models/user/Recruiter.js";
import { Company } from "../../sequelize/models/company/Company.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();
const eventDb = getEventDbMethods();

export class JobsDb extends UserDb {
  constructor() {
    super("Jobs Database");
  }

  async createScrappedJob(job: IScrappedJobWithId, roleCacheId: string) {
    await this.run("Create Scrapped Job", async () => {
      const transaction = await db.transaction();
      try {
        await Job.create(
          {
            status: "ACTIVE",
            id: job.id,
            description: job.description,
            isRemote: false,
            title: job.title,
          },
          { transaction },
        );
        await Scrapped.create(
          {
            companyName: job.company,
            JobId: job.id,
            link: job.link,
            location: job.location,
          },
          { transaction },
        );
        await JobCache.create(
          {
            JobId: job.id,
            JobRoleCacheId: roleCacheId,
          },
          { transaction },
        );
        await transaction.commit();
        console.log(roleCacheId, "-----------------rolecache");
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  }

  async createJobRoleCache(name: string, ttlDays: number) {
    return await this.run("Create JobRoleCache", async () => {
      const roleCache = await JobRoleCache.create(
        { name, ttlDays },
        { raw: true },
      );
      console.log("rolecache", roleCache);
      return roleCache.dataValues.id;
    });
  }

  async getRoleCacheJobs(roleId: string, size: number) {
    return await this.run("Get Role Cache Jobs", async () => {
      const jobs = await Job.findAll({
        include: [
          {
            model: Scrapped,
            required: true,
          },
          {
            model: JobCache,
            where: { JobRoleCacheId: roleId },
            required: true,
            attributes: [],
          },
        ],
        attributes: ["title", "description"],
        limit: size,
        raw: true,
        nest: true,
      });

      return jobs.map((job: any) => ({
        title: job.title,
        link: job.Scrapped.link,
        companyName: job.Scrapped.companyName,
        location: job.Scrapped.location,
        description: job.description,
      }));
    });
  }

  async getScrappedJob(id: string) {
    return await this.run("Get Scrapped Job", () =>
      Job.findByPk(id, {
        include: { model: Scrapped, required: true },
        raw: true,
        nest: true,
      }),
    );
  }
  async getLastSentTime(userId: string) {
    const last = await UserSentJobs.findOne({
      where: { UserId: userId },
      order: [["CreatedAt", "DESC"]],
    });
    //@ts-ignore
    return last?.dataValues.CreatedAt ?? null;
  }

  async getJobsSinceLastSent(
    userId: string,
    industry?: string,
    userEducation?: string,
    userExperience?: string,
  ) {
    return await this.run("Get Jobs Since Last Sent", async () => {
      const lastSent = await this.getLastSentTime(userId);

      const educationNumber = userEducation ? Number(userEducation) : null;
      const experienceNumber = userExperience ? Number(userExperience) : null;

      if (
        (educationNumber !== null && isNaN(educationNumber)) ||
        (experienceNumber !== null && isNaN(experienceNumber))
      ) {
        throw new Error("Education and Experience must be valid numbers");
      }

      const jobWhere: any = { status: "ACTIVE" };
      if (lastSent) {
        jobWhere.createdAt = { [Op.gt]: lastSent };
      }

      const postedWhere: any = { maxApplications: { [Op.gt]: 0 } };
      if (industry) postedWhere.industry = { [Op.like]: `%${industry}%` };
      if (experienceNumber !== null)
        postedWhere.experience = { [Op.lte]: experienceNumber };
      if (educationNumber !== null)
        postedWhere.educationLevel = { [Op.lte]: educationNumber };

      const jobs = await Job.findAll({
        where: jobWhere,
        include: [
          {
            model: Posted,
            required: true,
            where: postedWhere,
            include: [
              {
                model: Recruiter,
                required: true,
                include: [
                  {
                    model: Company,
                    attributes: ["website", "logo", "name", "location"],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
      });

      return jobs;
    });
  }
  async getPostedJobInnfo(jobId: string) {
    return await this.run("Get Posted Job Info", async () => {
      const job = await Job.findByPk(jobId, {
        include: [
          {
            model: Posted,
            required: true,
          },
        ],
        raw: true,
        nest: true,
      });
      return job;
    });
  }
  async createUserSentJob(userId: string, jobId: string) {
    return await this.run("Create User Sent Job", async () => {
      await UserSentJobs.create({ UserId: userId, JobId: jobId });
    });
  }
  async createJobsWithAuditBulk(jobs: PostedJobData[], recruiterId: string) {
    return await this.run("createJobsWithAuditBulk DB Query", async () => {
      const transaction = await db.transaction();
      try {
        const embeddings = await Promise.all(
          jobs.map((j) => createTextEmbedding(j.title)),
        );

        const missingIndex = embeddings.findIndex((e) => !e);
        if (missingIndex !== -1) {
          throw new Error(
            `Failed to generate embedding for job at index ${missingIndex}`,
          );
        }
        const createdJobs = await Job.bulkCreate(
          jobs.map((j) => ({
            title: j.title,
            salary: Number(j.salary) ?? null,
            description: j.description,
            isRemote: j.isRemote,
            status: "ACTIVE",
          })),
          { transaction, returning: true },
        );
        const companyId =
          await getRecruiterDbMethods().getRecruiterCompanyId(recruiterId);
        const hasAiInsights =
          await getCompanyDbMethods().doesCompanyHasAiInsights(companyId!);
        const company =
          await getRecruiterDbMethods().getRecruiterCompany(recruiterId);
        const posted = await Posted.bulkCreate(
          jobs.map((j, i) => ({
            aiInsights: hasAiInsights!,
            JobId: createdJobs[i]!.dataValues.id,
            employmentType: j.employmentType as employmentType,
            educationLevel: Number(j.educationLevel),
            experience: Number(j.experience),
            embedding: JSON.stringify(embeddings[i]),
            RecruiterUserId: recruiterId,
            location: j.location,
            maxApplications: Number(j.maxApplications),
            companyName: j.companyName,
            industry: j.industry,
            programType: j.programType as ProgramType,
            closingDate: j.closingDate,
          })),
          { transaction },
        );
        await RecruiterAudit.bulkCreate(
          createdJobs.map((job) => ({
            action: "created job",
            event: "CREATE",
            targetType: "JOB",
            targetId: job.dataValues.id,
            performedBy: recruiterId,
          })),
          { transaction },
        );

        await transaction.commit();

        await Promise.allSettled(
          createdJobs.map((job) =>
            eventDb.logEvent(
              recruiterId,
              job.dataValues.id,
              "JOB",
              "CREATE",
              "create job",
            ),
          ),
        );

        await getJobSeekerDbMethods().notifyJobSeekerAboutNewJobPosting(
          posted,
          createdJobs,
          company,
        );

        return createdJobs;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  }
}

export const getJobsDbMethods = () => {
  return new JobsDb();
};
