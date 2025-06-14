"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { verifySchema } from "@/schemas/VerifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthCard } from "@/components/ui/auth-card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

const VerifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message || "Account verified successfully!");
      router.push("/sign-in");
    } catch (error) {
      console.error("Verification error:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Error verifying code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleResendCode = async () => {
  //   if (countdown > 0) return;

  //   setIsResending(true);
  //   try {
  //     const response = await sendVerificationEmail()

  //     toast.success(
  //       response.data.message || "Verification code resent successfully!"
  //     );
  //     setCountdown(60); // 1 minute cooldown
  //   } catch (error) {
  //     console.error("Resend error:", error);
  //     const axiosError = error as AxiosError<ApiResponse>;
  //     toast.error(
  //       axiosError.response?.data.message ||
  //         "Failed to resend verification code"
  //     );
  //   } finally {
  //     setIsResending(false);
  //   }
  // };

  return (
    <AuthCard
      title="Verify Your Account"
      description={`Enter the 6-digit code sent to your email`}
      footerText="Back to"
      footerLink="/sign-in"
      footerLinkText="Sign in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel className="text-center">Verification Code</FormLabel> */}
                {/* <Mail className="left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> */}
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot key={index} index={index} className="h-10 w-10 sm:h-12 sm:w-12"/>
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>

                <FormMessage className="text-xs" />

                {/* <div className="mt-4 text-center text-sm text-muted-foreground">
                  {countdown > 0 ? (
                    <p>Resend code in {countdown}s</p>
                  ) : (
                    <button
                      type="button"
                      // onClick={handleResendCode}
                      disabled={isResending}
                      className="text-primary hover:underline focus:outline-none"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                          Sending...
                        </>
                      ) : (
                        "Didn't receive a code? Resend"
                      )}
                    </button>
                  )}
                </div> */}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-10 cursor-pointer"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Verify Account
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Having trouble?
          </span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Check your spam folder or contact support if you need help.</p>
      </div>
    </AuthCard>
  );
};

export default VerifyAccount;
