import type { Transporter } from "nodemailer";
import { transport } from "./transport.js";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { emailOTPTemplate } from "../../utils/structures/html/emailOTPTemplate.js";
import { logEmail, logError } from "../logging/loggers.js";

export class EmailService {
  static #instance: EmailService | null = null;
  #transport: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  > | null = null;
  constructor() {
    if (EmailService.#instance !== null) {
      return EmailService.#instance;
    }
    this.#transport = transport;
    EmailService.#instance = this;
  }

  async sendEmail(email: string, code: string) {
    const link = "https://main.thewoo.online/LogoWithText.png";
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    try {
      const info = await this.#transport!.sendMail({
        from: "Cracked Auth Service<thatdevcracked@gmail.com>",
        to: `${email}`,
        subject: `OTP Code`,
        html: emailOTPTemplate(code, date, link),
      });
      logEmail({
        email_type: "OTP",
        recipient: email,
        status: "sent",
        subject: "OTP Code",
      });

      console.log("✅ Email sent:", info.messageId);
    } catch (error) {
     await  logEmail({
        email_type: "OTP",
        recipient: email,
        status: "failed",
        subject: "OTP Code",
      });
      await logError({
        action: "sending OTP email",
        error_message: (error as Error).message,
        error_type: "SERVER_ERROR",
        severity: "critical",
        endpoint: "promptAI",
        stack_trace: (error as Error).stack
          ? (error as Error).stack!
          : "no stack trace",
      });
      console.error("❌ Error sending email:", error);
    }
  }
}
