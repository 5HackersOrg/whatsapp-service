export const resume1latex = `
\\documentclass[letterpaper]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage[margin=0.75in]{geometry} % Set reasonable margins

% Define custom commands for section headings
\\newcommand{\\resumeSectionHeading}[2]{
    \\vspace{5pt}
    \\noindent\\textbf{\\Large #1}
    \\hfill \\textit{#2}
    \\vspace{5pt}
    \\hrule
    \\vspace{5pt}
}

\\newcommand{\\resumeSubSectionHeading}[2]{
    \\vspace{2pt}
    \\noindent\\textbf{#1} \\hfill \\textit{#2}
    \\vspace{-2pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\vspace{2pt}
    \\noindent\\textbf{#1} \\hfill \\textit{#2}
    \\vspace{-2pt}
}

\\begin{document}

% --- Personal Details ---
\\begin{center}
    \\textbf{\\Huge {{first_name}} {{last_name}}} \\\\[5pt]
    \\textbf{\\Large {{target_role}}} \\\\[5pt]
    \\href{mailto:{{email}}}{{{email}}} | 
    \\href{tel:{{phone}}}{{{phone}}} | 
    \\href{ {{linkedin_url}} }{LinkedIn} | 
    {{location}} | 
    \\href{ {{portfolio_url}} }{Portfolio}
\\end{center}

\\vspace{10pt}

% --- Summary ---
\\resumeSectionHeading{Professional Summary}{}
\\begin{itemize}[leftmargin=*, itemsep=0pt, parsep=0pt]
    \\item {{professional_summary}}
\\end{itemize}

% --- Skills ---
\\resumeSectionHeading{Technical Skills}{}
\\begin{itemize}[leftmargin=*, itemsep=0pt, parsep=0pt]
    {{#each skill_categories}}
    \\item \\textbf{ {{category_name}} }: {{skills_list}}
    {{/each}}
\\end{itemize}

% --- Experience ---
\\resumeSectionHeading{Professional Experience}{}

{{#each experience}}
\\resumeSubSectionHeading{ {{job_title}} }{ {{start_date}} - {{end_date}} }
\\textbf{ {{company}} } | {{location}}
\\begin{itemize}[leftmargin=1.5em, itemsep=2pt, parsep=0pt]
    {{#each bullet_points}}
    \\item {{this}}
    {{/each}}
\\end{itemize}
{{/each}}

% --- Projects ---
\\resumeSectionHeading{Key Projects}{}

{{#each projects}}
\\resumeProjectHeading{ {{project_name}} }{ {{start_date}} - {{end_date}} }
\\begin{itemize}[leftmargin=1.5em, itemsep=2pt, parsep=0pt]
    {{#each bullet_points}}
    \\item {{this}}
    {{/each}}
\\end{itemize}
{{/each}}

% --- Education & Certifications ---
\\resumeSectionHeading{Education \\& Certifications}{}

{{#each education}}
\\resumeSubSectionHeading{ {{degree}} }{ {{start_date}} - {{end_date}} }
\\textbf{ {{institution}} } | {{location}}
\\begin{itemize}[leftmargin=1.5em, itemsep=2pt, parsep=0pt]
    \\item {{description}}
\\end{itemize}
{{/each}}

\\resumeSubSectionHeading{Certifications}{}
\\begin{itemize}[leftmargin=1.5em, itemsep=2pt, parsep=0pt]
    {{#each certifications}}
    \\item {{name}}
    {{/each}}
\\end{itemize}

% --- References ---
{{#if references}}
\\resumeSectionHeading{References}{}
\\begin{itemize}[leftmargin=1.5em, itemsep=2pt, parsep=0pt]
    {{#each references}}
    \\item {{name}}, {{title}} (\\textit{ {{email}} }, {{phone}})
    {{/each}}
\\end{itemize}
{{/if}}

\\end{document}
`;
