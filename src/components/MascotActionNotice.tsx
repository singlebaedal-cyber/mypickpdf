"use client";

import React from "react";
import RedPanda, { RedPandaMood } from "./RedPanda";

interface MascotActionNoticeProps {
  mood?: "ready" | "hooray" | "success" | "thinking";
  title: string;
  description: string;
  actionHint?: string;
  className?: string;
}

export default function MascotActionNotice({
  mood = "ready",
  title,
  description,
  actionHint,
  className = "",
}: MascotActionNoticeProps) {
  const isSuccess = mood === "hooray" || mood === "success";

  return (
    <div
      className={`p-4 sm:p-5 rounded-3xl flex items-center gap-4 border transition-all ${
        isSuccess
          ? "bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border-emerald-200/80 shadow-xs"
          : "bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-orange-50/80 border-orange-200/70 shadow-xs"
      } ${className}`}
    >
      <div className="shrink-0 hover:scale-105 transition-transform">
        <RedPanda mood={mood} size={58} />
      </div>
      <div className="min-w-0 flex-1">
        <h5
          className={`text-sm sm:text-base font-extrabold flex items-center gap-1.5 break-keep ${
            isSuccess ? "text-emerald-900" : "text-orange-950"
          }`}
        >
          <span>{title}</span>
          <span className="text-xs">🐾</span>
        </h5>
        <p
          className={`text-xs mt-0.5 leading-relaxed break-keep ${
            isSuccess ? "text-emerald-700" : "text-orange-800/90"
          }`}
        >
          {description}
        </p>
        {actionHint && (
          <div
            className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
              isSuccess
                ? "bg-emerald-100/90 text-emerald-800"
                : "bg-orange-100/90 text-orange-900"
            }`}
          >
            <span>👉</span>
            <span>{actionHint}</span>
          </div>
        )}
      </div>
    </div>
  );
}
