import type { Metadata } from "next";
import { constructToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = constructToolMetadata("privacy-policy");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
