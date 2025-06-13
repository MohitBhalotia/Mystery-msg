import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { nanoid } from "nanoid";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || "",
          email: profile.email || "",
          image: profile.picture,
          isVerified: true, // Google-verified emails are considered verified
        };
      },
    }),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          // Create a new user if they don't exist
          let username = user.name?.split(" ").join("").toLowerCase();
          try {
            const response = await axios.get<ApiResponse>(
              `${process.env.NEXT_PUBLIC_APP_URL}/api/check-username-unique?username=${username}`
            );
            console.log(
              response.data.success ? "Taking from name" : "Appending"
            );
          } catch (error) {
            console.error("Username check failed:", error);
            console.log("Appending");

            username = username! + Math.floor(Math.random() * 10000);
          }

          const newUser = new UserModel({
            username,
            email: user.email,
            isVerified: true,
            isAcceptingMessages: true,
            verifyCode: "123456",
            password: nanoid(8),

            verifyCodeExpiry: new Date(),
            messages: [],
          });

          await newUser.save();
          user._id = newUser._id?.toString() || "";
          user.isVerified = true;
          user.isAcceptingMessage = true;
          user.username = newUser.username;
        } else {
          user._id = existingUser._id?.toString() || "";
          user.isVerified = existingUser.isVerified;
          user.isAcceptingMessage = existingUser.isAcceptingMessage;
          user.username = existingUser.username;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        if (token.isAcceptingMessage !== undefined) {
          session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
        }
      }
      return session;
    },
  },
};
