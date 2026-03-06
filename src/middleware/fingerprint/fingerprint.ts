import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function extractFingerprint(req: Request): string {
  const components = [req.headers["X-Fingerprint"] ?? ""].join("|");

  return crypto.createHash("sha256").update(components).digest("hex");
}
export function fingerprintMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  (req as any).fingerprint = extractFingerprint(req);
  next();
}
