import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../setup.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface UserRoleAttributes {
  UserId: string;
  RoleId: string;
}

export type UserRoleCreationAttributes = Optional<UserRoleAttributes, never>;
export class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  public UserId!: string;
  public RoleId!: string;
}
UserRole.init(
  {
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    
    },
    RoleId: {
      type: DataTypes.UUID,
      allowNull: false,
     
    },
  },
  {
    sequelize: db,
    modelName: "UserRole",
    tableName: "UserRoles",
    timestamps: false,
  },
);
