import type { Metadata } from "next";
import { constructToolMetadata } from "@/lib/tools-seo";
import ToolLayoutWrapper from "@/components/ToolLayoutWrapper";

export const metadata: Metadata = constructToolMetadata("powerpoint-to-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayoutWrapper toolKey="powerpoint-to-pdf">{children}</ToolLayoutWrapper>;
}
