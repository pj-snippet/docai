import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};
    return res.status(200).json({ 
      analysis: `Test connection successful! Received prompt: "${prompt || 'None'}"` 
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}