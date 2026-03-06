import { DataTypes, Model } from "sequelize"
import type { Optional } from "sequelize"
import { DBConnection } from "../../setup.js"
const dbInstance = new DBConnection()
const db = dbInstance.getDb()

export const MODERATOR_STATUSES = ["active", "inactive"] as const
export type ModeratorStatus = typeof MODERATOR_STATUSES[number]

export interface ModeratorAttributes {
  UserId: string
  status: ModeratorStatus
  createdAt: Date
  updatedAt: Date
}

export type ModeratorCreationAttributes = Optional<
  ModeratorAttributes,
  "status" | "createdAt" | "updatedAt"
>

export class Moderator
  extends Model<ModeratorAttributes, ModeratorCreationAttributes>
  implements ModeratorAttributes
{
  public UserId!: string
  public status!: ModeratorStatus
  public createdAt!: Date
  public updatedAt!: Date
}

Moderator.init(
  {
    UserId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM(...MODERATOR_STATUSES),
      defaultValue: "inactive",
      allowNull: false,
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
    modelName: "Moderator",
    tableName: "Moderators",

  }
)


