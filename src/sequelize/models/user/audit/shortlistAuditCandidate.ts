import { v7 as uuidv7 } from "uuid";
import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../../setup.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

/* ============================
   ATTRIBUTES
============================ */

export interface ShortlistAuditCandidateAttributes {
  id: string;
  ShortlistAuditId: string;
  CandidateId: string;
  createdAt?: Date;
}

export type ShortlistAuditCandidateCreationAttributes = Optional<
  ShortlistAuditCandidateAttributes,
  "id" | "createdAt"
>;

export class ShortlistAuditCandidate
  extends Model<
    ShortlistAuditCandidateAttributes,
    ShortlistAuditCandidateCreationAttributes
  >
  implements ShortlistAuditCandidateAttributes
{
  public id!: string;
  public ShortlistAuditId!: string;
  public CandidateId!: string;
  public readonly createdAt!: Date;
}

/* ============================
   INIT
============================ */

ShortlistAuditCandidate.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv7(),
    },
    ShortlistAuditId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    CandidateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: "ShortlistAuditCandidates",
    timestamps: false,
    indexes: [{ fields: ["ShortlistAuditId"] }, { fields: ["CandidateId"] }],
  },
);


