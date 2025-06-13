import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import UserModel from "@/model/User";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  // console.log("userMsg", user);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  console.log(userId);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log("user", user);

    if (!user) {
      return Response.json({
        success: false,
        message: "No user found",
      },{status:404});
    }
    if (user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages available",
        },
        { status: 200 }
      );
    }

    return Response.json({
      success: true,
      messages: user[0].messages,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 }
    );
  }
}
