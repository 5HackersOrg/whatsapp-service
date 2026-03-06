import type { Request, Response } from "express";
import { getJobsDbMethods } from "../../repository/jobs/JobsDb.js";
import type { PostedJobData } from "../../utils/types/jobs/IJob.js";

export const createJob = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const jobs: PostedJobData[] = req.body.jobs;
  try {
    const result = await getJobsDbMethods().createJobsWithAuditBulk(
      jobs,
      userId,
    );
    res.status(200).json({ message: "Job created successfully" });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
