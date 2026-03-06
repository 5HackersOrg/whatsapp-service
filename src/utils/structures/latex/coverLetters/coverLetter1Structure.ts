export const coverLetter1Latex = `
%-------------------------
% AI-READY Entry-level Cover-letter Template in LaTeX
% Converted to pdflatex for speed
%------------------------

\\documentclass[11pt,a4paper]{article}

%%%% Include Packages
\\usepackage[utf8]{inputenc} % Required for pdflatex
\\usepackage[T1]{fontenc}    % Required for pdflatex
\\usepackage{helvet}         % Loads Helvetica (Arial equivalent)
\\renewcommand{\\familydefault}{\\sfdefault} % Sets the default font to sans-serif

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{multicol}
\\usepackage{csquotes}
\\usepackage{tabularx}
\\usepackage[11pt]{moresize}
\\usepackage{setspace}
\\usepackage[inline]{enumitem}
\\usepackage{ragged2e}
\\usepackage{anyfontsize}
\\usepackage[margin=1cm]{geometry}

\\hypersetup{colorlinks=true,urlcolor=black}

%%%% Set Page Style
\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

%%%% Set URL Style
\\urlstyle{same}

%%%% Set Indentation
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

%%%% Colors
\\definecolor{UI_blue}{RGB}{32, 64, 151}
\\definecolor{HF_color}{RGB}{179, 179, 179}
\\rfoot{{\\color{HF_color} \\thepage \\ of \\ 1}}

\\begin{document}

%%%%%%% --------------------------------------------------------------------------------------
%%%%%%% HEADER
%%%%%%% --------------------------------------------------------------------------------------
\\begin{center}
 \\begin{minipage}[b]{0.30\\textwidth}
 \\large [[PHONE_NUMBER]] \\\\
 \\large \\href{mailto:[[EMAIL]]}{[[EMAIL]]} 
 \\end{minipage}% 
\\begin{minipage}[b]{0.40\\textwidth}
 \\centering
 {\\Huge [[FULL_NAME]]} \\\\ 
\\vspace{0.1cm}
{\\color{UI_blue} \\Large{[[TARGET_JOB_TITLE]]}} \\\\
\\end{minipage}% 
 \\begin{minipage}[b]{0.30\\textwidth}
 \\flushright \\large
\\href{[[LINKEDIN_URL]]}{linkedin.com/in/[[LINKEDIN_ID]]} \\\\
 \\href{[[PORTFOLIO_URL]]}{Portfolio}
\\end{minipage} 
 
\\vspace{-0.15cm} 
{\\color{UI_blue} \\hrulefill}
\\end{center}

\\justify
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{12pt}
\\vspace{0.2cm}
\\begin{center}
 {\\color{UI_blue} \\Large{COVER LETTER}}
\\end{center}

%%%%%%% --------------------------------------------------------------------------------------
%%%%%%% RECIPIENT & DATE
%%%%%%% --------------------------------------------------------------------------------------

\\textbf{Date:} \\today \\\\
\\textbf{To:} [[HIRING_MANAGER_NAME]] \\\\
[[COMPANY_NAME]] \\\\
[[COMPANY_ADDRESS_OPTIONAL]]

\\vspace{0.4cm}

Dear [[HIRING_MANAGER_NAME]],

[[LETTER_CONTENT_PARAGRAPH_1]]

[[LETTER_CONTENT_PARAGRAPH_2]]

[[LETTER_CONTENT_PARAGRAPH_3]]

%%%%%%% --------------------------------------------------------------------------------------
%%%%%%%  SIGNATURE
%%%%%%% --------------------------------------------------------------------------------------

\\vspace{0.5cm}
\\raggedright
Sincerely, \\\\ 
\\vspace{0.2cm}
[[FULL_NAME]] \\\\ 
[[PHONE_NUMBER]] \\\\ 
\\href{mailto:[[EMAIL]]}{[[EMAIL]]}

\\end{document}
`;
