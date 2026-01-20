// src/validations/auth.validation.ts
import { z } from "zod";

const loginUserZodSchema = z.object({
  body: z.object({
    mobile: z
      .string()
      .min(11, "Mobile number too short")
      .max(14, "Mobile number too long")
      .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password too long"),
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
