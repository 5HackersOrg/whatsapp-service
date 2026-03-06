export const coverLetter2Latex = `
\\documentclass[11pt,a4paper]{article}

% --- PDFLATEX REQUIRED PACKAGES ---
\\usepackage[utf8]{inputenc} % Handles accents/symbols (é, ñ, ü)
\\usepackage[T1]{fontenc}    % Ensures text can be copy-pasted correctly
\\usepackage{lmodern}        % Makes the default font look sharper/modern
% ----------------------------------

\\usepackage[left=1in,top=1in,right=1in,bottom=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}

% Colors
\\definecolor{navy}{HTML}{00199e}

\\begin{document}

%--- SENDER INFO ---
\\noindent
\\textbf{\\Large \\textcolor{navy}{ {{full_name}} }} \\\\
{{location}} $|$ {{phone}} $|$ {{email}} \\\\
\\href{ {{linkedin_url}} }{LinkedIn} $|$ \\href{ {{github_url}} }{Portfolio/GitHub}

\\vspace{2em}

%--- DATE & RECIPIENT ---
\\noindent
\\today \\\\

\\vspace{1em}
\\noindent
Hiring Manager \\\\
{{company_name}} \\\\
{{company_location}}

\\vspace{2em}

%--- SALUTATION ---
\\noindent
Dear {{#if hiring_manager_name}} {{hiring_manager_name}} {{else}} Hiring Manager {{/if}},

\\vspace{1em}

%--- OPENING PARAGRAPH ---
I am writing to express my strong interest in the \\textbf{ {{job_title}} } position at \\textbf{ {{company_name}} }. Having followed {{company_name}}'s work in {{industry_field}}, I am impressed by your recent focus on {{specific_company_initiative}}. As a {{current_role_or_title}} with a background in {{core_specialty}}, I am confident that my technical skills and project experience align perfectly with the goals of your team.

\\vspace{1em}

%--- BODY PARAGRAPH 1: THE "ACTION" & "RESULT" ---
In my recent work at {{most_relevant_company_or_project}}, I spearheaded {{major_action}}. By utilizing {{specific_tools_from_JD}}, I was able to achieve {{quantifiable_result_or_metric}}. This experience taught me how to effectively {{transferable_skill_from_JD}}, a skill I am eager to apply to the challenges at {{company_name}}.

\\vspace{1em}

%--- BODY PARAGRAPH 2: THE "FIT" ---
My technical foundation in \\textbf{ {{primary_skills_list}} } has prepared me to contribute immediately to your current projects. Beyond my technical capabilities, I am a proactive problem-solver who thrives in {{work_environment_style}} environments. I am particularly drawn to this role because of {{reason_why_this_job_is_next_step}}.

\\vspace{1em}

%--- CLOSING ---
I am eager to bring my unique blend of {{skill_1}} and {{skill_2}} to your team. Thank you for your time and consideration. I look forward to the possibility of discussing how my background can support the continued success of {{company_name}}.

\\vspace{2em}

\\noindent
Sincerely, \\\\
\\vspace{1em} \\\\
\\textbf{ {{full_name}} }

\\end{document}
`;
