import {
  AdminAuditLog,
  type AuditAction,
  type AuditTargetType,
} from "../../sequelize/models/admin/adminLogs.js";
import { AiUsageLog } from "../../sequelize/models/ai/aiUsageLog.js";
import {
  EmailLog,
  type EmailStatus,
  type EmailType,
} from "../../sequelize/models/email/emailLogs.js";
import {
  ErrorLog,
  type ErrorType,
  type SeverityLevel,
} from "../../sequelize/models/error/Errorlog.js";
import { sendNotifyErrorMessage } from "../twillio/whatsappMessages/sendWhatsappMessage.js";

interface LogAiUsageParams {
  company_id?: string | null;
  user_id?: string | null;
  model: string;
  tokens_input: number;
  tokens_total: number;
  tokens_output: number;
  cost_zar: number;
  endpoint: string;
  duration_ms: number;
  success: boolean;
  error_message?: string | null;
}

export async function logAiUsage(params: LogAiUsageParams) {
  try {
    await AiUsageLog.create(params);
  } catch (err) {
    console.error("Failed to log AI usage:", err);
  }
}

export async function logError(params: {
  error_type: ErrorType;
  error_message: string;
  action: string;
  company_id?: string;
  user_id?: string;
  stack_trace?: string;
  endpoint?: string;
  severity?: SeverityLevel;
}) {
  try {
    await ErrorLog.create(params);
    await sendNotifyErrorMessage({
      action: params.action,
      error: params.error_message,
    });
  } catch (err) {
    console.error("Failed to log error:", err);
  }
}

export async function logEmail(params: {
  recipient: string;
  email_type: EmailType;
  subject?: string;
  status: EmailStatus;
  error_message?: string;
}) {
  try {
    await EmailLog.create(params);
  } catch (err) {
    console.error("Failed to log email:", err);
  }
}

export async function logAudit(params: {
  admin_id: string;
  action: AuditAction;
  target_type?: AuditTargetType;
  target_id?: string;
  before_state?: Record<string, any>;
  after_state?: Record<string, any>;
  ip_address?: string;
}) {
  try {
    await AdminAuditLog.create(params);
  } catch (err) {
    console.error("Failed to log audit:", err);
  }
}
