import type { Metadata, Viewport } from "next";
import { Poppins, Onest, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/StoreProvider";
import Script from "next/script";

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
    default: "BASSPORT Pro | Bass Fishing Intelligence Hub",
    template: "%s | BASSPORT Pro",
  },
  description:
    "Discover top bass fishing lakes, real-time fishing reports, seasonal patterns, and community catches with BASSPORT Pro.",
  keywords: [
    "bass fishing",
    "fishing lakes",
    "lake intelligence",
    "fishing reports",
    "BASSPORT Pro",
    "angler community",
  ],
  icons: {
    icon: "/icons/logo.png",
    apple: "/icons/logo.png",
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
    siteName: process.env.NEXT_PUBLIC_APP_NAME || "BASSPORT Pro",
    title: "BASSPORT Pro | Bass Fishing Intelligence Hub",
    description:
      "Explore premium bass fishing lakes, catch intelligence, and expert reports to plan your next trophy day.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/icons/logo.png`,
        width: 1200,
        height: 630,
        alt: "BASSPORT Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BASSPORT Pro | Bass Fishing Intelligence Hub",
    description:
      "Lake intelligence, fishing reports, and trophy catches in one platform.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/icons/logo.png`],
  },
  alternates: {
    canonical: "/",
  },
  category: "Software",
  classification: "Fishing Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A365D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: process.env.NEXT_PUBLIC_APP_NAME || "BASSPORT Pro",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description:
      "Discover top bass fishing lakes, real-time reports, and trophy catches with BASSPORT Pro.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${poppins.variable} ${onest.variable} ${geistMono.variable} ${clashDisplay.variable} antialiased bg-background font-sans`}
        suppressHydrationWarning
      >
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`
            (function () {
              function cleanBisAttrs() {
                var nodes = document.querySelectorAll('[bis_skin_checked]');
                for (var i = 0; i < nodes.length; i++) {
                  nodes[i].removeAttribute('bis_skin_checked');
                }
              }

              cleanBisAttrs();

              var observer = new MutationObserver(function () {
                cleanBisAttrs();
              });

              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
              });

              window.addEventListener('load', function () {
                setTimeout(function () {
                  observer.disconnect();
                }, 2000);
              });
            })();
          `}
        </Script>
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
            <Toaster richColors position="top-right" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
