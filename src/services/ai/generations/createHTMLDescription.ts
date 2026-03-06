import { promptAI } from "../../../utils/genModel/genModel.js";
import { genHtmlJobDescriptionPrompt } from "../../../utils/prompts/generations/createHTMLJobDescriptionPrompt.js";

export const createHTMLJobDescription = async (
  job_description: string,
  jobTitle: string,
) => {
  const response = await promptAI({
    prompt: genHtmlJobDescriptionPrompt(job_description, jobTitle),
    action: "creating HTML job description",
    company_id: null,
    user_id: null,
  })!;
  let cleanedOutput = response!;
  if (cleanedOutput.startsWith("```html")) {
    cleanedOutput = cleanedOutput.slice(7);
  } else if (cleanedOutput.startsWith("```")) {
    cleanedOutput = cleanedOutput.slice(3);
  }

  if (cleanedOutput.endsWith("```")) {
    cleanedOutput = cleanedOutput.slice(0, -3);
  }

  cleanedOutput = cleanedOutput.trim();
  return cleanedOutput;
};
