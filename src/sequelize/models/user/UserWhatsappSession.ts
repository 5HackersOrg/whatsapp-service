import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();
export interface UserWhatsappSessionAttributes {
  phoneNumber: string;
  state: string;
  email?: string | null;
  referredCode?: string | null;
  otp?: string | null;
  userId?: string | null;
  password?: string | null;
  redeemed: boolean;
  customerWindowTimeout: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWhatsappSessionCreationAttributes = Optional<
  UserWhatsappSessionAttributes,
  "email" | "referredCode" | "otp" | "userId" | "createdAt" | "updatedAt"
>;

export class UserWhatsappSession
  extends Model<
    UserWhatsappSessionAttributes,
    UserWhatsappSessionCreationAttributes
  >
  implements UserWhatsappSessionAttributes
{
  public phoneNumber!: string;
  public customerWindowTimeout!: string;
  public password!: string;
  public state!: string;
  public email!: string | null;
  public referredCode!: string | null;
  public otp!: string | null;
  public userId!: string | null;
  public redeemed!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserWhatsappSession.init(
  {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerWindowTimeout: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referredCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    redeemed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: "UserWhatsappSession",
    tableName: "UserWhatsappSessions",
    timestamps: true,
  },
);
