import { customAlphabet } from "nanoid";
export const generateRefCode=()=> {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const generateRefCode = customAlphabet(alphabet, 8);
    return generateRefCode();
  }