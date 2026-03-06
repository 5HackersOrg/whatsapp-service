import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { Interview } from "./Interview.js";
import { Rating } from "./Rating.js";
import { Application } from "../application/Application.js";
import { SideGigProposal } from "../application/SideGigProposal.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const SUBSCRIPTION_TIERS = ["Free", "Supporter"] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export const RESUME_TEMPLATES = [
  "Minimal",
  "Professional",
  "Corporate",
] as const;
export type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];

export const COVER_LETTER_TEMPLATES = ["Basic", "Professional"] as const;
export type CoverLetterTemplate = (typeof COVER_LETTER_TEMPLATES)[number];

export interface JobSeekerAttributes {
  UserId: string;
  scrappedJobs: number;
  foundJobsToday: number;
  embedding?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  industry?: string | null;
  refCode?: string | null;
  credits: number;
  experience: number | null;
  educationLevel: number | null;
  totalReferrals: number;
  optInForSideGigs: boolean;
  verifiedId: string;
  subscriptionValid: boolean;
  subscriptionTier: SubscriptionTier;
  referredBy?: string | null;
  averageRating?: number | null;
  resumeTemplate: ResumeTemplate;
  coverLetterTemplate: CoverLetterTemplate;

  createdAt: Date;
  updatedAt: Date;
}

export type JobSeekerCreationAttributes = Optional<
  JobSeekerAttributes,
  | "scrappedJobs"
  | "foundJobsToday"
  | "address"
  | "latitude"
  | "longitude"
  | "industry"
  | "refCode"
  | "credits"
  | "totalReferrals"
  | "optInForSideGigs"
  | "subscriptionValid"
  | "subscriptionTier"
  | "referredBy"
  | "averageRating"
  | "resumeTemplate"
  | "coverLetterTemplate"
  | "experience"
  | "educationLevel"
  | "createdAt"
  | "updatedAt"
>;

export class JobSeeker
  extends Model<JobSeekerAttributes, JobSeekerCreationAttributes>
  implements JobSeekerAttributes
{
  public UserId!: string;
  public scrappedJobs!: number;
  public foundJobsToday!: number;
  public address!: string | null;
  public embedding!: string | null;
  public latitude!: string | null;
  public industry!: string | null;
  public longitude!: string | null;
  public refCode!: string | null;
  public credits!: number;
  public educationLevel!: number | null;
  public experience!: number | null;
  public totalReferrals!: number;
  public optInForSideGigs!: boolean;
  public verifiedId!: string;
  public subscriptionValid!: boolean;
  public subscriptionTier!: SubscriptionTier;
  public referredBy!: string | null;
  public averageRating!: number | null;
  public resumeTemplate!: ResumeTemplate;
  public coverLetterTemplate!: CoverLetterTemplate;
  public resumeTemplateJson!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

JobSeeker.init(
  {
    UserId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    scrappedJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    foundJobsToday: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    embedding: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
    },

    totalReferrals: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    optInForSideGigs: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subscriptionValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subscriptionTier: {
      type: DataTypes.ENUM(...SUBSCRIPTION_TIERS),
      defaultValue: "Free",
    },
    referredBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    resumeTemplate: {
      type: DataTypes.ENUM(...RESUME_TEMPLATES),
      defaultValue: "Minimal",
    },
    coverLetterTemplate: {
      type: DataTypes.ENUM(...COVER_LETTER_TEMPLATES),
      defaultValue: "Basic",
    },
    educationLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    modelName: "JobSeeker",
    tableName: "JobSeekers",
  },
);

JobSeeker.hasMany(Interview, { onDelete: "CASCADE" });
Interview.belongsTo(JobSeeker);
JobSeeker.hasMany(Application, { onDelete: "CASCADE" });
Application.belongsTo(JobSeeker);
JobSeeker.hasMany(Rating, { onDelete: "CASCADE" });
Rating.belongsTo(JobSeeker);
JobSeeker.hasMany(SideGigProposal, { onDelete: "CASCADE" });
SideGigProposal.belongsTo(JobSeeker);
