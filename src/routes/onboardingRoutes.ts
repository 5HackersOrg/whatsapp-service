import { Router } from "express";
import { onboardingCompleteController } from "../controller/recruiter/OnboardingController.js";
import { uploadLogo } from "../middleware/multer.js";
const router = Router();
router.post("/onboard", uploadLogo("logo"), onboardingCompleteController);

export default router;
