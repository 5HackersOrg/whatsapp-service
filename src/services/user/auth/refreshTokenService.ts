import { UsersAuthDb } from "../../../repository/users/auth/AuthDb.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashFingerprint,
  verifyRefreshToken,
} from "../../token/tokenService.js";
const authDb = new UsersAuthDb();
export const setRefreshToken = async (
  userId: string,
  fingerprint: string,
  role: string,
) => {
  const fingerprintHash = hashFingerprint(fingerprint);
  const accessToken = await generateAccessToken({
    fingerprintHash: fingerprintHash,
    userId: userId,
    role: role,
  });
  const refreshToken = await generateRefreshToken({
    fingerprintHash: fingerprintHash,
    userId: userId,
    role: role,
  });
  if (!refreshToken) return;
  await authDb.saveRefreshToken(userId, refreshToken, fingerprintHash);
  return { accessToken, refreshToken };
};
export const verifyRefreshTokenService = async (
  refreshToken: string,
  currentFingerprint: string,
): Promise<{
  reason: string;
  status: number;
  data: any;
  success: boolean;
}> => {
  try {
    const res = await verifyRefreshToken(refreshToken);
    if (!res) {
      return {
        data: null,
        reason: "invalid token ",
        status: 403,
        success: false,
      };
    }
    const { userId, fingerprintHash,role } = res;
    const user = await authDb.getUserById(userId);
    if (!user) {
      await authDb.deleteRefreshToken(refreshToken);
      return {
        data: null,
        reason: "user not found",
        status: 404,
        success: false,
      };
    }
    const currentFingerprintHash = await hashFingerprint(currentFingerprint);
    if (fingerprintHash !== currentFingerprintHash) {
      await authDb.deleteRefreshToken(refreshToken);
      return {
        data: null,
        reason: "sus activity user has to login again ",
        status: 403,
        success: false,
      };
    }
    const accessToken = await generateAccessToken({
      userId,
      fingerprintHash,
      role: role,
    });
    return {
      data: accessToken,
      reason: "token valid",
      status: 200,
      success: true,
    };
  } catch (err) {
    console.log(err);
    await authDb.deleteRefreshToken(refreshToken);
    return {
      data: null,
      reason: "token is expired",
      status: 403,
      success: false,
    };
  }
};
export const removeRefreshToken = async (token: string) => {
  await authDb.deleteRefreshToken(token);
};
