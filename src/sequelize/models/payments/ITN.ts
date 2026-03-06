import { v7 as uuidv7 } from "uuid"
import { DBConnection } from "../../setup.js"
import { DataTypes, Model } from "sequelize"
const dbInstance = new DBConnection()
const db = dbInstance.getDb()

export interface ITNAttributes {
  PaymentId: string
  transactionId: string
  status: string
}



export class ITN
  extends Model<ITNAttributes, any>
  implements ITNAttributes
{
  public PaymentId!: string
  public transactionId!: string
  public status!: string
}

ITN.init(
  {
    PaymentId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "ITN",
    tableName: "ITNs",
    timestamps: true,
  }
)
