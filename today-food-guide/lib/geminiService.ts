import { GoogleGenAI, Type } from '@google/genai';

export interface AnalyzeFoodPayload {
  imageBase64?: string;
  mimeType?: string;
  notes?: string;
  tone?: 'dietitian' | 'partner' | 'frank';
  context?: {
    budgetLabel?: string;
    timeLabel?: string;
    motives?: string[];
    restrictions?: string[];
  };
  recentSummary?: {
    avgPrice?: number;
    avgVegServings?: number;
    recentFoods?: string[];
  };
}

export interface TtsPayload {
  text?: string;
  tone?: 'dietitian' | 'partner' | 'frank';
}

const getAiClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'today-food-guide-app',
      },
    },
  });
};

export function getFallbackAnalysis(payload: AnalyzeFoodPayload) {
  const notes = payload.notes || '';
  const budgetLabel = payload.context?.budgetLabel || '100–150 元';
  const restrictions = payload.context?.restrictions?.join('、') || '無特別忌口';

  const isMenuSample = notes.includes('菜單') || notes.includes('麵攤') || notes.includes('價目');
  const isLightSample = notes.includes('雞胸') || notes.includes('超商') || notes.includes('地瓜');
  const isStinkyTofu = notes.includes('臭豆腐') || notes.includes('蒜泥');

  if (isMenuSample) {
    return {
      inputKind: 'menu',
      detectedName: '巷口台灣小吃攤綜合菜單（麵食・飯類・小菜）',
      category: '外食菜單辨識',
      summary: '菜單共有 15+ 項平價選項，容易引發選擇過載；已依您的預算與營養缺口收斂為 3 個最佳組合。',
      scores: {
        balance: 7.8,
        vegetable: 7.2,
        calorieControl: 8.1,
        satiety: 8.6,
        value: 9.2,
      },
      overallScore: 84,
      verdict: '高 CP 平價首選',
      estimatedPrice: 135,
      calories: 560,
      macros: {
        protein: 28,
        carbs: 68,
        fat: 18,
        fiberGrams: 7,
        vegServings: 1.5,
        fruitServings: 0,
      },
      myPlateCheck: {
        wholeGrains: true,
        protein: true,
        vegetables: true,
        fruit: false,
        dairyOrNuts: false,
      },
      recommendations: [
        {
          id: 'opt-nudge',
          badge: '🌟 數位輕推首選・營養最均衡',
          title: '陽春湯麵（小）＋ 燙大陸妹 ＋ 滷蛋豆干雙拼',
          estimatedPrice: 135,
          calories: 540,
          macros: { protein: 27, carbs: 64, fat: 16 },
          reason: `符合 ${budgetLabel} 預算與「${restrictions}」條件，把精緻澱粉減半並用豆蛋補齊蛋白質，同時補進一份深色蔬菜。`,
          nutritionTip: '國健署「我的餐盤」建議「菜比水果多一點」：點麵食時加點一份不淋肉燥的燙青菜，就能把蔬菜量拉到拳頭大！',
          actionHint: '點餐時請老闆燙青菜「少油膏、不加肉燥」，湯頭喝一半即可減少約 400mg 鈉攝取。',
          matchScore: 95,
        },
        {
          id: 'opt-cp',
          badge: '💰 高 CP 值飽足之選',
          title: '滷肉飯（小）＋ 蛤蜊冬瓜湯 ＋ 燙空心菜',
          estimatedPrice: 145,
          calories: 620,
          macros: { protein: 22, carbs: 74, fat: 24 },
          reason: '價格親民、出餐快速，熱湯配蔬菜能延長胃部飽足感，避免單吃滷肉飯導致血糖急升想睡。',
          nutritionTip: '飯跟蔬菜差不多大：白飯選擇小碗，搭配瓜類湯品與深綠葉菜，能減緩餐後血糖波動、維持下午專注力。',
          actionHint: '可選瘦肉較多的部位，並避免把湯裡的滷汁全拌入飯中。',
          matchScore: 88,
        },
        {
          id: 'opt-comfort',
          badge: '💛 暖心療癒・微調提案',
          title: '餛飩湯麵 ＋ 涼拌小黃瓜',
          estimatedPrice: 120,
          calories: 490,
          macros: { protein: 20, carbs: 62, fat: 15 },
          reason: '清湯口感溫潤不油膩，適合疲憊或趕時間時快速補充能量，花費壓在 120 元內。',
          nutritionTip: '豆魚蛋肉一掌心：餛飩內餡肉量通常只有約半掌心，建議下午可搭配一瓶無糖豆漿或茶葉蛋補足蛋白質。',
          actionHint: '涼拌小黃瓜可補充爽脆膳食纖維，記得留點胃口在餐後吃一顆拳頭大的水果（如芭樂或蘋果）。',
          matchScore: 84,
        },
      ],
      voiceScripts: {
        dietitian:
          '這張小吃攤菜單選項非常多，容易產生選擇困難。我已幫您收斂出三個最符合預算的組合，首推陽春湯麵搭配燙青菜與滷蛋豆干，總價約一百三十五元，蛋白質與蔬菜比例最均衡，記得燙青菜少油膏會更清爽！',
        partner:
          '辛苦了！面對整面菜單一定很煩惱吧？別想太多，我已經從中精選出三個一百五十元有找的好選擇。最推薦湯麵配燙青菜和豆干滷蛋，暖胃又有飽足感，餐後再補個小水果就很完美囉！',
        frank:
          '整面菜單看下來一半都是高油高鈉地雷！別再盯著菜單發呆五分鐘了，直接選一號組合：陽春麵配燙青菜跟豆干滷蛋，一百三十五元搞定，青菜叫老闆別淋肉燥，下午才不會在辦公桌前血糖昏迷！',
      },
      myPlateLesson: '外食點麵攤時，遵守「主食減半＋一份深色青菜＋一份豆蛋類」三步驟，就能輕鬆對齊國健署我的餐盤。',
      disclaimer: '熱量與三大營養素為多模態 AI 視覺估算值，受份量與烹調用油差異影響，僅供日常飲食參考 [9]。',
    };
  }

  if (isLightSample) {
    return {
      inputKind: 'meal',
      detectedName: '超商高蛋白地瓜雞胸輕食組合',
      category: '便利商店均衡組合',
      summary: '優質蛋白與原型澱粉配置完整，但蔬菜與水果仍有提升空間；已為您評估營養並提供 3 個外食接續決策選項。',
      scores: {
        balance: 8.9,
        vegetable: 7.4,
        calorieControl: 9.4,
        satiety: 8.3,
        value: 8.6,
      },
      overallScore: 91,
      verdict: '上班族高效率優選',
      estimatedPrice: 148,
      calories: 445,
      macros: {
        protein: 34,
        carbs: 48,
        fat: 11,
        fiberGrams: 6.5,
        vegServings: 1.2,
        fruitServings: 0.5,
      },
      myPlateCheck: {
        wholeGrains: true,
        protein: true,
        vegetables: true,
        fruit: false,
        dairyOrNuts: false,
      },
      recommendations: [
        {
          id: 'opt-nudge',
          badge: '🌟 數位輕推首選・直接採納＋補蔬果',
          title: '舒肥雞胸肉 ＋ 烤地瓜 ＋ 和風生菜沙拉（不沾滿醬）',
          estimatedPrice: 148,
          calories: 445,
          macros: { protein: 34, carbs: 48, fat: 11 },
          reason: `總價 ${budgetLabel} 內即可達成 34g 高蛋白質與原型根莖澱粉，熱量控管極佳，3 分鐘就能完成取餐。`,
          nutritionTip: '國健署「我的餐盤」口訣「飯跟蔬菜一樣多」：烤地瓜屬於全穀雜糧類，搭配一整盒生菜沙拉可兼顧飽足與膳食纖維。',
          actionHint: '和風醬汁先倒一半即可，可再拿一包無調味綜合堅果（約一茶匙）補充好油脂。',
          matchScore: 96,
        },
        {
          id: 'opt-cp',
          badge: '💰 高 CP 值省錢加飽足',
          title: '茶葉蛋 2 顆 ＋ 烤地瓜（中）＋ 無糖高纖豆漿',
          estimatedPrice: 105,
          calories: 430,
          macros: { protein: 28, carbs: 50, fat: 12 },
          reason: '百元出頭即可取得動植物雙重蛋白與膳食纖維，最適合月底精省或趕時間會議前補給。',
          nutritionTip: '早晚一杯奶／豆漿補充鈣質與優質蛋白，但記得下一餐多補兩份深綠色熟蔬菜以達成每日三蔬二果。',
          actionHint: '豆漿選無糖高纖版，避免含糖飲料增加額外精製糖負擔。',
          matchScore: 89,
        },
        {
          id: 'opt-comfort',
          badge: '💛 溫暖升級・有湯有菜',
          title: '關東煮白蘿蔔香菇玉米筍 ＋ 雞胸飯糰 ＋ 無糖綠茶',
          estimatedPrice: 139,
          calories: 465,
          macros: { protein: 24, carbs: 62, fat: 10 },
          reason: '天氣偏涼或想喝熱湯時，用原型蔬菜關東煮取代炸物，既有儀式感又不超標。',
          nutritionTip: '挑關東煮時優先選白蘿蔔、香菇、高麗菜捲與玉米筍等原型食材，避開高鈉魚漿加工品。',
          actionHint: '關東煮湯頭鈉含量較高，淺嚐幾口暖胃即可，搭配無糖茶更能解膩。',
          matchScore: 85,
        },
      ],
      voiceScripts: {
        dietitian:
          '這組超商輕食搭配非常聰明！烤地瓜提供原型碳水，雞胸肉補足約三十四克蛋白質，總熱量控制在四百四十五大卡上下。建議沙拉醬先倒一半，並記得今天再補充一份新鮮水果就更完美了。',
        partner:
          '忙碌的一天能選到這樣的輕食組合真的很棒喔！一百五十元內既有地瓜的香甜又有飽滿蛋白質，不會讓下午昏昏欲睡。如果還想喝點熱的，也可以參考關東煮原型蔬菜的選項。',
        frank:
          '算你會挑！地瓜配雞胸肉至少沒在中午灌進八百大卡油膩便當。但別以為買了沙拉就萬事大吉，醬包整包倒下去熱量直接破功，先加一半就好，下午記得買顆芭樂補水果！',
      },
      myPlateLesson: '「早晚一杯奶、每餐水果拳頭大」：超商輕食常見蛋白夠但水果與乳品不足，可在結帳時順手帶一顆切盤水果或無糖優酪乳。',
      disclaimer: '熱量與三大營養素為多模態 AI 視覺估算值，受實際商品克重與醬料用量影響，僅供日常飲食參考 [9]。',
    };
  }

  if (isStinkyTofu) {
    return {
      inputKind: 'meal',
      detectedName: '夜市脆皮黃金臭豆腐配台式泡菜',
      category: '夜市／解壓小吃',
      summary: '油炸豆腐蛋白質與油脂偏高、台式泡菜提供部分發酵蔬菜，建議搭配無糖茶與額外蔬果平衡本日攝取。',
      scores: {
        balance: 6.4,
        vegetable: 6.0,
        calorieControl: 5.8,
        satiety: 7.9,
        value: 8.8,
      },
      overallScore: 76,
      verdict: '療癒系・需搭蔬果平衡',
      estimatedPrice: 80,
      calories: 540,
      macros: {
        protein: 21,
        carbs: 46,
        fat: 30,
        fiberGrams: 4.5,
        vegServings: 0.8,
        fruitServings: 0,
      },
      myPlateCheck: {
        wholeGrains: false,
        protein: true,
        vegetables: true,
        fruit: false,
        dairyOrNuts: false,
      },
      recommendations: [
        {
          id: 'opt-nudge',
          badge: '🌟 數位輕推首選・解膩均衡補菜',
          title: '臭豆腐與朋友分食一半 ＋ 鹽水雞花椰菜木耳 ＋ 無糖四季春',
          estimatedPrice: 155,
          calories: 470,
          macros: { protein: 26, carbs: 34, fat: 22 },
          reason: '保留想吃炸物紓壓的滿足感，同時用鹽水雞的深色蔬菜與去皮雞胸補齊「我的餐盤」蔬菜缺口。',
          nutritionTip: '國健署建議每日攝取 3 份蔬菜、2 份水果：炸臭豆腐旁的泡菜通常只有約 0.5 份蔬菜，且醃漬糖分偏高，搭配新鮮燙青菜能有效平衡鈉與油脂。',
          actionHint: '臭豆腐醬汁請老闆淋在盤邊沾著吃，可減少約 30% 多餘鈉含量。',
          matchScore: 93,
        },
        {
          id: 'opt-cp',
          badge: '💰 高 CP 值清爽收斂',
          title: '臭豆腐單份（醬汁減半）＋ 現切芭樂一袋 ＋ 無糖冷泡茶',
          estimatedPrice: 130,
          calories: 585,
          macros: { protein: 22, carbs: 58, fat: 30 },
          reason: '總花費僅 130 元，用富含維生素 C 的芭樂幫助抗氧化與解膩，同時達成當餐水果份量。',
          nutritionTip: '「每餐水果拳頭大」：芭樂是低 GI 高纖水果，能延緩油炸澱粉的血糖上升速度。',
          actionHint: '芭樂選擇不加梅粉，保留清爽口感並減少額外糖鈉。',
          matchScore: 87,
        },
        {
          id: 'opt-comfort',
          badge: '💛 完整飽足正餐替代',
          title: '清蒸／麻辣鴨血豆腐鍋（不喝湯）＋ 高麗菜金針菇',
          estimatedPrice: 160,
          calories: 490,
          macros: { protein: 28, carbs: 42, fat: 21 },
          reason: '同樣能吃到入味豆腐的滿足感，但改用蒸煮方式可大幅降低約 10–15g 油炸油脂。',
          nutritionTip: '豆製品本身是優質植物性蛋白來源，換成非油炸烹調方式，讓蛋白質攝取更沒有油脂負擔。',
          actionHint: '湯底油脂與鈉含量高，專心吃料與蔬菜、少喝湯效果最好。',
          matchScore: 85,
        },
      ],
      voiceScripts: {
        dietitian:
          '金黃酥脆的臭豆腐一份約五百四十大卡，泡菜雖然是蔬菜但份量不到一份且偏甜鹹。建議搭配無糖茶與一份鹽水雞燙花椰菜，或是選清蒸臭豆腐配大量蔬菜，既能享受美味又能顧及營養均衡！',
        partner:
          '忙碌一天偶爾用酥脆的臭豆腐犒賞自己完全沒問題！只要把醬汁放旁邊沾著吃，再多帶一袋清脆芭樂或無糖綠茶解膩，就能在療癒心情的同時照顧好身體喔。',
        frank:
          '這盤炸臭豆腐香氣很犯規沒錯，但三十克脂肪直接吃下去，今晚的運動量可不小！聰明點，分一半給朋友，另一半預算拿去買無糖四季春跟鹽水雞花椰菜，才不會讓這餐只有熱量沒有纖維！',
      },
      myPlateLesson: '享用夜市小吃時採取「一份炸物＋一份燙青菜或鮮切水果＋無糖茶」的黃金三角，不必壓抑口腹之欲也能避免營養失衡。',
      disclaimer: '熱量與三大營養素為多模態 AI 視覺估算值，受油炸吸油量與醬汁多寡影響，僅供日常飲食參考 [9]。',
    };
  }

  // Default: 台式滷雞腿便當
  return {
    inputKind: 'meal',
    detectedName: '台式滷雞腿便當（三樣配菜＋白飯）',
    category: '外食便當主食',
    summary: '典型台灣外食族午餐配置：主菜蛋白質充足，但配菜偏油且白飯份量較大；已結合您的情境收斂 3 個最佳吃法與點餐提案。',
    scores: {
      balance: 7.9,
      vegetable: 7.2,
      calorieControl: 7.0,
      satiety: 9.1,
      value: 8.9,
    },
    overallScore: 83,
    verdict: '均衡潜力佳・微調即滿分',
    estimatedPrice: 125,
    calories: 760,
    macros: {
      protein: 32,
      carbs: 92,
      fat: 28,
      fiberGrams: 5.8,
      vegServings: 1.3,
      fruitServings: 0,
    },
    myPlateCheck: {
      wholeGrains: true,
      protein: true,
      vegetables: true,
      fruit: false,
      dairyOrNuts: false,
    },
    recommendations: [
      {
        id: 'opt-nudge',
        badge: '🌟 數位輕推首選・去皮減油＋多深綠菜',
        title: '滷雞腿便當（飯減 1/3、雞腿去皮、選兩樣深綠蔬菜）',
        estimatedPrice: 125,
        calories: 610,
        macros: { protein: 30, carbs: 66, fat: 18 },
        reason: `完全符合 ${budgetLabel} 預算，僅透過微調點餐口訣（去皮＋少飯＋雙深綠菜）即可直接省下約 150 kcal 多餘油脂與精製碳水。`,
        nutritionTip: '國健署「我的餐盤」強調「飯跟蔬菜一樣多」：一般便當白飯常達 1.5 碗，請老闆「飯少」並把空間留給兩格深綠色葉菜最理想。',
        actionHint: '優先挑炒高麗菜、青江菜或海帶芽，避開麻婆豆腐、炸茄子或糖醋等高油勾芡配菜。',
        matchScore: 95,
      },
      {
        id: 'opt-cp',
        badge: '💰 高 CP 值均衡換搭',
        title: '白斬／蔥油雞肉便當（改紫米五穀飯）＋ 無糖綠茶',
        estimatedPrice: 135,
        calories: 640,
        macros: { protein: 32, carbs: 68, fat: 22 },
        reason: '同價位帶升級為未精製全穀雜糧飯，增加維生素 B 群與膳食纖維，下午上班不易想睡。',
        nutritionTip: '「吃原態全穀」：只要將白飯換成五穀飯或糙米飯，每餐即可多獲得約 2–3 克膳食纖維。',
        actionHint: '蔥油醬容易隱藏高熱量，請店家淋少許提味即可。',
        matchScore: 89,
      },
      {
        id: 'opt-comfort',
        badge: '💛 晚間輕盈／補蔬果提案',
        title: '減量便當配菜盒（無飯）＋ 蒸蛋 ＋ 餐後拳頭大芭樂',
        estimatedPrice: 140,
        calories: 520,
        macros: { protein: 28, carbs: 45, fat: 19 },
        reason: '若前一餐碳水已偏高或接近晚餐時段，用鮮甜水果取代部分澱粉，吃飽又無負擔。',
        nutritionTip: '國民營養調查顯示八成以上職場外食族未達每日三蔬二果 [1]，在便當後補一份水果是最簡單的高分習慣。',
        actionHint: '水果建議選整顆原態（芭樂、蘋果、小番茄），比果汁更能保留纖維。',
        matchScore: 84,
      },
    ],
    voiceScripts: {
      dietitian:
        '這份台式滷雞腿便當蛋白質很充足，一百二十五元的 CP 值也很高，不過整份吃下來熱量約七百六十大卡、白飯與油脂稍高。建議採納輕推提案：請老闆白飯少三分之一、雞腿去皮，並挑兩樣深綠色蔬菜，立刻就能省下一百五十大卡！',
      partner:
        '忙碌到中午能吃到熱騰騰的雞腿便當真的很療癒！價格也很親民。只要在點餐時多說一句「飯少一點、幫我選兩樣青菜」，就能吃得飽又不怕下午血糖昏昏欲睡喔。',
      frank:
        '一百二十五元這份量是很有誠意啦，但你看看那層油亮的雞皮跟塞滿盒子的白飯，吃完下午三點保證打哈欠！照一號方案做：飯砍掉三分之一、皮剝掉、菜別選茄子或甜不辣，這樣才算聰明外食！',
    },
    myPlateLesson: '外食便當黃金法則：「白飯減三分之一、雙深綠蔬菜、避開勾芡油炸配菜」，一次改善高油高碳水的上班族通病。',
    disclaimer: '熱量與三大營養素為多模態 AI 視覺估算值，受便當店飯量與配菜用油差異影響，僅供日常飲食參考 [9]。',
  };
}

export async function analyzeFoodWithGemini(payload: AnalyzeFoodPayload) {
  if (!payload.imageBase64) {
    throw new Error('請提供餐點或菜單照片數據');
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn('[Gemini] GEMINI_API_KEY not configured, using offline fallback guide.');
    return getFallbackAnalysis(payload);
  }

  try {
    const ai = getAiClient();
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      notes = '',
      context = {},
      recentSummary = {},
    } = payload;

    const systemInstruction = `
你是【今日食光導覽員】——一位結合「決策科學（克服選擇過載）」、「數位輕推（Digital Nudging）」與「國健署我的餐盤營養識讀」的多模態 AI 外食決策與營養導覽顧問。
使用對象為每日外食的上班族與大專學生，協助他們在忙碌、決策疲勞時，透過拍照（餐點實拍或餐廳菜單）與情境語音需求，快速做出兼顧預算、飽足感與營養均衡的選擇。

設計原則（嚴格遵守）：
1. 模組 2（影像辨識與營養估算）：辨識圖片是單一「餐點實拍(meal)」還是「菜單看板(menu)」，估算價格、熱量(kcal)與三大營養素(蛋白質/碳水/脂肪克數)、膳食纖維與蔬果份數，並檢核國健署「我的餐盤」項目。
2. 模組 3（個人化推薦・認知減負）：結合使用者情境（預算、時間、心情動機、忌口限制）與近期飲食趨勢，嚴格只收斂產出 **3 個** 推薦選項（不可多於或少於 3 個！）：
   - 第 1 個：🌟 數位輕推首選（營養最均衡且符合預算）
   - 第 2 個：💰 高 CP 值省錢飽足之選
   - 第 3 個：💛 心情療癒或微調減負提案
3. 每個推薦選項都必須附上一句簡短實用的「我的餐盤／營養識讀小知識」，讓使用者在選餐時順便學習。
4. 嚴格輸出符合 schema 的繁體中文 JSON。
5. voiceScripts 必須為三種導覽語氣分別撰寫 80-130 字的語音播報稿：
   - dietitian: 溫和專業的「營養識讀夥伴」
   - partner: 溫暖體貼的「日常陪伴顧問」
   - frank: 直白犀利、幽默吐槽但實用的「效率決策督察」
`;

    const cleanMimeType = mimeType.includes('svg') ? 'image/png' : mimeType;
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z+]+;base64,/, '');

    const promptText = `
使用者目前的外食決策情境：
- 預算區間：${context.budgetLabel || '100–150 元'}
- 可用時間：${context.timeLabel || '20–30 分鐘'}
- 選食動機／心情：${context.motives?.join('、') || '兼顧飽足與健康'}
- 飲食限制／忌口：${context.restrictions?.join('、') || '無特別限制'}
- 語音或文字補充：「${notes || '（未填寫文字補充，請直接依照片內容進行專業辨識與推薦）'}」
- 過去一週飲食摘要：平均單餐花費約 ${recentSummary.avgPrice || 135} 元、平均每餐蔬菜約 ${recentSummary.avgVegServings || 1.1} 份、近期吃過：${recentSummary.recentFoods?.join('、') || '便當、麵食'}

請分析這張照片並嚴格輸出包含 3 個精準推薦選項的 JSON 導覽報告。
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
            inputKind: { type: Type.STRING },
            detectedName: { type: Type.STRING },
            category: { type: Type.STRING },
            summary: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                balance: { type: Type.NUMBER },
                vegetable: { type: Type.NUMBER },
                calorieControl: { type: Type.NUMBER },
                satiety: { type: Type.NUMBER },
                value: { type: Type.NUMBER },
              },
              required: ['balance', 'vegetable', 'calorieControl', 'satiety', 'value'],
            },
            overallScore: { type: Type.INTEGER },
            verdict: { type: Type.STRING },
            estimatedPrice: { type: Type.INTEGER },
            calories: { type: Type.INTEGER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                fiberGrams: { type: Type.NUMBER },
                vegServings: { type: Type.NUMBER },
                fruitServings: { type: Type.NUMBER },
              },
              required: ['protein', 'carbs', 'fat', 'fiberGrams', 'vegServings', 'fruitServings'],
            },
            myPlateCheck: {
              type: Type.OBJECT,
              properties: {
                wholeGrains: { type: Type.BOOLEAN },
                protein: { type: Type.BOOLEAN },
                vegetables: { type: Type.BOOLEAN },
                fruit: { type: Type.BOOLEAN },
                dairyOrNuts: { type: Type.BOOLEAN },
              },
              required: ['wholeGrains', 'protein', 'vegetables', 'fruit', 'dairyOrNuts'],
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  badge: { type: Type.STRING },
                  title: { type: Type.STRING },
                  estimatedPrice: { type: Type.INTEGER },
                  calories: { type: Type.INTEGER },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER },
                    },
                    required: ['protein', 'carbs', 'fat'],
                  },
                  reason: { type: Type.STRING },
                  nutritionTip: { type: Type.STRING },
                  actionHint: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                },
                required: [
                  'id',
                  'badge',
                  'title',
                  'estimatedPrice',
                  'calories',
                  'macros',
                  'reason',
                  'nutritionTip',
                  'actionHint',
                  'matchScore',
                ],
              },
            },
            voiceScripts: {
              type: Type.OBJECT,
              properties: {
                dietitian: { type: Type.STRING },
                partner: { type: Type.STRING },
                frank: { type: Type.STRING },
              },
              required: ['dietitian', 'partner', 'frank'],
            },
            myPlateLesson: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'inputKind',
            'detectedName',
            'category',
            'summary',
            'scores',
            'overallScore',
            'verdict',
            'estimatedPrice',
            'calories',
            'macros',
            'myPlateCheck',
            'recommendations',
            'voiceScripts',
            'myPlateLesson',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('未收到 Gemini 分析結果');
    }

    const parsed = JSON.parse(text);
    // Ensure strictly 3 recommendations to preserve the choice-overload reduction guarantee [4]
    if (Array.isArray(parsed.recommendations)) {
      parsed.recommendations = parsed.recommendations.slice(0, 3);
    }
    if (!parsed.disclaimer) {
      parsed.disclaimer = '熱量與三大營養素為多模態 AI 視覺估算值，僅供日常飲食參考 [9]。';
    }
    return parsed;
  } catch (error: any) {
    console.error('[Gemini Analysis Error]:', error);
    const fallback = getFallbackAnalysis(payload);
    return {
      ...fallback,
      _offlineNotice: '目前採用離線範例導覽資料庫回應（' + (error?.message || '離線展示模式') + '）',
    };
  }
}

export async function synthesizeSpeechWithGemini(payload: TtsPayload) {
  const { text, tone = 'dietitian' } = payload;

  if (!text) {
    throw new Error('請提供要朗讀的文字');
  }

  if (!process.env.GEMINI_API_KEY) {
    return { fallbackBrowserTTS: true };
  }

  try {
    const ai = getAiClient();

    let voiceName = 'Kore';
    let style = 'Clear, warm, helpful Taiwanese nutrition guide tone';

    if (tone === 'partner') {
      voiceName = 'Kore';
      style = 'Gentle, supportive, friendly everyday companion tone';
    } else if (tone === 'frank') {
      voiceName = 'Fenrir';
      style = 'Energetic, fast-paced, witty, assertive food advisor tone';
    } else {
      voiceName = 'Charon';
      style = 'Calm, trustworthy, clear nutrition educator voice';
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
      return {
        audioBase64: audioData,
        mimeType: 'audio/wav',
      };
    }

    return { fallbackBrowserTTS: true };
  } catch (err: any) {
    console.warn('[TTS API Warning]:', err?.message);
    return { fallbackBrowserTTS: true };
  }
}
