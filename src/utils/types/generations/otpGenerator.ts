import bcrypt from "bcrypt";

export const generateOtp = async (length = 5) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  const hashedOtp = await bcrypt.hash(otp.toString(), 10);

  return {
    otp: otp.toString(),
    hashedOtp,
  };
};
