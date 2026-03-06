import { DataTypes, Model, type Optional } from "sequelize";
import { DBConnection } from "../../setup.js";

const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export interface UserSentJobsAttributes {
  UserId: string;
  JobId: string;
}

export type UserSentJobsCreationAttributes = Optional<
  UserSentJobsAttributes,
  never
>;
export class UserSentJobs
  extends Model<UserSentJobsAttributes, UserSentJobsCreationAttributes>
  implements UserSentJobsAttributes
{
  public UserId!: string;
  public JobId!: string;
}
UserSentJobs.init(
  {
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    JobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "UserSentJobs",
    tableName: "UserSentJobs",
    timestamps: true,
  },
);
