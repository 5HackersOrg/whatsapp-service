import jwt from "jsonwebtoken";
import crypto from "crypto";
import { withErrorHandling } from "../../utils/errorHandler.js";
import { configDotenv } from "dotenv";
configDotenv();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "ACCESS_SECRET and REFRESH_SECRET must be defined in environment variables",
  );
}

export interface TokenPayload {
  userId: string;
  role:string
  fingerprintHash: string;
}

export const hashFingerprint = (raw: string): string =>
  crypto.createHash("sha256").update(raw).digest("hex");

export const generateAccessToken = (payload: TokenPayload) =>
  withErrorHandling("Generate Access Token", "Token Service", "critical", () =>
    Promise.resolve(jwt.sign(payload, ACCESS_SECRET!, { expiresIn: "15m" })),
  );

export const generateOnboardAccessToken = (email: string) =>
  withErrorHandling(
    "Generate Onboard Access Token",
    "Token Service",
    "critical",
    () =>
      Promise.resolve(
        jwt.sign({ email }, ACCESS_SECRET!, { expiresIn: "13m" }),
      ),
  );

export const generateRefreshToken = (payload: TokenPayload) =>
  withErrorHandling("Generate Refresh Token", "Token Service", "critical", () =>
    Promise.resolve(jwt.sign(payload, REFRESH_SECRET!, { expiresIn: "7d" })),
  );

export const verifyAccessToken = (token: string) =>
  withErrorHandling("Verify Access Token", "Token Service", "critical", () =>
    Promise.resolve(jwt.verify(token, ACCESS_SECRET!) as TokenPayload),
  );

export const verifyAccessTokenOnboard = (token: string) =>
  withErrorHandling(
    "Verify Onboard Access Token",
    "Token Service",
    "critical",
    () =>
      Promise.resolve(jwt.verify(token, ACCESS_SECRET!) as { email: string }),
  );

export const verifyRefreshToken = (token: string) =>
  withErrorHandling("Verify Refresh Token", "Token Service", "critical", () =>
    Promise.resolve(jwt.verify(token, REFRESH_SECRET!) as TokenPayload),
  );
