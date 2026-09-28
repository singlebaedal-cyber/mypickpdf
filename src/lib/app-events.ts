// Event bus for real-time tool error reporting and AI consultation coordination

export interface AppToolErrorDetail {
  toolId: string;
  toolName: string;
  errorMessage: string;
  technicalDetails?: string;
  suggestedAction?: string;
  timestamp: string;
  onRetry?: () => void;
}

export function reportAppError(error: {
  toolId: string;
  toolName: string;
  errorMessage: string;
  technicalDetails?: string;
  suggestedAction?: string;
  onRetry?: () => void;
}) {
  if (typeof window === "undefined") return;
  const detail: AppToolErrorDetail = {
    ...error,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  window.dispatchEvent(new CustomEvent("mypickpdf:tool_error", { detail }));
}
