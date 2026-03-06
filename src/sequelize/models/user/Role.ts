import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { DBConnection } from "../../setup.js";
import { v7 as uuidv7 } from "uuid";
import { Permission } from "./permissions/Permissions.js";
import type { Roles } from "../../../utils/types/user/permissions.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface RoleAttributes {
  id: string;
  name: Roles;
}

export type RoleCreationAttributes = Optional<RoleAttributes, "id">;
const UserRoles = [
  "admin",
  "hiring_manager",
  "recruiter",
  "viewer",
  "system_admin",
  "moderator",
  "jobSeeker",
] as const;
export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: string;
  public name!: Roles;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM(...UserRoles),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Role",
    tableName: "Roles",
    timestamps: true,
  },
);
Role.hasOne(Permission, { foreignKey: "RoleId", onDelete: "CASCADE" });
Permission.belongsTo(Role);
