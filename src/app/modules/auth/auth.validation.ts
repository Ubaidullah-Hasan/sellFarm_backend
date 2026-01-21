// src/validations/auth.validation.ts
import { z } from "zod";

const loginUserZodSchema = z.object({
  body: z.object({
    mobile: z
      .string()
      .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "লগইন ব্যর্থ হয়েছে! মোবাইল নম্বর বা পাসওয়ার্ড চেক করুন!"),
    password: z
      .string()
      .min(8, "লগইন ব্যর্থ হয়েছে! মোবাইল নম্বর বা পাসওয়ার্ড চেক করুন!")
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      error: 'Refresh token is required!',
    }),
  }),
});

export const authValidation = {
  loginUserZodSchema,
  refreshTokenValidationSchema,
};
