import { Company } from "../../sequelize/models/company/Company.js";
import { UserDb } from "../users/user/UserDb.js";

export class CompanyDb extends UserDb {
  constructor() {
    super("Company Database");
  }
  async getCompanyById(id: string) {
    return await this.run("getCompanyById DB Query", async () => {
      const company = await Company.findByPk(id);
      return company;
    });
  }
  async doesCompanyHasAiInsights(companyId: string) {
    return await this.run("doesCompanyHasAiInsights DB Query", async () => {
      const company = await Company.findByPk(companyId);
      if (!company) throw new Error("Company not found");
      const mappins = {
        PayPerPost: 0,
        Supporter: 1,
        Enterprise: 2,
      };
      const companiesTier = mappins[company.dataValues.subscriptionTier!];
      return companiesTier > 0;
    });
  }
  
}

export const getCompanyDbMethods = () => {
  return new CompanyDb();
};
