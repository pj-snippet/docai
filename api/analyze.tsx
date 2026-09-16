// api/analyze.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Your Gemini / Groq processing logic here
    return res.status(200).json({ analysis: 'Success output' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}