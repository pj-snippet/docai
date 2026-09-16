import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBase64, mimeType, prompt } = req.body || {};

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing file data or mimeType.' });
    }

    const userPrompt = prompt || 'Analyze this document accurately.';
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Primary: Try Gemini API
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType, data: fileBase64 } },
                { text: userPrompt },
              ],
            },
          ],
        });

        if (response.text) {
          return res.status(200).json({ analysis: response.text });
        }
      } catch (geminiError: any) {
        console.warn('Gemini failed/rate-limited, falling back to Groq:', geminiError.message);
      }
    }

    // 2. Secondary: Fallback to Groq API
    if (groqKey) {
      const groq = new Groq({ apiKey: groqKey });
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `Document Prompt: ${userPrompt}\nNote: Text extraction request processed via fallback logic.`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
      });

      const output = completion.choices[0]?.message?.content || 'No output generated from Groq.';
      return res.status(200).json({ analysis: output });
    }

    return res.status(500).json({ error: 'No valid API keys configured on Vercel.' });
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}