"use client";

import { BookOpen, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Step {
  step: number;
  title: string;
  desc: string;
}

interface HowToSectionProps {
  toolName: string;
  steps: Step[];
}

export default function HowToSection({ toolName, steps }: HowToSectionProps) {
  const { t, lang } = useLanguage();

  // Schema.org HowTo for AEO and Google Featured Snippets
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${toolName} ${t("howto_heading_suffix")}`,
    description: `mypickpdf - ${toolName}`,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: s.desc,
        },
      ],
    })),
  };

  const headingText = lang === "ko"
    ? `${toolName}${t("howto_heading_suffix")}`
    : `${t("howto_heading_suffix")} ${toolName}`.replace(/^[\s—\-:]+/, "").trim();

  return (
    <section className="my-16 max-w-5xl mx-auto px-4">
      {/* Inject AEO HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-rose-600" /> {t("howto_badge")}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {headingText}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {t("howto_subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div
            key={s.step}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 font-black text-lg flex items-center justify-center border border-rose-100">
                {s.step}
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed flex-grow">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
