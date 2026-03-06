import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();
console.log(process.env.BRAVO_USER, "brevo user name");
export const transport = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BRAVO_USER,
    pass: process.env.BRAVO_PASS,
  },
});
