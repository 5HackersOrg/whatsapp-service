import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const APPLICATION_TYPES = ["JOB", "SIDEGIG"] as const;
export type ApplicationType = (typeof APPLICATION_TYPES)[number];

export const APPLICATION_STATUSES = [
  "applied",
  "interviewing",
  "offered",
  "rejected",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface ApplicationAttributes {
  id: string;
  targetId: string;
  JobId: string;
  JobSeekerUserId: string;
  type: ApplicationType;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
}

export type ApplicationCreationAttributes = Optional<
  ApplicationAttributes,
  "id" | "appliedAt" | "updatedAt"
>;

export class Application
  extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public id!: string;
  public targetId!: string;
  public JobId!: string;
  public JobSeekerUserId!: string;
  public type!: ApplicationType;
  public status!: ApplicationStatus;
  public appliedAt!: Date;
  public updatedAt!: Date;
}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    targetId: { type: DataTypes.UUID, allowNull: false },
    JobSeekerUserId: { type: DataTypes.UUID, allowNull: false },
    JobId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.ENUM(...APPLICATION_TYPES), allowNull: false },
    status: { type: DataTypes.ENUM(...APPLICATION_STATUSES), allowNull: false },
    appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize: db,
    modelName: "Application",
    tableName: "Applications",
    timestamps: true,
  },
);
