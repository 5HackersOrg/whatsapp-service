import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
import { User } from "../user/Users.js";
import { JobSeeker } from "../user/JobSeeker.js";
import { Company } from "../company/Company.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const VERIFICATION_TARGET_TYPES = ["user", "company"] as const;
export const VERIFICATION_TYPES = [
  "email",
  "phone",
  "identity",
  "business",
  "address",
  "bank_account",
] as const;
export const VERIFICATION_STATUSES = [
  "pending",
  "in_review",
  "verified",
  "rejected",
  "expired",
] as const;

export type VerificationTargetType = (typeof VERIFICATION_TARGET_TYPES)[number];
export type VerificationType = (typeof VERIFICATION_TYPES)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export interface VerificationAttributes {
  id: string;
  target_type: VerificationTargetType;
  type: VerificationType;
  status: VerificationStatus;
  submitted_data?: string
  rejection_reason?: string | null;
  notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: Date | null;
  expires_at?: Date | null;
}

export type VerificationCreationAttributes = Optional<
  VerificationAttributes,
  | "id"
  | "status"
  | "submitted_data"
  | "rejection_reason"
  | "notes"
  | "reviewed_by"
  | "reviewed_at"
  | "expires_at"
>;

export class Verification
  extends Model<VerificationAttributes, VerificationCreationAttributes>
  implements VerificationAttributes
{
  public id!: string;
  public target_type!: VerificationTargetType;
  public type!: VerificationType;
  public status!: VerificationStatus;
  public submitted_data!: string
  public rejection_reason!: string | null;
  public notes!: string | null;
  public reviewed_by!: string | null;
  public reviewed_at!: Date | null;
  public expires_at!: Date | null;
}

Verification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    target_type: {
      type: DataTypes.ENUM(...VERIFICATION_TARGET_TYPES),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...VERIFICATION_TYPES),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...VERIFICATION_STATUSES),
      allowNull: false,
      defaultValue: "pending",
    },
    submitted_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Verification",
    tableName: "Verifications",
    timestamps: true,
    indexes: [
      {
        fields: ["target_type"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["type"],
      },
      
    ],
  },
);
JobSeeker.belongsTo(Verification, {
  foreignKey: "verifiedId",
});

Verification.hasOne(JobSeeker, {
  foreignKey: "verifiedId",
});
Company.belongsTo(Verification, {
  foreignKey: "verifiedId",
});

Verification.hasOne(Company, {
  foreignKey: "verifiedId",
  onDelete: "CASCADE",
});
User.hasMany(Verification, {
  foreignKey: "reviewed_by",
});
Verification.belongsTo(User, {
  foreignKey: "reviewed_by",
});
