import type { IJob } from "./IJob.js";

export interface Job {
  id: string;
  [key: string]: any;
}

export interface JobRole {
  id: string;
  pdf_url: string;
  jobs: IJob[];
  role: string;
  [key: string]: any;
}

export interface MessagedJob {
  jobId: string;
}

export interface BatchJobUpdate {
  target_role: string;
  jobs: Job[];
}
