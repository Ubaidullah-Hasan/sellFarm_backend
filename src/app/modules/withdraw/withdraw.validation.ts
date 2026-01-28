import { z } from "zod";

export const createWithdrawZodSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Name is required"),

        paymentType: z
            .string()
            .min(1, "Payment type is required"),

        paymentNumber: z
            .string()
            .min(11, "Mobile number too short")
            .max(14, "Mobile number too long")
            .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number"),

        amount: z
            .number()
            .positive("Amount must be greater than 0"),
    }),
});
