import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/SignUpSchema";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // validate username
    const result = UsernameQuerySchema.safeParse(queryParams);
    // console.log(result); 
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(",")
              : "Invalid username",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 409 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking usernqame uniqueness:", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
