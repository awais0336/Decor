import type { Metadata } from "next";
import { Playfair_Display, Inter, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import { CookieBanner } from "@/components/layout/CookieBanner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-button",
});

export const metadata: Metadata = {
  title: "Decornish | Luxury Home Decor",
  description: "Curating the art of living. Discover exclusive home decor, luxury furniture, and curated accessories.",
  openGraph: {
    title: "Decornish | Luxury Home Decor",
    description: "Curating the art of living. Discover exclusive home decor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-brand-gold/30">
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
