import { z } from "zod";
import { depositStatus } from "./deposit.constants";

export const depositStatusSchema = z.enum([
  depositStatus.PENDING,
  depositStatus.APPROVED,
  depositStatus.REJECTED,
]);

/**
 * ✅ Create Deposit (USER)
 * userId body থেকে নেবে না (token থেকে নেবে)
 */
export const createDepositZodSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    payType: z.string().min(1, "payType is required"),
    trxID: z.string().min(3, "trxID is required"),
  }),
});

/**
 * ✅ Admin status update
 */
export const updateDepositStatusZodSchema = z.object({
  body: z.object({
    status: depositStatusSchema,
  }),
});
