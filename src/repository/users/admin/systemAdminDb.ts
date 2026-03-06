import { Op, QueryTypes, Sequelize } from "sequelize";
import { AiUsageLog } from "../../../sequelize/models/ai/aiUsageLog.js";
import { Company } from "../../../sequelize/models/company/Company.js";
import { JobSeeker } from "../../../sequelize/models/user/JobSeeker.js";
import { Recruiter } from "../../../sequelize/models/user/Recruiter.js";
import { User } from "../../../sequelize/models/user/Users.js";
import { DBConnection } from "../../../sequelize/setup.js";
import { UserDb } from "../user/UserDb.js";
import { Verification } from "../../../sequelize/models/verification/verification.js";
import { Role } from "../../../sequelize/models/user/Role.js";
import { Moderator } from "../../../sequelize/models/user/Moderator.js";
import { hashPassword } from "../../../utils/hash/hashes.js";
import {
  ErrorLog,
  type ErrorType,
  type SeverityLevel,
} from "../../../sequelize/models/error/Errorlog.js";
import {
  EmailLog,
  type EmailStatus,
  type EmailType,
} from "../../../sequelize/models/email/emailLogs.js";
import { Payment, PAYMENT_TYPES } from "../../../sequelize/models/payments/Payment.js";
import { Job } from "../../../sequelize/models/jobs/Job.js";
import { Report } from "../../../sequelize/models/jobs/Reports.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export class SystemAdminDb extends UserDb {
  constructor() {
    super("SystemAdminDb");
  }
  async getPendingVerificationCompanies() {
    return await this.run(
      "getPendingVerificationCompanies DB Query",
      async () => {
        return await Company.findAll({
          include: [
            {
              model: Verification,
              where: {
                status: {
                  [Op.in]: ["pending", "in_review"],
                },
              },
              required: true,
              attributes: ["id", "status", "type", "createdAt"],
            },
          ],
          attributes: ["id", "name", "number", "email"],
          order: [["createdAt", "DESC"]],
        });
      },
    );
  }
  async verifyCompany(userId: string, companyId: string) {
    return await this.run("verifyCompany DB Query", async () => {
      return await db.transaction(async (transaction) => {
        const company = await Company.findByPk(companyId, {
          include: [
            {
              model: Verification,
              required: true,
            },
          ],
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!company) {
          console.log("Company not found");
          return false;
        }
        //@ts-ignore
        const verification = company.Verification;

        if (!verification) {
          console.log("Verification not found");
          return false;
        }

        if (!["pending", "in_review"].includes(verification.status)) {
          return false;
        }

        await verification.update(
          {
            status: "verified",
            reviewed_by: userId,
            reviewed_at: new Date(),
          },
          { transaction },
        );

        return true;
      });
    });
  }
  async getDashboardStats(date: string) {
    return await this.run("getDashboardStats DB Query", async () => {
      const monthDate = new Date(date);

      // Current month
      const startOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );
      const endOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        1,
        0,
        0,
        0,
        0,
      );
      endOfMonth.setMilliseconds(-1);

      // Previous month
      const prevMonthDate = new Date(monthDate);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      const startOfPrevMonth = new Date(
        prevMonthDate.getFullYear(),
        prevMonthDate.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );
      const endOfPrevMonth = new Date(
        prevMonthDate.getFullYear(),
        prevMonthDate.getMonth() + 1,
        1,
        0,
        0,
        0,
        0,
      );
      endOfPrevMonth.setMilliseconds(-1);

      const buildDateFilter = (start: Date, end: Date) => ({
        createdAt: { [Op.between]: [start, end] },
      });

     
      const [
        companiesCurr,
        candidatesCurr,
        recruitersCurr,
        aiStatsCurr,
        companiesPrev,
        candidatesPrev,
        recruitersPrev,
        aiStatsPrev,
      ] = await Promise.all([
        Company.count({ where: buildDateFilter(startOfMonth, endOfMonth) }),
        JobSeeker.count({ where: buildDateFilter(startOfMonth, endOfMonth) }),
        Recruiter.count({
          include: [
            {
              model: User,
              attributes: ["createdAt"],
              where: buildDateFilter(startOfMonth, endOfMonth),
              required: true,
            },
          ],
        }),
        AiUsageLog.findOne({
          attributes: [
            [
              Sequelize.fn(
                "COALESCE",
                Sequelize.fn("SUM", Sequelize.col("tokens_total")),
                0,
              ),
              "total_tokens_used",
            ],
            [
              Sequelize.fn(
                "COALESCE",
                Sequelize.fn("SUM", Sequelize.col("cost_zar")),
                0,
              ),
              "total_spend",
            ],
            [
              Sequelize.fn(
                "COALESCE",
                Sequelize.fn("AVG", Sequelize.col("duration_ms")),
                0,
              ),
              "average_response_time",
            ],
          ],
          where: buildDateFilter(startOfMonth, endOfMonth),
        }),
        Company.count({
          where: buildDateFilter(startOfPrevMonth, endOfPrevMonth),
        }),
        JobSeeker.count({
          where: buildDateFilter(startOfPrevMonth, endOfPrevMonth),
        }),
        Recruiter.count({
          include: [
            {
              model: User,
              attributes: ["createdAt"],
              where: buildDateFilter(startOfPrevMonth, endOfPrevMonth),
              required: true,
            },
          ],
        }),
        AiUsageLog.findOne({
          attributes: [
            [
              Sequelize.fn(
                "COALESCE",
                Sequelize.fn("SUM", Sequelize.col("tokens_total")),
                0,
              ),
              "total_tokens_used",
            ],
            [
              Sequelize.fn(
                "COALESCE",
                Sequelize.fn("SUM", Sequelize.col("cost_zar")),
                0,
              ),
              "total_spend",
            ],
            [
              Sequelize.fn(
                "COALESCE",
                Sequelize.fn("AVG", Sequelize.col("duration_ms")),
                0,
              ),
              "average_response_time",
            ],
          ],
          where: buildDateFilter(startOfPrevMonth, endOfPrevMonth),
        }),
      ]);

      const calculateGrowth = (current: number, previous: number) =>
        previous === 0 ? 0 : ((current - previous) / previous) * 100;

      return {
        companies: companiesCurr,
        companies_growth_percent: calculateGrowth(companiesCurr, companiesPrev),
        candidates: candidatesCurr,
        candidates_growth_percent: calculateGrowth(
          candidatesCurr,
          candidatesPrev,
        ),
        recruiters: recruitersCurr,
        recruiters_growth_percent: calculateGrowth(
          recruitersCurr,
          recruitersPrev,
        ),
        total_tokens_used: Number(aiStatsCurr?.dataValues.tokens_total || 0),
        total_tokens_growth_percent: calculateGrowth(
          Number(aiStatsCurr?.dataValues.tokens_total || 0),
          Number(aiStatsPrev?.dataValues.tokens_total || 0),
        ),
        total_spend: Number(aiStatsCurr?.dataValues.cost_zar || 0),
        total_spend_growth_percent: calculateGrowth(
          Number(aiStatsCurr?.dataValues.cost_zar || 0),
          Number(aiStatsPrev?.dataValues.cost_zar || 0),
        ),
        average_response_time: Number(aiStatsCurr?.dataValues.duration_ms || 0),
        average_response_growth_percent: calculateGrowth(
          Number(aiStatsCurr?.dataValues.duration_ms || 0),
          Number(aiStatsPrev?.dataValues.duration_ms || 0),
        ),
      };
    });
  }
  async createModerator(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return await this.run("createModerator DB Query", async () => {
      return await db.transaction(async (transaction) => {
        const password = await hashPassword(data.password);
        const user = await User.create(
          {
            name: data.name,
            email: data.email,
            password: password,
          },
          { transaction },
        );

        const role = await Role.findOne({
          where: { name: "moderator" },
          transaction,
        });

        if (!role) {
          throw new Error("Moderator role not found");
        }

        //@ts-ignore
        await user.addRole(role, { transaction });

        await Moderator.create(
          {
            UserId: user.id,
          },
          { transaction },
        );

        return user;
      });
    });
  }
  async createSystemAdmin(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return await this.run("createSystemAdmin DB Query", async () => {
      const password = await hashPassword(data.password);
      return await db.transaction(async (transaction) => {
        const user = await User.create(
          {
            name: data.name,
            email: data.email,
            password: password,
          },
          { transaction },
        );

        const role = await Role.findOne({
          where: { name: "system_admin" },
          transaction,
        });

        if (!role) {
          throw new Error("System admin role not found");
        }
        //@ts-ignore
        await user.addRole(role, { transaction });

        return user;
      });
    });
  }
  async getErrorLogs(options?: {
    page?: number;
    limit?: number;
    severity?: SeverityLevel;
    error_type?: ErrorType;
    resolved?: boolean;
    CompanyId?: string;
    UserId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return await this.run("getErrorLogs DB Query", async () => {
      const {
        page = 1,
        limit = 20,
        severity,
        error_type,
        resolved,
        CompanyId,
        UserId,
        startDate,
        endDate,
      } = options || {};

      const offset = (page - 1) * limit;

      const where: any = {};

      if (severity) where.severity = severity;
      if (error_type) where.error_type = error_type;
      if (typeof resolved === "boolean") where.resolved = resolved;
      if (CompanyId) where.CompanyId = CompanyId;
      if (UserId) where.UserId = UserId;

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = startDate;
        if (endDate) where.createdAt[Op.lte] = endDate;
      }

      const { rows, count } = await ErrorLog.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: ["id", "email", "name"],
          },
          {
            model: Company,
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      return {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        logs: rows,
      };
    });
  }

  async getAiUsageLogs(options?: {
    page?: number;
    limit?: number;
    CompanyId?: string;
    UserId?: string;
    model?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    return await this.run("getAiUsageLogs DB Query", async () => {
      const {
        page = 1,
        limit = 20,
        CompanyId,
        UserId,
        model,
        success,
        startDate,
        endDate,
      } = options || {};

      const offset = (page - 1) * limit;

      const where: any = {};

      if (CompanyId) where.CompanyId = CompanyId;
      if (UserId) where.UserId = UserId;
      if (model) where.model = model;
      if (typeof success === "boolean") where.success = success;

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = startDate;
        if (endDate) where.createdAt[Op.lte] = endDate;
      }

      const { rows, count } = await AiUsageLog.findAndCountAll({
        where,
        include: [
          {
            model: Company,
            attributes: ["id", "name", "email"],
          },
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      return {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        logs: rows,
      };
    });
  }

  async getEmailLogs(options?: {
    page?: number;
    limit?: number;
    recipient?: string;
    email_type?: EmailType;
    status?: EmailStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    return await this.run("getEmailLogs DB Query", async () => {
      const {
        page = 1,
        limit = 20,
        recipient,
        email_type,
        status,
        startDate,
        endDate,
      } = options || {};

      const offset = (page - 1) * limit;

      const where: any = {};

      if (recipient) where.recipient = recipient;
      if (email_type) where.email_type = email_type;
      if (status) where.status = status;

      if (startDate || endDate) {
        where.sent_at = {};
        if (startDate) where.sent_at[Op.gte] = startDate;
        if (endDate) where.sent_at[Op.lte] = endDate;
      }

      const { rows, count } = await EmailLog.findAndCountAll({
        where,
        order: [["sent_at", "DESC"]],
        limit,
        offset,
      });

      return {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        logs: rows,
      };
    });
  }

  async getRevenueDashboardWithGrowth(month: string, opCost = 1000) {
    const monthDate = new Date(month);

    // Current month
    const startOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const endOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    );
    endOfMonth.setMilliseconds(-1);

   
    const prevMonthDate = new Date(monthDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    const startOfPrevMonth = new Date(
      prevMonthDate.getFullYear(),
      prevMonthDate.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const endOfPrevMonth = new Date(
      prevMonthDate.getFullYear(),
      prevMonthDate.getMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    );
    endOfPrevMonth.setMilliseconds(-1);

  
    const startOfYear = new Date(monthDate.getFullYear(), 0, 1, 0, 0, 0, 0);

    const buildDateFilter = (start: Date, end: Date) => ({
      createdAt: { [Op.between]: [start, end] },
      status: "COMPLETED",
    });

    const [
      monthRevenue,
      prevMonthRevenue,
      monthRevenueByType,
      prevMonthRevenueByType,
      monthAiCost,
      ytdRevenue,
      ytdRevenueByType,
    ] = await Promise.all([
      Payment.findOne({
        attributes: [
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("SUM", Sequelize.col("amount")),
              0,
            ),
            "total",
          ],
        ],
        where: buildDateFilter(startOfMonth, endOfMonth),
      }),
      Payment.findOne({
        attributes: [
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("SUM", Sequelize.col("amount")),
              0,
            ),
            "total",
          ],
        ],
        where: buildDateFilter(startOfPrevMonth, endOfPrevMonth),
      }),
      Payment.findAll({
        attributes: [
          "type",
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("SUM", Sequelize.col("amount")),
              0,
            ),
            "revenue",
          ],
        ],
        where: buildDateFilter(startOfMonth, endOfMonth),
        group: ["type"],
      }),
      Payment.findAll({
        attributes: [
          "type",
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("SUM", Sequelize.col("amount")),
              0,
            ),
            "revenue",
          ],
        ],
        where: buildDateFilter(startOfPrevMonth, endOfPrevMonth),
        group: ["type"],
      }),
      AiUsageLog.findOne({
        attributes: [
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("SUM", Sequelize.col("cost_zar")),
              0,
            ),
            "total_ai_cost",
          ],
        ],
        where: { createdAt: { [Op.between]: [startOfMonth, endOfMonth] } },
      }),
      Payment.findOne({
        attributes: [
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("SUM", Sequelize.col("amount")),
              0,
            ),
            "total",
          ],
        ],
        where: buildDateFilter(startOfYear, endOfMonth),
      }),
      Payment.findAll({
        attributes: [
          "type",
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("SUM", Sequelize.col("amount")),
              0,
            ),
            "revenue",
          ],
        ],
        where: buildDateFilter(startOfYear, endOfMonth),
        group: ["type"],
      }),
    ]);

    const formatByType = (results: any[]) => {
      const formatted: Record<string, number> = {};
      PAYMENT_TYPES.forEach((type) => (formatted[type] = 0));
      results.forEach((row) => {
        formatted[row.getDataValue("type")] = Number(
          row.getDataValue("revenue"),
        );
      });
      return formatted;
    };

    //@ts-ignore
    const totalMonthRevenue = Number(monthRevenue?.getDataValue("total") || 0);

    const totalPrevMonthRevenue = Number(
      //@ts-ignore
      prevMonthRevenue?.getDataValue("total") || 0,
    );
    const revenueGrowthPercent =
      totalPrevMonthRevenue === 0
        ? 0
        : ((totalMonthRevenue - totalPrevMonthRevenue) /
            totalPrevMonthRevenue) *
          100;

    const revenueByType = formatByType(monthRevenueByType);
    const prevRevenueByType = formatByType(prevMonthRevenueByType);

    const typeGrowthPercent: Record<string, number> = {};
    PAYMENT_TYPES.forEach((type) => {
      const prev = prevRevenueByType[type] || 0;
      const curr = revenueByType[type] || 0;
      typeGrowthPercent[type] = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
    });
    //@ts-ignore
    const totalAiCost = Number(monthAiCost?.getDataValue("total_ai_cost") || 0);
    const margin = totalMonthRevenue - (opCost + totalAiCost);
    //@ts-ignore
    const totalYtdRevenue = Number(ytdRevenue?.getDataValue("total") || 0);

    return {
      month: {
        totalRevenue: totalMonthRevenue,
        revenueGrowthPercent,
        opCost,
        totalAiCost,
        margin,
        revenueByType,
        typeGrowthPercent,
      },
      ytd: {
        totalRevenue: totalYtdRevenue,
        revenueByType: formatByType(ytdRevenueByType),
      },
    };
  }
  async getJobWithReports(jobId: string) {
    return await this.run("getJobWithReports DB Query", async () => {
      const job = await Job.findByPk(jobId, {
        include: [
          {
            model: Report,
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      if (!job) return null;
      return job;
    });
  }
}
