import type { Metadata } from "next";
import { constructToolMetadata } from "@/lib/tools-seo";
import ToolLayoutWrapper from "@/components/ToolLayoutWrapper";

export const metadata: Metadata = constructToolMetadata("compress-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayoutWrapper toolKey="compress-pdf">{children}</ToolLayoutWrapper>;
}
