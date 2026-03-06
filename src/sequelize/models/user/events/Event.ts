import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../../setup.js";
import { v7 } from "uuid";

const EVENT_RESOURCES = [
  "JOB",
  "SHORTLIST",
  "INTERVIEW",
  "COMPANY",
  "IAM",
  "APPLICATION",
] as const;

const EVENT_METHODS = ["CREATE", "UPDATE", "DELETE"] as const;

export type EventResource = (typeof EVENT_RESOURCES)[number];
export type ResourceType = (typeof EVENT_METHODS)[number];
const dbInstance = new DBConnection();
const db = dbInstance.getDb();
interface EventAttributes {
  id: string;
  UserId: string;
  metaData: string;
  
  targetId: string;
  eventResource: EventResource;
  resourceType: ResourceType;
}
export type EventCreationAttributes = Optional<EventAttributes, "id">;

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public UserId!: string;
  public id!: string;
  public targetId!: string;
  public metaData!: string;
  public resourceType!: ResourceType;
  public eventResource!: EventResource;
}
Event.init(
  {
    resourceType: {
      type: DataTypes.ENUM(...EVENT_RESOURCES),
      allowNull: false,
    },
    eventResource: {
      type: DataTypes.ENUM(...EVENT_METHODS),
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => v7(),
    },
    metaData: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "Events",
    modelName: "Event",
    timestamps: true,
  },
);
