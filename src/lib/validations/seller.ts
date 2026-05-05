import { z } from "zod";

export const sellerOnboardingSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9][a-z0-9-]{2,39}$/, "Nur Kleinbuchstaben, Zahlen und Bindestriche."),
  displayName: z.string().trim().min(2).max(80),
  consentAccepted: z.literal("on", {
    errorMap: () => ({ message: "Bitte akzeptiere die Beta-Bedingungen." })
  })
});
