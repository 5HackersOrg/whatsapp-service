import { UserSessionState } from "../../../../utils/enums/whatsapp/sessionState.js";
import { SideGigCreationStep } from "../../../../utils/enums/whatsapp/sideGigCreationSteps.js";
import { MESSAGES } from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import type { IUserProfile } from "../../../../utils/types/user/IUserProfile.js";
import { validators } from "../../../../utils/validators/validators.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
import type { stateParams } from "../user/onBoardMenu.js";

export const sideGigMenu = async ({
  message,
  number,
  user_email,
  user_database,
  ref_code,
  userId,
  redeemded,
}: stateParams) => {
  if (message.toLocaleLowerCase().trim() === "yes") {
    await user_database.optInSideGigUserProfile(user_email);
    await sendWhatsAppMessage(number, MESSAGES.SIDE_GIGS_MENU);
  } else if (message.toLocaleLowerCase().trim() === "no") {
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
  }
  if (message === "4") {
    await user_database.updateWhatsappState(
      number,
      UserSessionState.SIDE_GIG_STEP1_TITLE,
      user_email,
      "",
      userId,
      ref_code,
      redeemded,
    );

    await sendWhatsAppMessage(number, SideGigCreationStep.SIDE_GIG_STEP1_TITLE);
  }
};
