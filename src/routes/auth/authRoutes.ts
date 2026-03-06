import { Router } from "express";
import {
  onboardPass,
  login,
  logout,
  refresh,
  verifyUserOtp,
} from "../../controller/recruiter/auth/recruiterAuthController.js";
const router = Router();
router.post("/auth/onboardPass", onboardPass);
router.get("/auth/refresh", refresh);
router.post("/auth/login", login);
router.post("/auth/verify-otp", verifyUserOtp);
router.get("/auth/logout", logout);

export default router;
