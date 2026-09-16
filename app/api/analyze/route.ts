import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { PDFParse } from 'pdf-parse';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];
const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(model: string, prompt: string, buffer: Buffer, mimeType: string) {
  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: buffer.toString('base64'), mimeType } },
          { text: prompt },
        ],
      },
    ],
    config: { temperature: 0.2 },
  });
  return response.text;
}

async function callGroq(model: string, prompt: string, documentText: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are an expert document analysis engine.' },
      { role: 'user', content: `Document Content:\n"""\n${documentText}\n"""\n\nTask: ${prompt}` },
    ],
    model: model,
    temperature: 0.2,
  });
  return chatCompletion.choices[0]?.message?.content || '';
}

// Native Web Request type (no 'next/server' import required)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const prompt = (formData.get('prompt') as string) || 'Summarize and extract key facts from this document.';

    if (!file) {
      return Response.json({ error: 'No document uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // TIER 1: Gemini Multimodal Fallback
    for (const model of GEMINI_MODELS) {
      try {
        const analysis = await callGemini(model, prompt, buffer, file.type);
        return Response.json({
          success: true,
          provider: 'Google Gemini',
          modelUsed: model,
          analysis,
        });
      } catch (err: any) {
        console.warn(`Gemini (${model}) failed: ${err?.message}. Retrying...`);
        await sleep(1000);
      }
    }

    // TIER 2: Extract text & Groq Fallback
    let extractedText = '';
    if (file.type === 'application/pdf') {
      const parser = new PDFParse({ data: buffer });
      try {
        const pdfData = await parser.getText();
        extractedText = pdfData.text;
      } finally {
        await parser.destroy();
      }
    } else {
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      throw new Error('Could not extract readable text from document.');
    }

    for (const model of GROQ_MODELS) {
      try {
        const analysis = await callGroq(model, prompt, extractedText);
        return Response.json({
          success: true,
          provider: 'Groq',
          modelUsed: model,
          analysis,
        });
      } catch (err: any) {
        console.warn(`Groq (${model}) failed: ${err?.message}. Retrying...`);
        await sleep(1000);
      }
    }

    return Response.json({ error: 'All free tier limits hit.' }, { status: 429 });
  } catch (error: any) {
    return Response.json({ error: 'Processing failed', details: error.message }, { status: 500 });
  }
}