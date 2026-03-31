import type { Metadata, Viewport } from "next";
import { Poppins, Onest, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/StoreProvider";

const clashDisplay = localFont({
  src: [
    {
      path: "./fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: `Obliq – Discover more than 5000+ Jobs`,
    template: "%s | Obliq",
  },
  description:
    "Obliq is the great platform for job seekers searching for new career heights and passionate about startups. Discover more than 5000+ jobs across Design, Technology, Engineering and more.",
  keywords: [
    "Admin Panel",
    "User Management",
    "career",
    "Obliq",
    "Jobs",
  ],
  // PWA Configuration
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  authors: [{ name: "Nayon" }],
  creator: "Nayon",
  publisher: "Nayon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: process.env.NEXT_PUBLIC_APP_NAME || "Obliq",
    title: `${process.env.NEXT_PUBLIC_APP_NAME || "Obliq"} - Site Panel`,
    description:
      "Obliq is the great platform for job seekers searching for new career heights and passionate about startups. Discover more than 5000+ jobs across Design, Technology, Engineering and more.",
    images: [
      {
        url: "/icons/logo.png",
        width: 1200,
        height: 630,
        alt: "Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${process.env.NEXT_PUBLIC_APP_NAME || "Obliq"} - Site Panel`,
    description:
      "Obliq is the great platform for job seekers searching for new career heights and passionate about startups. Discover more than 5000+ jobs across Design, Technology, Engineering and more.",
    images: ["/icons/logo.png"],
    creator: "@nrbnayon",
  },
  alternates: {
    canonical: "/",
  },
  category: "Software",
  classification: "Modern Web Application",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: process.env.NEXT_PUBLIC_APP_NAME || "Obliq",
    applicationCategory: "Dashboard Management System",
    operatingSystem: "Web",
    description:
      "Obliq is the great platform for job seekers searching for new career heights and passionate about startups. Discover more than 5000+ jobs across Design, Technology, Engineering and more.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${onest.variable} ${geistMono.variable} ${clashDisplay.variable} antialiased bg-background font-sans`}
        suppressHydrationWarning
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          forcedTheme="light"
        >
          <StoreProvider>
              {children}
              <Toaster richColors position="top-center" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
