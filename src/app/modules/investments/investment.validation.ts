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
        userId: objectIdSchema,
        productId: objectIdSchema,
        payInfo: objectIdSchema,
        amount: z.number().positive("amount must be positive"),
        status: investmentStatusSchema.optional(), // default pending
    }),
});

// ✅ Update Investment (partial)
const updateInvestmentZodSchema = z.object({
    body: z.object({
        userId: objectIdSchema.optional(),
        productId: objectIdSchema.optional(),
        payInfo: objectIdSchema.optional(),
        amount: z.number().positive().optional(),
        status: investmentStatusSchema.optional(),
    }),
});

export const investmentZodValidation = {
    createInvestmentZodSchema,
    updateInvestmentZodSchema,
};

