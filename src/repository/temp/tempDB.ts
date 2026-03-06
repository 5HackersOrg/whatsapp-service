import { Company } from "../../sequelize/models/company/Company.js";
import {
  OnboardingInfo,
  type OnboardingInfoAttributes,
  type OnboardingStep,
} from "../../sequelize/models/temp/OnboardingInfo.js";
import { Permission } from "../../sequelize/models/user/permissions/Permissions.js";
import { Recruiter } from "../../sequelize/models/user/Recruiter.js";
import { Role } from "../../sequelize/models/user/Role.js";
import { UserRole } from "../../sequelize/models/user/UserRole.js";
import { User } from "../../sequelize/models/user/Users.js";
import { Verification } from "../../sequelize/models/verification/verification.js";
import { DBConnection } from "../../sequelize/setup.js";
import { EmailService } from "../../services/email/emailService.js";
import { logError } from "../../services/logging/loggers.js";
import { generateOnboardAccessToken } from "../../services/token/tokenService.js";
import { sendCompanyVerificationMessage } from "../../services/twillio/whatsappMessages/sendWhatsappMessage.js";
import { hashPassword } from "../../utils/hash/hashes.js";
import { generateOtp } from "../../utils/types/generations/otpGenerator.js";
import { defaultPermissions } from "../../utils/types/user/permissions.js";
import { generateApiKey } from "../../utils/user/generateAPIKey.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();
const emailService = new EmailService();

type BusinessData = {
  company_name: string;
  company_email: string;
  company_location: string;
  company_number: string;
  company_logo: string;
  company_website: string;
  company_industry: string;
};

export interface tempDataUpdate {
  field: {
    name: OnboardingStep;
    value: string;
    next_step: OnboardingStep;
    companyData?: BusinessData;
  };
  completed?: boolean;
}

export class TempDB {
  private async log(action: string, error: unknown) {
    const err = error as Error;
    await logError({
      action,
      error_message: err.message,
      error_type: "SERVER_ERROR",
      severity: "critical",
      endpoint: "tempDB",
      stack_trace: err.stack ?? "no stack trace",
    });
  }

  private async run<T>(
    action: string,
    fn: () => Promise<T>,
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      await this.log(action, error);
    }
  }

  async hasSession(email: string): Promise<{
    found: boolean;
    session: OnboardingInfoAttributes | null;
  }> {
    const result = await this.run("hasSession DB Query", async () => {
      const normalizedEmail = email.toLowerCase().trim();
      const record = await OnboardingInfo.findByPk(normalizedEmail);
      if (!record) return { found: false, session: null };
      return { found: true, session: record.dataValues };
    });

    return result ?? { found: false, session: null };
  }

  async createSession(email: string): Promise<boolean> {
    const result = await this.run("Create Session DB Query", async () => {
      const { otp } = await generateOtp();
      await emailService.sendEmail(email, otp);
      await OnboardingInfo.create({ email, otp, last_step: "otp" });
      return true;
    });

    return result ?? false;
  }

  private async createRecruiter(session: OnboardingInfoAttributes) {
    const transaction = await db.transaction();
    try {
      const verification = await Verification.create(
        {
          target_type: "company",
          type: "business",
          status: "pending",
          submitted_data: JSON.stringify({
            company_name: session.company_name!,
            company_email: session.company_email!,
            company_location: session.company_location!,
            company_number: session.company_number!,
            company_website: session.company_website!,
            company_industry: session.company_industry!,
            company_logo: session.company_logo!,
          }),
        },
        { transaction },
      );

      const company = await Company.create(
        {
          name: session.company_name!,
          location: session.company_location!,
          verifiedId: verification.dataValues.id,
          number: session.company_number!,
          website: session.company_website!,
          apiKey: session.api_key!,
          logo: session.company_logo!,
          email: session.company_email!,
          industry: session.company_industry!,
          subscriptionTier: "PayPerPost",
        },
        { transaction },
      );

      const role = await Role.findOne({ where: { name: "admin" } });

      const user = await User.create(
        {
          email: session.email,
          name: session.name!,
          password: session.password!,
        },
        { transaction },
      );

      await UserRole.create(
        {
          RoleId: role?.dataValues.id!,
          UserId: user.dataValues.id,
        },
        { transaction },
      );

      await Permission.create(
        {
          CompanyId: company.dataValues.id,
          RoleId: role?.dataValues.id!,
          ...defaultPermissions["admin"],
        },
        { transaction },
      );

      await Recruiter.create(
        {
          CompanyId: company.dataValues.id,
          UserId: user.dataValues.id,
          active: true,
        },
        { transaction },
      );

      await transaction.commit();
      await sendCompanyVerificationMessage(
        company.dataValues.name,
        company.dataValues.number!,
      );
    } catch (error) {
      await transaction.rollback();
      await this.log("createRecruiter DB transaction", error);
      throw error;
    }
  }

  async updateSession(
    email: string,
    data: tempDataUpdate,
  ): Promise<{
    success: boolean;
    reason: string;
    access_token?: string | undefined;
    api_key?: string;
  }> {
    const result = await this.run("Update Session DB Query", async () => {
      console.log(data);
      console.log("seraching for session with email ", email);
      const session = await OnboardingInfo.findByPk(email);
      if (!session) return { reason: "user session not found", success: false };
      if (session.setup_completed)
        return { reason: "this session is completed", success: false };

      if (data.field.name === "otp") {
        if (session.dataValues.otp !== data.field.value) {
          return { reason: "user otp is not correct", success: false };
        }
      }

      if (data.field.name === "password") {
        data.field.value = await hashPassword(data.field.value);
      }

      if (data.field.name === "company_location") {
        const api = session.dataValues.api_key ?? generateApiKey();
        const access_token = await generateOnboardAccessToken(email);
        const { company_logo, ...rest } = data.field.companyData!;
        await session.update({
          ...rest,
          api_key: api,
          [data.field.name]: data.field.value,
          last_step: "completed",
          setup_completed: true,
          access_token: access_token ?? null,
        });
        await session.reload();
        await this.createRecruiter(session.dataValues);
        return {
          reason: "user session updated",
          success: true,
          api_key: api,
          access_token,
        };
      }

      await session.update({
        [data.field.name]: data.field.value,
        last_step: data.field.next_step,
      });

      return { reason: "user session updated", success: true };
    });

    return result ?? { reason: "server error", success: false };
  }
}
