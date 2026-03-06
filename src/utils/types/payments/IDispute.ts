export type DisputeStatus = "open" | "under_review" | "resolved" | "rejected";
export type DisputeInitiator = "candidate" | "poster";
export type DisputeOutcome = "candidate_favor" | "poster_favor" | "no_fault";
export interface IDisputeEvidence {
  message: string;
  attachments: string | string[];
}

export interface IDisputeResolution {
  outcome: DisputeOutcome;
  resolution_note: string;
  resolvedAt: Date;
}
export interface IDispute {
  id: string;
  poster_id: string;
  candidate_id: string;
  dispute_reason: string;
  candidate_evidence: IDisputeEvidence;
  poster_evidence: IDisputeEvidence;
  status: DisputeStatus;
  createdAt: Date;
  updatedAt: Date;
  escrow_id: string;
  initiated_by: DisputeInitiator;
  moderator_id: string | null;
  resolution: IDisputeResolution | null;
}