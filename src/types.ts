export type TaskType = "overview" | "action_items" | "metrics_data" | "summary" | "custom_query";

export interface DocumentInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  base64Data?: string; // base64 string for PDF/binary
  textContent?: string; // raw text for text/markdown docs
  previewUrl?: string; // blob or data url for preview
  uploadedAt: Date;
  pageCountEstimate?: number;
}

export interface AnalysisSection {
  id: string;
  taskType: TaskType;
  title: string;
  content: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isGroundingMissing?: boolean;
}

export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  type: "application/pdf" | "text/plain";
  textContent: string;
  base64Pdf?: string; // optional base64 PDF if generated
}
