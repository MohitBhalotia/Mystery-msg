"use server"

import { ApiResponse } from "@/types/ApiResponse";
import { getVerificationEmailHtml } from "../../emails/VerificationEmails";
import { transporter } from "@/lib/resend";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = await getVerificationEmailHtml(username, verificationCode);

    const  mailOptions={
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Mystery Msg',
      html: emailHtml,
    };

    const response=await transporter?.sendMail(mailOptions);
    // console.log("EMail",response);
    

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email. Please try again later.',
    };
  }
}
