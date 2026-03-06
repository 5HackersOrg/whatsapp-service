import type { Request, Response } from "express";
import type { InterviewSchedule } from "../utils/types/jobs/IInterviewSchedule.js";
import { setUpInterview } from "../services/user/applications/interviews/setUpInterview.js";
export const TestInterview = async (req: Request, res: Response) => {
  console.log("recievd request : ", req.body);
  const interviewSchedule: InterviewSchedule = req.body;
  const result = await setUpInterview(interviewSchedule);
  res.status(200).json(result);
};
