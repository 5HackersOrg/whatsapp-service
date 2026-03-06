import {
  signGigData,
  type GigData,
} from "../../../../../utils/signatures/generateSig.js";
import type { stateParams } from "../../user/onBoardMenu.js";
import { UserSessionState } from "../../../../../utils/enums/whatsapp/sessionState.js";
import { SIDE_GIG_STEP6_DEPOSIT } from "../../../../../utils/enums/whatsapp/sideGigCreationSteps.js";
import { sendWhatsAppMessage } from "../../../whatsappMessages/sendWhatsappMessage.js";
import { MESSAGES } from "../../../../../utils/enums/whatsapp/uiTextMessages.js";

export const step6 = async ({
  message,
  number,
  user_database,
  jobs_database,
  ref_code,
  redeemded,

  user_email,
  userId,
}: stateParams) => {
  if (message.toLowerCase().includes("cancel")) {
    await user_database.updateWhatsappState(
      number,
      UserSessionState.MAIN_MENU,
      user_email,
      "",
      userId,
      ref_code,
      redeemded,
    );
    await sendWhatsAppMessage(number, MESSAGES.MAIN_MENU);
    return;
  }
  if (message.toLowerCase().includes("regenerate")) {
    const data = (await jobs_database.getTempSideGigListing(
      user_email,
    )) as GigData;
    const { sig } = signGigData(data);
    const url = `https://app.thewoo.online/api/deposit?id=${encodeURIComponent(sig)}&mail=${encodeURIComponent(user_email)}`;

    await sendWhatsAppMessage(number, SIDE_GIG_STEP6_DEPOSIT(url));
    return;
  }
  await sendWhatsAppMessage(
    number,
    "❌ invalid option enter cancel to go back to main menu or confirm pay paying deposit",
  );
};
