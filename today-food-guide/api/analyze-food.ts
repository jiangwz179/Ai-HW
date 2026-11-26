import { analyzeFoodWithGemini } from '../lib/geminiService';

export default async function handler(
  req: { method?: string; body?: any },
  res: { status: (code: number) => { json: (data: any) => void } }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64 } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ error: '請提供餐點或菜單照片數據' });
  }

  try {
    const result = await analyzeFoodWithGemini(req.body);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || '分析失敗' });
  }
}
