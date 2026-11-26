import { DietLogEntry } from '../types';

export interface LiteratureReference {
  id: number;
  stage: '痛點存在' | '理論依據' | '技術可行' | '系統評估';
  citation: string;
  url: string;
  finding: string;
  systemMapping: string;
}

export interface ModuleSpec {
  number: number;
  name: string;
  modality: string;
  refs: string;
  description: string;
  highlight: string;
}

export const PHASE_A_SURVEY_STATS = {
  decisionDifficultyRate: '84.2%',
  decisionTimeRate: '94.7%',
  decisionTimeRange: '5–30 分鐘',
  typicalBudget: '100–200 元',
  dashboardUrl: 'https://share.gemini.google/vvAP14LeTCJc',
};

export const TEAM_MEMBERS = [
  { id: 'D11455002', name: '蕭惠瀞', moduleRole: '模組 1｜情境語音點餐需求與 FCQ 選食動機標籤' },
  { id: 'D11555006', name: '陳儷方', moduleRole: '模組 2｜多模態拍照辨識與熱量／三大營養素估算' },
  { id: 'M11555002', name: '江宛臻', moduleRole: '模組 3｜3 選項個人化推薦、數位輕推與我的餐盤識讀' },
  { id: 'M11555018', name: '黃靖雯', moduleRole: '模組 4｜週飲食紀錄儀表板與 TAM 系統接受度評估' },
];

export const MODULE_SPECS: ModuleSpec[] = [
  {
    number: 1,
    name: '情境語音點餐需求',
    modality: '語音 → 文字',
    refs: '[3][4]',
    description: '透過中文語音辨識與情境標籤，快速收集預算（100–200 元）、時間、當下心情與飲食限制。',
    highlight: '依據 Food Choice Questionnaire [3] 九大選食動機設計情境條件，釐清偏好以克服選擇過載 [4]。',
  },
  {
    number: 2,
    name: '拍照辨識與營養估算',
    modality: '影像',
    refs: '[7][8][9]',
    description: '拍攝外食餐點或店家菜單看板，以多模態 AI 辨識菜色並估算熱量、三大營養素與蔬果份數。',
    highlight: '參照影像飲食評估流程 [7][8]，並依大模型營養誤差研究 [9] 明確標示「估算值僅供參考」。',
  },
  {
    number: 3,
    name: '個人化推薦（認知減負）',
    modality: '文字推理',
    refs: '[4][5][6]',
    description: '結合模組 1 情境、模組 2 影像與過去飲食紀錄，精準收斂出「3 個選項」並附上一句「我的餐盤」知識。',
    highlight: '刻意推薦 3 個選項而非 1 個答案或一長串清單 [4]，兼顧自主權與低認知負荷，定位為外食族營養識讀夥伴。',
  },
  {
    number: 4,
    name: '飲食紀錄儀表板',
    modality: '視覺化',
    refs: '[1][2]',
    description: '視覺化呈現一週外食的營養均衡（含 3 蔬 2 果檢核）、單餐花費趨勢、決策耗時縮短幅度與飲食多樣性。',
    highlight: '直接回應台灣職場八成未達三蔬二果 [1] 與全國外食高比例 [2] 的在地健康痛點。',
  },
];

export const LITERATURE_REFERENCES: LiteratureReference[] = [
  {
    id: 1,
    stage: '痛點存在',
    citation: '衛生福利部國民健康署（2011）。100 年全國職場健康促進暨菸害防制調查結果（外食與蔬果攝取）。衛生福利部網站。',
    url: 'https://www.hpa.gov.tw/',
    finding: '針對 15 歲以上專職員工分層隨機抽樣（N = 6,065），八成以上員工每日未達「3 蔬 2 果」，近七成午餐外食，且外食比例逐年上升。',
    systemMapping: '對應模組 4 儀表板「3 蔬 2 果達標追蹤」與模組 3 補菜輕推策略（引註 2011 年資料並搭配 [2] 較新調查）。',
  },
  {
    id: 2,
    stage: '痛點存在',
    citation: '潘文涵（計畫主持人）（2022）。國民營養健康狀況變遷調查（106–109 年）成果報告。衛生福利部國民健康署委託研究計畫。',
    url: 'https://www.hpa.gov.tw/',
    finding: '台灣官方全國性營養調查指出，學生與青年族群外食比例偏高，七到九成每天至少一餐外食，亟需外食營養識讀輔助。',
    systemMapping: '支撐本系統鎖定「每日外食上班族與學生」之高頻剛需與「我的餐盤」日常教育定位。',
  },
  {
    id: 3,
    stage: '理論依據',
    citation: 'Steptoe, A., Pollard, T. M., & Wardle, J. (1995). Development of a measure of the motives underlying the selection of food: The Food Choice Questionnaire. Appetite, 25(3), 267–284.',
    url: 'https://doi.org/10.1006/appe.1995.0061',
    finding: '以 358 位 18–87 歲成人進行因素分析，歸納九個核心選食動機：健康、情緒、便利、感官吸引力、天然成分、價格、體重控制、熟悉度、道德考量。',
    systemMapping: '作為前期問卷設計與模組 1 情境標籤（預算、時間、心情、健康/減脂訴求）之理論基礎。',
  },
  {
    id: 4,
    stage: '理論依據',
    citation: 'Scheibehenne, B., Greifeneder, R., & Todd, P. M. (2010). Can there ever be too many options? A meta-analytic review of choice overload. Journal of Consumer Research, 37(3), 409–425.',
    url: 'https://doi.org/10.1086/651235',
    finding: '整合分析 50 篇實驗共 63 個條件（N = 5,036），平均效果量接近零但研究間差異顯著；文中明確指出「缺乏既有偏好」是引發選擇過載的關鍵前提。',
    systemMapping: '誠實引用此篇：正因外食族在疲憊時偏好不明確，先由模組 1 釐清需求，再由模組 3 收斂為「3 個精準選項」最有意義。',
  },
  {
    id: 5,
    stage: '技術可行',
    citation: 'Trattner, C., & Elsweiler, D. (2017). Food recommender systems: Important contributions, challenges and future research directions. arXiv preprint arXiv:1711.02760.',
    url: 'https://arxiv.org/abs/1711.02760',
    finding: '回顧食物推薦系統的演進與挑戰，指出兼具健康意識的推薦系統是引導使用者改善飲食選擇的重要方法。',
    systemMapping: '支撐模組 3 在推薦排序中同時權衡個人偏好與健康均衡指標。',
  },
  {
    id: 6,
    stage: '技術可行',
    citation: 'Min, W., Jiang, S., Liu, L., Rui, Y., & Jain, R. (2019). A survey on food computing. ACM Computing Surveys, 52(5), Article 92.',
    url: 'https://doi.org/10.1145/3329168',
    finding: '系統性定義「食物運算（Food Computing）」框架，串聯感知、辨識、檢索、推薦與健康監測五大異質資料任務。',
    systemMapping: '作為本系統「語音＋影像輸入 → 營養辨識 → 推薦 → 週紀錄追蹤」全鏈路架構藍圖。',
  },
  {
    id: 7,
    stage: '技術可行',
    citation: 'Dalakleidi, K. V., Papadelli, M., Kapolos, I., & Papadimitriou, K. (2022). Applying image-based food-recognition systems on dietary assessment: A systematic review. Advances in Nutrition, 13(6), 2590–2619.',
    url: 'https://doi.org/10.1093/advances/nmac078',
    finding: '確立影像式飲食評估標準流程：拍照 → 辨識食物類別 → 估算份量 → 推算熱量與營養素。',
    systemMapping: '直接對應模組 2 的多模態影像辨識與營養素輸出介面。',
  },
  {
    id: 8,
    stage: '技術可行',
    citation: 'Lo, F. P.-W., Qiu, J., Wang, Z., Chen, J., Xiao, B., Yuan, W., Giannarou, S., Frost, G., & Lo, B. (2023). Dietary assessment with multimodal ChatGPT: A systematic analysis. arXiv preprint arXiv:2312.08592.',
    url: 'https://arxiv.org/abs/2312.08592',
    finding: '證實通用多模態大型語言模型不需針對食物資料額外微調即可達到最高 87.5% 辨識準確率，且能參照周遭物品估算份量。',
    systemMapping: '驗證本系統採用通用多模態生成式 AI（Gemini）直接辨識台灣外食餐點與菜單的技術可行性。',
  },
  {
    id: 9,
    stage: '技術可行',
    citation: 'Fridolfsson, J., Sjöberg, E., Thiwång, M., & Pettersson, S. (2025). Performance evaluation of 3 large language models for nutritional content estimation from food images. Current Developments in Nutrition, 107556.',
    url: 'https://doi.org/10.1016/j.cdnut.2025.107556',
    finding: '實測比較 GPT-4o、Claude 3.5 Sonnet 與 Gemini 1.5 Pro 的食物影像營養估算誤差（熱量 MAPE 約 35.8%，且 Gemini 在單純估算上誤差較明顯）。',
    systemMapping: '誠實呈現技術限制：本系統雖然串接 Gemini API 以利課程原型整合，但於畫面清楚標註「AI 估算值僅供參考」。',
  },
  {
    id: 10,
    stage: '系統評估',
    citation: 'Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319–340.',
    url: 'https://doi.org/10.2307/249008',
    finding: '提出科技接受模型（TAM），透過「知覺有用性（PU）」與「知覺易用性（PEOU）」預測使用者實際採納行為。',
    systemMapping: '於系統內建 TAM 體驗回饋問卷模組，完成「前期需求調查 → 系統實作 → 接受度評估」研究閉環。',
  },
];

// Demo 1-week baseline records for Module 4 visualization before user logs enough meals
export const SEED_DIET_LOGS: DietLogEntry[] = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 4 * 86400000,
    selectedOptionTitle: '滷雞腿便當（飯減 1/3、去皮、雙深綠菜）',
    detectedName: '台式滷雞腿便當',
    category: '外食便當',
    price: 125,
    calories: 610,
    macros: { protein: 30, carbs: 66, fat: 18 },
    vegServings: 1.8,
    fruitServings: 0,
    decisionSeconds: 38,
    tone: 'dietitian',
    isDemo: true,
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 3 * 86400000,
    selectedOptionTitle: '陽春湯麵（小）＋ 燙大陸妹 ＋ 滷蛋豆干雙拼',
    detectedName: '巷口小吃攤菜單',
    category: '麵食小吃',
    price: 135,
    calories: 540,
    macros: { protein: 27, carbs: 64, fat: 16 },
    vegServings: 1.5,
    fruitServings: 0.5,
    decisionSeconds: 45,
    tone: 'partner',
    isDemo: true,
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 2 * 86400000,
    selectedOptionTitle: '舒肥雞胸肉 ＋ 烤地瓜 ＋ 和風生菜沙拉',
    detectedName: '超商高蛋白輕食組',
    category: '超商輕食',
    price: 148,
    calories: 445,
    macros: { protein: 34, carbs: 48, fat: 11 },
    vegServings: 1.4,
    fruitServings: 1.0,
    decisionSeconds: 29,
    tone: 'dietitian',
    isDemo: true,
  },
  {
    id: 'demo-4',
    timestamp: Date.now() - 1 * 86400000,
    selectedOptionTitle: '臭豆腐分食一半 ＋ 鹽水雞花椰菜木耳 ＋ 無糖茶',
    detectedName: '夜市脆皮臭豆腐',
    category: '夜市平衡搭',
    price: 155,
    calories: 470,
    macros: { protein: 26, carbs: 34, fat: 22 },
    vegServings: 2.0,
    fruitServings: 0,
    decisionSeconds: 52,
    tone: 'frank',
    isDemo: true,
  },
];
