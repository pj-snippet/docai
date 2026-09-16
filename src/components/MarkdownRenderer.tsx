import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Check if content mentions grounding failure
  const isNotPresent = content.includes("This information is not present in the uploaded document.");

  return (
    <div className="markdown-content text-slate-800 text-[15px] leading-relaxed space-y-4">
      {isNotPresent && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-lg text-amber-900 text-sm font-medium">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-semibold">Grounding Notice:</span> This answer confirms that the requested information is not present within the provided document content.
          </div>
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200 first:mt-0 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-slate-900 mt-5 mb-2.5 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-sm inline-block"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3.5 text-slate-700 leading-relaxed last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 bg-slate-100/70 px-1 py-0.5 rounded text-[14.5px]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-800">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 my-3 pl-5 list-disc marker:text-indigo-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 my-3 pl-5 list-decimal marker:font-semibold marker:text-slate-600">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-700 leading-normal pl-1">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-400 bg-indigo-50/50 pl-4 py-2 my-3 text-slate-700 italic rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-lg border border-slate-200/90 shadow-sm">
              <table className="w-full text-left text-sm border-collapse bg-white">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-800 uppercase text-xs font-bold tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 font-normal">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/80 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap bg-slate-100/70">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-slate-700 align-top border-t border-slate-100">
              {children}
            </td>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
