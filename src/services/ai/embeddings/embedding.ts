import OpenAI from "openai";
import { logAiUsage } from "../../logging/loggers.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createTextEmbedding = async (
  text: string,
  userId?: string,
  companyId?: string,
) => {
  const start = Date.now();

  try {
    if (!text || typeof text !== "string") {
      throw new Error("Text must be a non-empty string");
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No embedding returned from OpenAI API");
    }

    const duration = Date.now() - start;

    const usage = response.usage;

    const tokensInput = usage?.prompt_tokens ?? 0;
    const tokensOutput = 0;
    const tokensTotal = usage?.total_tokens ?? tokensInput;

    const costzar = (tokensTotal / 1000) * 0.00032;

  
    await logAiUsage({
      company_id: companyId ?? null,
      user_id: userId ?? null,
      model: "text-embedding-3-small",
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
      tokens_total: tokensTotal,
      cost_zar: Number(costzar.toFixed(6)),
      endpoint: "createTextEmbedding",
      duration_ms: duration,
      success: true,
      error_message: null,
    });

    return response.data[0]?.embedding;
  } catch (error: any) {
    const duration = Date.now() - start;

    await logAiUsage({
      company_id: companyId ?? null,
      user_id: userId ?? null,
      model: "text-embedding-3-small",
      tokens_input: 0,
      tokens_output: 0,
      tokens_total: 0,
      cost_zar: 0,
      endpoint: "createTextEmbedding",
      duration_ms: duration,
      success: false,
      error_message: error?.message ?? "Unknown error",
    });

    throw error;
  }
};
