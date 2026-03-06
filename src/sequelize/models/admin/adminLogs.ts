// AdminAuditLog.ts
import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
import { User } from "../user/Users.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const AUDIT_ACTIONS = [
  "SUSPEND_USER",
  "UNSUSPEND_USER",
  "APPROVE_COMPANY",
  "REJECT_COMPANY",
  "DELETE_USER",
  "DELETE_COMPANY",
  "UPDATE_PERMISSIONS",
  "RESOLVE_ERROR",
  "UPDATE_CONFIG",
] as const;

export const AUDIT_TARGET_TYPES = [
  "user",
  "company",
  "job",
  "verification",
  "config",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];
export type AuditTargetType = (typeof AUDIT_TARGET_TYPES)[number];

export interface AdminAuditLogAttributes {
  id: string;
  UserId?: string | null;
  action: AuditAction;
  target_type?: AuditTargetType | null;
  created_at?: Date;
}

export type AdminAuditLogCreationAttributes = Optional<
  AdminAuditLogAttributes,
  "id" | "UserId" | "target_type" | "created_at"
>;

export class AdminAuditLog
  extends Model<AdminAuditLogAttributes, AdminAuditLogCreationAttributes>
  implements AdminAuditLogAttributes
{
  public id!: string;
  public admin_id!: string | null;
  public action!: AuditAction;
  public target_type!: AuditTargetType | null;
  public readonly created_at!: Date;
}

AdminAuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    action: {
      type: DataTypes.ENUM(...AUDIT_ACTIONS),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "AdminAuditLog",
    tableName: "AdminAuditLogs",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["UserId"] },
      { fields: ["action"] },
      { fields: ["createdAt"] },
    ],
  },
);
