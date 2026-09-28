"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface StepBadgeProps {
  step: number;
  label: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
  className?: string;
}

export default function StepBadge({
  step,
  label,
  isCompleted = false,
  isCurrent = true,
  className = "",
}: StepBadgeProps) {
  if (isCompleted) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black shadow-2xs ${className}`}>
        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
        <span>{label}</span>
      </div>
    );
  }

  if (isCurrent) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-black shadow-md shadow-rose-600/30 animate-pulse ${className}`}>
        <span className="w-4 h-4 rounded-full bg-white text-rose-600 flex items-center justify-center text-[10px] font-black">{step}</span>
        <span>{label}</span>
        <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold ${className}`}>
      <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">{step}</span>
      <span>{label}</span>
    </div>
  );
}
