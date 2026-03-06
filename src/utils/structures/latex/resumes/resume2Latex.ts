export const resume2latex = `
\\documentclass[letterpaper,11pt]{article}

%----------------------------------------------------------------------------------------
% PACKAGES & SETUP (PDFLATEX COMPATIBLE)
%----------------------------------------------------------------------------------------
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\\usepackage{tabularx}

% --- PDFLATEX FONT FIXES ---
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[default]{sourcesanspro}

% Colors
\\definecolor{titleblue}{HTML}{00199e}
\\definecolor{subtitleblue}{HTML}{2ec1e0}
\\definecolor{darktext}{HTML}{222222}

\\color{darktext}

% Page layout
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

%----------------------------------------------------------------------------------------
% CUSTOM COMMANDS
%----------------------------------------------------------------------------------------
\\titleformat{\\section}{\\Large\\bfseries\\color{titleblue}}{}{0em}{}[\\color{titleblue}\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{6pt}

\\newcommand{\\resumeItem}[1]{\\item\\small{#1\\vspace{-2pt}}}

\\newcommand{\\resumeSubheading}[4]{
  \\item
  \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
    \\textbf{\\textcolor{subtitleblue}{#1}} & #2 \\\\
    \\textit{\\small #3} & \\textit{\\small #4} \\\\
  \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
  \\item
  \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
    \\small #1 & #2 \\\\
  \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

%----------------------------------------------------------------------------------------
% DOCUMENT
%----------------------------------------------------------------------------------------
\\begin{document}

%--- HEADER ---
\\begin{center}
  {\\Huge \\textbf{\\textcolor{titleblue}{ {{full_name}} }}} \\\\ \\vspace{4pt}
  \\small {{location}} $|$ {{phone}} $|$
  \\href{mailto:{{email}}}{\\underline{{email}}} \\\\
  \\href{{linkedin_url}}{\\underline{LinkedIn}} $|$
  \\href{{github_url}}{\\underline{GitHub}} $|$
  {{portfolio_url}}
\\end{center}

%--- SUMMARY ---
{{#if professional_summary}}
\\section{Personal Profile}
\\small{{professional_summary}}
{{/if}}

%--- EDUCATION ---
{{#if education.length}}
\\section{Education}
\\resumeSubHeadingListStart
{{#each education}}
  \\resumeSubheading
    {{{institution}}}{{{location}}}
    {{{degree}}}{{{start_date}} -- {{{end_date}}}

  {{#if (or gpa highlights.length)}}
  \\resumeItemListStart
    {{#if gpa}}\\resumeItem{\\textbf{GPA:} {{gpa}}}{{/if}}
    {{#each highlights}}\\resumeItem{{{this}}}{{/each}}
  \\resumeItemListEnd
  {{/if}}

{{/each}}
\\resumeSubHeadingListEnd
{{/if}}

%--- EXPERIENCE ---
{{#if experience.length}}
\\section{Experience}
\\resumeSubHeadingListStart
{{#each experience}}
  \\resumeSubheading
    {{{job_title}}}{{{start_date}} -- {{{end_date}}}
    {{{company}}}{{{location}}}

  {{#if bullet_points.length}}
  \\resumeItemListStart
    {{#each bullet_points}}\\resumeItem{{{this}}}{{/each}}
  \\resumeItemListEnd
  {{/if}}

{{/each}}
\\resumeSubHeadingListEnd
{{/if}}

%--- PROJECTS ---
{{#if projects.length}}
\\section{Projects}
\\resumeSubHeadingListStart
{{#each projects}}
  \\resumeProjectHeading
    {\\textbf{\\textcolor{subtitleblue}{{{project_name}}}} $|$ \\textit{{{technologies_used}}}}
    {{{date}}}

  {{#if highlights.length}}
  \\resumeItemListStart
    {{#each highlights}}\\resumeItem{{{this}}}{{/each}}
  \\resumeItemListEnd
  {{/if}}

{{/each}}
\\resumeSubHeadingListEnd
{{/if}}

%--- SKILLS ---
{{#if (or technical_skills_list soft_skills_or_interests)}}
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\item \\small{
  {{#if technical_skills_list}}\\textbf{Languages/Tools:} {{technical_skills_list}} \\\\{{/if}}
  {{#if soft_skills_or_interests}}\\textbf{Methodologies/Interests:} {{soft_skills_or_interests}}{{/if}}
}
\\end{itemize}
{{/if}}

\\end{document}
`;
