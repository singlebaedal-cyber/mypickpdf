import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDE_ARTICLES, getGuideBySlug } from "@/lib/guides-data";
import { SITE_CONFIG } from "@/lib/seo-config";
import GuideArticleView from "@/components/GuideArticleView";

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const article = getGuideBySlug(params.slug);
  if (!article) {
    return {
      title: "가이드를 찾을 수 없습니다 | mypickpdf",
    };
  }

  const title = `${article.translations.ko.title} | mypickpdf`;
  const description = article.translations.ko.summary;
  const canonicalUrl = `${SITE_CONFIG.domain}/guides/${article.slug}`;

  return {
    title,
    description,
    keywords: [
      ...article.keywords,
      "mypickpdf 가이드",
      "PDF 팁",
      "무료 PDF 도구",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "mypickpdf",
      images: [
        {
          url: "/mascot/mascot_main.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      publishedTime: `${article.date}T09:00:00+09:00`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/mascot/mascot_main.png"],
    },
  };
}

export default function GuideDetailPage({ params }: GuidePageProps) {
  const article = getGuideBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // JSON-LD Structured Data for Google & Naver
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.translations.ko.title,
    description: article.translations.ko.summary,
    image: `${SITE_CONFIG.domain}/mascot/mascot_main.png`,
    datePublished: `${article.date}T09:00:00+09:00`,
    dateModified: `${article.date}T09:00:00+09:00`,
    author: {
      "@type": "Organization",
      name: "mypickpdf Team",
      url: SITE_CONFIG.domain,
    },
    publisher: {
      "@type": "Organization",
      name: "mypickpdf",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.domain}/mascot/mascot_main.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.domain}/guides/${article.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: SITE_CONFIG.domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "가이드",
        item: `${SITE_CONFIG.domain}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.translations.ko.title,
        item: `${SITE_CONFIG.domain}/guides/${article.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Search Engine Rich Snippet JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <GuideArticleView article={article} />
    </>
  );
}
