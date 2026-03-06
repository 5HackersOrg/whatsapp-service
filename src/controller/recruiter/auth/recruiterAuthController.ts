import type { Request, Response } from "express";
import {
  onBoardPassService,
  userLogin,
  verifyOtp,
} from "../../../services/user/auth/loginService.js";
import {
  removeRefreshToken,
  setRefreshToken,
  verifyRefreshTokenService,
} from "../../../services/user/auth/refreshTokenService.js";
import { extractFingerprint } from "../../../middleware/fingerprint/fingerprint.js";
const COOKIES_OPTIONS = {
  httpOnly: true,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
export const onboardPass = async (req: Request, res: Response) => {
  const access_token = req.body.accessToken;
  const result = await onBoardPassService(access_token, req);
  if (!result.status) {
    res.status(result.status).json(result);
    return;
  }
  res.cookie("refreshToken", result.data.refreshToken, COOKIES_OPTIONS);
  res.status(200).json({ access_token: result.data.accessToken });
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await userLogin(email, password);
  if (!result.success) {
    res.status(403).json(result);
    return;
  }
  res.status(200).json(result);
};
export const verifyUserOtp = async (req: Request, res: Response) => {
  const { otp, email } = req.body;

  const result = await verifyOtp(email, otp);
  if (!result.data) {
    res.status(403).json(result);
    return;
  }
  const userId = result.data;
  const role = result.role!;
  const fingerprint = extractFingerprint(req);
  const outcome = await setRefreshToken(userId, fingerprint, role);
  if (!outcome) {
    res.status(500).json({ message: "internal server error" });
    return;
  }
  const { accessToken, refreshToken } = outcome;
  res.cookie("refreshToken", refreshToken, COOKIES_OPTIONS);
  res.status(200).json({ accessToken });
};
export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(403).json({ message: "refreshToken missing" });
    return;
  }
  const fingerprint = extractFingerprint(req);
  const result = await verifyRefreshTokenService(refreshToken, fingerprint);
  res.status(result.status).json(result);
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(200).json({ message: "logout successfull" });
    return;
  }
  await removeRefreshToken(token);
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "logout successfull" });
};
