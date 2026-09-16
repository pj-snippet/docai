import 'dotenv/config';
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// 1. Check what process.env is seeing
console.log("Loaded API Key:", process.env.GEMINI_API_KEY ? "EXISTS (starts with " + process.env.GEMINI_API_KEY.slice(0, 5) + "...)" : "UNDEFINED / MISSING");

// 2. Initialize the SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Increase payload limit for PDF base64 uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy getter for GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

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
- When asked to extract action items: Group tasks by priority or department (e.g., Immediate Actions, Key Deadlines, Requirements).
- When asked to answer a user question: Give a direct 1-2 sentence answer first, followed by supporting citations or bullet points quoted from the context.

Always adhere strictly to these guidelines without deviations. Never hallucinate facts outside the provided document.`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "DocAI Backend", timestamp: new Date().toISOString() });
});

// Document analysis endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { fileData, mimeType, textContent, taskType, customPrompt, history } = req.body;

    if (!fileData && !textContent) {
      return res.status(400).json({ error: "No document data or text content provided." });
    }

    const ai = getAiClient();

    // Determine prompt based on task
    let promptInstruction = "";
    if (taskType === "overview") {
      promptInstruction = `Analyze the uploaded document and generate a structured overview:
1. Executive Summary (2-3 sentences max)
2. Top 5 Core Takeaways (bullet points with bold keywords)
3. Key Data & Metrics (format as a Markdown table with columns: Topic | Detail/Value)`;
    } else if (taskType === "action_items") {
      promptInstruction = `Scan the uploaded document and extract all actionable items, rules, or key dates:
1. List all dates, deadlines, or milestones in a Markdown table with columns: [Date/Timeline | Task / Event | Related Stakeholder]
2. List key requirements or action items grouped by category (e.g., Immediate Actions, Key Deadlines, Requirements).`;
    } else if (taskType === "metrics_data") {
      promptInstruction = `Identify all important data, financial figures, metrics, or technical parameters in this document. Present them entirely in structured Markdown tables with explicit column headers and short contextual explanations.`;
    } else if (taskType === "summary") {
      promptInstruction = `Provide a 2-sentence executive summary followed by a bulleted breakdown of core sections.`;
    } else if (taskType === "custom_query" || customPrompt) {
      promptInstruction = `User Question: "${customPrompt}"
Remember to give a direct 1-2 sentence answer first, followed by supporting citations or bullet points quoted from the context. If comparative data or metrics are involved, render them using Markdown Tables. If the answer cannot be determined from the document, explicitly state: "This information is not present in the uploaded document."`;
    } else {
      promptInstruction = `Analyze the document and provide an executive summary, top takeaways, and key metrics in Markdown tables.`;
    }

    // Build parts
    const parts: any[] = [];

    if (fileData) {
      // Clean base64 if it has header like "data:application/pdf;base64,"
      const cleanBase64 = fileData.includes(",") ? fileData.split(",")[1] : fileData;
      parts.push({
        inlineData: {
          mimeType: mimeType || "application/pdf",
          data: cleanBase64,
        },
      });
    } else if (textContent) {
      parts.push({
        text: `--- DOCUMENT CONTEXT ---\n${textContent}\n--- END OF DOCUMENT ---`,
      });
    }

    // Add conversation history if provided
    if (Array.isArray(history) && history.length > 0) {
      const historyContext = history
        .slice(-6)
        .map((h: { role: string; content: string }) => `${h.role.toUpperCase()}: ${h.content}`)
        .join("\n\n");
      parts.push({
        text: `--- PREVIOUS CONVERSATION CONTEXT ---\n${historyContext}\n--- END OF PREVIOUS CONVERSATION ---`,
      });
    }

    parts.push({
      text: promptInstruction,
    });

    let outputText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts },
        config: {
          systemInstruction: DOCAI_SYSTEM_INSTRUCTION,
          temperature: 0.1,
        },
      });
      outputText = response.text || "";
    } catch (primaryError: any) {
      console.warn("Primary model gemini-3.6-flash error, falling back to gemini-3.8-flash:", primaryError?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts },
        config: {
          systemInstruction: DOCAI_SYSTEM_INSTRUCTION,
          temperature: 0.1,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      outputText = fallbackResponse.text || "";
    }

    if (!outputText) {
      outputText = "No response generated from document analysis.";
    }

    return res.json({
      success: true,
      analysis: outputText,
      taskType: taskType || "custom",
    });
  } catch (error: any) {
    console.error("DocAI Analysis Error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to analyze document with DocAI.",
    });
  }
});

// Setup Vite development server middleware or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DocAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
