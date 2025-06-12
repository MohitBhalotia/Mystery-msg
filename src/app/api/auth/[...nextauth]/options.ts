import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // id: "credentials",
      name: "Mystery Msg",
      credentials: {
        identifier: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        // username:{
        //     label: "Username",
        //     type: "text",
        //     placeholder: "Enter your username"
        // },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials, req): Promise<any> {
        console.log(credentials);

        await dbConnect();
        try {
          const user = await UserModel.findOne(
            // $or: [
            { email: credentials?.identifier }
            // {username:credentials?.username}
            // ],
          );
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("You are not verified. Please verify your email.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password!,
            user.password
          );
          if (isPasswordCorrect) {
            // console.log('Done');
            
            return user;
          } else {
            throw new Error("Invalid credentials. Please try again.");
          }
        } catch (error: any) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      token._id = user?._id?.toString();
      token.isVerified = user?.isVerified;
      token.isAcceptingMessages = user?.isAcceptingMessages;
      token.username = user?.username;
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
