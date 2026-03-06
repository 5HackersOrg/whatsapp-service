export type CoverLetterGenPrompt = {
  user?: any;
  today_date: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description: string;
  job_link?: string;
  user_json_file?: string;
  coverLetterStructure: string;
  email?: string;
};
export type PDFResumePrompt = {
  job_description: string;
  user_json_file: string;
  latexStructure: string;
};
export interface GeneratePDFResponse {
  message: string;
  status: number | string;
  pdfName?: string;
  error?: string;
}
