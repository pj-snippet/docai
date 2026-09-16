import React from "react";
import { FileText, ShieldCheck, Cpu, Download, Copy, Check, Columns, PanelLeft, PanelRight } from "lucide-react";
import { DocumentInfo } from "../types";

interface HeaderProps {
  document: DocumentInfo | null;
  activeAnalysisText?: string;
  viewLayout: "split" | "document" | "analysis";
  onLayoutChange: (layout: "split" | "document" | "analysis") => void;
  onNewUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  document,
  activeAnalysisText,
  viewLayout,
  onLayoutChange,
  onNewUpload,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyAnalysis = () => {
    if (!activeAnalysisText) return;
    navigator.clipboard.writeText(activeAnalysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAnalysis = () => {
    if (!activeAnalysisText) return;
    const blob = new Blob([activeAnalysisText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    if (link) {
      link.href = url;
      link.download = `DocAI_Analysis_${document?.name?.replace(/\.[^/.]+$/, "") || "Document"}.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">DocAI</span>
              <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                Document Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Grounding-strict extraction, analysis & structured metric translation
            </p>
          </div>
        </div>

        {/* Center / Status info */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Grounded</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Layout switches (hidden on small mobile) */}
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-600">
            <button
              id="layout-split-btn"
              onClick={() => onLayoutChange("split")}
              title="Split View (Doc + Analysis)"
              className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                viewLayout === "split" ? "bg-white text-indigo-700 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              id="layout-doc-btn"
              onClick={() => onLayoutChange("document")}
              title="Document Only"
              className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                viewLayout === "document" ? "bg-white text-indigo-700 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <PanelLeft className="w-3.5 h-3.5" />
              <span>Doc</span>
            </button>
            <button
              id="layout-analysis-btn"
              onClick={() => onLayoutChange("analysis")}
              title="Analysis Only"
              className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                viewLayout === "analysis" ? "bg-white text-indigo-700 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span>Analysis</span>
            </button>
          </div>

          {/* Action buttons if analysis exists */}
          {activeAnalysisText && (
            <div className="flex items-center gap-1.5">
              <button
                id="copy-analysis-btn"
                onClick={handleCopyAnalysis}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Copy Analysis Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                id="download-analysis-btn"
                onClick={handleDownloadAnalysis}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Download Report (.md)"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          )}

          {/* New upload button */}
          <button
            id="upload-new-doc-btn"
            onClick={onNewUpload}
            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
