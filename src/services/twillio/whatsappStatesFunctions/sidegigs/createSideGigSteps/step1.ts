import { v4 } from "uuid";
import type { GigData } from "../../../../../utils/signatures/generateSig.js";
import type { stateParams } from "../../user/onBoardMenu.js";
import { UserSessionState } from "../../../../../utils/enums/whatsapp/sessionState.js";
import { SideGigCreationStep } from "../../../../../utils/enums/whatsapp/sideGigCreationSteps.js";
import { sendWhatsAppMessage } from "../../../whatsappMessages/sendWhatsappMessage.js";

export const step1 = async ({
  message,
  number,
  user_database,
  ref_code,
  redeemded,
  jobs_database,
  user_email,
  userId,
}: stateParams) => {
  const data: GigData = {
    budget: 0,
    id: v4(),
    description: "",
    is_remote: true,
    location: {
      address: "",
      lat: "",
      lon: "",
    },
    title: message,
  };

  await jobs_database.updateTempSideGigListing(data, user_email);
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
};
