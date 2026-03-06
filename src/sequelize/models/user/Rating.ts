import { DataTypes, Model } from "sequelize"
import type { Optional } from "sequelize"
import { DBConnection } from "../../setup.js"

const dbInstance = new DBConnection()
const db = dbInstance.getDb()
export interface RatingAttributes {
  UserId: string
  score: number
  targetId: string
  message?: string | null
}

export type RatingCreationAttributes = Optional<
  RatingAttributes,
   "message" 
>

export class Rating
  extends Model<RatingAttributes, RatingCreationAttributes>
  implements RatingAttributes
{
  public UserId!: string
  public score!: number
  public targetId!: string
  public message!: string | null
  public createdAt!: Date
  public updatedAt!: Date
}

Rating.init(
  {
    UserId: {
      type: DataTypes.UUID,
      primaryKey: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
   
  },
  {
    sequelize: db,
    modelName: "Rating",
    tableName: "Ratings",
    timestamps:true
  }
)
