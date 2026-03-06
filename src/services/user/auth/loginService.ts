import { extractFingerprint } from "../../../middleware/fingerprint/fingerprint.js";
import type { Request } from "express";
import { UsersAuthDb } from "../../../repository/users/auth/AuthDb.js";
import { UserDb } from "../../../repository/users/user/UserDb.js";
import { verifyAccessTokenOnboard } from "../../token/tokenService.js";
import { setRefreshToken } from "./refreshTokenService.js";
const authDb = new UsersAuthDb();
const userDb = new UserDb();
export const userLogin = async (email: string, password: string) => {
  return await authDb.login(email, password);
};
export const verifyOtp = async (email: string, otp: string) => {
  return await authDb.verifyOtp(email, otp);
};
export const onBoardPassService = async (
  access_token: string,
  req: Request,
): Promise<{
  reason: string;
  success: boolean;
  status: number;
  data?: any;
}> => {
  try {
    const res = await verifyAccessTokenOnboard(access_token);
    if (!res) {
      return {
        reason: "invalid token ",
        status: 403,
        success: false,
      };
    }
    const { email } = res;
    const user = await userDb.getUserByEmail(email);
    if (!user) {
      return {
        reason: "account not found",
        status: 404,
        success: false,
      };
    }
    //@ts-ignore
    const role = user.getRoles()[0].dataValues.name;
    const userId = user.dataValues.id;
    const fingerprint = extractFingerprint(req);
    const result = await setRefreshToken(userId, fingerprint, role);
    if (!result) {
      return {
        reason: "internal server error",
        status: 500,
        success: false,
      };
    }
    const { accessToken, refreshToken } = result;
    return {
      reason: "sucessfull request",
      status: 200,
      success: true,
      data: { accessToken, refreshToken, role },
    };
  } catch (err) {
    console.log(err);
    return {
      reason: "invalid token ",
      status: 403,
      success: false,
    };
  }
};
