import type { coverLetterTemplates } from "../../user/userCoverLetters.js";
import type { resumeTemplates } from "../../user/userResume.js";
import type { IRating } from "./IRating.js";

export enum UserSubTiers {
  FREE = "FREE",
  SUPPORTER = "SUPPORTER",
}

export interface IUserProfile {
  ref_link: string | null;
  location: {
    lat?: number;
    lon?: number;
  };
  id: string;
  credits: number;
  ref_code: string | null;
  balance: number;
  ratings: IRating[];
  purchased_resume_templates: resumeTemplates[];
  purchased_coverletter_templates: coverLetterTemplates[];
  opted_in_for_side_gigs: boolean;
  resume_template: resumeTemplates;
  cover_letter_template: coverLetterTemplates;
  subscription_tier: UserSubTiers;
  latest_sub_date: Date;
  side_gig_ids: string[];
  disputes_id: string[];
  skills: string[];
  application_ids: string[];
  application_ids_side_gigs: string[];
  payment_ids: string[];
  total_referrals: number;
  verified: boolean;
  referred_by: string | null;
}
