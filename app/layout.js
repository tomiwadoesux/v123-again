import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "V123",
  description: "A Portfolio Project by Wale-Durojaye Ayoyomiwa",
  keywords: ["portfolio", "Wale-Durojaye", "Ayoyomiwa", "Design Engineer", "frontend", "V123"],
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
    title: "V123 - Portfolio Project of Wale-Durojaye Ayoyomiwa",
    description: "A clean, modern project showcasing the work of Wale-Durojaye Ayoyomiwa.",
    url: "https://ayotomcs.me",
    siteName: "V123 Portfolio Project",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Preview of V123 Portfolio Project by Wale-Durojaye Ayoyomiwa",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "V123 - Portfolio Project of Wale-Durojaye Ayoyomiwa",
    description: "News System Portfolio Project developed by Wale-Durojaye Ayoyomiwa.",
    images: ["/og-image.jpg"],
    creator: "@ayotomcs",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/locomotive-scroll.css" as="style" />
        <link rel="prefetch" href="/love" />
        <link rel="preload" href="/fonts/Fino/fino-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
