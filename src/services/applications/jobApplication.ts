import { getApplicationsDbMethods } from "../../repository/applications/ApplicationsDb.js";
import { sendWhatsAppMessage } from "../twillio/whatsappMessages/sendWhatsappMessage.js";

export const applyToJob = async (
  user_id: string,
  job_id: string,
  userPhoneNumber: string,
) => {
  try {
    const hasApplied = await getApplicationsDbMethods().hasAppliedToJob(
      user_id,
      job_id,
    );
    if (hasApplied) {
      await sendWhatsAppMessage(userPhoneNumber, {
        type: "text",
        text: " 😩 Sorry you have already applied to this job",
      });
      return;
    }
    await getApplicationsDbMethods().apply(job_id, user_id, "JOB", job_id);
    await sendWhatsAppMessage(userPhoneNumber, {
      type: "text",
      text: "job application sent ☺️ lets gooooooo 💪💪💪 ",
    });
  } catch (err) {
    await sendWhatsAppMessage(userPhoneNumber, {
      type: "text",
      text: "Something went wrong 😔 please try again later 😭😭😭😭",
    });
  }
};
