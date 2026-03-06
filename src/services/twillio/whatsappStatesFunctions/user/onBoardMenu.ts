import { JobSeekerDb } from "../../../../repository/users/jobSeekers/JobSeekersDb.js";
import { UserSessionState } from "../../../../utils/enums/whatsapp/sessionState.js";
import { MESSAGES } from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import type { MessageInfo } from "../../../../utils/types/whatsapp/messages/messageTypes.js";
import { generateCustomerWindowTimeout } from "../../../../utils/whatsapp/isValidCustomerWindow.js";
import type { stateParams } from "../../whatappStateHelper.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
const onBoardMenuError = async (body: MessageInfo) => {
  await sendWhatsAppMessage(body.userPhoneNumber, {
    type: "text",
    text: `😅 Oops! That option isn’t valid.\n
            Please select one:
            📝 Register Account
            🔐 Login`,
  });
};
const jobSeekersDb = new JobSeekerDb();

export const onBoardMenu = async ({
  body,
  redeemded,
  ref_code,
  userId,
  user_email,
  password,
  user_otp,
}: stateParams) => {
  console.log("in obard menu  data : ", body);
  switch (body.type) {
    case "audio":
      await onBoardMenuError(body);
      return;
    case "location":
      await onBoardMenuError(body);
      return;
    case "image":
      await onBoardMenuError(body);
      return;
    case "document":
      await onBoardMenuError(body);
      return;
    case "video":
      await onBoardMenuError(body);
      return;
    case "text":
      await onBoardMenuError(body);
      return;
    case "list_reply":
      await onBoardMenuError(body);
      return;
    case "button_reply":
      console.log(JSON.stringify(body), "\n---------------->");
      const id = body.info.id;
      switch (id) {
        case "login":
          //TODO
          return;

        case "register":
          await jobSeekersDb.updateUserWhatsappState(body.userPhoneNumber, {
            customerServiceTimeout: generateCustomerWindowTimeout(),
            email: user_email,
            otp: user_otp,
            redeemded: redeemded,
            password,
            referredCode: ref_code,
            state: UserSessionState.CREATE_ACCOUNT,
            userId,
          });
          await sendWhatsAppMessage(body.userPhoneNumber, {
            type: "text",
            text: MESSAGES.CREATE_ACCOUNT_PROMPT,
          });
          return;
      }
  }
};
