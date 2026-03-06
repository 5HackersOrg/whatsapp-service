import { Sequelize } from "sequelize";
export class DBConnection{
  private static instance:DBConnection|null =null
  private db: Sequelize|null =null
  constructor(){
    if(!DBConnection.instance){
      this.db = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "Whatshire",
});
   DBConnection.instance = this
    }
    return DBConnection.instance
  }
  getDb(){
    return this.db!
  }

}



