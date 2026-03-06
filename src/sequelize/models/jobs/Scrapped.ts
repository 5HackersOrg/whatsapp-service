import { DataTypes, Model } from "sequelize"
import { DBConnection } from "../../setup.js"
import { JobCache } from "./cache/JobCache.js"

export interface ScrappedAttributes {
  JobId: string
  location: string
  companyName: string
  link: string

}
const dbInstance = new DBConnection()
const db = dbInstance.getDb()


export class Scrapped
  extends Model<ScrappedAttributes, ScrappedAttributes>
  implements ScrappedAttributes
{
  public JobId!: string;
  public location!: string;
  public companyName!: string;
  public link!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Scrapped.init(
  {
    JobId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize: db,
    modelName: "Scrapped",
    tableName: "Scrappeds",
  }
)

Scrapped.hasOne(JobCache, { onDelete: "CASCADE" })
JobCache.belongsTo(Scrapped)
