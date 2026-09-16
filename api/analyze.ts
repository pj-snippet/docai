import { GoogleGenAI } from "@google/genai";

// Vercel config: push to the absolute max allowed on the free tier
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb',
    },
  },
};

const DOCAI_SYSTEM_INSTRUCTION = `You are DocAI, an expert document intelligence assistant. Your objective is to extract, analyze, and translate complex unstructured PDF documents into clear, actionable insights.

### Core Guidelines:
1. Grounding: Answer questions strictly based on the content of the provided document. If an answer cannot be determined from the document text, explicitly state: "This information is not present in the uploaded document."
2. Formatting: 
   - Use clean Markdown syntax.
   - For comparative data, lists of metrics, or numerical breakdowns, ALWAYS render data using Markdown Tables.
   - Use bold emphasis for key terminology.
3. Tone: Professional, objective, direct, and helpful.

### Handling Default Document Tasks:
- When asked for a summary: Provide a 2-sentence executive summary followed by a bulleted breakdown of core sections.
- When asked to extract action items: Group tasks by priority or department.
- When asked to answer a user question: Give a direct 1-2 sentence answer first, followed by supporting citations.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileData, mimeType, textContent, taskType, customPrompt, history } = req.body;

    if (!fileData && !textContent) {
      return res.status(400).json({ error: "No document data or text content provided." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing." });
    }

    const ai = new GoogleGenAI({ apiKey });
    let promptInstruction = customPrompt 
      ? `User Question: "${customPrompt}"\nRemember to give a direct answer first, followed by supporting citations. If the answer cannot be determined, explicitly state so.`
      : `Analyze the document and provide an executive summary, top takeaways, and key metrics in Markdown tables.`;

    const parts: any[] = [];

    if (fileData) {
      const cleanBase64 = fileData.includes(",") ? fileData.split(",")[1] : fileData;
      parts.push({
        inlineData: {
          mimeType: mimeType || "application/pdf",
          data: cleanBase64,
        },
      });
    } else if (textContent) {
      parts.push({ text: `--- DOCUMENT CONTEXT ---\n${textContent}\n--- END OF DOCUMENT ---` });
    }

    parts.push({ text: promptInstruction });

    let outputText = "";
    
    // Primary execution
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: { systemInstruction: DOCAI_SYSTEM_INSTRUCTION, temperature: 0.1 },
      });
      outputText = response.text || "";
    } catch (error: any) {
      console.warn("Primary model error, falling back to gemini-2.0-flash:", error.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: { parts },
        config: { systemInstruction: DOCAI_SYSTEM_INSTRUCTION, temperature: 0.1 },
      });
      outputText = fallbackResponse.text || "";
    }

    return res.status(200).json({
      success: true,
      analysis: outputText || "No response generated.",
      taskType: taskType || "custom",
    });

  } catch (error: any) {
    console.error("DocAI Analysis Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}