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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials): Promise<any> {
        // console.log(credentials);

        await dbConnect();
        try {
          const user = await UserModel.findOne({
            email: credentials?.identifier,
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("You are not verified. Please verify your email.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            credentials?.password!,
            user.password
          );
          if (isPasswordCorrect) {
            // console.log('Done');
            console.log(user);

            return user;
          } else {
            throw new Error("Invalid credentials. Please try again.");
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw new Error(error);
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
      if (user) {
        token._id = user?._id?.toString();
        token.isVerified = user?.isVerified;
        token.isAcceptingMessages = user?.isAcceptingMessage;
        token.username = user?.username;
        token.email = token.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessages;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
