// EmailLog.ts
import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const EMAIL_TYPES = [
  "OTP",
  "WELCOME",
  "NOTIFICATION",
  "PASSWORD_RESET",
  "VERIFICATION",
] as const;

export const EMAIL_STATUSES = ["sent", "failed", "bounced"] as const;

export type EmailType = (typeof EMAIL_TYPES)[number];
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export interface EmailLogAttributes {
  id: string;
  recipient: string;
  email_type: EmailType;
  subject?: string | null;
  status: EmailStatus;
  error_message?: string | null;
  sent_at?: Date;
}

export type EmailLogCreationAttributes = Optional<
  EmailLogAttributes,
  "id" | "subject" | "error_message" | "sent_at"
>;

export class EmailLog
  extends Model<EmailLogAttributes, EmailLogCreationAttributes>
  implements EmailLogAttributes
{
  public id!: string;
  public recipient!: string;
  public email_type!: EmailType;
  public subject!: string | null;
  public status!: EmailStatus;
  public error_message!: string | null;
  public readonly sent_at!: Date;
}

EmailLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    recipient: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email_type: {
      type: DataTypes.ENUM(...EMAIL_TYPES),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...EMAIL_STATUSES),
      allowNull: false,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "EmailLog",
    tableName: "EmailLogs",
    timestamps: true,
    updatedAt: false,
    createdAt: "sent_at",
    indexes: [
      { fields: ["recipient"] },
      { fields: ["email_type"] },
      { fields: ["status"] },
      { fields: ["sent_at"] },
    ],
  },
);
