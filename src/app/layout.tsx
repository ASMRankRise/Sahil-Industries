import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GSAPEnhancements } from "@/components/ui/GSAPEnhancements";
import { GlobalLoader } from "@/components/GlobalLoader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sahil Industries | EOT Cranes & Hoists",
  description: "Manufacturer and solution partner of EOT cranes and hoists.",
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <GlobalLoader />
        <GSAPEnhancements>{children}</GSAPEnhancements>
      </body>
    </html>
  );
}
