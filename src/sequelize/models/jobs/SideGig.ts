import { DataTypes, Model } from "sequelize"
import { DBConnection } from "../../setup.js"

export interface SideGigAttributes {
  JobId: string
  latitude: string
  longitude: string
  address: string

}
const dbInstance = new DBConnection()
const db = dbInstance.getDb()



export class SideGig
  extends Model<SideGigAttributes, SideGigAttributes>
  implements SideGigAttributes
{
  public JobId!: string;
  public latitude!: string;
  public longitude!: string;
  public address!: string;
}

SideGig.init(
  {
    JobId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize: db,
    modelName: "SideGig",
    tableName: "SideGigs",
  }
)
