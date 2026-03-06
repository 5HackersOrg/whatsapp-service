import { promptAI } from "../../../utils/genModel/genModel.js";
import { generateRecruiterAdvicePrompt } from "../../../utils/prompts/generations/recruiterAdvicePrompt.js";

export const createRecruiterAdvice = async (
  job_description: string,
  user_json_file: any,
) => {
  const response = await promptAI({
    prompt: generateRecruiterAdvicePrompt(job_description, user_json_file),
    recruiterAdvice: true,
    action: "creating recruiter advice",
    company_id: null,
    user_id: null,
  });
  const jsonContent = JSON.parse(response!);
  const applicantMetaData = {
    personal: user_json_file,
    recruiterAdvice: jsonContent,
  };
  return applicantMetaData;
};
