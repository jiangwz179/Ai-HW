<div align="center">

# 🌃 夜市小吃評審官

### Night Market Food Critic — AI 台灣夜市小吃評鑑系統

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-API-4285F4?logo=google&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)

拍一張照片，讓三位個性截然不同的評審官幫你的夜市小吃打分數。

[AI Studio 原始應用程式](https://ai.studio/apps/43030136-d556-4172-bc53-2db4e3b4cf5a) · [專案資料夾](./%E5%A4%9C%E5%B8%82%E5%B0%8F%E5%90%83%E8%A9%95%E5%AF%A9%E5%AE%98-(night-market-food-critic)/)

</div>

---

## ✨ 功能特色

| 功能 | 說明 |
|---|---|
| 📷 小吃採樣 | 即時鏡頭、相簿上傳或拖曳照片；內建四款試玩範例（臭豆腐、雞排、蚵仔煎、地瓜球） |
| 🎙️ 試吃心得 | 文字輸入、中文語音辨識（`zh-TW`）與常用標籤一鍵插入 |
| 🧑‍⚖️ 三種評審人設 | 毒舌、溫馨、米其林三種風格，各自有專屬語氣、配色與語音角色 |
| 📊 五維感官雷達圖 | 色澤、香氣、味道、份量、CP 值，滿分 10.0 |
| 🔥 熱量罪惡值 | 預估熱量、運動等效時間與飲食建議 |
| 🧋 解膩手搖飲 | 針對油脂與口感推薦搭配飲料並說明原因 |
| 💡 內行避雷秘訣 | 老饕吃法，以及翻卡可見的店家技術改善建議 |
| 🔊 AI 語音講評 | Gemini TTS 依人設朗讀；失敗時自動退回瀏覽器語音合成 |
| 🗂️ 評審紀錄 | 最近 20 筆紀錄保存於 `localStorage`，可查看、回載、單筆或全部刪除 |
| 📋 一鍵分享 | 複製格式化評審報告文字 |
| 🎧 夜市氛圍 | 油鍋嘶嘶環境音、蓋章音效、高分彩色紙屑與 CRT 掃描線視覺 |

## 🧑‍⚖️ 今日當值評審

| 評審 | 風格 | 語音 | 口吻 |
|---|---|---|---|
| 🌶️ 高登式・毒舌美食戰神 | 辛辣吐槽、黑色幽默 | `Fenrir`（快、銳利） | 「連吸血鬼聞到這蒜泥都要連夜退租！」 |
| 🧁 溫馨療癒・巷弄美食部落客 | 溫暖詩意、市井煙火氣 | `Kore`（柔、甜） | 「酥脆與溫潤在舌尖化開，那是歸家般的踏實慰藉。」 |
| ⭐ 米其林密探・挑剔評鑑特派員 | 火候、梅納反應、工藝分析 | `Charon`（沉穩、權威） | 「油溫控制與發酵菌種展現出成熟的街頭熟成工藝。」 |

## 🔄 操作流程

1. 選擇評審風格。
2. 拍攝／上傳小吃照片（或點「試玩範例小吃」），可補充試吃心得。
3. 點「召喚評審開始評分」，等待三段式分析動畫。
4. 查看雷達圖、熱量、飲品搭配與語音點評；可翻卡看改善建議、複製報告或存入紀錄。

## 🛠️ 技術架構

| 層級 | 技術 |
|---|---|
| 前端 | React 19、TypeScript、Vite 8、Tailwind CSS 4、Motion、lucide-react |
| 後端 | Express 4（與 Vite middleware 整合） |
| AI | `@google/genai` — `gemini-3.8-flash`（圖片評鑑）、`gemini-3.8-flash-lite-tts`（語音） |
| 其他 | canvas-confetti、Web Speech API、Web Speech Synthesis |
| 資料儲存 | 瀏覽器 `localStorage`（評審紀錄），API 金鑰僅存在於伺服器環境變數 |

## 🚀 本機執行

需求：Node.js 20+（支援 npm）。

```bash
cd "夜市小吃評審官-(night-market-food-critic)"
npm install
cp .env.example .env
```

在 `.env` 中填入你的 Gemini API 金鑰：

```env
GEMINI_API_KEY="你的_Gemini_API_金鑰"
APP_URL="http://localhost:3000"
```

啟動開發伺服器：

```bash
npm run dev
```

瀏覽 http://localhost:3000 。鏡頭功能需在 `localhost` 或 HTTPS 環境下使用。

### 正式建置

```bash
npm run build
NODE_ENV=production npm start
```

### 可用指令

| 指令 | 說明 |
|---|---|
| `npm run dev` | 啟動 Vite + Express 開發伺服器 |
| `npm run build` | 建置前端並打包 `dist/server.js` |
| `npm run start` | 以正式模式啟動（請搭配 `NODE_ENV=production`） |
| `npm run preview` | 預覽 Vite 建置結果 |
| `npm run lint` | TypeScript 型別檢查 |
| `npm run clean` | 清除建置產物 |

## 🔌 API

| 端點 | 方法 | 請求 | 回應 |
|---|---|---|---|
| `/api/analyze-food` | POST | `{ imageBase64, mimeType, notes, critic }` | 結構化評鑑 JSON（見 `src/types.ts`） |
| `/api/tts` | POST | `{ text, critic }` | `{ audioBase64, mimeType }` 或 `{ fallbackBrowserTTS: true }` |

> 未設定 `GEMINI_API_KEY` 或 Gemini 連線失敗時，評鑑 API 會回傳內建的「離線老饕」範例報告，介面仍可完整操作與展示。

## 📁 目錄結構

```text
.
├── README.md
├── server.ts                  # Express API 與 Gemini 呼叫
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── public/
│   └── assets/aistudio/       # AI Studio 產生的靜態資源
└── src/
    ├── App.tsx                # 主介面與狀態管理
    ├── main.tsx
    ├── index.css
    ├── types.ts               # 評鑑結果型別
    ├── data/samples.ts        # 試玩範例小吃
    ├── utils/audio.ts         # 音效與環境音
    └── components/
        ├── CameraModal.tsx    # 即時鏡頭
        ├── HistoryModal.tsx   # 評審紀錄
        └── RadarChart.tsx     # 五維雷達圖
```

## 🔒 隱私與注意事項

- 照片與心得會傳送至 Google Gemini API 進行分析；請勿上傳含個資的影像。
- API 金鑰僅由後端讀取，`.env` 已被 `.gitignore` 排除，不會進到版本控制。
- 熱量、運動等效與營養建議為 AI 估算，僅供趣味參考，不為醫療或營養專業意見。
- 語音辨識與瀏覽器語音合成支援度依瀏覽器而異；不支援時仍可手動輸入文字。

---

<div align="center">

 made with 🏮 & Google AI Studio · [回到頂部](#-夜市小吃評審官)

</div>
