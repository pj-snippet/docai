import React, { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/Header";
import { DocumentViewer } from "./components/DocumentViewer";
import { AnalysisConsole } from "./components/AnalysisConsole";
import { ChatInterface } from "./components/ChatInterface";
import { DocumentInfo, TaskType, ChatMessage } from "./types";
import { SAMPLE_DOCUMENTS } from "./data/sampleDocuments";
import { AlertCircle, X } from "lucide-react";

export default function App() {
  // State
  const [currentDoc, setCurrentDoc] = useState<DocumentInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TaskType | "chat">("overview");
  const [analyses, setAnalyses] = useState<Record<string, string>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [viewLayout, setViewLayout] = useState<"split" | "document" | "analysis">("split");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize with the first enterprise sample document so the app is instantly rich and ready
  useEffect(() => {
    const initialSample = SAMPLE_DOCUMENTS[0];
    const initialDoc: DocumentInfo = {
      id: initialSample.id,
      name: initialSample.fileName,
      size: new Blob([initialSample.textContent]).size,
      type: initialSample.type,
      textContent: initialSample.textContent,
      uploadedAt: new Date(),
    };
    setCurrentDoc(initialDoc);

    // Run initial overview analysis
    executeAnalysis("overview", initialDoc);
  }, []);

  // When switching document, clear previous analyses and reset
  const handleSelectDoc = (doc: DocumentInfo) => {
    setCurrentDoc(doc);
    setAnalyses({});
    setChatMessages([]);
    setErrorMessage(null);
    executeAnalysis("overview", doc);
  };

  const handleNewUpload = () => {
    // Switch to document view if on small screens and trigger browse
    const browseBtn = document.getElementById("browse-file-btn");
    browseBtn?.click();
  };

  // API Call to execute task analysis
  const executeAnalysis = async (task: TaskType, docToAnalyze?: DocumentInfo) => {
    const targetDoc = docToAnalyze || currentDoc;
    if (!targetDoc) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        taskType: task,
      };

      if (targetDoc.base64Data) {
        payload.fileData = targetDoc.base64Data;
        payload.mimeType = targetDoc.type || "application/pdf";
      } else if (targetDoc.textContent) {
        payload.textContent = targetDoc.textContent;
      } else {
        throw new Error("No readable content in document.");
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze document.");
      }

      setAnalyses((prev) => ({
        ...prev,
        [task]: data.analysis,
      }));
    } catch (err: any) {
      console.error("Task Analysis Error:", err);
      setErrorMessage(err.message || "An error occurred while analyzing the document.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Chat Message
  const handleSendMessage = async (query: string) => {
    if (!currentDoc || !query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        taskType: "custom_query",
        customPrompt: query,
        history: chatMessages.slice(-4).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      if (currentDoc.base64Data) {
        payload.fileData = currentDoc.base64Data;
        payload.mimeType = currentDoc.type || "application/pdf";
      } else if (currentDoc.textContent) {
        payload.textContent = currentDoc.textContent;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "DocAI failed to respond.");
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.analysis,
        timestamp: new Date(),
        isGroundingMissing: data.analysis.includes("This information is not present in the uploaded document."),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setErrorMessage(err.message || "Failed to get response from DocAI.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  // Extract active text for export
  const activeAnalysisText = activeTab !== "chat" ? analyses[activeTab] : "";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <Header
        document={currentDoc}
        activeAnalysisText={activeAnalysisText}
        viewLayout={viewLayout}
        onLayoutChange={setViewLayout}
        onNewUpload={handleNewUpload}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col min-h-0">
        {/* Mobile View Switcher (visible below lg breakpoint) */}
        <div className="flex lg:hidden mb-3 p-1 bg-slate-200/80 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setViewLayout("document")}
            className={`flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer ${
              viewLayout === "document"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Document Preview
          </button>
          <button
            onClick={() => setViewLayout("analysis")}
            className={`flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer ${
              viewLayout === "analysis" || viewLayout === "split"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            DocAI Analysis Console
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[calc(100vh-6rem)]">
          {/* Left Column: Document Source Viewer */}
          {(viewLayout === "document" || (viewLayout === "split")) && (
            <div
              className={`flex flex-col h-[520px] lg:h-full ${
                viewLayout === "document"
                  ? "lg:col-span-12"
                  : "lg:col-span-5 hidden lg:flex"
              }`}
            >
              <DocumentViewer
                currentDoc={currentDoc}
                onSelectDoc={handleSelectDoc}
                onTriggerUpload={handleNewUpload}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}

          {/* Right Column: DocAI Intelligence & Analysis Console */}
          {(viewLayout === "analysis" || (viewLayout === "split")) && (
            <div
              className={`flex flex-col h-[650px] lg:h-full ${
                viewLayout === "analysis"
                  ? "lg:col-span-12"
                  : "lg:col-span-7 flex"
              }`}
            >
              <AnalysisConsole
                document={currentDoc}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                analyses={analyses}
                isAnalyzing={isAnalyzing}
                onRunTask={(t) => executeAnalysis(t)}
                renderChatView={() => (
                  <ChatInterface
                    document={currentDoc}
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    onClearChat={handleClearChat}
                    isLoading={isChatLoading}
                  />
                )}
              />
            </div>
          )}
        </div>
      </main>
      <Analytics />
    </div>
  );
}
