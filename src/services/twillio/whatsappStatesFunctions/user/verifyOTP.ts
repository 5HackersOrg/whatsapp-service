import { JobSeekerDb } from "../../../../repository/users/jobSeekers/JobSeekersDb.js";
import { UserSessionState } from "../../../../utils/enums/whatsapp/sessionState.js";
import { MESSAGES } from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import type { MessageInfo } from "../../../../utils/types/whatsapp/messages/messageTypes.js";
import { generateCustomerWindowTimeout } from "../../../../utils/whatsapp/isValidCustomerWindow.js";
import type { stateParams } from "../../whatappStateHelper.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
const jobSeekersDb = new JobSeekerDb();
const OTPError = async (body: MessageInfo, email: string) => {
  await sendWhatsAppMessage(body.userPhoneNumber, {
    type: "text",
    text: MESSAGES.INVALID_OTP(email),
  });
};
export const verifyOTP = async ({
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
      await OTPError(body, user_email);
      return;
    case "location":
      await OTPError(body, user_email);
      return;
    case "image":
      await OTPError(body, user_email);
      return;
    case "document":
      await OTPError(body, user_email);
      return;
    case "video":
      await OTPError(body, user_email);
      return;
    case "text":
      const message = body.info.body;
      if (message.includes("-1")) {
        await jobSeekersDb.updateUserWhatsappState(body.userPhoneNumber, {
          email: message,
          otp: "",
          password: password,
          redeemded: redeemded,
          referredCode: ref_code,
          state: UserSessionState.CREATE_ACCOUNT,
          userId,
          customerServiceTimeout: generateCustomerWindowTimeout(),
        });
        await sendWhatsAppMessage(body.userPhoneNumber, {
          type: "text",
          text: MESSAGES.CREATE_ACCOUNT_PROMPT,
        });
        return;
      } else {
        if (message !== user_otp) {
          await OTPError(body, user_email);
          return;
        }
        await jobSeekersDb.updateUserWhatsappState(body.userPhoneNumber, {
          email: user_email,
          otp: "",
          redeemded: redeemded,
          password: password,
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
      await OTPError(body, user_email);
      return;
    case "button_reply":
      await OTPError(body, user_email);
      return;
  }
};
