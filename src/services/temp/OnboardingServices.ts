import { TempDB, type tempDataUpdate } from "../../repository/temp/tempDB.js";
import type { OnboardingStep } from "../../sequelize/models/temp/OnboardingInfo.js";
const tempDb = new TempDB();
export const updateSession = async (
  email: string,
  data?: tempDataUpdate | null,
): Promise<{
  success: boolean;
  reason: string;
  data?: any;
  accessToken?: string | undefined;
  api_key?: string | undefined;
  last_step: OnboardingStep;
}> => {
  console.log("data:\n", data);
  if (!data) {
    const { found, session } = await tempDb.hasSession(email);
    if (!found) {
      await tempDb.createSession(email);
      return {
        success: true,
        last_step: "email",
        reason: "started first step",
      };
    } else {
      const last_step = session?.last_step!;
      if (last_step && session) {
        const { password, ...rest } = session;
        return {
          success: false,
          last_step: last_step,
          data: { ...rest },
          reason: "continue last step",
        };
      }

      return {
        success: false,
        last_step: last_step,
        reason: "continue last step",
      };
    }
  } else {
    console.log("companyData:\n", data.field.companyData);
    const res = await tempDb.updateSession(email, data);
    return {
      success: res.success,
      last_step: data.field.next_step,
      reason: res.reason,
      accessToken: res.access_token,
      api_key: res.api_key,
    };
  }
};
