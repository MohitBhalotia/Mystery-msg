import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/User";

export async function DELETE(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  //   console.log("userMsg", user);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthenticated",
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryParams = {
    messageId: searchParams.get("messageId"),
  };
  try {
    const deletedMessage = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: queryParams.messageId } },
      }
    );

    
    if (deletedMessage.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted!",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Message deleted!",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
