<div align="center">

# 🍱 今日食光導覽員（TodayFoodGuide AI）

### 多模態 AI 外食決策與營養導覽系統 — 用拍照與語音告別「不知道吃什麼」

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-API-4285F4?logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel&logoColor=white)

[A 階段前期調研儀表板](https://share.gemini.google/vvAP14LeTCJc) · [應用程式專案目錄](./today-food-guide/)

</div>

---

## 1. 專題簡介與重新定位

**【今日食光導覽員】** 是一個針對台灣外食上班族與大專學生設計的「外食決策輔助與營養識讀學習夥伴」。
系統整合**語音情境理解**、**多模態食物／菜單影像辨識**、**數位輕推（3 選項收斂推薦）**與**週飲食紀錄儀表板**，不僅協助使用者在 **100–200 元**預算內快速決定要吃什麼，更在每次推薦附上一句國健署「我的餐盤」營養知識，讓選餐過程成為日常營養識讀微學習。

---

## 2. 問題背景與痛點（A 階段問卷實證）

根據本組於 A 階段收集之外食族前期調研問卷與[調研儀表板](https://share.gemini.google/vvAP14LeTCJc)數據：

- **決策困難普遍存在**：高達 **84.2%** 的受訪者經常面臨飲食決策困難（「不知道吃什麼」）。
- **決策時間成本極高**：**94.7%** 的受訪者每次需花費 **5–30 分鐘** 才能決定餐點，重複性飲食選擇加劇日常決策疲勞。
- **預算與營養失衡雙重受限**：多數外食族單餐預算集中於 **100–200 元**，且根據台灣官方全國調查，八成以上職場員工每日未達「3 蔬 2 果」[1]，七至九成學生與青年每天至少一餐外食 [2]。

---

## 3. 四大 AI 功能模組（含模態與文獻對應）

| 編號 | 功能模組 | 核心功能說明 | 模態 | 文獻依據 |
|---|---|---|---|---|
| **模組 1** | **情境語音點餐需求** | 透過中文語音辨識（`zh-TW`）與快速情境標籤，說出／點選單餐預算（100–200 元）、可用時間、選食動機與飲食限制（如少油、補青菜、不辣） | `語音 → 文字` | `[3][4]` |
| **模組 2** | **拍照辨識與營養估算** | 拍攝外食餐點或店家菜單看板，以多模態 AI 辨識菜色、估算熱量、三大營養素（P/C/F）與「我的餐盤」缺口；依實證研究標示「估算值僅供參考」 | `影像` | `[7][8][9]` |
| **模組 3** | **個人化推薦（認知減負）** | 結合模組 1 情境、模組 2 影像與過去紀錄，刻意收斂為 **3 個精準選項**（而非單一強制答案或一長串清單），搭配數位輕推排序與一句「我的餐盤」營養識讀知識，支援三種語氣語音導覽 | `文字推理` | `[4][5][6]` |
| **模組 4** | **飲食紀錄儀表板** | 視覺化呈現一週外食的營養均衡度（3 蔬 2 果達標率）、單餐花費趨勢、決策耗時縮短幅度（秒 vs 問卷 5–30 分）與飲食多樣性反思回饋 | `視覺化` | `[1][2]` |

> 系統另內建 **TAM 科技接受模型回饋問卷（`[10]`）** 與 **理論與文獻支持分頁**，完整串聯「需求調查 → 系統開發 → 接受度評估」研究閉環。

---

## 4. 十篇核心文獻依據

文獻依 **「痛點存在 → 理論依據 → 技術可行 → 系統評估」** 邏輯排列：

### A. 痛點存在（台灣在地數據）
- **[1]** 衛生福利部國民健康署（2011）。100 年全國職場健康促進暨菸害防制調查結果（外食與蔬果攝取）。衛生福利部網站。
  - **支持論點**：以 15 歲以上專職員工分層隨機抽樣（N = 6,065），八成以上員工每日未達 3 蔬 2 果，近七成午餐外食。（註：2011 年調查，搭配 `[2]` 較新資料）
- **[2]** 潘文涵（計畫主持人）（2022）。國民營養健康狀況變遷調查（106–109 年）成果報告。衛生福利部國民健康署委託研究計畫。
  - **支持論點**：官方全國性營養調查顯示，青少年與青年族群外食比例偏高，七到九成每天至少一餐外食，凸顯外食營養均衡導覽的迫切性。

### B. 理論依據（選食動機與選擇過載）
- **[3]** Steptoe, A., Pollard, T. M., & Wardle, J. (1995). Development of a measure of the motives underlying the selection of food: The Food Choice Questionnaire. *Appetite*, 25(3), 267–284. https://doi.org/10.1006/appe.1995.0061
  - **支持論點**：歸納出九個選食動機（健康、情緒、便利、感官吸引力、天然成分、價格、體重控制、熟悉度、道德考量），作為問卷與模組 1 情境條件設計基礎。
- **[4]** Scheibehenne, B., Greifeneder, R., & Todd, P. M. (2010). Can there ever be too many options? A meta-analytic review of choice overload. *Journal of Consumer Research*, 37(3), 409–425. https://doi.org/10.1086/651235
  - **支持論點與誠實引用**：統合分析 50 篇實驗（63 個條件，N = 5,036）指出平均效果量接近零，但「缺乏既有偏好」是引發選擇過載的重要前提。因此本系統先以模組 1 釐清需求，再於模組 3 將選擇收斂為 **3 個選項**。

### C. 技術可行（食物推薦與食物運算架構）
- **[5]** Trattner, C., & Elsweiler, D. (2017). Food recommender systems: Important contributions, challenges and future research directions. *arXiv preprint arXiv:1711.02760*. https://arxiv.org/abs/1711.02760
  - **支持論點**：具健康意識的推薦系統是引導使用者做出更健康飲食選擇的重要途徑，支撐模組 3 兼顧偏好與均衡的推薦邏輯。
- **[6]** Min, W., Jiang, S., Liu, L., Rui, Y., & Jain, R. (2019). A survey on food computing. *ACM Computing Surveys*, 52(5), Article 92. https://doi.org/10.1145/3329168
  - **支持論點**：提出「食物運算（Food Computing）」框架，整合食物感知、辨識、檢索、推薦與健康監測，作為系統整體架構依據。

### D. 技術可行（多模態影像辨識與 AI 營養估算）
- **[7]** Dalakleidi, K. V., Papadelli, M., Kapolos, I., & Papadimitriou, K. (2022). Applying image-based food-recognition systems on dietary assessment: A systematic review. *Advances in Nutrition*, 13(6), 2590–2619. https://doi.org/10.1093/advances/nmac078
  - **支持論點**：歸納「拍照 → 辨識食物 → 估算份量 → 推算熱量與營養素」標準流程，直接對應模組 2。
- **[8]** Lo, F. P.-W., Qiu, J., Wang, Z., Chen, J., Xiao, B., Yuan, W., Giannarou, S., Frost, G., & Lo, B. (2023). Dietary assessment with multimodal ChatGPT: A systematic analysis. *arXiv preprint arXiv:2312.08592*. https://arxiv.org/abs/2312.08592
  - **支持論點**：證實多模態 LLM 不需額外微調即可達到最高 87.5% 食物辨識準確率，並可透過周遭物件估算份量。
- **[9]** Fridolfsson, J., Sjöberg, E., Thiwång, M., & Pettersson, S. (2025). Performance evaluation of 3 large language models for nutritional content estimation from food images. *Current Developments in Nutrition*, 107556. https://doi.org/10.1016/j.cdnut.2025.107556
  - **支持論點**：比較 ChatGPT-4o、Claude 3.5 Sonnet 與 Gemini 1.5 Pro 的影像營養估算誤差（熱量 MAPE 約 35.8%，且 Gemini 誤差相對較高）。本系統據此明確於介面標示「**AI 營養估算值僅供參考**」。

### E. 系統評估（科技接受模型）
- **[10]** Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. *MIS Quarterly*, 13(3), 319–340. https://doi.org/10.2307/249008
  - **支持論點**：以知覺有用性（PU）與知覺易用性（PEOU）評估資訊系統採納意願，實作於本系統「TAM 體驗回饋問卷」模組。

---

## 5. 技術架構與目錄結構

| 層級 | 技術選型 |
|---|---|
| 前端 | React 19、TypeScript、Vite 8、Tailwind CSS 4、lucide-react、canvas-confetti |
| 後端 / 部署 | Express 4（本機開發）＋ Vercel Serverless Functions（`api/*.ts` ＋ `vercel.json`） |
| 多模態 AI | `@google/genai` — `gemini-3.8-flash`（影像辨識與 3 選項推理）、`gemini-3.8-flash-lite-tts`（語音導覽） |
| 瀏覽器 API | Web Speech API（`zh-TW` 語音需求輸入）、Web Speech Synthesis（TTS 備援）、`localStorage`（週紀錄與 TAM 問卷） |

```text
today-food-guide/
├── api/                         # Vercel Serverless API 入口
│   ├── analyze-food.ts
│   └── tts.ts
├── lib/
│   └── geminiService.ts         # 共用 Gemini 多模態分析、3 選項收斂與離線備援邏輯
├── server.ts                    # 本機 Express + Vite 開發伺服器
├── vercel.json                  # Vercel 部署路由設定
└── src/
    ├── App.tsx                  # 主工作區（模組 1–3 串接與語音導覽）
    ├── types.ts                 # 多模態分析、3 選項推薦、週紀錄與 TAM 型別
    ├── data/
    │   ├── samples.ts           # 4 款台灣外食與菜單採樣範例
    │   └── literature.ts        # 10 篇文獻、前期數據、4 模組定義與示範週紀錄
    └── components/
        ├── CameraModal.tsx      # 餐點／菜單即時相機拍攝
        ├── RadarChart.tsx       # 營養與決策五維雷達圖
        ├── WeeklyDashboard.tsx  # 模組 4：週飲食營養、花費與決策耗時儀表板
        ├── LiteraturePanel.tsx  # 理論定位與 10 篇文獻支持檢視頁
        └── TamSurveyModal.tsx   # TAM 系統接受度回饋問卷 [10]
```

---

## 6. 本機執行與 Vercel 部署

### 本機開發（Node.js 20+）

```bash
cd today-food-guide
npm install
cp .env.example .env
# 在 .env 中填入 GEMINI_API_KEY（未設定時會自動啟用離線範例導覽資料庫）
npm run dev
```

開啟 `http://localhost:3000` 即可使用。

### Vercel 部署

1. 於 Vercel 匯入此 GitHub Repository，將 **Root Directory** 設為 `today-food-guide`。
2. 在 Vercel Environment Variables 新增 `GEMINI_API_KEY`。
3. 部署完成即可獲得公開展示網址（支援 `/api/analyze-food` 與 `/api/tts`）。

---

## 7. 小組成員與 GitHub 協作分工

| 學號 | 姓名 | 負責模組與任務 |
|---|---|---|
| `D11455002` | 蕭惠瀞 | 模組 1｜情境語音點餐需求與 FCQ 選食動機標籤 `[3][4]` |
| `D11555006` | 陳儷方 | 模組 2｜多模態拍照辨識與熱量／三大營養素估算 `[7][8][9]` |
| `M11555002` | 江宛臻 | 模組 3｜3 選項個人化推薦、數位輕推與我的餐盤識讀 `[4][5][6]` |
| `M11555018` | 黃靖雯 | 模組 4｜週飲食紀錄儀表板 `[1][2]` 與 TAM 系統接受度評估 `[10]` |

### GitHub Collaborators 設定檢查清單
- [ ] 已於 GitHub Repo `Settings → Collaborators` 邀請全體 4 位組員
- [ ] 已邀請授課老師（`johnliontw.ad@gmail.com`）為 Collaborator
- [ ] 各組員透過獨立 Branch 開發模組功能並 Merge 至 `main`，保留分工協作 Commit 紀錄
