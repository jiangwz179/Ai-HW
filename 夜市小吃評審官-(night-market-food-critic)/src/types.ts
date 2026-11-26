export type CriticType = 'toxic' | 'cozy' | 'michelin';

export interface FoodScores {
  color: number;
  aroma: number;
  taste: number;
  portion: number;
  value: number;
}

export interface PairedDrink {
  name: string;
  reason: string;
}

export interface CriticReviews {
  toxic: string;
  cozy: string;
  michelin: string;
}

export interface CritiqueResult {
  foodName: string;
  category: string;
  oneLineSummary: string;
  scores: FoodScores;
  totalScore: number;
  verdict: string;
  calories: number;
  exerciseEquiv: string;
  calorieTip: string;
  pairedDrink: PairedDrink;
  proTip: string;
  flavorTags?: string[];
  reviews: CriticReviews;
  improvements: string[];
  _offlineNotice?: string;
  capturedAt?: string;
  imageUrl?: string;
}

export interface CriticProfile {
  id: CriticType;
  name: string;
  avatar: string;
  frontTitle: string;
  badgeText: string;
  colorName: 'pink' | 'yellow' | 'cyan';
  themeHex: string;
  glowClass: string;
  manifesto: string;
  quoteSample: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  foodName: string;
  category: string;
  totalScore: number;
  verdict: string;
  critic: CriticType;
  imageUrl: string;
  result: CritiqueResult;
}
