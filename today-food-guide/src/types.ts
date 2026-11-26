export type GuideTone = 'dietitian' | 'partner' | 'frank';

export type BudgetRangeId = 'under100' | '100-150' | '150-200' | 'over200';
export type TimeConstraintId = 'quick10' | 'normal20' | 'relaxed';

export interface ContextInput {
  budget: BudgetRangeId;
  timeConstraint: TimeConstraintId;
  motives: string[];
  restrictions: string[];
  notes: string;
}

export interface NutritionDecisionScores {
  balance: number;
  vegetable: number;
  calorieControl: number;
  satiety: number;
  value: number;
}

export interface MacrosEstimate {
  protein: number;
  carbs: number;
  fat: number;
  fiberGrams: number;
  vegServings: number;
  fruitServings: number;
}

export interface MyPlateCheck {
  wholeGrains: boolean;
  protein: boolean;
  vegetables: boolean;
  fruit: boolean;
  dairyOrNuts: boolean;
}

export interface RecommendedOption {
  id: string;
  badge: string;
  title: string;
  estimatedPrice: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  reason: string;
  nutritionTip: string;
  actionHint: string;
  matchScore: number;
}

export interface AnalysisResult {
  inputKind: 'meal' | 'menu';
  detectedName: string;
  category: string;
  summary: string;
  scores: NutritionDecisionScores;
  overallScore: number;
  verdict: string;
  estimatedPrice: number;
  calories: number;
  macros: MacrosEstimate;
  myPlateCheck: MyPlateCheck;
  recommendations: RecommendedOption[];
  voiceScripts: Record<GuideTone, string>;
  myPlateLesson: string;
  disclaimer?: string;
  _offlineNotice?: string;
}

export interface GuideToneProfile {
  id: GuideTone;
  shortLabel: string;
  name: string;
  avatar: string;
  subtitle: string;
  badgeText: string;
  themeHex: string;
  glowClass: string;
  manifesto: string;
}

export interface DietLogEntry {
  id: string;
  timestamp: number;
  selectedOptionTitle: string;
  detectedName: string;
  category: string;
  price: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  vegServings: number;
  fruitServings: number;
  decisionSeconds: number;
  tone: GuideTone;
  imageUrl?: string;
  analysisResult?: AnalysisResult;
  isDemo?: boolean;
}

export interface TamSurveyEntry {
  id: string;
  timestamp: number;
  usefulnessScore: number;
  easeOfUseScore: number;
  reducesOverloadScore: number;
  comment: string;
}
