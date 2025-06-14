// import { Resend } from "resend";
// export const resend = new Resend(process.env.RESEND_API_KEY);

import nodemailer from "nodemailer";

export let transporter: nodemailer.Transporter | null;
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("Email transport configured");
} catch (error) {
  console.error("Failed to configure email transport:", error);
  transporter = null;
}
