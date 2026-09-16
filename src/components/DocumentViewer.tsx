import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, RefreshCw, Eye, Search, FileUp, Sparkles, ExternalLink } from "lucide-react";
import { DocumentInfo, SampleDocument } from "../types";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocuments";

interface DocumentViewerProps {
  currentDoc: DocumentInfo | null;
  onSelectDoc: (doc: DocumentInfo) => void;
  onTriggerUpload: () => void;
  isAnalyzing: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  currentDoc,
  onSelectDoc,
  isAnalyzing,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (isPdf) {
      reader.onload = () => {
        const base64String = reader.result as string;
        // Also create a blob URL for preview
        const blobUrl = URL.createObjectURL(file);

        onSelectDoc({
          id: `doc-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: "application/pdf",
          base64Data: base64String,
          previewUrl: blobUrl,
          uploadedAt: new Date(),
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Treat as text/markdown document
      reader.onload = () => {
        const textContent = reader.result as string;
        onSelectDoc({
          id: `doc-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type || "text/plain",
          textContent,
          uploadedAt: new Date(),
        });
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleDocument) => {
    onSelectDoc({
      id: sample.id,
      name: sample.fileName,
      size: new Blob([sample.textContent]).size,
      type: sample.type,
      textContent: sample.textContent,
      uploadedAt: new Date(),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Document Top Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-indigo-100/70 text-indigo-700 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {currentDoc ? currentDoc.name : "Document Repository"}
            </h3>
            <p className="text-[11px] text-slate-500 truncate">
              {currentDoc ? (
                <>
                  {formatFileSize(currentDoc.size)} • {currentDoc.type.split("/")[1]?.toUpperCase() || "DOCUMENT"} • Uploaded {currentDoc.uploadedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </>
              ) : (
                "Upload a PDF or choose a verified enterprise sample"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.md,.json,.csv"
            className="hidden"
          />
          <button
            id="browse-file-btn"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Main Document Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {!currentDoc ? (
          /* Empty / Upload State */
          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full py-8">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
                  : "border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-slate-900 mb-1">
                Drop your PDF or document here
              </h4>
              <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                Supports PDF contracts, reports, financial statements, and technical specifications up to 50MB.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-xs">
                <FileUp className="w-3.5 h-3.5" />
                Browse Documents
              </span>
            </div>

            {/* Enterprise Sample Documents */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Or test with verified enterprise samples
                </span>
              </div>
              <div className="space-y-2.5">
                {SAMPLE_DOCUMENTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/30 transition-all group flex items-start justify-between gap-3 shadow-2xs cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">
                          {sample.title}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {sample.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {sample.description}
                      </p>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Load &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Document Loaded View */
          <div className="flex-1 flex flex-col h-full">
            {/* Search / Filter in document text */}
            {currentDoc.textContent && (
              <div className="mb-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search terms inside document..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Document Body */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex flex-col">
              {currentDoc.previewUrl ? (
                /* PDF Embed View */
                <div className="w-full h-full flex flex-col">
                  <div className="p-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      PDF Document Reader
                    </span>
                    <a
                      href={currentDoc.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                    >
                      <span>Open in tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <object
                    data={currentDoc.previewUrl}
                    type="application/pdf"
                    className="w-full flex-1"
                  >
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                      <FileText className="w-12 h-12 text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">PDF Ready for Analysis</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        DocAI is reading this PDF via native multimodal vision and text extraction.
                      </p>
                      <a
                        href={currentDoc.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium inline-flex items-center gap-1"
                      >
                        Download / View Full PDF
                      </a>
                    </div>
                  </object>
                </div>
              ) : (
                /* Text / Document Raw Inspector */
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-800 leading-relaxed bg-white">
                  <pre className="whitespace-pre-wrap font-mono">
                    {searchTerm && currentDoc.textContent ? (
                      currentDoc.textContent.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <mark key={i} className="bg-yellow-200 font-bold px-0.5 rounded">
                            {part}
                          </mark>
                        ) : (
                          part
                        )
                      )
                    ) : (
                      currentDoc.textContent
                    )}
                  </pre>
                </div>
              )}
            </div>

            {/* Quick Switch Sample Footer */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-[11px]">Quick switch sample:</span>
              <div className="flex items-center gap-1.5">
                {SAMPLE_DOCUMENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                      currentDoc?.name === s.fileName
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {s.title.split(" ")[0]}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
