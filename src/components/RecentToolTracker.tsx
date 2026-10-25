"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TOOLS_REGISTRY } from "@/lib/tools-registry";

export default function RecentToolTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname || pathname === "/") return;

    const slug = pathname.replace(/^\//, "");
    const matchedTool = TOOLS_REGISTRY.find((t) => t.id === slug || t.href === pathname);

    if (matchedTool) {
      try {
        const raw = localStorage.getItem("pdfpick_recent_tools");
        const current: string[] = raw ? JSON.parse(raw) : [];
        const updated = [matchedTool.id, ...current.filter((id) => id !== matchedTool.id)].slice(0, 6);
        localStorage.setItem("pdfpick_recent_tools", JSON.stringify(updated));
      } catch (e) {}
    }
  }, [pathname]);

  return null;
}
