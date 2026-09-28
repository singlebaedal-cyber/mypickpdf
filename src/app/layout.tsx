import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiFeedbackWidget from "@/components/AiFeedbackWidget";
import KakaoInAppBanner from "@/components/KakaoInAppBanner";
import { SITE_CONFIG, WEB_APPLICATION_SCHEMA, FAQ_SCHEMA } from "@/lib/seo-config";
import { LanguageProvider } from "@/lib/i18n";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.domain }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
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
    locale: "ko_KR",
    url: SITE_CONFIG.domain,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.brandName,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 800,
        height: 600,
        alt: "mypickpdf - 마이픽피디에프 래서팬더",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  alternates: {
    canonical: SITE_CONFIG.domain,
  },
  verification: {
    google: "3GEf0s7jNKQSZ5NOk_8uD_aQUuHicYvr531ycq-5ib0",
    other: {
      "naver-site-verification": "6e99cef10e0d83ff11779a9206193559aee8eb28",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="3GEf0s7jNKQSZ5NOk_8uD_aQUuHicYvr531ycq-5ib0" />

        {/* Naver Search Advisor Verification */}
        <meta name="naver-site-verification" content="6e99cef10e0d83ff11779a9206193559aee8eb28" />

        {/* Global WebApplication Schema for GEO & AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_APPLICATION_SCHEMA) }}
        />

        {/* FAQ Schema for Google Search Rich Snippet */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        />

        {/* Google AdSense Script (공식 소유권 인증 및 자동 광고 스크립트) */}
        {SITE_CONFIG.googleAdSensePublisherId !== "ca-pub-XXXXXXXXXXXXXXXX" && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.googleAdSensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Favicons (래서판다 마스코트) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />

        {/* International SEO (hreflang) - Google Global Search Ranking */}
        <link rel="alternate" hrefLang="x-default" href="https://mypickpdf.vercel.app/" />
        <link rel="alternate" hrefLang="ko" href="https://mypickpdf.vercel.app/" />
        <link rel="alternate" hrefLang="en" href="https://mypickpdf.vercel.app/" />
        <link rel="alternate" hrefLang="ja" href="https://mypickpdf.vercel.app/" />
        <link rel="alternate" hrefLang="es" href="https://mypickpdf.vercel.app/" />
        <link rel="alternate" hrefLang="zh" href="https://mypickpdf.vercel.app/" />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-rose-500 selection:text-white">
        <GoogleAnalytics />
        <LanguageProvider>
          <KakaoInAppBanner />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <AiFeedbackWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
