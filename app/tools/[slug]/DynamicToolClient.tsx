import React, { useState, useEffect } from 'react';

interface DynamicToolClientProps {
  defaultPrompt: string;
}

export default function DynamicToolClient({ defaultPrompt }: DynamicToolClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPrompt(defaultPrompt);
  }, [defaultPrompt]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const resultStr = reader.result as string;
        // Strip out the header (e.g. data:application/pdf;base64,)
        const base64 = resultStr.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult('');
    setCopied(false);

    try {
      const fileBase64 = await fileToBase64(file);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileBase64,
          mimeType: file.type || 'application/pdf',
          prompt,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const rawText = await res.text();
        console.error('Server non-JSON response:', rawText);
        setResult(`Server Error (${res.status}): ${rawText.slice(0, 150)}...`);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setResult(data.error || `Request failed with status ${res.status}`);
        return;
      }

      setResult(data.analysis || 'No analysis returned.');
    } catch (err: any) {
      setResult(`Client Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 border rounded-xl p-6 bg-white shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Upload Document</label>
        <input
          type="file"
          accept=".pdf,.png,.jpg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm border rounded-lg p-2 cursor-pointer bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Instruction / Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Processing...' : 'Run Analysis'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm whitespace-pre-wrap relative">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800">Analysis Result:</span>
            <button
              onClick={handleCopy}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
          <div className="text-gray-700">{result}</div>
        </div>
      )}
    </div>
  );
}