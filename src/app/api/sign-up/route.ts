import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request): Promise<Response> {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message:
            "Username already exists. Please choose a different username.",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 99999).toString(); // Generate a random verification code
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists.",
          },
          { status: 400 }
        );
      }
      else{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Set expiry to 1 hour from now
        await existingUserByEmail.save();
      }

    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour from now

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });

      await newUser.save();
    }

    // send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    // console.log("Email response:", emailResponse);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message:
            emailResponse.message || "Failed to send verification email.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "User registered successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user. Please try again later.",
      },
      { status: 500 }
    );
  }
}
