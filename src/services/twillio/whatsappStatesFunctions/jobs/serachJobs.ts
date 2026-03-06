import { JobSeekerDb } from "../../../../repository/users/jobSeekers/JobSeekersDb.js";
import { MESSAGES } from "../../../../utils/enums/whatsapp/uiTextMessages.js";
import { readJsonFileFromGCP } from "../../../../utils/gcp/bucketHelper.js";
import type { MessageInfo } from "../../../../utils/types/whatsapp/messages/messageTypes.js";
import { downloadMedia } from "../../../../utils/whatsapp/downloadPDF.js";
import { createResumeTemplate } from "../../../ai/generations/createResumeTemplate.js";
import { sendFoundJobs } from "../../../user/generation/sendFoundJobs.js";
import type { stateParams } from "../../whatappStateHelper.js";
import { sendWhatsAppMessage } from "../../whatsappMessages/sendWhatsappMessage.js";
const jobSeekerDb = new JobSeekerDb();
export type CallBackParams = {
  number: string;
  message: string;
};
const updateResumeStatus = async ({ number, message }: CallBackParams) => {
  if (!number && !message) return;
  await sendWhatsAppMessage(number, { type: "text", text: message });
};
const SearchJobsError = async (body: MessageInfo) => {
  await sendWhatsAppMessage(body.userPhoneNumber, {
    type: "text",
    text: MESSAGES.JOB_SEARCH,
  });
};
export const searchJob = async ({
  body,
  userId,
  ref_code,
  customerWindowTimeout,
  password,
  user_email,
  user_otp,
  redeemded,
}: stateParams) => {
  switch (body.type) {
    case "audio":
      await SearchJobsError(body);
      return;
    case "location":
      await SearchJobsError(body);
      return;
    case "image":
      await SearchJobsError(body);
      return;
    case "document":
      const user = await jobSeekerDb.getJobSeekerById(userId);
      if (!user) {
        console.log("user is null");
        return;
      }
      let result: any = {};

      const jsonResume = await readJsonFileFromGCP(user.email!);
      if (!jsonResume) {
        const resumeBuffer = await downloadMedia(body.info.url);
        result = await createResumeTemplate(
          resumeBuffer,
          user.id,
          updateResumeStatus,
          body.userPhoneNumber,
        );
      } else {
        result = JSON.parse(jsonResume);
        const target_role = result.personal_details.title_or_position;
        await sendWhatsAppMessage(body.userPhoneNumber, {
          type: "text",
          text: `searching for ${target_role} jobs`,
        });
      }

      await sendFoundJobs({
        user,
        customerWindowTimeout,
        password,
        user_email,
        user_otp,
        result,
        body,
        userId,
        ref_code,
        redeemded,
      });

      return;

    case "video":
      await SearchJobsError(body);
      return;
    case "text":
      await SearchJobsError(body);
      return;
    case "list_reply":
      await SearchJobsError(body);
      return;
    case "button_reply":
      await SearchJobsError(body);
      return;
  }
};
