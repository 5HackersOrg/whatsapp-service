import { Router } from "express";
import { TestInterview } from "../controller/TestController.js";
const router = Router();
router.post("/test/interview", TestInterview);

export default router;
