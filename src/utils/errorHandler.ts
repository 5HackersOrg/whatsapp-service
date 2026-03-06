import { logError } from "../services/logging/loggers.js";

export const withErrorHandling = async <T>(
  action: string,
  endpoint: string,
  severity: "critical" | "info" | "warn" | "error",
  fn: () => Promise<T>,
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    const err = error as Error;
    await logError({
      action,
      endpoint,
      error_message: err.message,
      error_type: "SERVER_ERROR",
      severity: severity,
      stack_trace: err.stack ?? "no stack trace",
    });
  }
};
