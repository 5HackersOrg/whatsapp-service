import { DataTypes, Model } from "sequelize";

import { DBConnection } from "../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const PROGRAM_TYPES = [
  "Not a Program",
  "Learnership",
  "Graduate",
  "Internship",
] as const;
export type ProgramType = (typeof PROGRAM_TYPES)[number];
export const EMPLOYEMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
] as const;
export type employmentType = (typeof EMPLOYEMENT_TYPES)[number];

export interface PostedAttributes {
  JobId: string;
  RecruiterUserId: string;
  location: string;
  maxApplications: number;
  aiInsights: boolean;
  companyName: string;
  industry: string;
  educationLevel: number;
  employmentType: employmentType;
  experience: number;
  embedding: string;
  programType: ProgramType;
  closingDate: string;
}

export class Posted
  extends Model<PostedAttributes, PostedAttributes>
  implements PostedAttributes
{
  public JobId!: string;
  public location!: string;
  public RecruiterUserId!: string;
  public maxApplications!: number;
  public aiInsights!: boolean;
  public companyName!: string;
  public employmentType!: employmentType;
  public industry!: string;
  public experience!: number;
  public embedding!: string;
  public educationLevel!: number;
  public closingDate!: string;
  public programType!: ProgramType;
}

Posted.init(
  {
    JobId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    RecruiterUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    aiInsights: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxApplications: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    educationLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    embedding: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    closingDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    programType: {
      type: DataTypes.ENUM(...PROGRAM_TYPES),
      allowNull: false,
    },
    employmentType: {
      type: DataTypes.ENUM(...EMPLOYEMENT_TYPES),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Posted",
  },
);
