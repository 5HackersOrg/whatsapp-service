import type { Request, Response } from "express";
import { initiatePaymentSupporterSubscriptionCompany } from "../../services/payments/initiatePayment.js";
import { generateSignature } from "../../services/payments/payfast/api_signature.js";

export const paySupportSubscriptionController = (
  req: Request,
  res: Response,
) => {
  const { email, name } = req.body;
  const paymentData = initiatePaymentSupporterSubscriptionCompany(email, name);
  const signature = generateSignature(paymentData, "hellodidistudythis");
  res.json({ paymentData, signature });
};
