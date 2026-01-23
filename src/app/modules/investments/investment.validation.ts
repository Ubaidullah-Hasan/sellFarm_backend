import { z } from "zod";
import { investmentStatus } from "./investment.constants";

// Mongo ObjectId validation (24 hex chars)
const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const investmentStatusSchema = z.enum([
    investmentStatus.ACCEPTED,
    investmentStatus.PENDING,
    investmentStatus.REJECTED
]);

// ✅ Create Investment
const createInvestmentZodSchema = z.object({
    body: z.object({
        productId: objectIdSchema,
        amount: z.number().positive("amount must be positive"),
        status: investmentStatusSchema.optional(), // default pending
    }),
});

// ✅ Update Investment (partial)
const updateInvestmentZodSchema = z.object({
    body: z.object({
        productId: objectIdSchema.optional(),
        amount: z.number().positive().optional(),
        status: investmentStatusSchema.optional(),
    }),
});

/**
 * ✅ Admin status update
 */
export const updateInvestmentStatusZodSchema = z.object({
  body: z.object({
    status: investmentStatusSchema,
  }),
});

export const investmentZodValidation = {
    createInvestmentZodSchema,
    updateInvestmentZodSchema,
};

