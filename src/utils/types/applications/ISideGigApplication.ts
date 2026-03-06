export type ProposalStatus = "submitted" | "accepted" | "rejected";

export interface ISideGigApplication {
  id: string;
  user_id: string;
  proposal: string;
  job_info_id: string;
  date: Date;
  status: ProposalStatus;
}
