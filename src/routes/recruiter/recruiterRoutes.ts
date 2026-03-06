import { Router } from "express";
import { createJob } from "../../controller/recruiter/jobsController.js";
import { requireAuth } from "../../middleware/requireAuth.js";
const router = Router();
router.post("/rec/job/create", requireAuth, createJob);

export default router;
