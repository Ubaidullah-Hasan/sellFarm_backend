import { z } from "zod";

// Zod Schema
const createProductZodSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  image: z.string().url("Invalid image URL").min(1, "Image URL is required"),
  dailyProfit: z.number().min(0, "Daily profit cannot be negative"),
  maxInvestCount: z
    .number()
    .int()
    .min(0, "Max invest count cannot be negative")
    .default(0),
  investmentCycle: z
    .number()
    .int()
    .min(1, "Investment cycle must be at least 1 day")
    .default(30),
  price: z.number().min(0, "Price cannot be negative"),
  totalProfit: z.number().min(0, "Total profit cannot be negative"),
});

export const ProductValidation = {
  createProductZodSchema,
};
