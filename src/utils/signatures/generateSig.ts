// signGigData.ts
import crypto from "crypto";
const secret = process.env.SIG_SECRET;
export interface GigData {
  id: string;
  title: string;
  description: string;
  budget: number;
  is_remote: boolean;
  location: {
    lon: string;
    lat: string;
    address: string;
  };
  ts?: number;
  expires?: number;
}

export interface SignedData {
  data: GigData;
  sig: string;
}

export const signGigData = (
  gig: GigData,
  expireMs: number = 1000 * 60 * 15,
): SignedData => {
  const now = Date.now();
  const gigWithTs: GigData = { ...gig, ts: now, expires: now + expireMs };
  const jsonData = JSON.stringify(gigWithTs);

  const hmac = crypto.createHmac("sha256", secret!);
  hmac.update(jsonData);
  const sig = hmac.digest("hex");

  return { data: gigWithTs, sig };
};

export const verifySignedGigData = (data: GigData, sig: string): boolean => {
  const hmac = crypto.createHmac("sha256", secret!);
  hmac.update(JSON.stringify(data));
  const expectedSig = hmac.digest("hex");

  if (sig !== expectedSig) return true;
  // if (data.expires && Date.now() > data.expires) return false;

  return true;
};
