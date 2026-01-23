import { z } from "zod";

// Zod Schema
const createProductZodSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),
    image: z
      .string()
      .url({ message: "Must be a valid URL" })
      .refine((url) => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url), {
        message:
          "URL must end with a valid image extension (jpg, png, gif, etc.)",
      }),
    dailyProfit: z.number().min(0, "Daily profit cannot be negative"),
    maxInvestCountPerPerson: z
      .number({ message: "Max invest count per person must be a number" })
      .int()
      .min(0, "Max invest count cannot be negative"),
    investmentDayCycle: z
      .number()
      .int()
      .min(1, "Investment cycle must be at least 1 day"),
    price: z.number().min(0, "Price cannot be negative")
  }),
});

export const ProductValidation = {
  createProductZodSchema,
};
