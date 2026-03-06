import { v7 as uuidv7 } from "uuid";
import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { ShortlistCandidate } from "./shortlistCandidate.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const SHORTLIST_STATUSES = [
  "REVIEWING",
  "INTERVIEWING",
  "OFFER",
] as const;

export type ShortlistStatus = (typeof SHORTLIST_STATUSES)[number];

export interface ShortlistAttributes {
  id: string;
  JobId: string;
  RecruiterId: string;
  status: ShortlistStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ShortlistCreationAttributes = Optional<
  ShortlistAttributes,
  "id" | "status"
>;

export class Shortlist
  extends Model<ShortlistAttributes, ShortlistCreationAttributes>
  implements ShortlistAttributes
{
  public id!: string;
  public JobId!: string;
  public RecruiterId!: string;
  public status!: ShortlistStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shortlist.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv7(),
    },
    JobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    RecruiterId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...SHORTLIST_STATUSES),
      allowNull: false,
      defaultValue: "REVIEWING",
    },
  },
  {
    sequelize: db,
    tableName: "Shortlists",
    timestamps: true,
    indexes: [
      { fields: ["JobId"] },
      { fields: ["RecruiterId"] },
      { fields: ["status"] },
    ],
  },
);

// Associations
Shortlist.hasMany(ShortlistCandidate, {
  foreignKey: "ShortlistId",
  onDelete: "CASCADE",
});

ShortlistCandidate.belongsTo(Shortlist, {
  foreignKey: "ShortlistId",
});

export default Shortlist;
