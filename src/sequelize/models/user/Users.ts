import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
import { Role } from "./Role.js";
import { Moderator } from "./Moderator.js";
import { JobSeeker } from "./JobSeeker.js";
import { Recruiter } from "./Recruiter.js";
import { Event } from "./events/Event.js";
import { UserRole } from "./UserRole.js";
import { RefreshToken } from "./RefreshTokens.js";
import { AiUsageLog } from "../ai/aiUsageLog.js";
import { AdminAuditLog } from "../admin/adminLogs.js";
import { Job } from "../jobs/Job.js";
import { UserSentJobs } from "./UserSentJobs.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface UserAttributes {
  id: string;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  suspended?: boolean;
  otp?: string | null;
  password?: string | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "phoneNumber" | "otp" | "email" | "name" | "password" | "suspended"
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string | null;
  public email!: string | null;
  public phoneNumber!: string | null;
  public otp!: string | null;
  public suspended!: boolean;
  public password!: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    suspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
  },
);

User.hasOne(Moderator, { foreignKey: "UserId", onDelete: "CASCADE" });
Moderator.belongsTo(User);
User.hasOne(JobSeeker, { foreignKey: "UserId", onDelete: "CASCADE" });
JobSeeker.belongsTo(User);
User.hasOne(Recruiter, { foreignKey: "UserId", onDelete: "CASCADE" });
Recruiter.belongsTo(User);

User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });
User.belongsToMany(Job, { through: UserSentJobs });
Job.belongsToMany(User, { through: UserSentJobs });

User.hasOne(RefreshToken, { foreignKey: "UserId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User);
User.hasMany(Event, { onDelete: "CASCADE" });
Event.belongsTo(User);
User.hasMany(AiUsageLog, { foreignKey: "UserId", onDelete: "CASCADE" });
AiUsageLog.belongsTo(User);

AdminAuditLog.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(AdminAuditLog, { foreignKey: "UserId", onDelete: "CASCADE" });
