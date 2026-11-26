import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { analyzeFoodWithGemini, synthesizeSpeechWithGemini } from './lib/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. Multimodal Food & Menu Analysis + 3-Option Recommendation API
app.post('/api/analyze-food', async (req, res) => {
  const { imageBase64 } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ error: '請提供餐點或菜單照片數據' });
  }

  try {
    const result = await analyzeFoodWithGemini(req.body);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || '分析失敗' });
  }
});

// 2. TTS Voice Guide API
app.post('/api/tts', async (req, res) => {
  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: '請提供要朗讀的文字' });
  }

  try {
    const result = await synthesizeSpeechWithGemini(req.body);
    return res.json(result);
  } catch (err: any) {
    return res.json({ fallbackBrowserTTS: true });
  }
});

// Dev or Production Static Handler
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TodayFoodGuide Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
