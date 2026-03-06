import { v7 as uuidv7 } from "uuid";
import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { Shortlist } from "./Shortlist.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const CANDIDATE_STATUSES = [
  "ACTIVE",
  "INTERVIEWING",
  "OFFERED",
  "REJECTED",
] as const;

export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

export interface ShortlistCandidateAttributes {
  id: string;
  ShortlistId: string;
  CandidateId: string;
  status: CandidateStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ShortlistCandidateCreationAttributes = Optional<
  ShortlistCandidateAttributes,
  "id" | "status"
>;

export class ShortlistCandidate
  extends Model<
    ShortlistCandidateAttributes,
    ShortlistCandidateCreationAttributes
  >
  implements ShortlistCandidateAttributes
{
  public id!: string;
  public ShortlistId!: string;
  public CandidateId!: string;
  public status!: CandidateStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShortlistCandidate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    ShortlistId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    CandidateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...CANDIDATE_STATUSES),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize: db,
    modelName: "ShortlistCandidate",
    tableName: "ShortlistCandidates",
    timestamps: true,
    indexes: [
      { fields: ["ShortlistId"] },
      { fields: ["CandidateId"] },
      { fields: ["status"] },
    ],
  },
);


