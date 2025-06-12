import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmails";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Msg | Verification Code",
      react: VerificationEmail({
        username: username,
        otp: verificationCode,
      }),
    });
    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email. Please try again later.",
    };
  }
}
