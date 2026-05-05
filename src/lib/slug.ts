import { RESERVED_SLUGS } from "@/lib/constants";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 72);
}

export function randomSuffix(length = 4): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(values)
    .map((value) => alphabet[value % alphabet.length])
    .join("");
}

export function createProductSlug(params: { sellerUsername?: string | null; productName: string }): string {
  const sellerPart = slugify(params.sellerUsername || "lyvee");
  const productPart = slugify(params.productName) || "produkt";
  const base = `${sellerPart}-${productPart}`.slice(0, 80).replace(/-+$/g, "");
  const slug = `${base}-${randomSuffix(4)}`;

  if (RESERVED_SLUGS.has(slug)) {
    return `${slug}-${randomSuffix(4)}`;
  }

  return slug;
}
