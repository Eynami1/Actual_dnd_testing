import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DnD Combat Tracker",
  description: "Track health, movement, and action points for characters"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
