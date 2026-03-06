import { v7 as uuidv7 } from "uuid";
import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../../setup.js";
import { ShortlistAuditCandidate } from "./shortlistAuditCandidate.js";



const dbInstance = new DBConnection();
const db = dbInstance.getDb();

/* ============================
   TYPES
============================ */

export const SHORTLIST_AUDIT_EVENTS = [
  "CREATE",
  "UPDATE_STATUS",
  "REMOVE_CANDIDATE",
  "FINALIZE_CANDIDATE",
] as const;

export const SHORTLIST_AUDIT_TARGETS = ["SHORTLIST", "CANDIDATE"] as const;

export type ShortlistAuditEvent = (typeof SHORTLIST_AUDIT_EVENTS)[number];
export type ShortlistAuditTarget = (typeof SHORTLIST_AUDIT_TARGETS)[number];

/* ============================
   ATTRIBUTES
============================ */

export interface ShortlistAuditAttributes {
  id: string;
  ShortlistId: string;
  RecruiterId: string;
  event: ShortlistAuditEvent;
  target: ShortlistAuditTarget;
  oldValue?: unknown;
  newValue?: unknown;
  createdAt?: Date;
}

/* ============================
   CREATION TYPE
============================ */

export type ShortlistAuditCreationAttributes = Optional<
  ShortlistAuditAttributes,
  "id" | "oldValue" | "newValue" | "createdAt"
>;

/* ============================
   MODEL
============================ */

export class ShortlistAudit
  extends Model<ShortlistAuditAttributes, ShortlistAuditCreationAttributes>
  implements ShortlistAuditAttributes
{
  public id!: string;
  public ShortlistId!: string;
  public RecruiterId!: string;
  public event!: ShortlistAuditEvent;
  public target!: ShortlistAuditTarget;
  public oldValue?: unknown;
  public newValue?: unknown;
  public readonly createdAt!: Date;


}

/* ============================
   INIT
============================ */

ShortlistAudit.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv7(),
    },
    ShortlistId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    RecruiterId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    event: {
      type: DataTypes.ENUM(...SHORTLIST_AUDIT_EVENTS),
      allowNull: false,
    },
    target: {
      type: DataTypes.ENUM(...SHORTLIST_AUDIT_TARGETS),
      allowNull: false,
    },
    oldValue: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: "ShortlistAudits",
    timestamps: false,
    indexes: [
      { fields: ["ShortlistId"] },
      { fields: ["RecruiterId"] },
      { fields: ["event"] },
      { fields: ["createdAt"] },
    ],
  },
);

/* ============================
   ASSOCIATIONS
============================ */

ShortlistAudit.hasMany(ShortlistAuditCandidate, {
  foreignKey: "ShortlistAuditId",
  as: "candidates",
  onDelete: "CASCADE",
});

ShortlistAuditCandidate.belongsTo(ShortlistAudit, {
  foreignKey: "ShortlistAuditId",
  as: "audit",
});

export default ShortlistAudit;
