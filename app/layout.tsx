import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CityEcho - Discover & Share Places",
  description: "A modern city guide to explore cafes, museums, hotels and more.",
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${montserrat.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
      >
        <SessionProvider session={session}>
          <Navbar />
          <main>
            {children}
          </main>
          <Toaster position="top-right" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
