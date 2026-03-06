import { DataTypes, Model } from "sequelize"
import type { Optional } from "sequelize"
import { DBConnection } from "../../../setup.js"
import { v7 as uuidv7 } from "uuid"
import { JobCache } from "./JobCache.js"
const dbInstance = new DBConnection()
const db = dbInstance.getDb()

export interface JobRoleCacheAttributes {
  id: string
  ttlDays: number
  name:string

}

export type JobRoleCacheCreationAttributes = Optional<JobRoleCacheAttributes, "id" >

export class JobRoleCache
  extends Model<JobRoleCacheAttributes, JobRoleCacheCreationAttributes>
  implements JobRoleCacheAttributes
{
  public id!: string
  public ttlDays!: number
  public name!: string
}

JobRoleCache.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    ttlDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
   
  },
  {
    sequelize: db,
    modelName: "JobRoleCache",
    tableName: "JobRoleCaches",
    timestamps: true,
  }
)

JobRoleCache.hasMany(JobCache, { foreignKey:"JobRoleCacheId",onDelete: "CASCADE" })
JobCache.belongsTo(JobRoleCache)

