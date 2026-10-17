import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { registryName, registryUrl } from "@www/lib/registry";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(registryUrl),
  title: { default: `${registryName} UI`, template: `%s | ${registryName} UI` },
  description: `The ${registryName} design system: components, sections and visuals for React and Tailwind, and a CLI that applies them to any site.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
