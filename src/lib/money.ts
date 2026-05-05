export function eurToCents(value: string | number): number {
  const normalized = String(value).replace(",", ".").trim();
  const amount = Number(normalized);

  if (!Number.isFinite(amount)) {
    throw new Error("Ungültiger Betrag");
  }

  return Math.round(amount * 100);
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(cents / 100);
}

export function calculateApplicationFeeCents(amountCents: number, feeBps: number): number {
  return Math.max(1, Math.floor((amountCents * feeBps) / 10_000));
}
