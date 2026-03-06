import { JobSeekerDb } from "../../../repository/users/jobSeekers/JobSeekersDb.js";
import { withErrorHandling } from "../../../utils/errorHandler.js";
import { readJsonFileFromGCP } from "../../../utils/gcp/bucketHelper.js";
import { promptAI } from "../../../utils/genModel/genModel.js";
import { genCoverLetterPrompt } from "../../../utils/prompts/generations/coverLetterGenerationPrompt.js";
import { getJobDescptionEmailFormat } from "../../../utils/structures/html/jobDescriptionHTMLFormat.js";
import type { CoverLetterGenPrompt } from "../../../utils/types/generations/IGenerations.js";
import { cleanLatex } from "../../../utils/types/generations/latex/cleanLatex.js";
import { createHTMLJobDescription } from "./createHTMLDescription.js";
import { generatePDF } from "./generatePDF.js";
const jobSeekerDb = new JobSeekerDb();
export const createCoverLetter = async ({
  user,
  company_name,
  coverLetterStructure,
  job_description,
  job_link,
  job_location,
  job_title,
  today_date,
  email,
}: CoverLetterGenPrompt) => {
  return withErrorHandling(
    "createCoverLetter",
    "createCoverLetter",
    "critical",
    async () => {
      const user_json_file = await readJsonFileFromGCP(email!);
      const response = await promptAI({
        prompt: genCoverLetterPrompt({
          company_name,
          coverLetterStructure,
          job_description,
          job_location,
          job_title,
          today_date,
          user_json_file: user_json_file!,
        }),
        action: "creating Cover Letter",
        company_id: null,
        user_id: user.id,
      });
      const cleanedLatex = cleanLatex(response!);
      //generte email html
      const html_job_description = await createHTMLJobDescription(
        job_description,
        job_title,
      );
      const link = "https://main.thewoo.online/LogoWithText.png";
      const today = new Date();
      const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      const emailFormart = getJobDescptionEmailFormat({
        date,
        link,
        job_description_html: html_job_description,
        type: "Cover Letter",
        jobLink: job_link!,
      });

      const res = await generatePDF(
        cleanedLatex,
        email!,
        email!,
        emailFormart,
        "Cover Letter",
      );
      if (res.status === 200) {
        await jobSeekerDb.updateUserProfileCredits(user.id, -3);
      }
      return res;
    },
  );
};
