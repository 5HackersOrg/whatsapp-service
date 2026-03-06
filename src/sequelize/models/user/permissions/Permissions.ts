import { DataTypes , type Optional, Model } from "sequelize"
import { DBConnection } from "../../../setup.js"
const dbInstance = new DBConnection()
const db = dbInstance.getDb()
interface PermissionAttributes{
RoleId:string
CompanyId:string
jobs_read:boolean
jobs_update:boolean
jobs_delete:boolean
jobs_create:boolean
candidate_read:boolean
candidate_update:boolean
candidate_delete:boolean
candidate_create:boolean
audits_read:boolean
}
type PermissionCreationAttributes = Optional<PermissionAttributes,"audits_read"|"candidate_create"|"candidate_delete"|"candidate_read"|"candidate_update"|"jobs_create"|"jobs_delete"|"jobs_read"|"jobs_update">
export class Permission extends Model<PermissionAttributes,PermissionCreationAttributes> implements PermissionAttributes{

    public RoleId!: string 
    public CompanyId!: string 
    public jobs_create!: boolean
    public jobs_read!: boolean
    public jobs_delete!: boolean
    public jobs_update!: boolean
    public candidate_create!: boolean
    public candidate_read!: boolean
    public candidate_delete!: boolean
    public candidate_update!: boolean
    public audits_read!: boolean
}
Permission.init({
     RoleId:{
        type:DataTypes.UUID,
        primaryKey:true
     },
      CompanyId:{
        type:DataTypes.UUID,
        primaryKey:true
     },
     audits_read:{
        type:DataTypes.BOOLEAN
     },
       jobs_read:{
        type:DataTypes.BOOLEAN
     },  jobs_create:{
        type:DataTypes.BOOLEAN
     },  jobs_delete:{
        type:DataTypes.BOOLEAN
     },  jobs_update:{
        type:DataTypes.BOOLEAN
     },  candidate_create:{
        type:DataTypes.BOOLEAN
     },  candidate_delete:{
        type:DataTypes.BOOLEAN
     },  candidate_read:{
        type:DataTypes.BOOLEAN
     },  candidate_update:{
        type:DataTypes.BOOLEAN
     },
},{sequelize:db,tableName:"Permissions",modelName:"Permission"})