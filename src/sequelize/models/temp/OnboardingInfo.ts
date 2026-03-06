import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const ONBOARDING_STEPS = [
  "email",
  "password",
  "otp",
  "name",
  "company_name",
  "company_location",
  "api_key",
  "company_email",
  "company_logo",
  "completed",
  "company_number",
  "company_industry",
  "company_website",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export interface OnboardingInfoAttributes {
  email: string;
  api_key?: string | null;
  last_step: OnboardingStep;
  name?: string | null;
  password?: string | null;
  otp?: string | null;
  company_name?: string | null;
  company_website?: string | null;
  company_email?: string | null;
  company_logo?: string | null;
  company_location?: string | null;
  company_industry?: string | null;
  company_number?: string | null;
  access_token?: string | null;
  setup_completed: boolean;
}

type OnboardingInfoCreationAttributes = Optional<
  OnboardingInfoAttributes,
  | "last_step"
  | "name"
  | "otp"
  | "api_key"
  | "email"
  | "password"
  | "company_name"
  | "company_website"
  | "company_email"
  | "company_logo"
  | "company_location"
  | "company_number"
  | "access_token"
  | "company_industry"
  | "setup_completed"
>;

export class OnboardingInfo
  extends Model<OnboardingInfoAttributes, OnboardingInfoCreationAttributes>
  implements OnboardingInfoAttributes
{
  public email!: string;
  public last_step!: OnboardingStep;
  public name!: string | null;
  public otp!: string | null;
  public password!: string | null;
  public company_name!: string | null;
  public api_key!: string | null;
  public company_website!: string | null;
  public company_logo!: string | null;
  public company_email!: string | null;
  public company_location!: string | null;
  public company_industry!: string | null;
  public company_number!: string | null;
  public access_token!: string | null;
  public setup_completed!: boolean;
}

OnboardingInfo.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    last_step: {
      type: DataTypes.ENUM(...ONBOARDING_STEPS),
      defaultValue: "EMAIL",
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    otp: DataTypes.STRING,
    company_name: DataTypes.STRING,
    api_key: DataTypes.STRING,
    company_logo: DataTypes.STRING,
    company_website: DataTypes.STRING,
    company_email: DataTypes.STRING,
    company_location: DataTypes.STRING,
    company_industry: DataTypes.STRING,
    company_number: DataTypes.STRING,
    access_token: DataTypes.STRING,
    setup_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "OnboardingInfo",
    tableName: "OnboardingInfos",
    timestamps: true,
  },
);
