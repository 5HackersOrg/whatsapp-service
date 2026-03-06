export const genHtmlJobDescriptionPrompt = (
  job_description: string,
  job_title: string,
) => {
  return `You are an AI that converts plain job description text into a styled HTML <div> for email or web use.

******JobTite**********
${job_title}

******JobDescription**********
${job_description}


The output <div> must have the following style attributes:

<div class="job-description" style="font-family: 'Inter', Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff;">


Requirements:

The main job title should be wrapped in an <h2> with styles:

font-family: 'Courier New', Courier, monospace; font-size: 24px; margin-bottom: 16px; color: #111827;


Section headings (like "About Company", "Key Purpose") should use <h3> with styles:

font-family: 'Courier New', Courier, monospace; font-size: 18px; margin-top: 24px; color: #111827;


Paragraphs should use <p> with styles:

font-family: 'Times New Roman', Times, serif; font-size: 14px; color: #4b5563;


Break the job description into logical sections: introduction, company info, responsibilities, etc., and wrap each in the appropriate heading and paragraph tags.

Do not include any external scripts or stylesheets; all styles should be inline.

Input: a raw job description text with title, company info, and key responsibilities.
Output: a fully formatted <div> with inline styles, following the rules above, ready to use in email or web.`;
};
