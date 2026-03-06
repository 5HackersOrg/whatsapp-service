import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const INTERVIEW_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
] as const;
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export interface InterviewAttributes {
  id: string;
  CompanyId: string;
  RecruiterId: string;
  UserId: string;
  is_remote: boolean;
  location?: string | null;
  position: string;
  date: string;
  status: InterviewStatus;
  link?: string | null;
  metaData?: string | null;
  feedback?: string | null;
}

export type InterviewCreationAttributes = Optional<
  InterviewAttributes,
  "id" | "metaData" | "feedback"
>;

export class Interview
  extends Model<InterviewAttributes, InterviewCreationAttributes>
  implements InterviewAttributes
{
  public id!: string;
  public CompanyId!: string;
  public position!: string;
  public date!: string;
  public RecruiterId!: string;
  public UserId!: string;
  public is_remote!: boolean;
  public status!: InterviewStatus;
  public location!: string | null;
  public link!: string | null;
  public metaData!: string | null;
  public feedback!: string | null;
}

Interview.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    CompanyId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    RecruiterId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...INTERVIEW_STATUSES),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_remote: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Interview",
    tableName: "Interviews",
    timestamps: true,
  },
);
