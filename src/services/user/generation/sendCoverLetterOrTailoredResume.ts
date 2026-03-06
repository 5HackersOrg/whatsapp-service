import { JobsDb } from "../../../repository/jobs/JobsDb.js";
import { MESSAGES } from "../../../utils/enums/whatsapp/uiTextMessages.js";
import { getUserCoverLetterLatex } from "../../../utils/user/userCoverLetters.js";
import { getUserResumeLatex } from "../../../utils/user/userResume.js";
import { createCoverLetter } from "../../ai/generations/createCoverLetter.js";
import { createTailoredResume } from "../../ai/generations/createTailoredResume.js";

import { sendWhatsAppMessage } from "../../twillio/whatsappMessages/sendWhatsappMessage.js";
const jobDb = new JobsDb();
export const sendCoverLetterOrTailoredResume = async (
  user: any,
  number: string,
  type: "tailored" | "letter",
  jobId: string,
): Promise<void> => {
  const job = await jobDb.getScrappedJob(jobId);
  if (!job) {
    console.log("job not found");
    return;
  }

  if (type === "tailored") {
    if (user.JobSeeker.credits < 6) {
      await sendWhatsAppMessage(number, {
        type: "text",
        text: MESSAGES.NOT_ENOUGH_CREDITS(
          6,
          user.JobSeeker.credits,
          user.JobSeeker.refCode,
          `https://wa.me/27725288942?text=useMyRefferalCode#${user.JobSeeker.refCode}`,
        ),
      });
      return;
    }
    const latexStructure = getUserResumeLatex[user.JobSeeker.resumeTemplate];
    const res = await createTailoredResume(
      user,
      job.title,
      job.description,
      latexStructure!,
      //@ts-ignore
      job.Scrapped.link,
      user.email,
    );

    if (res?.status === 200) {
      await sendWhatsAppMessage(number, {
        type: "text",
        text: `✅ CV sent to email: ${user.email}`,
      });
      return;
    }
  } else {
    if (user.JobSeeker.credits < 3) {
      await sendWhatsAppMessage(number, {
        type: "text",
        text: MESSAGES.NOT_ENOUGH_CREDITS(
          3,
          user.JobSeeker.credits,
          user.JobSeeker.refCode,
          `https://wa.me/27725288942?text=useMyRefferalCode#${user.JobSeeker.refCode}`,
        ),
      });
      return;
    }
    const today = new Date().toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.log(
      "user cover letter template :",
      user.JobSeeker.coverLetterTemplate,
    );
    const latexStructure =
      getUserCoverLetterLatex[user.JobSeeker.coverLetterTemplate];

    const res = await createCoverLetter({
      //@ts-ignore
      company_name: job.Scrapped.company,
      coverLetterStructure: latexStructure!,
      job_description: job.description,
      //@ts-ignore
      job_location: job.Scrapped.location,
      job_title: job.title,
      today_date: today,
      email: user.email,
      //@ts-ignore
      job_link: job.Scrapped.link,
    });

    if (res?.status === 200) {
      await sendWhatsAppMessage(number, {
        type: "text",
        text: `✅ CV sent to email: ${user.email}`,
      });
      return;
    }
  }
  await sendWhatsAppMessage(number, {
    type: "text",
    text: "⚠️ Server is experiencing issues. Please try again later.",
  });
};
