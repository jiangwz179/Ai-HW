export interface SampleFood {
  id: string;
  name: string;
  category: string;
  notes: string;
  quickTags: string[];
  svg: string;
}

export const sampleFoods: Record<string, SampleFood> = {
  stinkyTofu: {
    id: 'stinkyTofu',
    name: '脆皮黃金臭豆腐配手作台式泡菜',
    category: '經典炸物',
    notes: '外皮炸得極度酥脆，老闆在中間戳洞塞了滿滿蒜泥跟辣椒醬，咬下去會爆汁！台式泡菜酸甜夠脆很解膩。',
    quickTags: ['外酥內嫩', '蒜泥爆量', '泡菜清脆', '重口味必吃'],
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
      <!-- Plate -->
      <ellipse cx="300" cy="235" rx="220" ry="165" fill="url(#plateGrad)" stroke="#523d2e" stroke-width="6"/>
      <ellipse cx="300" cy="235" rx="190" ry="140" fill="#241a14" stroke="#3b2b20" stroke-width="2"/>
      
      <!-- Tofu Cube 1 -->
      <rect x="180" y="140" width="105" height="95" rx="12" fill="url(#tofuGold)" stroke="#804706" stroke-width="3"/>
      <circle cx="232" cy="187" r="18" fill="#540a05"/>
      <circle cx="232" cy="187" r="9" fill="#2d0502"/>
      <path d="M 224 165 Q 235 155 242 166" stroke="#257a1b" stroke-width="3" fill="none"/>
      
      <!-- Tofu Cube 2 -->
      <rect x="315" y="140" width="105" height="95" rx="12" fill="url(#tofuGold)" stroke="#804706" stroke-width="3"/>
      <circle cx="367" cy="187" r="18" fill="#540a05"/>
      <circle cx="367" cy="187" r="9" fill="#2d0502"/>
      <circle cx="350" cy="175" r="3" fill="#ffe082"/>
      <circle cx="385" cy="195" r="3" fill="#ffe082"/>
      
      <!-- Tofu Cube 3 -->
      <rect x="245" y="250" width="105" height="95" rx="12" fill="url(#tofuGold)" stroke="#804706" stroke-width="3"/>
      <circle cx="297" cy="297" r="18" fill="#540a05"/>
      <circle cx="297" cy="297" r="9" fill="#2d0502"/>
      
      <!-- Taiwanese Pickled Cabbage -->
      <path d="M 370 240 Q 430 215 450 270 Q 425 325 365 305 Z" fill="#b9e075" opacity="0.95"/>
      <path d="M 380 250 Q 415 240 435 280 Q 405 310 380 290 Z" fill="#d2f29b"/>
      <circle cx="400" cy="265" r="5" fill="#e53935"/>
      <circle cx="420" cy="285" r="4.5" fill="#e53935"/>
      <circle cx="390" cy="290" r="4" fill="#e53935"/>

      <!-- Garlic Paste Drops -->
      <ellipse cx="280" cy="225" rx="12" ry="7" fill="#fdf0cd" opacity="0.8"/>
      
      <!-- Label -->
      <rect x="150" y="390" width="300" height="34" rx="8" fill="#000000" opacity="0.75"/>
      <text x="300" y="413" font-family="'Noto Sans TC', sans-serif" font-size="16" font-weight="bold" fill="#ffca28" text-anchor="middle">
        🥢 台灣夜市脆皮臭豆腐・採樣標本
      </text>
    </svg>`,
  },
  friedChicken: {
    id: 'friedChicken',
    name: '豪大大比臉大香酥雞排',
    category: '經典炸物',
    notes: '真的比臉還大！外皮是傳統地瓜粉顆粒麵衣，胡椒鹽下得很多香氣超撲鼻，剛咬下去有肉汁，但靠近骨頭處稍微偏油。',
    quickTags: ['比臉還大', '肉汁飽滿', '台式胡椒鹽', '脆皮地瓜粉'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <radialGradient id="chickenGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#e69533"/>
          <stop offset="60%" stop-color="#b8600d"/>
          <stop offset="100%" stop-color="#733202"/>
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="#131620"/>
      <!-- Paper Bag -->
      <path d="M 120 220 L 480 200 L 450 420 L 150 420 Z" fill="#bfa58a" stroke="#876d54" stroke-width="4"/>
      <path d="M 140 240 L 460 220 L 435 410 L 165 410 Z" fill="#9e836b"/>
      <text x="300" y="330" font-family="'Tourney', sans-serif" font-size="32" font-weight="900" fill="#e53935" text-anchor="middle" transform="rotate(-3, 300, 330)">HOT FRIED</text>

      <!-- Giant Chicken Cutlet -->
      <path d="M 140 180 C 130 90, 460 70, 480 180 C 500 270, 420 330, 260 340 C 150 330, 110 240, 140 180 Z" fill="url(#chickenGrad)" stroke="#5e2b02" stroke-width="6"/>
      <path d="M 170 170 Q 280 120 440 170 Q 380 290 230 290 Z" fill="#f7ab48" opacity="0.6"/>
      
      <!-- Pepper salt specks -->
      <circle cx="210" cy="180" r="3.5" fill="#2b231d"/>
      <circle cx="310" cy="150" r="4" fill="#2b231d"/>
      <circle cx="390" cy="220" r="3.5" fill="#2b231d"/>
      <circle cx="270" cy="240" r="4.5" fill="#2b231d"/>
      <circle cx="340" cy="260" r="3" fill="#2b231d"/>
      <circle cx="430" cy="190" r="4" fill="#2b231d"/>

      <!-- Label -->
      <rect x="150" y="390" width="300" height="34" rx="8" fill="#000000" opacity="0.75"/>
      <text x="300" y="413" font-family="'Noto Sans TC', sans-serif" font-size="16" font-weight="bold" fill="#ff7043" text-anchor="middle">
        🍗 現炸巨無霸雞排・採樣標本
      </text>
    </svg>`,
  },
  oysterOmelet: {
    id: 'oysterOmelet',
    name: '艋舺經典古早味香煎蚵仔煎',
    category: '主食小吃',
    notes: '邊緣煎得金黃焦脆，粉漿厚薄適中QQ的，特調海山醬帶點味噌甜甜微辣，東石蚵仔顆粒飽滿帶有鮮味，小白菜很多。',
    quickTags: ['邊緣酥脆', '蚵仔飽滿鮮美', '特製紅甜辣醬', 'Q彈粉漿'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <radialGradient id="ironPlate" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#303030"/>
          <stop offset="85%" stop-color="#1c1c1c"/>
          <stop offset="100%" stop-color="#0a0a0a"/>
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="#141416"/>
      <!-- Iron skillet / plate -->
      <circle cx="300" cy="225" r="190" fill="url(#ironPlate)" stroke="#4a4a4a" stroke-width="8"/>
      <circle cx="300" cy="225" r="170" fill="#212121"/>
      
      <!-- Egg & Batter Layer -->
      <ellipse cx="300" cy="225" rx="145" ry="125" fill="#e0a328" opacity="0.95"/>
      <!-- Green Veggies -->
      <path d="M 210 160 Q 290 120 380 170 Q 360 260 220 250 Z" fill="#388e3c" opacity="0.9"/>
      <path d="M 230 190 Q 270 170 330 180 Q 300 230 250 220 Z" fill="#66bb6a"/>

      <!-- Plump Oysters -->
      <ellipse cx="250" cy="210" rx="16" ry="13" fill="#607d8b" stroke="#37474f" stroke-width="2"/>
      <ellipse cx="330" cy="195" rx="18" ry="14" fill="#607d8b" stroke="#37474f" stroke-width="2"/>
      <ellipse cx="280" cy="255" rx="17" ry="13" fill="#607d8b" stroke="#37474f" stroke-width="2"/>
      <ellipse cx="340" cy="250" rx="15" ry="12" fill="#607d8b" stroke="#37474f" stroke-width="2"/>

      <!-- Signature Red Sauce (Hai-shan sauce) -->
      <path d="M 175 190 Q 280 235 415 195 Q 365 295 240 280 Z" fill="#d32f2f" opacity="0.88"/>
      <path d="M 200 205 Q 280 245 385 210 Q 345 280 260 265 Z" fill="#ef5350" opacity="0.6"/>

      <!-- Label -->
      <rect x="150" y="390" width="300" height="34" rx="8" fill="#000000" opacity="0.75"/>
      <text x="300" y="413" font-family="'Noto Sans TC', sans-serif" font-size="16" font-weight="bold" fill="#ef5350" text-anchor="middle">
        🍳 艋舺經典蚵仔煎・採樣標本
      </text>
    </svg>`,
  },
  sweetPotatoBall: {
    id: 'sweetPotatoBall',
    name: '澎湃現壓黃金雙色地瓜球',
    category: '傳統甜品',
    notes: '每一顆都壓了至少五六次，咬下去非常酥脆且空心彈牙！地瓜與紫薯香氣越嚼越香甜，紙袋完全沒有滲出厚油，超涮嘴。',
    quickTags: ['現壓空心', '外脆內Q', '地瓜香氣濃', '不油膩大推'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <radialGradient id="yellowBall" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffeb3b"/>
          <stop offset="60%" stop-color="#f57f17"/>
          <stop offset="100%" stop-color="#bc5100"/>
        </radialGradient>
        <radialGradient id="purpleBall" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ba68c8"/>
          <stop offset="60%" stop-color="#7b1fa2"/>
          <stop offset="100%" stop-color="#4a148c"/>
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="#181520"/>
      <!-- Basket / Paper bowl -->
      <ellipse cx="300" cy="270" rx="200" ry="90" fill="#261d19" stroke="#5d4037" stroke-width="6"/>

      <!-- Colorful Sweet Potato Balls with glossy highlights -->
      <circle cx="210" cy="190" r="46" fill="url(#yellowBall)"/>
      <circle cx="295" cy="170" r="48" fill="url(#purpleBall)"/>
      <circle cx="380" cy="195" r="45" fill="url(#yellowBall)"/>
      <circle cx="240" cy="260" r="47" fill="url(#purpleBall)"/>
      <circle cx="335" cy="265" r="48" fill="url(#yellowBall)"/>
      <circle cx="410" cy="270" r="42" fill="url(#purpleBall)"/>

      <!-- Highlights -->
      <ellipse cx="195" cy="175" rx="14" ry="8" fill="#fff" opacity="0.4" transform="rotate(-25, 195, 175)"/>
      <ellipse cx="280" cy="155" rx="14" ry="8" fill="#fff" opacity="0.4" transform="rotate(-25, 280, 155)"/>
      <ellipse cx="365" cy="180" rx="14" ry="8" fill="#fff" opacity="0.4" transform="rotate(-25, 365, 180)"/>

      <!-- Bamboo Skewer -->
      <line x1="170" y1="340" x2="280" y2="200" stroke="#d7ccc8" stroke-width="5" stroke-linecap="round"/>

      <!-- Label -->
      <rect x="150" y="390" width="300" height="34" rx="8" fill="#000000" opacity="0.75"/>
      <text x="300" y="413" font-family="'Noto Sans TC', sans-serif" font-size="16" font-weight="bold" fill="#ab47bc" text-anchor="middle">
        🍠 現壓雙色地瓜球・採樣標本
      </text>
    </svg>`,
  },
};

export const sampleFoodKeys = Object.keys(sampleFoods);
