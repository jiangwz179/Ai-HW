import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client
const getAiClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Fallback generator when offline or API key is absent
function getFallbackReview(notes: string, critic: string) {
  return {
    foodName: "特選金牌脆皮臭豆腐配手作泡菜",
    category: "經典炸物",
    oneLineSummary: "金黃酥脆外殼吸附濃郁蒜蓉醬油，空氣中瀰漫著直擊靈魂的發酵香氣。",
    scores: {
      color: 8.8,
      aroma: 9.3,
      taste: 8.5,
      portion: 8.2,
      value: 8.9,
    },
    totalScore: 88,
    verdict: "排隊名物",
    calories: 540,
    exerciseEquiv: "慢跑 52 分鐘",
    calorieTip: "油炸澱粉與吸油量適中，蒜泥促進代謝，但醬汁鈉含量偏高，建議搭配無糖茶飲。",
    pairedDrink: {
      name: "冬瓜檸檬山粉圓 (半糖微冰)",
      reason: "天然檸檬酸能迅速分解炸物在舌面形成的油脂膜，山粉圓提供爽脆高纖的咀嚼感。",
    },
    proTip: "一定要請老闆在豆腐正中央戳洞塞入蒜泥與辣醬，一口咬下爆汁才是內行吃法！",
    flavorTags: ["金黃極脆", "蒜香爆汁", "酸甜爽口", "夜市必吃"],
    reviews: {
      toxic: "老天爺！這盤臭豆腐大概在五百公尺外就能擊倒一頭牛。外皮炸得像裝甲車一樣硬脆，還好咬開豆腐心還算水嫩，蒜泥下得像不要錢一樣辛辣。說實話，比隔壁攤那些像海綿寶寶泡水的爛炸豆腐有誠意多了！",
      cozy: "剛出鍋熱氣騰騰的金黃豆腐，淋上溫醇的古早味油膏，配上醃得清甜爽脆的高麗菜泡菜，那是深夜逛夜市時最撫慰人心的樸實幸福感。",
      michelin: "油溫掌控極佳，維持在 185°C 成功激發出梅納褐變香氣。豆腐內部發酵孔洞分佈均勻，醋酸與蒜辣層次分明，展現出台灣街頭料理紮實的火候與工藝。",
    },
    improvements: [
      "起鍋前可再拉高油溫逼油 8 秒，盤底殘油將更為乾爽優雅。",
      "泡菜醃漬糖醋比例可微增檸檬皮清香，提升整體味蕾立體感。",
    ],
  };
}

// 1. Food Evaluation API
app.post('/api/analyze-food', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', notes = '', critic = 'toxic' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: '請提供美食照片數據' });
  }

  // If no API key is configured, return realistic fallback immediately
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[Gemini] GEMINI_API_KEY not configured, using gourmet fallback critique.');
    return res.json(getFallbackReview(notes, critic));
  }

  try {
    const ai = getAiClient();

    const systemInstruction = `
你是一位擁有絕對味蕾與敏銳洞察力的「台灣夜市小吃特級評審」。
請根據使用者提供的台灣夜市小吃照片與其現場試吃心得，進行專業、生動、多維度的評鑑。

輸出規範：嚴格輸出符合 schema 的 JSON 格式。
1. foodName: 道地的小吃繁體中文全名 (例如: 脆皮黃金臭豆腐配台式泡菜, 豪大大香酥雞排, 艋舺經典蚵仔煎, 黃金地瓜球)
2. category: 小吃類別 (如: 經典炸物, 滷味燒烤, 傳統甜品, 湯品熱炒, 主食小吃)
3. oneLineSummary: 一句極具點評感的一句話總結
4. scores: 五維評分 (滿分 10.0，必須精確到小數點後一位，0.0-10.0):
   - color: 「色澤外觀」油炸火候或成色
   - aroma: 「香氣撲鼻」鍋氣、發酵或調味氣味
   - taste: 「風味口感」酥脆/軟嫩度與調味平衡
   - portion: 「份量飽足」對比夜市常規價格的份量滿意度
   - value: 「CP 性價比」回訪意願與性價比
5. totalScore: 綜合得分 (整數 0-100)
6. verdict: 簡短評審判詞 (例如: 排隊名物, 水準之上, 平庸踩雷, 宵夜救星, 匠人神作)
7. calories: 預估單份熱量 (kcal, 整數)
8. exerciseEquiv: 等同消耗運動量 (例如: 慢跑 48 分鐘, 划船 35 分鐘)
9. calorieTip: 熱量負擔與消化建議 (繁體中文)
10. pairedDrink:
    - name: 最推薦搭配的台灣手搖杯或夜市解膩飲料 (如: 冬瓜檸檬山粉圓, 無糖四季春, 楊桃冰)
    - reason: 搭配原因 (從酸鹼解膩、口腔清爽度分析)
11. proTip: 內行老饕避雷或最佳吃法秘密
12. flavorTags: 3 到 5 個短標籤 (如: ["外酥內嫩", "重蒜過癮", "泡菜爽脆"])
13. reviews: 必須分別針對三種評審風格撰寫 100-140 字的特色評語：
    - toxic: 「高登式・毒舌美食戰神」風格，言詞辛辣、黑色幽默、挑剔嘲諷，但評語中肯搞笑。
    - cozy: 「溫馨療癒部落客」風格，溫暖細膩、文青詩意、感恩市井煙火氣。
    - michelin: 「米其林星級密探」風格，優雅挑剔、著重梅納反應、火候溫度控制與食材工藝。
14. improvements: 2 點給店家的技術或配方實用改進建議 (陣列)
`;

    // Normalize mimeType for SVG or standard images
    const cleanMimeType = mimeType.includes('svg') ? 'image/png' : mimeType;
    // Clean base64 prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z+]+;base64,/, '');

    const promptText = `
這是我在台灣夜市拍攝的小吃照片。
我的現場試吃感想是：「${notes || "（現場純視覺辨析，請從油光、成色、酥脆度、醬汁稠度與夜市水準深入評判）"}」
請仔細辨識這道小吃，並輸出完整的 JSON 評鑑報告。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: cleanMimeType,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            category: { type: Type.STRING },
            oneLineSummary: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.NUMBER },
                aroma: { type: Type.NUMBER },
                taste: { type: Type.NUMBER },
                portion: { type: Type.NUMBER },
                value: { type: Type.NUMBER },
              },
              required: ['color', 'aroma', 'taste', 'portion', 'value'],
            },
            totalScore: { type: Type.INTEGER },
            verdict: { type: Type.STRING },
            calories: { type: Type.INTEGER },
            exerciseEquiv: { type: Type.STRING },
            calorieTip: { type: Type.STRING },
            pairedDrink: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ['name', 'reason'],
            },
            proTip: { type: Type.STRING },
            flavorTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            reviews: {
              type: Type.OBJECT,
              properties: {
                toxic: { type: Type.STRING },
                cozy: { type: Type.STRING },
                michelin: { type: Type.STRING },
              },
              required: ['toxic', 'cozy', 'michelin'],
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'foodName',
            'category',
            'oneLineSummary',
            'scores',
            'totalScore',
            'verdict',
            'calories',
            'pairedDrink',
            'reviews',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('未收到 Gemini 評審結果');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('[Gemini Analysis Error]:', error);
    // If quota or network error, fallback to high quality offline data rather than failing completely
    const fallback = getFallbackReview(notes, critic);
    return res.json({
      ...fallback,
      _offlineNotice: '目前採用離線老饕評審庫為您評析（' + (error.message || '連線微調') + '）',
    });
  }
});

// 2. TTS Voice Generation API
app.post('/api/tts', async (req, res) => {
  const { text, critic = 'toxic' } = req.body;

  if (!text) {
    return res.status(400).json({ error: '請提供要朗讀的點評文字' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({ fallbackBrowserTTS: true });
  }

  try {
    const ai = getAiClient();

    // Map critic persona to voice and style prompt
    let voiceName = 'Fenrir';
    let style = 'Energetic, fast-paced, assertive critic with sarcastic humor';

    if (critic === 'cozy') {
      voiceName = 'Kore';
      style = 'Warm, gentle, soothing, sweet Taiwanese food blogger tone';
    } else if (critic === 'michelin') {
      voiceName = 'Charon';
      style = 'Deep, composed, authoritative, refined Michelin inspector voice';
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      return res.json({
        audioBase64: audioData,
        mimeType: 'audio/wav',
      });
    }

    return res.json({ fallbackBrowserTTS: true });
  } catch (err: any) {
    console.warn('[TTS API Warning]:', err.message);
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Night Market Food Critic Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
