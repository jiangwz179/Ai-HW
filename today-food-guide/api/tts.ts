import { synthesizeSpeechWithGemini } from '../lib/geminiService';

export default async function handler(
  req: { method?: string; body?: any },
  res: { status: (code: number) => { json: (data: any) => void } }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: '請提供要朗讀的文字' });
  }

  try {
    const result = await synthesizeSpeechWithGemini(req.body);
    return res.status(200).json(result);
  } catch {
    return res.status(200).json({ fallbackBrowserTTS: true });
  }
}
