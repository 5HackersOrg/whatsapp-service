import { foundJobsStructurePDFLatex } from "../../types/generations/latex/foundJobsPDFStructure.js";
import type { IJobWithoutDescription } from "../../types/jobs/IJob.js";

export const genFoundJobsPDFPrompt = (jobs: IJobWithoutDescription[]) => {
  return `
You are a LaTeX generation assistant.

Your task is to:
- Take a JSON array of job opportunities.
- Generate a complete LaTeX document based on the style of the provided template.
- Populate the document with ALL jobs from the array (dynamic length).

** Job Opportunities
${JSON.stringify(jobs)}

**Latex Template / Structure Reference**
${foundJobsStructurePDFLatex}


=====================
RULES
=====================

1. DYNAMIC LIST GENERATION (CRITICAL)
- The provided template contains placeholders (like _1, _2, _3) to show the style. Do NOT strictly limit yourself to these specific placeholders.
- Instead, identify the LaTeX formatting pattern used for a single job (e.g., the \\section* and \\begin{tabular} block).
- REPEAT this pattern for **EVERY** job in the provided JSON array.
- If the JSON contains 12 jobs, you must generate 12 corresponding job sections in the output.
- Ensure the document preamble (\\documentclass, packages, etc.) and footer (\\end{document}) are preserved, but the body contains the full list of jobs.

2. LATEX ESCAPING (CRITICAL)
You MUST escape LaTeX special characters in ALL injected values.

Replace:
- &  → \\&
- %  → \\%
- $  → \\$
- _  → \\_
- #  → \\#

Example:
"R&D Specialist" → "R\\&D Specialist"

Do NOT escape LaTeX commands or template structure — only injected values.

3. OUTPUT FORMAT
- Return ONLY the final raw LaTeX string.
- Do NOT include markdown code blocks.
- Do NOT include explanations, comments, or extra text.
- The output must be directly compilable by pdfLaTeX.

=====================
END OF RULES
=====================
`;
};
