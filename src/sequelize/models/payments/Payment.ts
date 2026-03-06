import { v7 as uuidv7 } from "uuid";
import { DBConnection } from "../../setup.js";
import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { ITN } from "./ITN.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const PAYMENT_STATUSES = ["PENDING", "COMPLETED", "FAILED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const PAYMENT_TYPES = [
  "UserSubscription",
  "SideGigDeposit",
  "CompanySubscription",
  "Pay_Per_Post",
] as const;
export type PaymentTypes = (typeof PAYMENT_TYPES)[number];

export interface PaymentAttributes {
  id: string;
  amount: number;
  payeerId: string;
  currency: string;
  status: PaymentStatus;
  type: PaymentTypes;
}

export type PaymentCreationAttributes = Optional<PaymentAttributes, "id">;

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: string;
  public amount!: number;
  public currency!: string;
  public payeerId!: string;
  public status!: PaymentStatus;
  public type!: PaymentTypes;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payeerId: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...PAYMENT_STATUSES),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...PAYMENT_TYPES),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Payment",
    tableName: "Payments",
    timestamps: true,
  },
);

Payment.hasOne(ITN, { foreignKey: "PaymentId", onDelete: "CASCADE" });
ITN.belongsTo(Payment);
