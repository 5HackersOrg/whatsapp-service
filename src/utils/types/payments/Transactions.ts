import { v7 } from "uuid";

export const createTransactionSupporterSubscription = (
  email: string,
  name: string,
) => {
  return {
    m_payment_id: v7(),
    subscription_type: "1",
    recurring_amount: "2800.00",
    frequency: "3",
    cycles: "0",
    amount: `2800.00`,
    item_name: "Supporter Subscription ",
    item_description: "250 jobs postings Per month and Ai Features",
    email_confirmation: "1",
    confirmation_address: email,
    payment_method: "cc",
    name_first: name,
    email_address: email,
    subscription_notify_email: "true",
    subscription_notify_webhook: "true",
    subscription_notify_buyer: "true",
    merchant_id: process.env.SANDBOX_MERCHANT_ID,
    merchant_key: process.env.SANDBOX_MERCHANT_KEY,
    return_url: "https://frontend.thewoo.online/payment-success",
    cancel_url: "https://frontend.thewoo.online/payment-failed",
    notify_url: "https://app.thewoo.online/api/user/payments/notify",
  };
};

export const createTransactionPayPerPost = (
  email: string,
  name: string,
  quantity: number,
) => {
  const price = 480 * quantity;
  return {
    m_payment_id: v7(),
    amount: `${price}`,
    item_name: "Supporter Subscription ",
    item_description: "Supporter Subscription",
    email_confirmation: "1",
    confirmation_address: email,
    payment_method: "ef",
    name_first: name,
    email_address: email,
    merchant_id: process.env.SANDBOX_MERCHANT_ID,
    merchant_key: process.env.SANDBOX_MERCHANT_KEY,
    return_url: "https://frontend.thewoo.online/payment-success",
    cancel_url: "https://frontend.thewoo.online/payment-failed",
    notify_url: "https://app.thewoo.online/api/user/payments/notify",
  };
};

export const createTransactionUserSubscription = (
  email: string,
  name: string,
) => {
  return {
    m_payment_id: v7(),
    amount: "70.00",
    item_name: "Supporter Subscription ",
    item_description: "Supporter Subscription",
    email_confirmation: "1",
    confirmation_address: email,
    payment_method: "ef",
    name_first: name,
    email_address: email,
    merchant_id: process.env.SANDBOX_MERCHANT_ID,
    merchant_key: process.env.SANDBOX_MERCHANT_KEY,
    return_url: "https://frontend.thewoo.online/payment-success",
    cancel_url: "https://frontend.thewoo.online/payment-failed",
    notify_url: "https://app.thewoo.online/api/user/payments/notify",
  };
};
export const createTransactionSidegig = (
  email: string,
  name: string,
  amount: string,
) => {
  return {
    m_payment_id: v7(),
    amount: amount,
    item_name: "SideGigPayment ",
    item_description: "SideGigPayment",
    email_confirmation: "1",
    confirmation_address: email,
    payment_method: "ef",
    name_first: name,
    email_address: email,
    merchant_id: process.env.SANDBOX_MERCHANT_ID,
    merchant_key: process.env.SANDBOX_MERCHANT_KEY,
    return_url: "https://frontend.thewoo.online/payment-success",
    cancel_url: "https://frontend.thewoo.online/payment-failed",
    notify_url: "https://app.thewoo.online/api/user/payments/notify",
  };
};
