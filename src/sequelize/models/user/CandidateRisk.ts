import { DataTypes, Model, type Optional } from "sequelize";
import { v7 } from "uuid";
import { DBConnection } from "../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

interface CandidateRiskAttributes {
  id: string | null;
  RecruiterAdviceId: string;
  risk: string;
}
type CandidateRiskAttributesOptional = Optional<CandidateRiskAttributes, "id">;

export class CandidateRisk
  extends Model<CandidateRiskAttributes, CandidateRiskAttributesOptional>
  implements CandidateRiskAttributes
{
  public id!: string;
  public RecruiterAdviceId!: string;
  public risk!: string;
}

CandidateRisk.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => v7(),
      primaryKey: true,
    },
    RecruiterAdviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    risk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "CandidateRisk",
    tableName: "CandidateRisks",
    timestamps: true,
  },
);
