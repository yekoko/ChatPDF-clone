import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProviders from "@/components/query-providers";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth.context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ChatPDF Clone",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProviders>{children}</QueryProviders>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
