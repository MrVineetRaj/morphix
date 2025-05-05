import type React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Morphix - Video Transformation Platform",
  description: "Upload, transform, and display videos with ease",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className + "min-h-screen bg-background"}>
          <Header />
          {children}
          <Toaster position={"top-center"} />
        </body>
      </html>
    </ClerkProvider>
  );
}
