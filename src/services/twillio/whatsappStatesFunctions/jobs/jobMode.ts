import { JobSeekerDb } from "../../../../repository/users/jobSeekers/JobSeekersDb.js";
import { UserSessionState } from "../../../../utils/enums/whatsapp/sessionState.js";
import {
  MESSAGES,
  sendMainMenuMessage,
} from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import type { MessageInfo } from "../../../../utils/types/whatsapp/messages/messageTypes.js";
import { isEmptyMessage } from "../../../../utils/user/isEmptyMessage.js";
import { generateCustomerWindowTimeout } from "../../../../utils/whatsapp/isValidCustomerWindow.js";
import { applyToJob } from "../../../applications/jobApplication.js";
import { sendCoverLetterOrTailoredResume } from "../../../user/generation/sendCoverLetterOrTailoredResume.js";
import type { stateParams } from "../../whatappStateHelper.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
const jobSeekerDb = new JobSeekerDb();
export const jobMode = async ({
  body,
  customerWindowTimeout,

  password,
  userId,
  user_email,
  user_otp,
  ref_code,
  redeemded,
}: stateParams): Promise<void> => {
  const user = await jobSeekerDb.getJobSeekerById(userId);
  if (!user) return;
  const MenuError = async (body: MessageInfo) => {
    await sendWhatsAppMessage(body.userPhoneNumber, {
      type: "text",
      //@ts-ignore
      text: MESSAGES.FOUND_JOB_MENU_V2(user.JobSeeker.credits),
    });
  };

  switch (body.type) {
    case "audio":
      await MenuError(body);
      return;
    case "location":
      await MenuError(body);
      return;
    case "image":
      await MenuError(body);
      return;
    case "document":
      await MenuError(body);
      return;
    case "video":
      await MenuError(body);
      return;
    case "text":
      const message = body.info.body;
      if (message.includes("-1")) {
        await jobSeekerDb.updateUserWhatsappState(body.userPhoneNumber, {
          email: user_email,
          otp: user_otp,
          password: password,
          redeemded: redeemded,
          referredCode: ref_code,
          state: UserSessionState.MAIN_MENU,
          userId,
          customerServiceTimeout: generateCustomerWindowTimeout(),
        });
        await sendMainMenuMessage(body.userPhoneNumber);
      } else {
        await MenuError(body);
      }
      return;
    case "list_reply":
      await MenuError(body);
      return;
    case "button_reply":
      const id_info = body.info.id;
      const parts = id_info.split("@");
      const id = parts[0];
      const jobId = parts[1];
      switch (id) {
        case "tailored":
          await sendCoverLetterOrTailoredResume(
            user,
            body.userPhoneNumber,
            "tailored",
            jobId!,
          );
          break;

        case "letter":
          await sendCoverLetterOrTailoredResume(
            user,
            body.userPhoneNumber,
            "letter",
            jobId!,
          );
          break;

        case "apply":
          await applyToJob(userId, jobId!, body.userPhoneNumber);
      }

      return;
  }
};
