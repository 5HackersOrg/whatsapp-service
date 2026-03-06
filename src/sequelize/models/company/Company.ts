import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
import { Recruiter } from "../user/Recruiter.js";
import { Permission } from "../user/permissions/Permissions.js";
import { Interview } from "../user/Interview.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const SUBSCRIPTION_TIERS = [
  "PayPerPost",
  "Supporter",
  "Enterprise",
] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export interface CompanyAttributes {
  id: string;
  name: string;
  location?: string | null;
  number?: string | null;
  logo?: string | null;
  industry?: string | null;
  verifiedId?: string;
  about?: string | null;
  email?: string | null;
  website?: string | null;
  apiKey?: string | null;
  createdAt?: Date;
  subscriptionTier?: SubscriptionTier | null;
}

export type CompanyCreationAttributes = Optional<
  CompanyAttributes,
  "id" | "website" | "apiKey" | "subscriptionTier" | "number" | "createdAt"
>;

export class Company
  extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes
{
  public id!: string;
  public name!: string;
  public location!: string | null;
  public logo!: string | null;
  public number!: string | null;
  public industry!: string | null;
  public verifiedId!: string;
  public email!: string | null;
  public about!: string | null;
  public website!: string | null;
  public apiKey!: string | null;
  public createdAt!: Date;
  public subscriptionTier!: SubscriptionTier | null;
}

Company.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifiedId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    apiKey: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    subscriptionTier: {
      type: DataTypes.ENUM(...SUBSCRIPTION_TIERS),
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Company",
    tableName: "Companies",
    timestamps: true,
  },
);

Company.hasMany(Recruiter, { foreignKey: "CompanyId", onDelete: "CASCADE" });
Recruiter.belongsTo(Company);
Company.hasOne(Permission, { foreignKey: "CompanyId", onDelete: "CASCADE" });
Permission.belongsTo(Company);
Recruiter.hasMany(Interview, { onDelete: "CASCADE" });
Interview.belongsTo(Recruiter);
