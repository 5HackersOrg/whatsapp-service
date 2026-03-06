import axios from "axios";

const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export const downloadMedia = async (url: string): Promise<Buffer> => {
  
  const fileResponse = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    responseType: "arraybuffer",
  });

  return Buffer.from(fileResponse.data);
};
