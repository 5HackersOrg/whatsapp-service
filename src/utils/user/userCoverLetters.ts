import { coverLetter1Latex } from "../structures/latex/coverLetters/coverLetter1Structure.js";
import { coverLetter2Latex } from "../structures/latex/coverLetters/coverLetter2Structure.js";

export const getUserCoverLetterLatex: Record<string, string> = {
  Basic: coverLetter1Latex,
  Professional: coverLetter2Latex,
};
export type coverLetterTemplates = "Basic" | "Professional";
