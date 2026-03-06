import { v4 } from "uuid";
import type { GigData } from "../../../../../utils/signatures/generateSig.js";
import type { stateParams } from "../../user/onBoardMenu.js";
import { UserSessionState } from "../../../../../utils/enums/whatsapp/sessionState.js";
import { SideGigCreationStep } from "../../../../../utils/enums/whatsapp/sideGigCreationSteps.js";
import { sendWhatsAppMessage } from "../../../whatsappMessages/sendWhatsappMessage.js";
import { isNumber } from "../../../../../utils/user/isNumber.js";

export const step3 = async ({
  message,
  number,
  user_database,
  ref_code,
  redeemded,
  jobs_database,
  user_email,
  userId,
}: stateParams) => {
  const data = (await jobs_database.getTempSideGigListing(
    user_email,
  )) as GigData;
  if (!isNumber(message)) {
    await sendWhatsAppMessage(number, "❌ Budget has to be a number only");
    return;
  }
  data.budget = Number(message);

  await jobs_database.updateTempSideGigListing(data, user_email);
  await user_database.updateWhatsappState(
    number,
    UserSessionState.SIDE_GIG_STEP4_LOCATION,
    user_email,
    "",
    userId,
    ref_code,
    redeemded,
  );

  await sendWhatsAppMessage(
    number,
    SideGigCreationStep.SIDE_GIG_STEP4_LOCATION,
  );
};
