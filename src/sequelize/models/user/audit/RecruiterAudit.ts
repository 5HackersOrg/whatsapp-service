import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../../setup.js";
export const AUDIT_EVENTS = ["CREATE", "READ", "UPDATE", "DELETE"] as const;
export type AuditEvent = (typeof AUDIT_EVENTS)[number];

export const AUDIT_TARGETS = [
  "JOB",
  "RECRUITER",
  "CANDIDATE",
  "INTERVIEW",
] as const;
export type AuditTarget = (typeof AUDIT_TARGETS)[number];
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface AuditAttributes {
  id: string;
  event: AuditEvent;
  targetType: AuditTarget;
  targetId: string;
  action: string;
  performedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AuditCreationAttributes = Optional<
  AuditAttributes,
  "id" | "performedBy" | "createdAt" | "updatedAt"
>;

export class RecruiterAudit
  extends Model<AuditAttributes, AuditCreationAttributes>
  implements AuditAttributes
{
  public id!: string;
  public event!: AuditEvent;
  public targetType!: AuditTarget;
  public targetId!: string;
  public action!: string;
  public performedBy!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

RecruiterAudit.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    event: {
      type: DataTypes.ENUM(...AUDIT_EVENTS),
      allowNull: false,
    },
    targetType: {
      type: DataTypes.ENUM(...AUDIT_TARGETS),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    modelName: "RecruiterAudit",
    tableName: "RecruiterAudits",
    timestamps: true,
  },
);
