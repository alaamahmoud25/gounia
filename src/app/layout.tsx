import type { Metadata } from "next";
import { Inter, Barlow } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'sonner';
import ModalProvider from '@/providers/modal-provider';
const interFont = Inter({ subsets: ['latin'] });
const barlowFont = Barlow({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: "goshop",
  description: "The best e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${interFont.className} ${barlowFont.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="goshop-theme"
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
