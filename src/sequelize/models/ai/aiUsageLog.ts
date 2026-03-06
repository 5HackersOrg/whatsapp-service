import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
import { Company } from "../company/Company.js";
import { User } from "../user/Users.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface AiUsageLogAttributes {
  id: string;
  CompanyId?: string | null;
  UserId?: string | null;
  model: string;
  tokens_input: number;
  tokens_output: number;
  tokens_total?: number;
  cost_zar: number;
  endpoint?: string | null;
  duration_ms?: number | null;
  success: boolean;
  error_message?: string | null;
  createdAt?: Date;
}

export type AiUsageLogCreationAttributes = Optional<
  AiUsageLogAttributes,
  | "id"
  | "CompanyId"
  | "UserId"
  | "tokens_input"
  | "tokens_output"
  | "tokens_total"
  | "cost_zar"
  | "endpoint"
  | "duration_ms"
  | "createdAt"
  | "success"
  | "error_message"
>;

export class AiUsageLog
  extends Model<AiUsageLogAttributes, AiUsageLogCreationAttributes>
  implements AiUsageLogAttributes
{
  public id!: string;
  public company_id!: string | null;
  public user_id!: string | null;
  public model!: string;
  public tokens_input!: number;
  public tokens_output!: number;
  public tokens_total!: number;
  public cost_zar!: number;
  public endpoint!: string | null;
  public duration_ms!: number | null;
  public success!: boolean;
  public error_message!: string | null;
}

AiUsageLog.init(
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
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tokens_input: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tokens_output: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tokens_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    cost_zar: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      defaultValue: 0,
    },
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "AiUsageLog",
    tableName: "AiUsageLogs",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["CompanyId"] },
      { fields: ["UserId"] },
      { fields: ["createdAt"] },
      { fields: ["model"] },
      { fields: ["success"] },
    ],
  },
);

AiUsageLog.belongsTo(Company, {
  foreignKey: "CompanyId",
});
Company.hasMany(AiUsageLog, {
  foreignKey: "CompanyId",
  onDelete: "CASCADE",
});
