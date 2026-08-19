import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tailwind Prose Dynamic Page Builder",
  description: "SQLite tabanli, prose ve not-prose ayrimini gosteren demo page builder.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
