import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KakaoInAppBanner from "@/components/KakaoInAppBanner";
import { 
  SITE_CONFIG, 
  WEB_APPLICATION_SCHEMA, 
  ORGANIZATION_SCHEMA 
} from "@/lib/seo-config";
import { LanguageProvider } from "@/lib/i18n";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import GlobalWelcomeBanner from "@/components/GlobalWelcomeBanner";
import BackToTopButton from "@/components/BackToTopButton";
import RecentToolTracker from "@/components/RecentToolTracker";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: `${SITE_CONFIG.brandName} - ${SITE_CONFIG.title}`,
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
        url: `${SITE_CONFIG.domain}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.domain}/opengraph-image`],
  },
  alternates: {
    canonical: SITE_CONFIG.domain,
    languages: {
      "ko-KR": SITE_CONFIG.domain,
      "x-default": SITE_CONFIG.domain,
    },
  },
  verification: {
    google: ["03Ngr0_g-9M2mOC3lZQmNJOCtriK2ipqycGPOeySR_s", "3GEf0s7jNKQSZ5NOk_8uD_aQUuHicYvr531ycq-5ib0"],
    other: {
      "naver-site-verification": ["e39cf0c295093069a2d67e000797b3275af45d86", "6e99cef10e0d83ff11779a9206193559aee8eb28"],
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_CONFIG.name,
  },
};

export const viewport = {
  themeColor: "#e11d48",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Language detector: defaults to Korean ('ko') for SEO & Googlebot WRS consistency unless explicitly set via ?lang= or localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var supported = ['ko','en','ja','zh','zh-TW','es','fr','de','it','pt','ru','vi','th','id','hi','ar','tr','nl'];
                  var params = new URLSearchParams(window.location.search);
                  var lang = params.get('lang');
                  if (!lang || supported.indexOf(lang) === -1) {
                    lang = localStorage.getItem('pdfpick_lang') || localStorage.getItem('mypickpdf_lang');
                  }
                  if (!lang || supported.indexOf(lang) === -1) {
                    lang = 'ko';
                  }
                  window.__INITIAL_LANG__ = lang;
                  document.documentElement.lang = lang;
                } catch(e) {}
              })();
            `,
          }}
        />

        {/* Global WebApplication Schema for GEO & AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_APPLICATION_SCHEMA) }}
        />

        {/* Global Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />

        {/* AI & LLM Agent discovery links & RSS Feed */}
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" title="pdfpick 공식 실무 가이드 & PDF 도구 RSS 피드" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="AI Agent Specification" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="AI Agent Full Documentation" />

        {/* Google AdSense Script (공식 소유권 인증 및 자동 광고 스크립트) */}
        {SITE_CONFIG.googleAdSensePublisherId !== "ca-pub-XXXXXXXXXXXXXXXX" && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.googleAdSensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-rose-500 selection:text-white">
        <GoogleAnalytics />
        <MicrosoftClarity />
        <LanguageProvider>
          <GlobalWelcomeBanner />
          <KakaoInAppBanner />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <BackToTopButton />
          <RecentToolTracker />
        </LanguageProvider>
      </body>
    </html>
  );
}
