import type { PDFResumePrompt } from "../../types/generations/IGenerations.js";

export const genPDFResumePrompt = ({
  job_description,
  latexStructure,
  user_json_file,
}: PDFResumePrompt) => {
  return `
    You are an expert ATS-optimized LaTeX resume creator. Your task is to generate a compelling, keyword-rich resume using the provided JSON resume data, strategically tailored to match the given job description.

    **Job Description (JD):**
    ${job_description}

    **JSON Resume Data (JS):**
    ${user_json_file}

    **Target LaTeX Structure (LS):**
    ${latexStructure}

    **Core Instructions:**

         1. **STAR Method & Quantification (Action/Result):**
       - **Rule:** Every bullet point in the "Experience" and "Projects" sections must follow the STAR method.
       - **Action:** Start each bullet with a strong action verb (e.g., "Architected," "Optimized," "Spearheaded").
       - **Result:** You MUST look for metrics, percentages, or specific outcomes in the JS data. 
       - If the JS data provides a result (e.g., "saved 20 hours" or "increased accuracy by 15%"), format the bullet to emphasize this: "Improved [X] by [Percentage/Metric] by implementing [Action] using [Tool]."
       - Transform passive responsibilities (e.g., "Responsible for coding") into active results (e.g., "Developed high-performance backend modules, reducing latency by 30%").

    2. **ATS Optimization (CRITICAL):**
       - Use exact keywords and phrases from the job description throughout the resume
       - Avoid tables, columns, images, or complex formatting that ATS cannot parse
       - Use standard section headings: "Experience", "Education", "Skills", "Projects", etc.
       - Include both acronyms and full terms (e.g., "Machine Learning (ML)")
       - Prioritize relevant skills and experiences that match the JD

    3. **Content Enhancement:**
       - Expand bullet points with quantifiable achievements using the STAR method (Situation, Task, Action, Result)
       - Transform basic responsibilities into impact-driven accomplishments
       - Incorporate action verbs: Led, Developed, Implemented, Optimized, Architected, etc.
       - Add metrics and numbers where the JSON data allows (percentages, timeframes, scale)
       - Emphasize technical skills, tools, and methodologies mentioned in both the JD and JSON

    4. **Strategic Tailoring:**
       - Reorder and emphasize experiences/skills that best match the job requirements
       - Mirror the language and terminology used in the job description
       - Highlight transferable skills relevant to the target role
       - Prioritize the most relevant 2-3 experiences over older/less relevant ones

    5. **Data Integrity Rules:**
       - ONLY use information present in the JSON data—never fabricate or infer
       - If data is missing or null, omit that section entirely
       - For dates: only show ranges when BOTH start_date AND end_date exist; show single date if only one exists
       - Maintain truthfulness while optimizing presentation

    6. **Structure & Formatting:**
       - Follow the target LaTeX structure exactly
       - Use simple, ATS-parseable LaTeX commands
       - Avoid special characters, graphics, or complex formatting
       - Keep consistent formatting throughout (dates, bullet points, spacing)
       - Ensure proper LaTeX syntax for easy compilation

    7. **Field Handling:**
      - Header: Only include contact fields with non-null data
       - Summary: Omit entirely if null; if present, tailor to JD keywords
       - Skills: Organize by relevance to JD (technical, soft skills, tools)
       - Experience: Focus on achievements over responsibilities
       - Projects: Emphasize those using technologies/skills from the JD
       - Additional sections: Only add if data exists in JSON and adds value

     8. **STAR Method & Quantification (Action/Result):**
       - **Rule:** Every bullet point in the "Experience" and "Projects" sections must follow the STAR method.
       - **Action:** Start each bullet with a strong action verb (e.g., "Architected," "Optimized," "Spearheaded").
       - **Result:** You MUST look for metrics, percentages, or specific outcomes in the JS data. 
       - If the JS data provides a result (e.g., "saved 20 hours" or "increased accuracy by 15%"), format the bullet to emphasize this: "Improved [X] by [Percentage/Metric] by implementing [Action] using [Tool]."
       - Transform passive responsibilities (e.g., "Responsible for coding") into active results (e.g., "Developed high-performance backend modules, reducing latency by 30%").


       10. **CRITICAL LaTeX Syntax Rules - READ CAREFULLY:**
       - Do NOT use \\text{} command (use \\textit{} instead for dates/emphasis)
       - Do NOT add explanatory comments or annotations in the LaTeX
       - Do NOT expand acronyms with unnecessary commentary (just "C\\#", not "C\\# (Object-Oriented)")
       - Do NOT use placeholder text from the LaTeX structure
       - Do NOT add preambles or explanations—output ONLY the LaTeX code
       - Do NOT invent information not in the JSON
       - Do NOT use Markdown syntax (**bold**, *italic*) - use LaTeX commands (\\textbf{}, \\textit{})
       - ALWAYS escape special LaTeX characters:
         * # → \\#
         * $ → \\$
         * & → \\&
         * _ → \\_
       - **CRITICAL: DO NOT ESCAPE % in comment lines (lines starting with %)**
       
       - **🚨 CRITICAL DATE FORMATTING - THIS IS CAUSING COMPILATION ERRORS:**
         * Month names (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec) are PLAIN TEXT
         * NEVER put a backslash before month names
         * Backslashes before month names will break LaTeX compilation
         * ✅ CORRECT EXAMPLES:
           - {Oct 2024 - Nov 2024}
           - {Jan 2024 - Mar 2024}
           - {Jun 2024 - Jul 2024}
           - \\resumeProjectHeading{\\textbf{Task Manager}}{Oct 2024 - Nov 2024}
         * ❌ WRONG - WILL CAUSE ERRORS:
           - {\\Oct 2024 - Nov 2024}  ← THIS BREAKS COMPILATION
           - {\\Jan 2024}  ← THIS BREAKS COMPILATION
           - \\resumeProjectHeading{\\textbf{Task Manager}}{\\Oct 2024}  ← THIS BREAKS COMPILATION
         * Remember: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec are NOT LaTeX commands
         * They should appear exactly as written with NO backslash prefix
      - Use proper LaTeX commands, not Markdown syntax

    **Output Requirements:**
    - Valid, compilable LaTeX code only
    - ATS-friendly formatting (no tables, columns, or graphics)
    - Keyword-optimized for the specific job description
    - Descriptive, achievement-focused bullet points
    - Clean, professional presentation
    `;
};
