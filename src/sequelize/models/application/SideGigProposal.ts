import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { Application } from "./Application.js"; // import your unified Application model

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface SideGigProposalAttributes {
  id: string;
  ApplicationId: string; // link to the application
  UserId: string; // applicant
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SideGigProposalCreationAttributes = Optional<
  SideGigProposalAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class SideGigProposal
  extends Model<SideGigProposalAttributes, SideGigProposalCreationAttributes>
  implements SideGigProposalAttributes
{
  public id!: string;
  public ApplicationId!: string;
  public UserId!: string;
  public message!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

SideGigProposal.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ApplicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Application,
        key: "id",
      },
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    modelName: "SideGigProposal",
    tableName: "SideGigProposals",
    timestamps: true,
  },
);


Application.hasMany(SideGigProposal, {
  foreignKey: "ApplicationId",
  onDelete: "CASCADE",
});
SideGigProposal.belongsTo(Application, { foreignKey: "ApplicationId" });
