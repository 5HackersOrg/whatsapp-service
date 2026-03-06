import { resume1latex } from "../structures/latex/resumes/resume1Latex.js";
import { resume2latex } from "../structures/latex/resumes/resume2Latex.js";
import { resume3Latex } from "../structures/latex/resumes/resume3Latex.js";

export const getUserResumeLatex: Record<string, string> = {
  Minimal: resume1latex,
  Professional: resume2latex,
  corporate: resume3Latex,
};
export type resumeTemplates = "Minimal" | "Professional" | "Corporate";
