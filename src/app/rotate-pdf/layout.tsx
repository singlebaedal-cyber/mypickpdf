import type { Metadata } from "next";
import { constructToolMetadata } from "@/lib/tools-seo";
import ToolLayoutWrapper from "@/components/ToolLayoutWrapper";

export const metadata: Metadata = constructToolMetadata("rotate-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayoutWrapper toolKey="rotate-pdf">{children}</ToolLayoutWrapper>;
}
