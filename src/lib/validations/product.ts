import { z } from "zod";
import { MAX_PRICE_CENTS, MIN_PRICE_CENTS } from "@/lib/constants";
import { eurToCents } from "@/lib/money";

export const createProductSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib einen Produktnamen ein.").max(80),
  description: z.string().trim().max(500).default(""),
  price: z
    .string()
    .trim()
    .transform((value, ctx) => {
      try {
        return eurToCents(value);
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ungültiger Preis." });
        return z.NEVER;
      }
    })
    .pipe(z.number().int().min(MIN_PRICE_CENTS).max(MAX_PRICE_CENTS)),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stock: z
    .string()
    .optional()
    .transform((value) => {
      if (!value || value.trim() === "") return null;
      return Number(value);
    })
    .pipe(z.number().int().min(0).nullable()),
  fomoEnabled: z.boolean().default(false)
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
