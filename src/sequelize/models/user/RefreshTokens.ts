import { DataTypes, Model } from "sequelize";
import { DBConnection } from "../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();
interface RefreshtokenAttributes {
  UserId: string;
  fingerprint: string;
  refreshToken: string;
}
export class RefreshToken
  extends Model<RefreshtokenAttributes, RefreshtokenAttributes>
  implements RefreshtokenAttributes
{
  public UserId!: string;
  public fingerprint!: string;
  public refreshToken!: string;
}
RefreshToken.init(
  {
    UserId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    fingerprint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "RefreshToken",
    tableName: "RefreshTokens",
  },
);
