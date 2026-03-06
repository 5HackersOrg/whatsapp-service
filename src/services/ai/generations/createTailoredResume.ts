import { JobSeekerDb } from "../../../repository/users/jobSeekers/JobSeekersDb.js";
import { withErrorHandling } from "../../../utils/errorHandler.js";
import { readJsonFileFromGCP } from "../../../utils/gcp/bucketHelper.js";
import { promptAI } from "../../../utils/genModel/genModel.js";
import { genTailoredResumeCreatorPrompt } from "../../../utils/prompts/generations/createTailoredResumePrompt.js";
import { getJobDescptionEmailFormat } from "../../../utils/structures/html/jobDescriptionHTMLFormat.js";
import { cleanLatex } from "../../../utils/types/generations/latex/cleanLatex.js";
import { createHTMLJobDescription } from "./createHTMLDescription.js";
import { generatePDF } from "./generatePDF.js";
const jobSeekerDb = new JobSeekerDb();
export const createTailoredResume = async (
  user: any,
  job_title: string,
  job_description: string,
  latexStructure: string,

  job_link: string,
  email: string,
) => {
  return withErrorHandling(
    "createTailoredResume",
    "createTailoredResume",
    "critical",
    async () => {
      const user_json_file = await readJsonFileFromGCP(email);
      const response = await promptAI({
        prompt: genTailoredResumeCreatorPrompt(
          job_description,
          user_json_file!,
          latexStructure,
        ),
        action: "creating Tailored Resume",
        company_id: null,
        user_id: user.id,
      });
      const cleanedLatex = cleanLatex(response!);
      const html_job_description = await createHTMLJobDescription(
        job_description,
        job_title,
      );
      const link = "https://main.thewoo.online/LogoWithText.png";
      const today = new Date();
      const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      const emailFormart = getJobDescptionEmailFormat({
        date,
        job_description_html: html_job_description,
        jobLink: job_link,
        link,
        type: "Resume",
      });

      const res = await generatePDF(
        cleanedLatex,
        email,
        email,
        emailFormart,
        "Resume",
      );
      if (res.status === 200) {
        await jobSeekerDb.updateUserProfileCredits(user.id, -6);
      }
      return res;
    },
  );
};
