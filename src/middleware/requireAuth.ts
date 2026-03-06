import type { Request, Response, NextFunction } from "express";
import {
  hashFingerprint,
  verifyAccessToken,
  type TokenPayload,
} from "../services/token/tokenService.js";
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}
export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const payload = await verifyAccessToken(token);
    console.log(payload)
    if (!payload) {
      res.status(401).json({ message: "Invalid Token" });
      return;
    }

    const rawFingerprint = req.headers["x-fingerprint"] as string;
    if (!rawFingerprint) {
      res.status(401).json({ message: "Missing device fingerprint" });
      return;
    }

    const hashed = hashFingerprint(rawFingerprint);

    // if (hashed !== payload.fingerprintHash) {
    //   res.status(401).json({ message: "Invalid device fingerprint" });
    //   return;
    // }

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired access token" });
  }
};
