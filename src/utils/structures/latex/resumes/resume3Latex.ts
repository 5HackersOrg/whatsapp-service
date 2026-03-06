export const resume3Latex = `
\\documentclass[letterpaper]{article}

%-----------------------------------------------------------
% PDFLATEX COMPATIBILITY PACKAGES
%-----------------------------------------------------------
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[default]{lato}

% Tighter margins for 1-page layout
\\usepackage[margin=0.6in, top=0.55in, bottom=0.55in]{geometry}

\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{empty}

%-----------------------------------------------------------
% CUSTOM MACROS (TIGHTENED FOR ONE PAGE)
%-----------------------------------------------------------

% NAME SECTION — REDUCED HEIGHT
\\newcommand{\\namesection}[3]{
  \\begin{center}
    {\\fontsize{25pt}{36pt}\\selectfont \\textbf{#1 #2}} \\\\[4pt]
    {\\small #3}
  \\end{center}
  \\vspace{4pt}
  \\vspace{6pt}
}

% SECTION HEADINGS
\\titleformat{\\section}{
  \\large\\bfseries\\scshape\\raggedright
}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{6pt}{4pt}

% SUBSECTIONS
\\titleformat{\\subsection}{
  \\bfseries\\raggedright
}{}{0em}{}
\\titlespacing{\\subsection}{0pt}{4pt}{2pt}

\\newcommand{\\runsubsection}[1]{\\bfseries #1}
\\newcommand{\\descript}[1]{\\itshape #1}
\\newcommand{\\location}[1]{#1}
\\newcommand{\\sectionsep}{\\vspace{4pt}}
\\newcommand{\\custombold}[1]{\\textbf{#1}}

% TIGHT LIST
\\newenvironment{tightemize}{
  \\begin{itemize}[leftmargin=1.2em, nosep, itemsep=1pt]
}{\\end{itemize}}

\\begin{document}

%-----------------------------------------------------------
% HEADER
%-----------------------------------------------------------
\\namesection{ {{first_name}} }{ {{last_name}} }{
  \\href{ {{website_url}} }{ {{website_url}} } \\\\
  \\href{mailto:{{email}}}{ {{email}} } \\ | \\ {{phone}}
}

% PREVENT PAGE BREAK AFTER HEADER
\\vspace{-6pt}
\\noindent
\\begin{minipage}[t]{0.33\\textwidth}

%-----------------------------------------------------------
% LEFT COLUMN
%-----------------------------------------------------------

\\section{Objective}
{{professional_summary}}
\\sectionsep

\\section{Education}
{{#each education}}
\\subsection{ {{institution}} }
\\descript{ {{degree_name}} }
\\location{Grad. {{end_date}} | {{location}}}
{{#if gpa}} \\\\ Cum. GPA: {{gpa}}{{/if}}
\\sectionsep
{{/each}}

\\section{Links}
{{#each social_links}}
{{platform}}: \\href{ {{url}} }{\\custombold{ {{username}} }} \\\\
{{/each}}
\\sectionsep

\\section{Skills}
\\subsection{Programming}
{{programming_skills_comma_separated}}
\\sectionsep

\\subsection{Software}
{{software_skills_comma_separated}}
\\sectionsep

\\subsection{Languages}
{{languages_comma_separated}}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.64\\textwidth}

%-----------------------------------------------------------
% RIGHT COLUMN
%-----------------------------------------------------------

\\section{Experience}
{{#each experience}}
\\runsubsection{ {{company}} } \\\\
\\descript{ {{job_title}} } \\\\
\\location{ {{start_date}} -- {{end_date}} | {{location}} }
\\begin{tightemize}
{{#each bullet_points}}
\\item {{this}}
{{/each}}
\\end{tightemize}
\\sectionsep
{{/each}}

\\section{Projects}
{{#each projects}}
\\runsubsection{ {{project_name}} } \\\\
\\location{ {{date}} }
\\begin{tightemize}
\\item {{description}}
\\end{tightemize}
\\sectionsep
{{/each}}

\\section{Training}
{{#each training}}
\\runsubsection{ {{title}} } \\\\
\\location{ {{provider}} }
\\begin{tightemize}
\\item {{description}}
\\end{tightemize}
\\sectionsep
{{/each}}

\\end{minipage}

\\end{document}
`;
