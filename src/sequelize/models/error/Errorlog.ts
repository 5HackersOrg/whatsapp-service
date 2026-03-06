// ErrorLog.ts
import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
import { Company } from "../company/Company.js";
import { User } from "../user/Users.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const ERROR_TYPES = [
  "OTP_FAILURE",
  "TRANSACTION_ERROR",
  "EMAIL_FAILURE",
  "AUTH_FAILURE",
  "VALIDATION_ERROR",
  "SERVER_ERROR",
] as const;

export const SEVERITY_LEVELS = ["info", "warn", "error", "critical"] as const;

export type ErrorType = (typeof ERROR_TYPES)[number];
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export interface ErrorLogAttributes {
  id: string;
  CompanyId?: string | null;
  UserId?: string | null;
  error_type: ErrorType;
  error_message: string;
  stack_trace?: string | null;
  endpoint?: string | null;
  severity: SeverityLevel;
  resolved: boolean;
  created_at?: Date;
}

export type ErrorLogCreationAttributes = Optional<
  ErrorLogAttributes,
  | "id"
  | "CompanyId"
  | "UserId"
  | "stack_trace"
  | "endpoint"
  | "severity"
  | "resolved"
  | "created_at"
>;

export class ErrorLog
  extends Model<ErrorLogAttributes, ErrorLogCreationAttributes>
  implements ErrorLogAttributes
{
  public id!: string;
  public company_id!: string | null;
  public user_id!: string | null;
  public error_type!: ErrorType;
  public error_message!: string;
  public stack_trace!: string | null;
  public endpoint!: string | null;
  public severity!: SeverityLevel;
  public resolved!: boolean;
  public readonly created_at!: Date;
}

ErrorLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    CompanyId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    error_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stack_trace: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    severity: {
      type: DataTypes.ENUM(...SEVERITY_LEVELS),
      allowNull: false,
      defaultValue: "error",
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "ErrorLog",
    tableName: "ErrorLogs",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["CompanyId"] },
      { fields: ["UserId"] },
      { fields: ["error_type"] },
      { fields: ["severity"] },
      { fields: ["resolved"] },
      { fields: ["createdAt"] },
    ],
  },
);

ErrorLog.belongsTo(Company, { foreignKey: "CompanyId" });
Company.hasMany(ErrorLog, { foreignKey: "CompanyId", onDelete: "CASCADE" });

ErrorLog.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(ErrorLog, { foreignKey: "UserId", onDelete: "CASCADE" });
