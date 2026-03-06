export const resumeTemplatePrompt = `
Structure this resume to match the JSON template below.



Guidelines:
- If a field has no corresponding information, set it to null
- "industry": must be a single word from this tuple (Technology, Finance, Healthcare, Education, Marketing, Engineering,
  Manufacturing, Retail, Logistics, RealEstate, Legal, Government,
  Energy, Agriculture, Hospitality, Support, Consulting, NonProfit,
  Automotive, Telecom, Other)
- "experience_level": use a single value without slashes (e.g., use "Mid-Level" instead of "Entry/Mid-Level")
- "title_or_position": must contain only ONE position title. If multiple titles are present, select the most relevant or primary one
- "xp":use the numeric values based on the Experience_Mappins to select the appropriate one 
- "education_level":use the numeric values based on the Education_Mappins to select the appropriate one

----------------------------------------
Education_Mappins (USE EXACT VALUES)
----------------------------------------
None → 0
Matric ||(National Senior Certificate) → 4
Certificate → 5
Diploma → 6
Bachelor → 7
Honours → 8
Masters → 9
Doctorate → 10

IMPORTANT:
- Use the HIGHEST completed qualification only.
- Do NOT infer postgraduate level unless explicitly stated.

----------------------------------------
Experience_Mappins (USE EXACT VALUES)
----------------------------------------
Zero experience → 0
Less than 1 year → 1
1-2 years → 2
2-3 years → 3
3-5 years → 5
5+ years → 6

IMPORTANT:
- Calculate total years of WORK experience only.
- Return ONLY a valid JSON object matching the schema. Do not include any explanatory text, markdown formatting, or code blocks.



`;
