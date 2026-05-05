import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyvee.link — Das Linktree fürs Geld",
  description: "Mobile-first Verkaufslinks für Creator, Coaches und lokale Seller."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
