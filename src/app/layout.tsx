import type { Metadata } from "next";
import type React from "react";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import CartDrawer from "@/components/CartDrawer";
import Analytics from "@/components/Analytics";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://maisbrinquedos.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Mais Brinquedos e Presentes",
    template: "%s — Mais Brinquedos e Presentes",
  },
  description: "Brinquedos, tech e presentes para todas as idades. Variedade, novidades e tecnologia em um só lugar.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    other: [
      { rel: "icon", url: "/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { rel: "icon", url: "/favicon.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
    ],
  },
  openGraph: {
    siteName: "Mais Brinquedos e Presentes",
    locale: "pt_BR",
    type: "website",
    title: "Mais Brinquedos e Presentes",
    description: "Brinquedos, tech e presentes para todas as idades. Variedade, novidades e tecnologia em um só lugar.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mais Brinquedos e Presentes",
    description: "Brinquedos, tech e presentes para todas as idades. Variedade, novidades e tecnologia em um só lugar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="light" className={`${bricolage.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`} style={{"--font-display": `var(--font-bricolage)`, "--font-body": `var(--font-geist)`, "--font-mono": `var(--font-geist-mono)`} as React.CSSProperties}>
      <body className="min-h-full flex flex-col">
        <CustomerAuthProvider>
          <CartProvider>
            <Analytics />
            <CartDrawer />
            {children}
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
