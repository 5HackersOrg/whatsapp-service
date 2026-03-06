import { verifyRefreshToken } from "../services/token/tokenService.js";
import type { AuthenticatedRequest } from "./requireAuth.js";
import type { Request, Response, NextFunction } from "express";
export const requireRefreshToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const payload = await verifyRefreshToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    req.user = payload;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};
