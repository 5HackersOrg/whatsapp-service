export const foundJobsStructurePDFLatex =
  "\\documentclass[11pt,a4paper]{article}\n\n" +
  "\\usepackage[utf8]{inputenc}\n" +
  "\\usepackage[T1]{fontenc}\n" +
  "\\usepackage{helvet}\n" +
  "\\renewcommand{\\familydefault}{\\sfdefault}\n" +
  "\\usepackage[margin=1in]{geometry}\n" +
  "\\usepackage{graphicx}\n" +
  "\\usepackage{hyperref}\n" +
  "\\usepackage{xcolor}\n" +
  "\\usepackage{array}\n\n" +
  "\\hypersetup{\n" +
  "    colorlinks=true,\n" +
  "    linkcolor=blue,\n" +
  "    urlcolor=blue\n" +
  "}\n\n" +
  "\\begin{document}\n\n" +
  "% ---------- HEADER / LOGO ----------\n" +
  "\\begin{center}\n" +
  "    {\\LARGE \\textbf{WhatsHire}}\n" +
  "\\end{center}\n\n" +
  "\\vspace{0.6cm}\n\n" +
  "\\begin{center}\n" +
  "    {\\LARGE \\textbf{Job Opportunities}}\\\\\n" + // FIXED: Changed \\\\\\\\ to \\\\
  "    \\vspace{0.3cm}\n" +
  "    {\\large Curated roles matching your CV}\n" +
  "\\end{center}\n\n" +
  "\\vspace{1cm}\n\n" +
  "% =================== JOB LISTINGS ====================\n\n" +
  "\\section*{{{JOB_TITLE_1}}}\n\n" +
  "\\begin{tabular}{>{\\bfseries}l l}\n" +
  "ID: & {{{JOB_ID_1}}} \\\\\n" + // FIXED: Changed \\\\\\\\ to \\\\
  "Company: & {{{JOB_COMPANY_1}}} \\\\\n" + // FIXED
  "Location: & {{{JOB_LOCATION_1}}} \\\\\n" + // FIXED
  "Link: & \\href{{{JOB_LINK_1}}}{View Job Posting}\n" +
  "\\end{tabular}\n\n" +
  "\\vspace{0.8cm}\n\n" +
  "\\section*{{{JOB_TITLE_2}}}\n\n" +
  "\\begin{tabular}{>{\\bfseries}l l}\n" +
  "ID: & {{{JOB_ID_2}}} \\\\\n" + // FIXED
  "Company: & {{{JOB_COMPANY_2}}} \\\\\n" + // FIXED
  "Location: & {{{JOB_LOCATION_2}}} \\\\\n" + // FIXED
  "Link: & \\href{{{JOB_LINK_2}}}{View Job Posting}\n" +
  "\\end{tabular}\n\n" +
  "\\vspace{0.8cm}\n\n" +
  "\\section*{{{JOB_TITLE_3}}}\n\n" +
  "\\begin{tabular}{>{\\bfseries}l l}\n" +
  "ID: & {{{JOB_ID_3}}} \\\\\n" + // FIXED
  "Company: & {{{JOB_COMPANY_3}}} \\\\\n" + // FIXED
  "Location: & {{{JOB_LOCATION_3}}} \\\\\n" + // FIXED
  "Link: & \\href{{{JOB_LINK_3}}}{View Job Posting}\n" +
  "\\end{tabular}\n\n" +
  "\\vspace{1cm}\n\n" +
  "\\begin{center}\n" +
  "    \\textit{Good luck with your applications!}\n" +
  "\\end{center}\n\n" +
  "\\end{document}\n";
