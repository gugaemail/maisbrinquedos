import type { Metadata } from "next";
import { Unbounded, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import CartDrawer from "@/components/CartDrawer";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
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
    <html lang="pt-BR" className={`${unbounded.variable} ${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text)] font-body">
        <CustomerAuthProvider>
          <CartProvider>
            <CartDrawer />
            {children}
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
