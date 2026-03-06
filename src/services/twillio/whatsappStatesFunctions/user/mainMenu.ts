import { JobSeekerDb } from "../../../../repository/users/jobSeekers/JobSeekersDb.js";
import { UserSessionState } from "../../../../utils/enums/whatsapp/sessionState.js";
import { MESSAGES } from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import type { MessageInfo } from "../../../../utils/types/whatsapp/messages/messageTypes.js";
import { generateCustomerWindowTimeout } from "../../../../utils/whatsapp/isValidCustomerWindow.js";
import type { stateParams } from "../../whatappStateHelper.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
const MainMenuError = async (body: MessageInfo) => {
  await sendWhatsAppMessage(body.userPhoneNumber, {
    type: "text",
    text: MESSAGES.MAIN_MENU_ERROR,
  });
};
const jobSeekerDb = new JobSeekerDb();
export const MainMenu = async ({
  userId,
  body,
  customerWindowTimeout,
  password,
  redeemded,
  ref_code,
  user_email,
  user_otp,
}: stateParams) => {
  switch (body.type) {
    case "audio":
      await MainMenuError(body);
      return;
    case "location":
      await MainMenuError(body);
      return;
    case "image":
      await MainMenuError(body);
      return;
    case "document":
      await MainMenuError(body);
      return;
    case "video":
      await MainMenuError(body);
      return;
    case "text":
      await MainMenuError(body);
      return;
    case "list_reply":
      await MainMenuError(body);
      return;
    case "button_reply":
      const id = body.info.id;
      switch (id) {
        case "jobSearch":
          await jobSeekerDb.updateUserWhatsappState(body.userPhoneNumber, {
            customerServiceTimeout: generateCustomerWindowTimeout(),
            email: user_email,
            otp: user_otp,
            redeemded: redeemded,
            password,
            referredCode: ref_code,
            state: UserSessionState.SEARCH_JOBS,
            userId,
          });
          await sendWhatsAppMessage(body.userPhoneNumber,{type:"text",text:MESSAGES.JOB_SEARCH})
          return

        case "profile":
        case "sideGig":
      }

      return;
  }
};
