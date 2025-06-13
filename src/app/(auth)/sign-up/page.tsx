"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { Loader2, User, Eye, EyeOff, Mail, Key } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { signUpSchema } from "@/schemas/SignUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthCard } from "@/components/ui/auth-card";
import { PasswordStrength } from "@/components/ui/password-strength";
import Image from "next/image";

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username && username.length > 0) {
        setIsCheckingUsername(true);
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage("");
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast.success(response.data.message || "Account created successfully!");
      router.push(`/verify/${data.username}`);
    } catch (error) {
      console.error("Signup error:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameAvailable = usernameMessage === "Username is available";
  const isUsernameInvalid =
    usernameMessage && usernameMessage !== "Username is available";

  return (
    <AuthCard
      title="Create an account"
      description="Enter your details to get started"
      footerText="Already have an account?"
      footerLink="/sign-in"
      footerLinkText="Sign in"
    >
      <Button
        variant="outline"
        type="button"
        disabled={isSubmitting || isGoogleLoading}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn("google", { callbackUrl: "/dashboard" });
        }}
        className="w-full cursor-pointer flex items-center justify-center gap-2"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Image alt="Google Logo" src="/Google.svg" className="h-5 w-5" />
        )}
        Continue with Google
      </Button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      placeholder="username"
                      autoComplete="username"
                      className={`pl-10 ${isUsernameAvailable ? "border-green-500" : isUsernameInvalid ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    {isCheckingUsername && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                    {!isCheckingUsername && username && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isUsernameAvailable ? (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="h-5 w-5 text-gray-400" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </FormControl>
                {usernameMessage && (
                  <p
                    className={`text-sm ${isUsernameAvailable ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={
                          isSubmitting ||
                          !isUsernameAvailable ||
                          isGoogleLoading
                        }
                        className="pl-10 w-full gap-2 mt-2"
                      />
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {field.value.length > 0 && (
                      <p className="text-sm text-yellow-500">
                        We will send a verification code!
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={
                        isSubmitting || !isUsernameAvailable || isGoogleLoading
                      }
                      className="pl-10 pr-10"
                    />
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <PasswordStrength password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={
                        isSubmitting || !isUsernameAvailable || isGoogleLoading
                      }
                      className="pl-10"
                    />
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="terms"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="cursor-pointer"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal inline">
                    I agree to the{" "}
                    <Link
                      target="_blank"
                      href="/terms"
                      className="text-primary underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      target="_blank"
                      href="/privacy"
                      className="text-primary underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="mr-2 h-5 w-5" />
            )}
            Create Account
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignUp;
