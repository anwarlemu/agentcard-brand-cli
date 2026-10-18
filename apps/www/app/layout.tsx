import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { registryName, registryUrl } from "@www/lib/registry";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(registryUrl),
  title: { default: `${registryName} design system`, template: `%s | ${registryName} design system` },
  alternates: { types: { "text/markdown": "/agents.md", "text/plain": "/llms.txt" } },
  description: `Components, design tokens and CLI guidance for building ${registryName} pages and interfaces.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
