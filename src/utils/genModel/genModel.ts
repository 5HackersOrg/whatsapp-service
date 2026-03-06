import { GoogleGenAI } from "@google/genai";
import { universalResumeTemplate } from "../types/generations/universalTemplate.js";
import { recruiter_decision_analysis } from "../types/generations/recruiterAdvice.js";
import { logAiUsage, logError } from "../../services/logging/loggers.js";

type genAiTypes = {
  pdfBuffer?: Buffer<any>;
  prompt: string;
  recruiterAdvice?: boolean;
  company_id: string | null;
  user_id: string | null;
  action: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const exponentialRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(
          `⚠️ Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
        );
        await sleep(delay);
      }
    }
  }

  throw lastError!;
};

const MODEL = "gemini-flash-lite-latest";

const COST_PER_1K_TOKENS_ZAR_INPUT = 0.00016;
const COST_PER_1K_TOKENS_ZAR_OUTPUT = 0.00064;
const calculateCost = (inputTokens: number, outputTokens: number) => {
  const costInput = inputTokens * COST_PER_1K_TOKENS_ZAR_INPUT;
  const costOutput = outputTokens * COST_PER_1K_TOKENS_ZAR_OUTPUT;
  const totalCost = costInput + costOutput;
  return totalCost;
};

export const promptAI = async ({
  prompt,
  pdfBuffer,
  recruiterAdvice,
  company_id,
  user_id,
  action,
}: genAiTypes) => {
  return exponentialRetry(async () => {
    const ai = new GoogleGenAI({});
    const start = Date.now();

    try {
      let response: any;

      if (pdfBuffer) {
        const fileMimeType = "application/pdf";
        const fileObject = new Blob([pdfBuffer], { type: fileMimeType });
        const file = await ai.files.upload({
          file: fileObject,
          config: { mimeType: fileMimeType, displayName: "resume.pdf" },
        });

        response = await ai.models.generateContent({
          model: MODEL,
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { fileData: { mimeType: fileMimeType, fileUri: file.uri! } },
              ],
            },
          ],
          config: {
            temperature: 0.12,
            responseMimeType: "application/json",
            responseSchema: universalResumeTemplate,
          },
        });

        await ai.files.delete({ name: file.name! });
      } else {
        response = await ai.models.generateContent({
          model: MODEL,
          contents: [{ text: prompt }],
          config: {
            temperature: 0.12,
            ...(recruiterAdvice && {
              responseMimeType: "application/json",
              responseSchema: recruiter_decision_analysis,
            }),
          },
        });
      }

      const tokens_input = response.usageMetadata?.promptTokenCount ?? 0;
      const tokens_output = response.usageMetadata?.candidatesTokenCount ?? 0;

      await logAiUsage({
        company_id,
        user_id,
        model: MODEL,
        tokens_total: tokens_input + tokens_output,
        tokens_input,
        tokens_output,
        cost_zar: calculateCost(tokens_input, tokens_output),
        endpoint: action,
        duration_ms: Date.now() - start,
        success: true,
      });

      return (
        response.text || response.candidates?.[0]?.content?.parts?.[0]?.text
      );
    } catch (error) {
      await logAiUsage({
        company_id,
        user_id,
        tokens_total: 0,
        model: MODEL,
        tokens_input: 0,
        tokens_output: 0,
        cost_zar: 0,
        endpoint: action,
        duration_ms: Date.now() - start,
        success: false,
        error_message: (error as Error).message,
      });
      await logError({
        action: action,
        error_message: (error as Error).message,
        error_type: "SERVER_ERROR",
        severity: "critical",
        endpoint: "promptAI",
        stack_trace: (error as Error).stack
          ? (error as Error).stack!
          : "no stack trace",
      });

      console.error("❌ Error creating resume template:", error);
      throw new Error("Failed to process resume with Google GenAI.");
    }
  }, 5);
};
