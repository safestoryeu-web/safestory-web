import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeStory.eu | Učte deti bezpečnosti",
  description: "Interaktívna hra pre deti. Sofia a Olívia učia deti, ako sa zachovať v nebezpečných situáciách.",
  icons: {
    icon: '/icon.png', // Tvoja nová ikonka
  },
  openGraph: {
    title: 'SafeStory.eu',
    description: 'Sofia a Olívia: Príbehy o bezpečnosti',
    url: 'https://www.safestory.eu',
    siteName: 'SafeStory',
    images: [
      {
        url: '/images/background.webp', // Tento obrázok sa ukáže pri zdieľaní linky
        width: 1200,
        height: 630,
      },
    ],
    locale: 'sk_SK',
    type: 'website',
  },
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
        {children}
      </body>
    </html>
  );
}
