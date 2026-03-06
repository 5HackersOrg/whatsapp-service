import type { CoverLetterGenPrompt } from "../../types/generations/IGenerations.js";

export const genCoverLetterPrompt = ({
  company_name,
  coverLetterStructure,
  job_description,
  job_location,
  job_title,
  today_date,
  user_json_file,
}: CoverLetterGenPrompt) => {
  return `
    You are an expert Career Coach and Professional Writer. Your task is to generate a persuasive, human-centric cover letter (200-300 words) using the provided JSON resume data, specifically tailored to the given job description.
     **Today Date (TD):**
     ${today_date}

     **Job Title (TD):**
     ${job_title}

     **Company Name (TD):**
     ${company_name}

     **Company Location (TD):**
     ${job_location}

    **Job Description (JD):**
    ${job_description}

    **JSON Resume Data (JS):**
    ${user_json_file}

    **Target LaTeX Structure (LS):**
    ${coverLetterStructure}

    **Core Instructions:**

    1. **Silent Omission Logic (CRITICAL):**
       - If a data field in the JSON is null, empty, or "N/A", you MUST remove the corresponding LaTeX command or line entirely. 
       - NEVER output literal placeholder text (e.g., "[[PORTFOLIO_URL]]").
       - If [[HIRING_MANAGER_NAME]] is unknown, use "Hiring Manager".
       - If [[TARGET_JOB_TITLE]] is missing in the JSON, derive it from the Job Description provided.
       - If a contact field (Phone, LinkedIn, Portfolio) is missing, remove that specific LaTeX element or minipage entry. Do not leave empty parentheses or dangling labels.

    2. **Voice and Tone (Human-Centric):**
       - Write like a person, not a machine. Avoid "AI-isms" like "tapestry," "delve," "dynamic," "passionate professional," or "testament to my skills."
       - Use active, punchy verbs and varying sentence lengths to create a natural reading rhythm.
       - Tell a brief story: "While developing [Project Name], I solved [Problem] by [Action]..."

    3. **Content Strategy (200-300 Words):**
       - **The Opening:** Don't just introduce yourself. Identify a key challenge mentioned in the JD and explain how your specific background addresses it.
       - **The Body:** Highlight 1-2 quantifiable wins from the JSON (e.g., "automated X to save Y hours"). Focus on the *impact* of your work.
       - **The Close:** Connect your personal values to the company's mission mentioned in the JD.

    4. **Data Integrity & Technical Rules:**
       - ONLY use facts from the JSON. 
       - Follow the target LaTeX structure strictly.
       - Escape special characters: & to \\&, % to \\% (except in comments), $ to \\$, # to \\#.
       - **DATES:** Use plain text month names (e.g., Oct 2024). NEVER put a backslash before the month name.
       - Use \\textit{} for emphasis, NEVER \\text{}.

    **Output Requirement:**
    Provide ONLY the valid, compilable LaTeX code. Do not include markdown backticks, introductory text, or concluding remarks.
`;
};
