import { RefreshToken } from "../../../sequelize/models/user/RefreshTokens.js";
import { User } from "../../../sequelize/models/user/Users.js";
import { EmailService } from "../../../services/email/emailService.js";
import { logError } from "../../../services/logging/loggers.js";
import { verifyPassword } from "../../../utils/hash/hashes.js";
import { generateOtp } from "../../../utils/types/generations/otpGenerator.js";
import { UserDb } from "../user/UserDb.js";

type UsersAuthDbResponse = {
  success: boolean;
  data: any;
  role?: string;
  reason: string;
};

const emailService = new EmailService();

const DB_ERROR: UsersAuthDbResponse = {
  data: null,
  reason: "db error",
  success: false,
};

export class UsersAuthDb extends UserDb {
  async login(email: string, password: string): Promise<UsersAuthDbResponse> {
    const result = await this.run("User Login DB Query", async () => {
      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ where: { email: normalizedEmail } });
      if (!user)
        return { data: null, reason: "invalid credentials", success: false };

      const valid = await verifyPassword(password, user.dataValues.password!);
      if (!valid)
        return { data: null, reason: "invalid credentials", success: false };

      const { otp } = await generateOtp();
      await emailService.sendEmail(user.dataValues.email!, otp);
      await user.update({ otp: otp });
      //@ts-ignore
      const roles = await user.getRoles();
      return {
        data: null,
        reason: "otp sent",
        role: roles[0].dataValues.name,
        success: true,
      };
    });

    return result ?? DB_ERROR;
  }

  async verifyOtp(
    email: string,
    userOtp: string,
  ): Promise<UsersAuthDbResponse> {
    const result = await this.run("Verify OTP DB Query", async () => {
      const user = await User.findOne({ where: { email } });
      if (!user)
        return { data: null, reason: "user not found", success: false };

      const { otp } = user.dataValues;
      if (!otp)
        return { data: null, reason: "invalid request", success: false };
      if (otp !== userOtp)
        return { data: null, reason: "incorrect otp", success: false };

      await user.update({ otp: null });

      //@ts-ignore
      const roles = await user.getRoles();
      return {
        data: user.dataValues.id,
        role: roles[0].dataValues.name,
        reason: "user validated",
        success: true,
      };
    });

    return result ?? DB_ERROR;
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    fingerprintHash: string,
  ) {
    await this.run("Save Refresh Token DB Query", async () => {
      await RefreshToken.upsert({
        fingerprint: fingerprintHash,
        refreshToken,
        UserId: userId,
      });
    });
  }

  async deleteRefreshToken(token: string) {
    await this.run("Delete Refresh Token DB Query", async () => {
      const refreshToken = await RefreshToken.findOne({
        where: { refreshToken: token },
      });
      await refreshToken?.destroy();
    });
  }
}
