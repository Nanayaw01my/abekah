import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";
import { SplashWrapper } from "@/components/SplashWrapper";
import { ServerWakeUp } from "@/components/ServerWakeUp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "RentFinder — Find. Connect. Move In with Confidence.",
    template: "%s | RentFinder",
  },
  description:
    "Browse verified rental properties from trusted landlords. No hidden fees. Direct communication. Move in with confidence.",
  keywords: ["rental", "property", "apartment", "house", "rent", "landlord", "tenant"],
  openGraph: {
    title: "RentFinder — Find Your Perfect Rental Home",
    description: "Browse 50,000+ verified rental properties from trusted landlords.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)] bg-white text-gray-900">
        <AuthProvider>
          <ServerWakeUp>
          <SplashWrapper>
            <Navbar />
            <div className="flex-1">{children}</div>
            <ConditionalFooter />
          </SplashWrapper>
          </ServerWakeUp>
        </AuthProvider>
      </body>
    </html>
  );
}
