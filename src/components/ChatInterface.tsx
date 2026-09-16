import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, Trash2, ArrowDown } from "lucide-react";
import { ChatMessage, DocumentInfo } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatInterfaceProps {
  document: DocumentInfo | null;
  messages: ChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  document,
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !document) return;
    const query = input.trim();
    setInput("");
    onSendMessage(query);
  };

  const sampleQuestions = [
    "What are the key dates and milestones mentioned?",
    "Summarize the financial numbers and payment terms",
    "What are the SLA metrics, uptime, or latency targets?",
    "What are the termination clauses or penalties?",
    "Who are the assigned stakeholders and their roles?",
    "What are the security, compliance, or encryption requirements?",
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Chat header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">DocAI Grounded Q&A</h4>
            <p className="text-[10px] text-slate-500">Strict document factual citations</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-[11px] text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-100"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 mb-1">
              Ask any question about this document
            </h4>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              DocAI answers with a direct 1-2 sentence response, followed by exact citations and Markdown tables. Unverifiable questions will be grounded strictly.
            </p>

            <div className="w-full text-left space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Suggested questions
              </span>
              {sampleQuestions.slice(0, 4).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  disabled={!document || isLoading}
                  className="w-full text-left text-xs p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 transition-all flex items-center justify-between gap-2 group cursor-pointer disabled:opacity-50"
                >
                  <span className="truncate">{q}</span>
                  <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[88%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white shadow-2xs font-medium"
                    : "bg-slate-50 border border-slate-200/80 text-slate-800 shadow-2xs"
                }`}
              >
                {msg.role === "assistant" ? (
                  <MarkdownRenderer content={msg.content} />
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
                <div
                  className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                    msg.role === "user" ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span>DocAI is inspecting document text and citing evidence...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              document
                ? "Ask a question about the document (e.g. 'What are the deadlines?')..."
                : "Upload or select a document to ask questions..."
            }
            disabled={!document || isLoading}
            className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || !document || isLoading}
            className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 px-1 text-center">
          Grounding Rule: If an answer cannot be determined from the document, DocAI will explicitly state so.
        </p>
      </form>
    </div>
  );
};
