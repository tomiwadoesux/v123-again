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

export const metadata = {
  title: "V123",
  description: "A Portfolio Project by Wale-Durojaye Ayoyomiwa",
  keywords: ["portfolio", "Wale-Durojaye", "Ayoyomiwa", "web developer", "frontend", "V123"],
  authors: [{ name: "Wale-Durojaye Ayoyomiwa" }],
  creator: "Wale-Durojaye Ayoyomiwa",
  metadataBase: new URL("https://ayotomcs.me"),
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "V123 - Portfolio of Wale-Durojaye Ayoyomiwa",
    description: "A clean, modern project showcasing the work of Wale-Durojaye Ayoyomiwa.",
    url: "https://ayotomcs.me",
    siteName: "V123 Portfolio Project",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Preview of V123 Portfolio by Wale-Durojaye Ayoyomiwa",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "V123 - Portfolio of Wale-Durojaye Ayoyomiwa",
    description: "A modern portfolio designed and developed by Wale-Durojaye Ayoyomiwa.",
    images: ["/og-image.jpg"],
    creator: "@WaleDurojaye",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
