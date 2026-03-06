import { Router } from "express";
import { addessAutoCompleteController } from "../controller/recruiter/autoCompleteController.js";
const router = Router();
router.post("/user/places-auto-complete", addessAutoCompleteController);

export default router;
