export const isValidCustomerWindow = (date: string) => {
  const now = new Date();
  const timeout = new Date(date);
  return now < timeout;
};
export const generateCustomerWindowTimeout = () => {
  const now = new Date();
  now.setHours(now.getHours() + 23);
  return now.toISOString();
};
