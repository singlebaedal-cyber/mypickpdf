import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDE_ARTICLES } from "@/lib/guides-data";
import GuideDetailClientView from "@/components/GuideDetailClientView";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = GUIDE_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return {};

  return {
    title: `${article.title} - 실무 가이드`,
    description: article.summary,
    keywords: [...article.tags, "pdfpick", "PDF 팁", "PDF 가이드"],
    alternates: {
      canonical: `https://pdfpick.kr/guides/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} - 실무 가이드 | pdfpick`,
      description: article.summary,
      url: `https://pdfpick.kr/guides/${article.slug}`,
      siteName: "pdfpick",
      locale: "ko_KR",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["pdfpick Editorial Team"],
      images: [
        {
          url: "https://pdfpick.kr/opengraph-image",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - 실무 가이드 | pdfpick`,
      description: article.summary,
      images: ["https://pdfpick.kr/opengraph-image"],
    },
  };
}

export default function GuideDetailPage({ params }: PageProps) {
  const article = GUIDE_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) {
    notFound();
  }

  // Schema.org Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: "https://pdfpick.kr/opengraph-image",
    author: {
      "@type": "Organization",
      name: "pdfpick Editorial Team",
      url: "https://pdfpick.kr",
    },
    publisher: {
      "@type": "Organization",
      name: "pdfpick",
      logo: {
        "@type": "ImageObject",
        url: "https://pdfpick.kr/icon.png",
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: `https://pdfpick.kr/guides/${article.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://pdfpick.kr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PDF 실무 가이드",
        item: "https://pdfpick.kr/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://pdfpick.kr/guides/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GuideDetailClientView slug={params.slug} />
    </>
  );
}
