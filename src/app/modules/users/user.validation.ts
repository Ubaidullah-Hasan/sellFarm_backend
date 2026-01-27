// src/validations/auth.validation.ts
import { z } from "zod";
import { userRole, userStatus } from "./user.constants";

const registerUserZodSchema = z.object({
  body: z.object({
    role: z
      .enum([userRole.ADMIN, userRole.INVESTOR], {
        message: `User role accepted ${userRole.ADMIN} or ${userRole.INVESTOR}`
      })
      .optional(), // optional, backend can default
    mobile: z
      .string()
      .min(11, "Mobile number too short")
      .max(14, "Mobile number too long")
      .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password too long"),
    referedCode: z
      .string({ message: "Refered code is required!" })
      .optional(),
    selfCode: z
      .string()
      .min(4, "selfCode too short")
      .max(20, "selfCode too long"),
    otpVarification: z
      .object({
        verified: z.boolean().optional(),
        otp: z.string().optional(),
        expireAt: z.coerce.date().optional(),
      })
      .optional(),

    balance: z.number().nonnegative().optional(),
    status: z.enum([userStatus.ACTIVE, userStatus.BLOCKED]).optional(),
  }),
});

export const userValidation = {
  registerUserZodSchema,
};
