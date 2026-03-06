import { saveUserPortfolioToBucket } from "../../../utils/gcp/bucketHelper.js";
import { promptAI } from "../../../utils/genModel/genModel.js";
import { genUserPortfolioPrompt } from "../../../utils/prompts/generations/createUserPortfolioPrompt.js";
import { createUserView } from "../../../utils/viewCreator.js";
const removeCodeBlocks = (text: string): string => {
  return text.replace(/^```[a-zA-Z]*\n?|```$/g, "").trim();
};
export const generateUserPortfolio = async (
  jsonContent: any,
  userId: string,
) => {
  const portfolio = await promptAI({
    prompt: genUserPortfolioPrompt(JSON.stringify(jsonContent)),
    action: "creating user portfolio",
    company_id: null,
    user_id: userId,
  });
  console.log(portfolio);
  await saveUserPortfolioToBucket(
    removeCodeBlocks(portfolio!),
    `${String(jsonContent.personal_details.full_name).replace(/\s+/g, "-")}`,
  );
  await createUserView(
    `${String(jsonContent.personal_details.full_name).replace(/\s+/g, "_")}`,
  );
};
