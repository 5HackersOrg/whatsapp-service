import { DataTypes, Model } from "sequelize";
import { DBConnection } from "../../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();
export interface JobCacheAttributes {
  JobRoleCacheId: string;
  JobId: string;
}

export class JobCache
  extends Model<JobCacheAttributes, JobCacheAttributes>
  implements JobCacheAttributes
{
  public JobRoleCacheId!: string;
  public JobId!: string;
}

JobCache.init(
  {
    JobRoleCacheId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    JobId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    sequelize: db,
    modelName: "JobCache",
    tableName: "JobCaches",
  },
);
