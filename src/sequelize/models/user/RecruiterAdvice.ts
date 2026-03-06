import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { CandidateStrength } from "./CandidateStrength.js";
import { CandidateRisk } from "./CandidateRisk.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export type InterviewPriority =
  | "High - Fast Track"
  | "Medium - Proceed"
  | "Low - Archive";

interface RecruiterAdviceAttributes {
  id: string | null;
  JobId: string;
  JobSeekerId: string;
  RecruiterId: string;
  RoleFitAnalysis: string;
  suitabilityRating: number;
  thrivePotentialRating: number;
  recruiterHeadline: string;
  interviewPriority: InterviewPriority;
}
type RecruiterAdviceAttributesOptional = Optional<
  RecruiterAdviceAttributes,
  "id"
>;

export class RecruiterAdvice
  extends Model<RecruiterAdviceAttributes, RecruiterAdviceAttributesOptional>
  implements RecruiterAdviceAttributes
{
  public id!: string;
  public JobId!: string;
  public JobSeekerId!: string;
  public RecruiterId!: string;
  public RoleFitAnalysis!: string;
  public suitabilityRating!: number;
  public thrivePotentialRating!: number;
  public recruiterHeadline!: string;
  public interviewPriority!: InterviewPriority;
  public createdAt!: Date;
  public updatedAt!: Date;
}

RecruiterAdvice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    JobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    RecruiterId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    JobSeekerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    RoleFitAnalysis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    suitabilityRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.0, max: 5.0 },
    },
    thrivePotentialRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.0, max: 5.0 },
    },
    recruiterHeadline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interviewPriority: {
      type: DataTypes.ENUM(
        "High - Fast Track",
        "Medium - Proceed",
        "Low - Archive",
      ),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "RecruiterAdvices",
    modelName: "RecruiterAdvice",
  },
);
RecruiterAdvice.hasMany(CandidateStrength, { onDelete: "CASCADE" });
CandidateStrength.belongsTo(RecruiterAdvice);
RecruiterAdvice.hasMany(CandidateRisk, { onDelete: "CASCADE" });
CandidateRisk.belongsTo(RecruiterAdvice);
