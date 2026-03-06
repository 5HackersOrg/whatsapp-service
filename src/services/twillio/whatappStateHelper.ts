import { UserSessionState } from "../../utils/enums/whatsapp/sessionState.js";
import { createAccount } from "./whatsappStatesFunctions/user/createAccount.js";
import { createPassword } from "./whatsappStatesFunctions/user/createPassword.js";
import { login } from "./whatsappStatesFunctions/user/login.js";
import { MainMenu } from "./whatsappStatesFunctions/user/mainMenu.js";
import { onBoardMenu } from "./whatsappStatesFunctions/user/onBoardMenu.js";
import { verifyOTP } from "./whatsappStatesFunctions/user/verifyOTP.js";
import { UserProfileFun } from "./whatsappStatesFunctions/user/userProfile.js";
import { sendCredits } from "./whatsappStatesFunctions/user/sendCredits.js";
import { sideGigMenu } from "./whatsappStatesFunctions/sidegigs/sideGigMenu.js";
import { step1 } from "./whatsappStatesFunctions/sidegigs/createSideGigSteps/step1.js";
import { step2 } from "./whatsappStatesFunctions/sidegigs/createSideGigSteps/step2.js";
import { step3 } from "./whatsappStatesFunctions/sidegigs/createSideGigSteps/step3.js";
import { step4 } from "./whatsappStatesFunctions/sidegigs/createSideGigSteps/step4.js";
import { step5 } from "./whatsappStatesFunctions/sidegigs/createSideGigSteps/step5.js";
import { step6 } from "./whatsappStatesFunctions/sidegigs/createSideGigSteps/step6.js";
import type { MessageInfo } from "../../utils/types/whatsapp/messages/messageTypes.js";
import { searchJob } from "./whatsappStatesFunctions/jobs/serachJobs.js";
import { jobMode } from "./whatsappStatesFunctions/jobs/jobMode.js";
export type stateParams = {
  body: MessageInfo;
  user_email: string;
  customerWindowTimeout: string;
  password: string;
  user_otp: string;
  userId: string;
  ref_code: string;
  redeemded: boolean;
};
type StateHandler = (params: stateParams) => Promise<void>;

export const stateHandlers: Record<UserSessionState, StateHandler> = {
  [UserSessionState.ONBOARD_MENU]: onBoardMenu,
  [UserSessionState.LOGIN]: login,
  [UserSessionState.CREATE_ACCOUNT]: createAccount,
  [UserSessionState.VERIFY_OTP]: verifyOTP,
  [UserSessionState.CREATE_PASSWORD]: createPassword,
  [UserSessionState.MAIN_MENU]: MainMenu,
  [UserSessionState.SEARCH_JOBS]: searchJob,
  [UserSessionState.FOUND_JOBS_MENU]: jobMode,
  [UserSessionState.USER_PROFILE]: UserProfileFun,
  [UserSessionState.SEND_CREDITS]: sendCredits,
  [UserSessionState.GIGS_MENU]: sideGigMenu,
  [UserSessionState.SIDE_GIG_STEP1_TITLE]: step1,
  [UserSessionState.SIDE_GIG_STEP2_DESCRIPTION]: step2,
  [UserSessionState.SIDE_GIG_STEP3_BUDGET]: step3,
  [UserSessionState.SIDE_GIG_STEP4_LOCATION]: step4,
  [UserSessionState.SIDE_GIG_STEP5_REVIEW]: step5,
  [UserSessionState.SIDE_GIG_STEP6_DEPOSIT]: step6,
};
