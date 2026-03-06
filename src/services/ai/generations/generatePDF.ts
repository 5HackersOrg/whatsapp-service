import axios, { AxiosError } from "axios";
import type { GeneratePDFResponse } from "../../../utils/types/generations/IGenerations.js";
import { logError } from "../../logging/loggers.js";
import { withErrorHandling } from "../../../utils/errorHandler.js";

export const generatePDF = async (
  latex: string,
  fullName: string,
  email: string,
  jobDescription: string,
  type: string,
): Promise<GeneratePDFResponse> => {
  return withErrorHandling(
    "generatePDF",
    "generatePDF",
    "critical",
    async () => {
      const res = await axios.post(`${process.env.PDF_CREATOR_URL}/generate`, {
        fullName,
        texContent: latex,
        email,
        job_description: jobDescription,
        type,
      });
      if (res.status === 201) {
        return res.data;
      }

      if (res.status === 200 && res.data) {
        return {
          message: "Resume sent to your email",
          status: res.status,
        };
      }

      return {
        message: "Unexpected response from PDF generation service",
        status: res.status,
      };
    },
  );
};
