import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/SignUpSchema";
import { z } from "zod";

const codeSchema = z.object({
  username: userNameValidation,
  code: z.string().length(6, "Code must be exactly 6 characters long"),
});
export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    // const decodedUsername=decodeURIComponent(username);
    const validated = codeSchema.parse({ username, code });
    console.log(validated);

    const user = await UserModel.findOne({
      username: validated.username,
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // TODO if user already verified handle that case
    const isCodeValid = user.verifyCode === validated.code;
    const isCodeNotExpired =
      user.verifyCodeExpiry && new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      // user.verifyCode = null;
      // user.verifyCodeExpiry = null; //  Reset the code and expiry
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid verification code. Please check your code and try again.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code has expired, Please SignUp again to get a new code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
