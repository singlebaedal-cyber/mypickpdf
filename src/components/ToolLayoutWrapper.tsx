import { constructToolSchemas } from "@/lib/tools-seo";
import RelatedToolsSection from "@/components/RelatedToolsSection";

interface ToolLayoutWrapperProps {
  toolKey: string;
  children: React.ReactNode;
}

export default function ToolLayoutWrapper({ toolKey, children }: ToolLayoutWrapperProps) {
  const schemas = constructToolSchemas(toolKey);

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
      <RelatedToolsSection currentToolId={toolKey} />
    </>
  );
}
