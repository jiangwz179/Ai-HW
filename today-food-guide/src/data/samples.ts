export interface SampleFood {
  id: string;
  badge: string;
  name: string;
  category: string;
  defaultNotes: string;
  defaultBudget: 'under100' | '100-150' | '150-200' | 'over200';
  svg: string;
}

export const sampleFoods: Record<string, SampleFood> = {
  chickenBento: {
    id: 'chickenBento',
    badge: '🍱 滷雞腿便當',
    name: '台式滷雞腿便當（三菜＋白飯）',
    category: '上班族午餐便當',
    defaultNotes: '中午只有20分鐘休息，預算100到150元，想吃飽但不想下午太想睡，希望少油多菜。',
    defaultBudget: '100-150',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2c241d"/>
          <stop offset="100%" stop-color="#17120e"/>
        </linearGradient>
        <linearGradient id="drumstickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b85d22"/>
          <stop offset="55%" stop-color="#8b3b12"/>
          <stop offset="100%" stop-color="#582107"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="#0d111a"/>
      <!-- Bento Box -->
      <rect x="85" y="65" width="430" height="305" rx="22" fill="url(#boxGrad)" stroke="#7c5d41" stroke-width="6"/>
      <!-- Compartments -->
      <rect x="105" y="85" width="195" height="265" rx="12" fill="#f8fafc" opacity="0.95"/>
      <rect x="312" y="85" width="183" height="82" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <rect x="312" y="176" width="183" height="82" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <rect x="312" y="267" width="183" height="83" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <!-- Rice texture -->
      <circle cx="155" cy="145" r="2" fill="#cbd5e1"/>
      <circle cx="235" cy="130" r="2" fill="#cbd5e1"/>
      <circle cx="170" cy="295" r="2" fill="#cbd5e1"/>
      <!-- Braised Drumstick over rice -->
      <path d="M 135 190 C 125 135, 225 110, 265 160 C 295 200, 250 265, 215 280 L 185 320 C 175 332, 155 322, 165 305 L 185 268 C 155 255, 140 225, 135 190 Z" fill="url(#drumstickGrad)" stroke="#3e1604" stroke-width="3"/>
      <ellipse cx="195" cy="175" rx="34" ry="18" fill="#d97706" opacity="0.35" transform="rotate(-20, 195, 175)"/>
      <!-- Veggie 1: Stir-fried greens -->
      <path d="M 330 128 Q 365 95 405 125 Q 440 100 475 132 Q 435 155 360 150 Z" fill="#22c55e"/>
      <path d="M 350 118 Q 390 105 440 126" stroke="#86efac" stroke-width="4" fill="none"/>
      <!-- Veggie 2: Braised egg & tofu -->
      <ellipse cx="365" cy="217" rx="28" ry="22" fill="#92400e" stroke="#451a03" stroke-width="2"/>
      <rect x="415" y="196" width="56" height="42" rx="6" fill="#d97706" stroke="#78350f" stroke-width="2"/>
      <!-- Veggie 3: Cabbage + Carrot -->
      <path d="M 330 312 Q 395 275 475 315 Q 435 340 345 335 Z" fill="#bef264"/>
      <circle cx="385" cy="308" r="7" fill="#f97316"/>
      <circle cx="435" cy="316" r="6" fill="#f97316"/>
      <!-- Label -->
      <rect x="130" y="392" width="340" height="34" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="300" y="414" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">
        🍱 台式滷雞腿便當・外食餐盤採樣
      </text>
    </svg>`,
  },
  streetMenu: {
    id: 'streetMenu',
    badge: '📋 巷口麵攤菜單',
    name: '巷口小吃攤價目菜單看板',
    category: '菜單辨識決策',
    defaultNotes: '站在麵攤前面看菜單看了十分鐘不知道吃什麼，預算150元內，想吃熱湯麵又想補青菜跟蛋白質。',
    defaultBudget: '100-150',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#0f172a"/>
      <!-- Menu Board -->
      <rect x="75" y="42" width="450" height="335" rx="16" fill="#fef3c7" stroke="#d97706" stroke-width="6"/>
      <rect x="90" y="56" width="420" height="307" rx="10" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
      <rect x="165" y="68" width="270" height="34" rx="6" fill="#b91c1c"/>
      <text x="300" y="91" font-family="'Noto Sans TC', sans-serif" font-size="17" font-weight="bold" fill="#fef2f2" text-anchor="middle">
        🏮 巷口古早味麵攤・價目表
      </text>
      <!-- Left Column -->
      <text x="118" y="135" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#78350f">陽春湯麵(小/大)  $45 / $60</text>
      <text x="118" y="168" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#78350f">麻醬乾麵         $55</text>
      <text x="118" y="201" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#78350f">滷肉飯(小/大)    $40 / $55</text>
      <text x="118" y="234" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#78350f">餛飩湯麵         $80</text>
      <text x="118" y="267" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#78350f">牛肉湯麵         $130</text>
      <text x="118" y="300" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#78350f">控肉飯便當       $110</text>
      <!-- Divider -->
      <line x1="335" y1="115" x2="335" y2="340" stroke="#fcd34d" stroke-width="2" stroke-dasharray="4 4"/>
      <!-- Right Column -->
      <text x="355" y="135" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#065f46">燙大陸妹     $40</text>
      <text x="355" y="168" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#065f46">燙空心菜     $40</text>
      <text x="355" y="201" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#065f46">涼拌小黃瓜   $40</text>
      <text x="355" y="234" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#9a3412">滷蛋豆干拼   $45</text>
      <text x="355" y="267" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#9a3412">嘴邊肉切盤   $65</text>
      <text x="355" y="300" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#1e40af">蛤蜊冬瓜湯   $55</text>
      <!-- Label -->
      <rect x="130" y="392" width="340" height="34" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="300" y="414" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#fbbf24" text-anchor="middle">
        📋 菜單看板辨識・AI 收斂 3 選項
      </text>
    </svg>`,
  },
  convenienceLight: {
    id: 'convenienceLight',
    badge: '🥗 超商高蛋白輕食',
    name: '超商高蛋白地瓜雞胸輕食組合',
    category: '便利商店均衡餐',
    defaultNotes: '只有10分鐘趕會議，預算150元內，想要高蛋白、低負擔又快速解決。',
    defaultBudget: '100-150',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#0b1320"/>
      <ellipse cx="300" cy="240" rx="225" ry="145" fill="#1e293b" stroke="#334155" stroke-width="5"/>
      <!-- Salad Bowl -->
      <circle cx="215" cy="215" r="85" fill="#0f172a" stroke="#475569" stroke-width="4"/>
      <path d="M 155 210 Q 190 155 255 180 Q 285 235 235 265 Q 170 270 155 210 Z" fill="#22c55e"/>
      <path d="M 175 200 Q 210 175 245 215 Q 210 245 175 235 Z" fill="#86efac"/>
      <circle cx="205" cy="198" r="10" fill="#ef4444"/>
      <circle cx="235" cy="232" r="9" fill="#facc15"/>
      <!-- Chicken Breast Pack -->
      <rect x="325" y="135" width="145" height="90" rx="18" fill="#fef2f2" stroke="#f87171" stroke-width="3"/>
      <ellipse cx="397" cy="180" rx="48" ry="26" fill="#fed7aa"/>
      <text x="397" y="185" font-family="'Noto Sans TC', sans-serif" font-size="13" font-weight="bold" fill="#9a3412" text-anchor="middle">舒肥雞胸 23gP</text>
      <!-- Sweet Potato -->
      <ellipse cx="395" cy="275" rx="68" ry="30" fill="#9a3412" stroke="#431407" stroke-width="3" transform="rotate(-10, 395, 275)"/>
      <ellipse cx="395" cy="272" rx="45" ry="18" fill="#facc15" opacity="0.85" transform="rotate(-10, 395, 272)"/>
      <!-- Label -->
      <rect x="130" y="392" width="340" height="34" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
      <text x="300" y="414" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#34d399" text-anchor="middle">
        🥗 超商高蛋白輕食組・營養採樣
      </text>
    </svg>`,
  },
  stinkyTofu: {
    id: 'stinkyTofu',
    badge: '🥟 夜市脆皮臭豆腐',
    name: '夜市脆皮黃金臭豆腐配台式泡菜',
    category: '夜市解壓小吃',
    defaultNotes: '下班超累想吃夜市臭豆腐紓壓，蒜泥加爆，但也擔心熱量太高或蔬菜不夠，預算150元內。',
    defaultBudget: '100-150',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <radialGradient id="plateGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#342820"/>
          <stop offset="85%" stop-color="#1f1712"/>
          <stop offset="100%" stop-color="#0f0c09"/>
        </radialGradient>
        <linearGradient id="tofuGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5c04e"/>
          <stop offset="50%" stop-color="#d9941e"/>
          <stop offset="100%" stop-color="#9e5e0d"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="#121018"/>
      <ellipse cx="300" cy="235" rx="220" ry="165" fill="url(#plateGrad)" stroke="#523d2e" stroke-width="6"/>
      <ellipse cx="300" cy="235" rx="190" ry="140" fill="#241a14" stroke="#3b2b20" stroke-width="2"/>
      <rect x="180" y="140" width="105" height="95" rx="12" fill="url(#tofuGold)" stroke="#804706" stroke-width="3"/>
      <circle cx="232" cy="187" r="18" fill="#540a05"/>
      <circle cx="232" cy="187" r="9" fill="#2d0502"/>
      <rect x="315" y="140" width="105" height="95" rx="12" fill="url(#tofuGold)" stroke="#804706" stroke-width="3"/>
      <circle cx="367" cy="187" r="18" fill="#540a05"/>
      <circle cx="367" cy="187" r="9" fill="#2d0502"/>
      <rect x="245" y="250" width="105" height="95" rx="12" fill="url(#tofuGold)" stroke="#804706" stroke-width="3"/>
      <circle cx="297" cy="297" r="18" fill="#540a05"/>
      <circle cx="297" cy="297" r="9" fill="#2d0502"/>
      <path d="M 370 240 Q 430 215 450 270 Q 425 325 365 305 Z" fill="#b9e075" opacity="0.95"/>
      <circle cx="400" cy="265" r="5" fill="#e53935"/>
      <circle cx="420" cy="285" r="4.5" fill="#e53935"/>
      <rect x="130" y="392" width="340" height="34" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.5"/>
      <text x="300" y="414" font-family="'Noto Sans TC', sans-serif" font-size="15" font-weight="bold" fill="#f472b6" text-anchor="middle">
        🥟 夜市脆皮臭豆腐・風味與平衡分析
      </text>
    </svg>`,
  },
};
