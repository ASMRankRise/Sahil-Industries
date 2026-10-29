import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './modern.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sahil Industries | EOT Cranes & Hoists',
  description: 'Manufacturer and solution partner of EOT cranes and hoists.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={inter.variable}>{children}</body></html>;
}
