import { getJobsDbMethods } from "../../../repository/jobs/JobsDb.js";
import {
  getJobSeekerDbMethods,
  JobSeekerDb,
} from "../../../repository/users/jobSeekers/JobSeekersDb.js";
import { filterJobs } from "../../../utils/embeddings/calculateSimillarity.js";
import { UserSessionState } from "../../../utils/enums/whatsapp/sessionState.js";
import { MESSAGES } from "../../../utils/enums/whatsapp/uiTextMessages.js";
import type { MessageInfo } from "../../../utils/types/whatsapp/messages/messageTypes.js";
import { generateCustomerWindowTimeout } from "../../../utils/whatsapp/isValidCustomerWindow.js";

import {
  sendPostedJobMessage,
  sendScrappedJobMessage,
  sendWhatsAppMessage,
} from "../../twillio/whatsappMessages/sendWhatsappMessage.js";
import { getRecommededJobs } from "../jobs/getRecommenedJobs.ts.js";
const jobSeekerDb = new JobSeekerDb();
export type sendFoundJobsParams = {
  result: any;
  user: any;
  body: MessageInfo;
  user_email: string;
  customerWindowTimeout: string;
  password: string;
  user_otp: string;
  userId: string;
  ref_code: string;
  redeemded: boolean;
};
const jobsMethods = getJobsDbMethods();
const sendDelayJobMessages = (userId: string, number: string, job: any) => {
  return new Promise<void>((resolve) => {
    setTimeout(async () => {
      await sendScrappedJobMessage(number, job);
      await jobsMethods.createUserSentJob(userId, job.id);
      resolve();
    }, 900);
  });
};
const sendDelayPostedJobMessages = (
  userId: string,
  number: string,
  job: any,
) => {
  return new Promise<void>((resolve) => {
    setTimeout(async () => {
      await sendPostedJobMessage(number, job);
      await jobsMethods.createUserSentJob(userId, job.id);
      resolve();
    }, 1000);
  });
};
export const sendFoundJobs = async ({
  result,
  userId,
  password,
  redeemded,
  ref_code,
  user_email,
  user_otp,
  user,
  body,
}: sendFoundJobsParams) => {
  const embedding =
    await getJobSeekerDbMethods().getParsedUserEmbedding(userId);
  if (!embedding) {
    console.log("embedding undefined");
    return;
  }
  const target_role = result.personal_details.title_or_position;
  const industry = result.ai_analysis_hints.industry;
  const xp = result.ai_analysis_hints.xp;
  const education_level = result.ai_analysis_hints.education_level;
  console.log("education_level", education_level);
  console.log("xp", xp);
  console.log("industry", industry);
  console.log("target_role", target_role);
  //

  // const res = await getRecommededJobs({
  //   embedding,
  //   industry,
  //   target_role,
  //   userId,
  //   xp,
  // });
  // if (!res) {
  //   console.log("no jobs found");
  //   return;
  // }
  // const { jobs } = res;
  await sendWhatsAppMessage(body.userPhoneNumber, {
    type: "text",
    text: MESSAGES.FOUND_JOBS_MENU(user.JobSeeker.credits),
  });
  // for (const job of jobs) {
  //   await sendDelayJobMessages(body.userPhoneNumber, job);
  // }
  await jobSeekerDb.updateUserWhatsappState(body.userPhoneNumber, {
    customerServiceTimeout: generateCustomerWindowTimeout(),
    email: user_email,
    otp: user_otp,
    redeemded: redeemded,
    password,
    referredCode: ref_code,
    state: UserSessionState.FOUND_JOBS_MENU,
    userId,
  });
  const preFilter = await jobsMethods.getJobsSinceLastSent(
    userId,
    industry,
    education_level,
    xp,
  );
  
  const qualifiedJobs =  filterJobs(embedding, preFilter!);
  for (const job of qualifiedJobs) {
    await sendDelayPostedJobMessages(userId, body.userPhoneNumber, job);
  }
};
