import crypto from "crypto";

export const generateApiKey = () => {
  const randomPart = crypto.randomBytes(32).toString("hex");

  return `Whatshire_${randomPart}`;
};

export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
};

export const verifyApiKey = (
  providedKey: string,
  storedHashedKey: string,
): boolean => {
  const hashedProvidedKey = hashApiKey(providedKey);
  return crypto.timingSafeEqual(
    Buffer.from(hashedProvidedKey),
    Buffer.from(storedHashedKey),
  );
};
