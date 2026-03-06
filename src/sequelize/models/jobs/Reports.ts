import { v7 as uuidv7 } from "uuid";
import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

// --- TYPES ---
export type ReportReason =
  | "PHISHING_ATTEMPT"
  | "SCAM_FRAUD"
  | "MISLEADING_INFO"
  | "SAFETY_VIOLATION"
  | "SPAM"
  | "EXPIRED";

export interface ReportAttributes {
  id: string;
  JobId: string;
  reason: ReportReason;
}

export type ReportCreationAttributes = Optional<ReportAttributes, "id">;

// --- MODEL CLASS ---
export class Report
  extends Model<ReportAttributes, ReportCreationAttributes>
  implements ReportAttributes
{
  public id!: string;
  public JobId!: string;
  public reason!: ReportReason;
  public readonly resolvedBy!: string;
  public readonly updatedAt!: Date;
}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    JobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Jobs",
        key: "id",
      },
    },

    reason: {
      type: DataTypes.ENUM(
        "PHISHING_ATTEMPT",
        "SCAM_FRAUD",
        "MISLEADING_INFO",
        "SAFETY_VIOLATION",
        "SPAM",
        "EXPIRED",
      ),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Report",
    tableName: "Reports",
    timestamps: true,
  },
);
