import React, { useState } from "react";
import { 
  FileSearch, 
  CalendarClock, 
  Table, 
  AlignLeft, 
  MessageSquare, 
  Play, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";
import { DocumentInfo, TaskType, AnalysisSection } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AnalysisConsoleProps {
  document: DocumentInfo | null;
  activeTab: TaskType | "chat";
  onTabChange: (tab: TaskType | "chat") => void;
  analyses: Record<string, string>; // taskType -> result
  isAnalyzing: boolean;
  onRunTask: (taskType: TaskType) => Promise<void>;
  renderChatView: () => React.ReactNode;
}

export const AnalysisConsole: React.FC<AnalysisConsoleProps> = ({
  document,
  activeTab,
  onTabChange,
  analyses,
  isAnalyzing,
  onRunTask,
  renderChatView,
}) => {
  const [copied, setCopied] = useState(false);

  const taskConfigs = [
    {
      id: "overview" as TaskType,
      label: "Structured Overview",
      icon: FileSearch,
      description: "Exec summary, top 5 core takeaways & metrics table",
      promptHint: "Generates 2-3 sentence summary, 5 takeaways, and Topic | Detail/Value table",
    },
    {
      id: "action_items" as TaskType,
      label: "Action Items & Dates",
      icon: CalendarClock,
      description: "Timeline & milestone table + categorized actions",
      promptHint: "Dates, deadlines, stakeholders table and grouped requirements",
    },
    {
      id: "metrics_data" as TaskType,
      label: "Financial & Tech Data",
      icon: Table,
      description: "All parameters & metrics structured in Markdown tables",
      promptHint: "Complete numerical breakdown, financials, and technical parameters",
    },
    {
      id: "summary" as TaskType,
      label: "Executive Summary",
      icon: AlignLeft,
      description: "2-sentence executive summary + core section breakdown",
      promptHint: "Concise executive overview with bulleted section breakdown",
    },
  ];

  const currentAnalysis = activeTab !== "chat" ? analyses[activeTab] : null;

  const handleCopy = () => {
    if (!currentAnalysis) return;
    navigator.clipboard.writeText(currentAnalysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Task Tabs Bar */}
      <div className="px-3 pt-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {taskConfigs.map((task) => {
            const Icon = task.icon;
            const isActive = activeTab === task.id;
            const hasData = !!analyses[task.id];

            return (
              <button
                key={task.id}
                onClick={() => onTabChange(task.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{task.label}</span>
                {hasData && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}

          {/* Chat / Ask tab */}
          <button
            onClick={() => onTabChange("chat")}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
            }`}
          >
            <MessageSquare className={`w-3.5 h-3.5 ${activeTab === "chat" ? "text-indigo-600" : "text-slate-400"}`} />
            <span>Ask DocAI</span>
          </button>
        </div>
      </div>

      {/* Main Console Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "chat" ? (
          renderChatView()
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Action Bar for the active task */}
            <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-medium">
                  {taskConfigs.find((t) => t.id === activeTab)?.description}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentAnalysis && (
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}

                <button
                  disabled={!document || isAnalyzing}
                  onClick={() => onRunTask(activeTab as TaskType)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3 h-3 ${isAnalyzing ? "animate-spin" : ""}`} />
                  <span>{currentAnalysis ? "Re-Analyze" : "Extract & Analyze"}</span>
                </button>
              </div>
            </div>

            {/* Analysis Output Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {isAnalyzing ? (
                /* Loading State */
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    DocAI is analyzing document structure...
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Extracting unstructured text, verifying facts, calculating metrics, and compiling formatted Markdown tables.
                  </p>
                </div>
              ) : currentAnalysis ? (
                /* Rendered Analysis */
                <div className="max-w-4xl mx-auto">
                  <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Generated by DocAI • Model: gemini-3.8-flash</span>
                    <span className="font-mono text-[11px]">Strict Grounding Enforced</span>
                  </div>
                  <MarkdownRenderer content={currentAnalysis} />
                </div>
              ) : (
                /* Empty / Prompt to Run */
                <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
                    {(() => {
                      const Icon = taskConfigs.find((t) => t.id === activeTab)?.icon || FileSearch;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    {taskConfigs.find((t) => t.id === activeTab)?.label}
                  </h4>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    {taskConfigs.find((t) => t.id === activeTab)?.promptHint}
                  </p>

                  <button
                    disabled={!document || isAnalyzing}
                    onClick={() => onRunTask(activeTab as TaskType)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run {taskConfigs.find((t) => t.id === activeTab)?.label}</span>
                  </button>
                  {!document && (
                    <p className="text-[11px] text-amber-600 mt-2 font-medium">
                      Please upload or select a document first
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
