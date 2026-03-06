import { v7 as uuidv7 } from "uuid";
import { DBConnection } from "../../setup.js";
import { DataTypes, Model,type Optional } from "sequelize";
import { Scrapped } from "./Scrapped.js";
import { SideGig } from "./SideGig.js";
import { Posted } from "./Posted.js";
import { Application } from "../application/Application.js";
import { JobCache } from "./cache/JobCache.js";
import { Report } from "./Reports.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();


export interface JobAttributes {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "FILLED" | "DISABLED" | "REVIEWING";
  isRemote: boolean;
  salary?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type JobCreationAttributes = Optional<
  JobAttributes,
  "id" | "salary" | "createdAt" | "updatedAt"
>;



export class Job
  extends Model<JobAttributes, JobCreationAttributes>
  implements JobAttributes
{
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: "ACTIVE" | "FILLED" | "DISABLED" | "REVIEWING";
  public isRemote!: boolean;
  public salary!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}



Job.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    isRemote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "FILLED", "DISABLED", "REVIEWING"),
      allowNull: false,
      defaultValue: "REVIEWING",
    },

    salary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Job",
    tableName: "Jobs",
    timestamps: true,
  },
);

/* ============================
   ASSOCIATIONS
============================ */

Job.hasOne(Scrapped, { foreignKey: "JobId", onDelete: "CASCADE" });
Scrapped.belongsTo(Job, { foreignKey: "JobId" });

Job.hasOne(SideGig, { foreignKey: "JobId", onDelete: "CASCADE" });
SideGig.belongsTo(Job, { foreignKey: "JobId" });

Job.hasOne(Posted, { foreignKey: "JobId", onDelete: "CASCADE" });
Posted.belongsTo(Job, { foreignKey: "JobId" });

Job.hasMany(Application, { foreignKey: "JobId", onDelete: "CASCADE" });
Application.belongsTo(Job, { foreignKey: "JobId" });

Job.hasMany(JobCache, { foreignKey: "JobId", onDelete: "CASCADE" });
JobCache.belongsTo(Job, { foreignKey: "JobId" });

Job.hasMany(Report, { foreignKey: "JobId", onDelete: "CASCADE" });
Report.belongsTo(Job, { foreignKey: "JobId" });

