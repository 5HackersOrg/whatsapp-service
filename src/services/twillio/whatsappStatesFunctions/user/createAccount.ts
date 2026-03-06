import { JobSeekerDb } from "../../../../repository/users/jobSeekers/JobSeekersDb.js";
import { UserSessionState } from "../../../../utils/enums/whatsapp/sessionState.js";
import { MESSAGES } from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import { generateOtp } from "../../../../utils/types/generations/otpGenerator.js";
import type { MessageInfo } from "../../../../utils/types/whatsapp/messages/messageTypes.js";
import { validators } from "../../../../utils/validators/validators.js";
import { generateCustomerWindowTimeout } from "../../../../utils/whatsapp/isValidCustomerWindow.js";
import { EmailService } from "../../../email/emailService.js";
import type { stateParams } from "../../whatappStateHelper.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
const jobSeekersDb = new JobSeekerDb();
const emailService = new EmailService();
const EmailError = async (body: MessageInfo) => {
  await sendWhatsAppMessage(body.userPhoneNumber, {
    type: "text",
    text: MESSAGES.INVALID_EMAIL,
  });
};
export const createAccount = async ({
  body,
  redeemded,
  ref_code,
  password,
  userId,
}: stateParams) => {
  switch (body.type) {
    case "audio":
      await EmailError(body);
      return;
    case "location":
      await EmailError(body);
      return;
    case "image":
      await EmailError(body);
      return;
    case "document":
      await EmailError(body);
      return;
    case "video":
      await EmailError(body);
      return;
    case "text":
      const message = body.info.body;
      if (validators.isValidEmail(message)) {
        const { otp } = await generateOtp();
        try {
          await emailService.sendEmail(message, otp);
          await jobSeekersDb.updateUserWhatsappState(body.userPhoneNumber, {
            email: message,
            otp: otp,
            redeemded: redeemded,
            referredCode: ref_code,
            password:password,
            state: UserSessionState.VERIFY_OTP,
            userId,
            customerServiceTimeout: generateCustomerWindowTimeout(),
          });
        } catch (err) {
          await sendWhatsAppMessage(body.userPhoneNumber, {
            type: "text",
            text: MESSAGES.SERVER_ERROR,
          });
        }

        await sendWhatsAppMessage(body.userPhoneNumber, {
          type: "text",
          text: MESSAGES.OTP_SENT,
        });
      } else {
        await EmailError(body);
      }
      return;
    case "list_reply":
      await EmailError(body);
      return;
    case "button_reply":
      await EmailError(body);
      return;
  }
};
