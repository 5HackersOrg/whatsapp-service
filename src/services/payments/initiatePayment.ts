import { createTransactionSupporterSubscription } from "../../utils/types/payments/Transactions.js";

export const initiatePaymentSupporterSubscriptionCompany = (
  email: string,
  name: string,
) => {
  const paymentData = createTransactionSupporterSubscription(email, name);

  return paymentData;
};
