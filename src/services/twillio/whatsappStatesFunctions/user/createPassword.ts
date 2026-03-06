import { JobSeekerDb } from "../../../../repository/users/jobSeekers/JobSeekersDb.js";
import { UserSessionState } from "../../../../utils/enums/whatsapp/sessionState.js";
import {
  MESSAGES,
  sendMainMenuMessage,
} from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import { hashPassword } from "../../../../utils/hash/hashes.js";
import type { MessageInfo } from "../../../../utils/types/whatsapp/messages/messageTypes.js";
import { validators } from "../../../../utils/validators/validators.js";
import { generateCustomerWindowTimeout } from "../../../../utils/whatsapp/isValidCustomerWindow.js";
import type { stateParams } from "../../whatappStateHelper.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
const PasswordError = async (body: MessageInfo) => {
  await sendWhatsAppMessage(body.userPhoneNumber, {
    type: "text",
    text: MESSAGES.WEAK_PASSWORD,
  });
};
const jobSeekersDb = new JobSeekerDb();

export const createPassword = async ({
  body,
  redeemded,
  ref_code,
  password,
  userId,
  user_email,
  user_otp,
}: stateParams) => {
  switch (body.type) {
    case "audio":
      await PasswordError(body);
      return;
    case "location":
      await PasswordError(body);
      return;
    case "image":
      await PasswordError(body);
      return;
    case "document":
      await PasswordError(body);
      return;
    case "video":
      await PasswordError(body);
      return;
    case "text":
      const message = body.info.body;
      if (validators.isValidPassword(message)) {
        const password = await hashPassword(message);
        const data = {
          email: user_email,
          password: password,
          otp: "",
          redeemded: redeemded,
          referredCode: ref_code,
          state: UserSessionState.MAIN_MENU,
          userId,
          customerServiceTimeout: generateCustomerWindowTimeout(),
        };
        await jobSeekersDb.updateUserWhatsappState(body.userPhoneNumber, data);
        await jobSeekersDb.createJobSeeker(body.userPhoneNumber, data);
        await sendMainMenuMessage(body.userPhoneNumber);
        return;
      } else {
        if (message !== user_otp) {
          await PasswordError(body);
          return;
        }
        await jobSeekersDb.updateUserWhatsappState(body.userPhoneNumber, {
          email: user_email,
          otp: "",
          password: password,
          redeemded: redeemded,
          referredCode: ref_code,
          state: UserSessionState.CREATE_PASSWORD,
          userId,
          customerServiceTimeout: generateCustomerWindowTimeout(),
        });

        await sendWhatsAppMessage(body.userPhoneNumber, {
          type: "text",
          text: MESSAGES.EMAIL_VERIFIED,
        });
      }
      return;
    case "list_reply":
      await PasswordError(body);
      return;
    case "button_reply":
      await PasswordError(body);
      return;
  }
};
