import { JobSeekerDb } from "../../../repository/users/jobSeekers/JobSeekersDb.js";
import { withErrorHandling } from "../../../utils/errorHandler.js";
import {
  saveJsonResumeToBucket,
  saveResumeToBucket,
} from "../../../utils/gcp/bucketHelper.js";
import { promptAI } from "../../../utils/genModel/genModel.js";
import { resumeTemplatePrompt } from "../../../utils/prompts/generations/createResumeTemplatePrompt.js";
import type { CallBackParams } from "../../twillio/whatsappStatesFunctions/jobs/serachJobs.js";
import { generateUserEmbedding } from "../../user/userEmbedding.js";
const jobSeekerDb = new JobSeekerDb();

export const createResumeTemplate = async (
  pdfBuffer: Buffer<any>,
  userId: string,
  cb: ({ number, message }: CallBackParams) => Promise<void>,
  phoneNumber: string,
) => {
  return withErrorHandling(
    "createResumeTemplate",
    "createResumeTemplate",
    "critical",
    async () => {
      const response = await promptAI({
        prompt: resumeTemplatePrompt,
        pdfBuffer: pdfBuffer,
        action: "creating resume template",
        company_id: null,
        user_id: userId,
      });
      const jsonContent = JSON.parse(response!);

      const user = await jobSeekerDb.getUserById(userId);
      await jobSeekerDb.setUserName(
        user!.id,
        jsonContent.personal_details.full_name,
      );

      await saveJsonResumeToBucket(jsonContent, user!.email!);
      await generateUserEmbedding({
        education_level: jsonContent.ai_analysis_hints.education_level,
        industry: jsonContent.ai_analysis_hints.industry,
        role: jsonContent.personal_details.title_or_position,
        userId,
        phoneNumber,
        xp: jsonContent.ai_analysis_hints.xp,
      });
      await saveResumeToBucket(pdfBuffer, user!.email!);
      await cb({
        number: phoneNumber,
        message: `Parsing Resume Done \nFetching ${jsonContent.personal_details.full_name} Recommended Jobs\nsearching for ${jsonContent.personal_details.title_or_position} Jobs`,
      });

      return jsonContent;
    },
  );
};
