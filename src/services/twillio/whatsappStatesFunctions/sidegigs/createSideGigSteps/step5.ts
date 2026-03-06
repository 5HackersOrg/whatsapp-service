import {
  SIDE_GIG_STEP5_REVIEW,
  SIDE_GIG_STEP6_DEPOSIT,
  SideGigCreationStep,
} from "../../../../../utils/enums/whatsapp/sideGigCreationSteps.js";
import { UserSessionState } from "../../../../../utils/enums/whatsapp/sessionState.js";
import { sendWhatsAppMessage } from "../../../whatsappMessages/sendWhatsappMessage.js";
import type { stateParams } from "../../user/onBoardMenu.js";
import { MESSAGES } from "../../../../../utils/enums/whatsapp/uiTextMessages.js";
import {
  signGigData,
  type GigData,
} from "../../../../../utils/signatures/generateSig.js";

export const step5 = async ({
  message,
  number,
  user_database,
  ref_code,
  redeemded,
  user_email,
  jobs_database,
  userId,
}: stateParams) => {
  const data = (await jobs_database.getTempSideGigListing(
    user_email,
  )) as GigData;
  const text = message.trim().toLowerCase();

  if (text.toLowerCase().includes("confirm")) {
    await user_database.updateWhatsappState(
      number,
      UserSessionState.SIDE_GIG_STEP6_DEPOSIT,
      user_email,
      "",
      userId,
      ref_code,
      redeemded,
    );
    const { sig } = signGigData(data);
    const url = `https://app.thewoo.online/api/deposit?id=${encodeURIComponent(sig)}&mail=${encodeURIComponent(user_email)}`;

    await sendWhatsAppMessage(number, SIDE_GIG_STEP6_DEPOSIT(url));
    return;
  }

  if (text.toLowerCase().includes("edit title")) {
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
    return;
  }

  if (text.toLowerCase().includes("edit budget")) {
    await user_database.updateWhatsappState(
      number,
      UserSessionState.SIDE_GIG_STEP3_BUDGET,
      user_email,
      "",
      userId,
      ref_code,
      redeemded,
    );

    await sendWhatsAppMessage(
      number,
      SideGigCreationStep.SIDE_GIG_STEP3_BUDGET,
    );
    return;
  }

  if (text.toLowerCase().includes("edit description")) {
    await user_database.updateWhatsappState(
      number,
      UserSessionState.SIDE_GIG_STEP2_DESCRIPTION,
      user_email,
      "",
      userId,
      ref_code,
      redeemded,
    );

    await sendWhatsAppMessage(
      number,
      SideGigCreationStep.SIDE_GIG_STEP2_DESCRIPTION,
    );
    return;
  }

  if (
    text.toLowerCase().includes("cancel") ||
    text.toLowerCase().includes("-1")
  ) {
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

  await sendWhatsAppMessage(
    number,
    SIDE_GIG_STEP5_REVIEW(
      data.title,
      data.description,
      data.budget,
      data.location.address,
      data.is_remote,
    ),
  );
};
