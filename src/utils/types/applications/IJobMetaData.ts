export type JobType = "side_gig" | "full_time" | "contract";
export type JobStatus = "open" | "closed" | "paused";
export interface IJobInfo {
  id: string;
  job_id: string;
  max_applicants: number;
  type: JobType;
  application_ids: string[];
  prev_applicants: string[];
  user_id: string;
  active: boolean;
  payments_id: string[];
  status: JobStatus;
}
