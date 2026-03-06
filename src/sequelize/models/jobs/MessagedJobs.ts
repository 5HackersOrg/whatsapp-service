import { DataTypes, Model } from "sequelize";
import { DBConnection } from "../../setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();
interface MessagedJobAttribute {
  messageId: string;
  jobId: string;
}
export class MessagedJobs
  extends Model<MessagedJobAttribute, MessagedJobAttribute>
  implements MessagedJobAttribute
{
  public messageId!: string;
  public jobId!: string;
}
MessagedJobs.init(
  {
    jobId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  { sequelize: db, tableName: "MessagedJobs", modelName: "MessagedJob" },
);
