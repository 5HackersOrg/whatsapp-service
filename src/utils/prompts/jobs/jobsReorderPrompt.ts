import type { ShortedJob } from "../../types/jobs/IJobs.js";

export const getJobsReorderPrompt = (target_role: string, jobs: ShortedJob) => {
  return `
  You are a career matching algorithm. Your task is to reorder a list of job opportunities based on their relevance to a specific "Target Role."

INPUTS:
1. A "Target Role" (the user's desired job title).
2. A "Job List" (an array of job objects).

**Target Role **
${target_role}

**Job List**
${JSON.stringify(jobs)}


INSTRUCTIONS:
1. Analyze the semantic similarity between the "Target Role" and each job's "title".
2. Reorder the "Job List" so that the most relevant matches appear first.
   - Exact matches or strong semantic matches (e.g., "Software Engineer" matches "Software Developer") should be at the top.
   - Partial matches or related technologies (e.g., "C# Developer" for a "Software Developer" target) should come next.
   - Weak matches should be at the bottom.
3. Return ONLY the valid JSON array of reordered job objects. Do not include markdown formatting, explanations, or extra text.
  `;
};
