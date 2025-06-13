import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^A-Za-z0-9]/, 'At least one special character');

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email("Please enter a valid email address"),
  password: passwordValidation,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean()
    .refine(val => val === true, {
      message: "You must accept the terms and conditions",
    })
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);
