import { DataTypes, Model, type Optional } from "sequelize";
import { v7 } from "uuid";
import { DBConnection } from "../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

interface CandidateStrengthAttributes {
  id: string | null;
  RecruiterAdviceId: string;
  risk: string;
}
type CandidateStrengthAttributesOptional = Optional<
  CandidateStrengthAttributes,
  "id"
>;

export class CandidateStrength
  extends Model<
    CandidateStrengthAttributes,
    CandidateStrengthAttributesOptional
  >
  implements CandidateStrengthAttributes
{
  public id!: string;
  public RecruiterAdviceId!: string;
  public risk!: string;
}

CandidateStrength.init(
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
    modelName: "CandidateStrength",
    tableName: "CandidateStrengths",
    timestamps: true,
  },
);
