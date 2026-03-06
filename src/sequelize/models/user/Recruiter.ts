import { DataTypes, Model } from "sequelize";
import { DBConnection } from "../../setup.js";
import { RecruiterAudit } from "./audit/RecruiterAudit.js";
import { Interview } from "./Interview.js";
import { Posted } from "../jobs/Posted.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface RecruiterAttributes {
  UserId: string;
  CompanyId: string;
  active: boolean;
}

export class Recruiter
  extends Model<RecruiterAttributes, RecruiterAttributes>
  implements RecruiterAttributes
{
  public UserId!: string;
  public active!: boolean;
  public CompanyId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Recruiter.init(
  {
    UserId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CompanyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Recruiter",
    tableName: "Recruiters",
  },
);

Recruiter.hasMany(Interview, { onDelete: "CASCADE" });
Interview.belongsTo(Recruiter);
Recruiter.hasMany(RecruiterAudit, {
  foreignKey: "RecruiterId",
  onDelete: "CASCADE",
});
RecruiterAudit.belongsTo(Recruiter);

Recruiter.hasMany(Posted, { onDelete: "CASCADE" });
Posted.belongsTo(Recruiter);
