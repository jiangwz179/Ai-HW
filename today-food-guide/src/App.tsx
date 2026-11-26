import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Utensils,
  Camera as CameraIcon,
  Upload,
  Mic,
  MicOff,
  Trash2,
  Volume2,
  VolumeX,
  RotateCw,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Compass,
  Clock,
  Wallet,
  HeartPulse,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

import {
  GuideTone,
  GuideToneProfile,
  BudgetRangeId,
  TimeConstraintId,
  AnalysisResult,
  RecommendedOption,
  DietLogEntry,
  TamSurveyEntry,
} from './types';
import { sampleFoods } from './data/samples';
import { SEED_DIET_LOGS } from './data/literature';
import { RadarChart } from './components/RadarChart';
import { CameraModal } from './components/CameraModal';
import { WeeklyDashboard } from './components/WeeklyDashboard';
import { LiteraturePanel } from './components/LiteraturePanel';
import { TamSurveyModal } from './components/TamSurveyModal';
import { playStampSound, playScoreFanfare } from './utils/audio';

type ActiveTab = 'guide' | 'dashboard' | 'literature';

const GUIDE_TONES: Record<GuideTone, GuideToneProfile> = {
  dietitian: {
    id: 'dietitian',
    shortLabel: '營養識讀夥伴',
    name: '營養識讀・我的餐盤導覽員',
    avatar: '🥗',
    subtitle: '國健署均衡視角',
    badgeText: '營養識讀導覽',
    themeHex: '#22d3ee',
    glowClass: 'border-glow-cyan',
    manifesto: '用最白話的「我的餐盤」原則，幫外食族快速看懂熱量、三大營養素與補菜技巧。',
  },
  partner: {
    id: 'partner',
    shortLabel: '暖心日常顧問',
    name: '暖心陪伴・外食紓壓夥伴',
    avatar: '🧁',
    subtitle: '溫柔不製造焦慮',
    badgeText: '暖心導覽模式',
    themeHex: '#fbbf24',
    glowClass: 'border-glow-yellow',
    manifesto: '在忙碌下班或趕課之間，用零壓力的數位輕推陪你挑出兼顧心情與荷包的好選擇。',
  },
  frank: {
    id: 'frank',
    shortLabel: '效率毒舌督察',
    name: '毒舌直白・決策效率督察',
    avatar: '🌶️',
    subtitle: '秒破選擇障礙',
    badgeText: '效率直球模式',
    themeHex: '#ff007f',
    glowClass: 'border-glow-pink',
    manifesto: '專治站在菜單前猶豫十分鐘的選擇癱瘓！直接點破高油地雷並給出三個最優解。',
  },
};

const BUDGET_OPTIONS: { id: BudgetRangeId; label: string }[] = [
  { id: 'under100', label: '100 元內' },
  { id: '100-150', label: '100–150 元' },
  { id: '150-200', label: '150–200 元' },
  { id: 'over200', label: '200 元以上' },
];

const TIME_OPTIONS: { id: TimeConstraintId; label: string }[] = [
  { id: 'quick10', label: '10 分鐘極速' },
  { id: 'normal20', label: '20–30 分鐘' },
  { id: 'relaxed', label: '慢慢享用餐點' },
];

const FCQ_MOTIVES = ['高CP值', '清爽少負擔', '想吃熱湯', '高蛋白增肌', '療癒紓壓', '趕時間方便'];
const DIET_RESTRICTIONS = ['多補蔬菜', '少油少鹽', '不吃辣', '不吃牛', '蛋奶素'];

const DIET_LOG_STORAGE_KEY = 'tfg_diet_logs_v1';
const TAM_STORAGE_KEY = 'tfg_tam_surveys_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('guide');
  const [currentTone, setCurrentTone] = useState<GuideTone>('dietitian');

  // Module 1: Context & Voice Need Input [3][4]
  const [budget, setBudget] = useState<BudgetRangeId>('100-150');
  const [timeConstraint, setTimeConstraint] = useState<TimeConstraintId>('normal20');
  const [selectedMotives, setSelectedMotives] = useState<string[]>(['高CP值', '清爽少負擔']);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(['多補蔬菜']);
  const [notes, setNotes] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Module 2: Photo Input [7][8][9]
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Module 3: Analysis & 3-Option Recommendation [4][5][6]
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const sessionStartRef = useRef<number>(Date.now());

  // Audio / TTS
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Module 4 & TAM [1][2][10]
  const [dietLogs, setDietLogs] = useState<DietLogEntry[]>([]);
  const [tamEntries, setTamEntries] = useState<TamSurveyEntry[]>([]);

  // Modals & UI helpers
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isTamOpen, setIsTamOpen] = useState<boolean>(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(DIET_LOG_STORAGE_KEY);
      if (storedLogs) {
        setDietLogs(JSON.parse(storedLogs));
      } else {
        setDietLogs(SEED_DIET_LOGS);
        localStorage.setItem(DIET_LOG_STORAGE_KEY, JSON.stringify(SEED_DIET_LOGS));
      }
    } catch {
      setDietLogs(SEED_DIET_LOGS);
    }

    try {
      const storedTam = localStorage.getItem(TAM_STORAGE_KEY);
      if (storedTam) {
        setTamEntries(JSON.parse(storedTam));
      }
    } catch {
      // ignore
    }

    loadPresetSample('chickenBento');
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const recentSummary = useMemo(() => {
    if (dietLogs.length === 0) {
      return { avgPrice: 135, avgVegServings: 1.1, recentFoods: [] };
    }
    const avgPrice = Math.round(dietLogs.reduce((a, b) => a + b.price, 0) / dietLogs.length);
    const avgVegServings = Number(
      (dietLogs.reduce((a, b) => a + b.vegServings, 0) / dietLogs.length).toFixed(1)
    );
    return {
      avgPrice,
      avgVegServings,
      recentFoods: dietLogs.slice(0, 3).map((d) => d.detectedName),
    };
  }, [dietLogs]);

  const loadPresetSample = (key: string) => {
    const sample = sampleFoods[key];
    if (!sample) return;
    const base64Data = btoa(unescape(encodeURIComponent(sample.svg)));
    const dataUrl = `data:image/svg+xml;base64,${base64Data}`;
    setImageSrc(dataUrl);
    setImageBase64(base64Data);
    setImageMimeType('image/svg+xml');
    setNotes(sample.defaultNotes);
    setBudget(sample.defaultBudget);
    setIsPresetDropdownOpen(false);
    sessionStartRef.current = Date.now();
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('請上傳有效的照片檔案（JPG、PNG、WEBP 等）');
      return;
    }
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageSrc(dataUrl);
      setImageBase64(dataUrl.split(',')[1]);
      sessionStartRef.current = Date.now();
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleCameraCapture = (b64: string, mime: string) => {
    setImageSrc(`data:${mime};base64,${b64}`);
    setImageBase64(b64);
    setImageMimeType(mime);
    sessionStartRef.current = Date.now();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const toggleSelection = (list: string[], value: string, setter: (next: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  // Module 1: Speech Recognition (zh-TW)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('您的瀏覽器尚未支援 Web Speech API 語音辨識，請改用文字或下方情境標籤。');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-TW';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!imageBase64) {
      showToast('請先拍攝或上傳餐點／菜單照片，或使用上方試玩範例！');
      return;
    }

    stopAudio();
    setIsAnalyzing(true);
    setLoadingStep(1);
    setResult(null);
    setSelectedOptionId(null);

    const timer1 = setTimeout(() => setLoadingStep(2), 1000);
    const timer2 = setTimeout(() => setLoadingStep(3), 2200);

    const budgetLabel = BUDGET_OPTIONS.find((b) => b.id === budget)?.label || '100–150 元';
    const timeLabel = TIME_OPTIONS.find((t) => t.id === timeConstraint)?.label || '20–30 分鐘';

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: imageMimeType,
          notes,
          tone: currentTone,
          context: {
            budgetLabel,
            timeLabel,
            motives: selectedMotives,
            restrictions: selectedRestrictions,
          },
          recentSummary,
        }),
      });

      if (!response.ok) {
        throw new Error('伺服器分析連線異常');
      }

      const data: AnalysisResult = await response.json();
      if (Array.isArray(data.recommendations)) {
        data.recommendations = data.recommendations.slice(0, 3);
      }

      setResult(data);
      playStampSound();

      if (data.overallScore >= 85) {
        playScoreFanfare();
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
          colors: ['#22d3ee', '#34d399', '#fbbf24', '#ec4899'],
        });
      }

      if (!isMuted) {
        setTimeout(() => {
          handlePlayTTS(data, currentTone);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      showToast('AI 連線暫時不穩，請確認伺服器或網路狀態後重試。');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsAnalyzing(false);
    }
  };

  // Adopt one of the 3 recommendations into Module 4 Weekly Dashboard
  const handleAdoptOption = (opt: RecommendedOption) => {
    if (!result) return;
    const elapsedSeconds = Math.max(
      8,
      Math.min(300, Math.round((Date.now() - sessionStartRef.current) / 1000))
    );

    const newLog: DietLogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      selectedOptionTitle: opt.title,
      detectedName: result.detectedName,
      category: result.category,
      price: opt.estimatedPrice,
      calories: opt.calories,
      macros: opt.macros,
      vegServings: result.macros.vegServings,
      fruitServings: result.macros.fruitServings,
      decisionSeconds: elapsedSeconds,
      tone: currentTone,
      imageUrl: imageSrc,
      analysisResult: result,
      isDemo: false,
    };

    setSelectedOptionId(opt.id);
    setDietLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 29)];
      localStorage.setItem(DIET_LOG_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    playStampSound();
    showToast(`已記錄「${opt.title}」（本次決策僅耗時 ${elapsedSeconds} 秒），可至儀表板查看週趨勢！`);
  };

  const handlePlayTTS = async (
    targetResult: AnalysisResult | null = result,
    tone: GuideTone = currentTone
  ) => {
    if (!targetResult) return;

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    const script = targetResult.voiceScripts[tone] || targetResult.summary;
    setIsAudioLoading(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: script, tone }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        audio.onended = () => {
          setIsPlayingAudio(false);
          currentAudioRef.current = null;
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          currentAudioRef.current = null;
          playBrowserSpeech(script, tone);
        };

        await audio.play();
        setIsPlayingAudio(true);
      } else {
        playBrowserSpeech(script, tone);
      }
    } catch {
      playBrowserSpeech(script, tone);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const playBrowserSpeech = (text: string, tone: GuideTone) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = tone === 'frank' ? 1.18 : tone === 'partner' ? 0.96 : 1.02;
    utterance.pitch = tone === 'frank' ? 1.05 : 1.0;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const copyDecisionReport = () => {
    if (!result) return;
    const recsText = result.recommendations
      .map(
        (r, i) =>
          `${i + 1}. [${r.badge}] ${r.title}（約 $${r.estimatedPrice}｜${r.calories} kcal）\n   📖 我的餐盤小知識：${r.nutritionTip}`
      )
      .join('\n');

    const report = `🍱【今日食光導覽員・多模態 AI 外食決策報告】
辨識目標：${result.detectedName}（${result.category}）
估算營養：${result.calories} kcal｜P ${result.macros.protein}g / C ${result.macros.carbs}g / F ${result.macros.fat}g
🎯 AI 收斂 3 推薦選項：
${recsText}
⚠️ ${result.disclaimer || '營養估算僅供參考 [9]'}`;

    navigator.clipboard.writeText(report).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const activeToneProfile = GUIDE_TONES[currentTone];

  return (
    <div className="relative min-h-screen bg-[#07080e] text-slate-100 font-sans overflow-x-hidden">
      {/* Ambient Glow */}
      <div className="fixed -top-24 -left-24 w-[480px] h-[480px] bg-cyan-600/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-[520px] h-[520px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0e101c]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 shadow-neon-cyan">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-300 border border-cyan-400/40">
                  MULTIMODAL AI FOOD GUIDE
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline">
                  用拍照與語音告別「不知道吃什麼」
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-wide text-white">
                今日食光導覽員{' '}
                <span className="text-xs font-medium text-cyan-300 hidden sm:inline">
                  多模態 AI 外食決策與營養導覽系統
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Preset Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPresetDropdownOpen((prev) => !prev)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">試玩外食範例</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isPresetDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono">
                    台灣外食・菜單採樣範例
                  </div>
                  {Object.values(sampleFoods).map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setActiveTab('guide');
                        loadPresetSample(sample.id);
                      }}
                      className="w-full text-left text-xs p-2 hover:bg-slate-800 rounded-xl flex items-center justify-between text-slate-300 hover:text-white transition"
                    >
                      <span>{sample.badge}</span>
                      <span className="text-[10px] text-slate-500">{sample.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TAM Survey Button */}
            <button
              type="button"
              onClick={() => setIsTamOpen(true)}
              className="text-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 px-3 py-2 rounded-xl border border-emerald-500/40 flex items-center gap-1.5 transition"
              title="填寫科技接受模型 (TAM) 體驗評估"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TAM 回饋 [10]</span>
            </button>

            {/* Mute Toggle */}
            <button
              type="button"
              onClick={() => {
                if (!isMuted) stopAudio();
                setIsMuted((prev) => !prev);
              }}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition flex items-center justify-center"
              title={isMuted ? '開啟自動語音導覽' : '靜音語音導覽'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 pb-2.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border transition ${
              activeTab === 'guide'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>模組 1–3｜AI 外食決策與營養導覽</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border transition ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>模組 4｜週飲食紀錄儀表板 ({dietLogs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('literature')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border transition ${
              activeTab === 'literature'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/60'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>理論定位與 10 篇文獻支持 [1]–[10]</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {activeTab === 'dashboard' ? (
          <WeeklyDashboard
            logs={dietLogs}
            onDeleteOne={(id) => {
              const updated = dietLogs.filter((l) => l.id !== id);
              setDietLogs(updated);
              localStorage.setItem(DIET_LOG_STORAGE_KEY, JSON.stringify(updated));
            }}
            onClearAll={() => {
              setDietLogs([]);
              localStorage.setItem(DIET_LOG_STORAGE_KEY, JSON.stringify([]));
            }}
            onRestoreDemo={() => {
              setDietLogs(SEED_DIET_LOGS);
              localStorage.setItem(DIET_LOG_STORAGE_KEY, JSON.stringify(SEED_DIET_LOGS));
              showToast('已恢復 4 筆示範外食週紀錄。');
            }}
            onInspectLog={(entry) => {
              if (entry.analysisResult) {
                setResult(entry.analysisResult);
                if (entry.imageUrl) setImageSrc(entry.imageUrl);
                setCurrentTone(entry.tone);
                setActiveTab('guide');
              }
            }}
          />
        ) : activeTab === 'literature' ? (
          <LiteraturePanel />
        ) : (
          <>
            {/* Tone Selector Banner */}
            <section className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> 外食族的營養識讀學習夥伴｜選擇導覽員語氣
                  </span>
                  <p className="text-xs text-slate-400">
                    結合情境需求（模組 1）、影像營養估算（模組 2）與過去週紀錄，收斂為 3 個精準選擇（模組 3）
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 max-w-md w-full">
                  {(['dietitian', 'partner', 'frank'] as GuideTone[]).map((toneKey) => {
                    const profile = GUIDE_TONES[toneKey];
                    const isSelected = currentTone === toneKey;
                    return (
                      <button
                        key={toneKey}
                        type="button"
                        onClick={() => {
                          setCurrentTone(toneKey);
                          if (isPlayingAudio) stopAudio();
                        }}
                        className={`p-2.5 rounded-2xl border transition flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? toneKey === 'frank'
                              ? 'border-pink-500/80 bg-pink-500/15 text-white shadow-neon-pink'
                              : toneKey === 'partner'
                              ? 'border-amber-400/80 bg-amber-400/15 text-white shadow-neon-yellow'
                              : 'border-cyan-400/80 bg-cyan-400/15 text-white shadow-neon-cyan'
                            : 'border-white/10 bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xl mb-1">{profile.avatar}</span>
                        <span className="text-xs font-black text-center">{profile.shortLabel}</span>
                        <span className="text-[10px] text-slate-400">{profile.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Two-Column Interactive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Module 1 + Module 2 Inputs */}
              <section className="lg:col-span-5 space-y-5">
                {/* Module 1: Context & Voice Input */}
                <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-white flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-400" /> 模組 1｜情境語音點餐需求
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      語音→文字 [3][4]
                    </span>
                  </div>

                  {/* Budget & Time */}
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1.5">
                        <Wallet className="w-3.5 h-3.5 text-amber-400" /> 單餐預算區間
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {BUDGET_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setBudget(opt.id)}
                            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition ${
                              budget === opt.id
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/70'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> 可用用餐時間
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {TIME_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setTimeConstraint(opt.id)}
                            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                              timeConstraint === opt.id
                                ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/70'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FCQ Motives & Dietary Restrictions */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> 選食動機與心情（FCQ [3]）
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {FCQ_MOTIVES.map((motive) => {
                        const active = selectedMotives.includes(motive);
                        return (
                          <button
                            key={motive}
                            type="button"
                            onClick={() => toggleSelection(selectedMotives, motive, setSelectedMotives)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                              active
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {motive}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-pink-400" /> 飲食限制／調整偏好
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {DIET_RESTRICTIONS.map((item) => {
                        const active = selectedRestrictions.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleSelection(selectedRestrictions, item, setSelectedRestrictions)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                              active
                                ? 'bg-pink-500/20 text-pink-300 border-pink-400/60'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Voice / Text Box */}
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 220))}
                      placeholder="點擊右下角麥克風說出需求，例如：「預算150元內，今天加班很累想吃熱的，不想太油想補青菜...」"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-3 pr-20 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition resize-none"
                    />
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition ${
                          isRecording
                            ? 'bg-pink-500 text-white border-pink-400 animate-pulse'
                            : 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-amber-400 border-amber-400/40'
                        }`}
                        title="語音輸入點餐需求 (zh-TW)"
                      >
                        {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotes('')}
                        className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 flex items-center justify-center transition"
                        title="清空文字"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Module 2: Photo Capture / Menu Upload */}
                <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-white flex items-center gap-2">
                      <CameraIcon className="w-4 h-4 text-cyan-400" /> 模組 2｜拍照辨識餐點或菜單
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      影像 [7][8][9]
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="flex-1 text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <CameraIcon className="w-3.5 h-3.5" />
                      <span>開啟相機拍攝</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>相簿上傳照片</span>
                    </button>
                  </div>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (!imageSrc) fileInputRef.current?.click();
                    }}
                    className={`group relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition bg-slate-900/80 flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
                      imageSrc ? 'border-cyan-500/50' : 'border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {!imageSrc ? (
                      <div className="text-center p-6 space-y-2 pointer-events-none">
                        <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-200">拖曳或點擊上傳餐點／菜單照片</p>
                      </div>
                    ) : (
                      <>
                        <img src={imageSrc} alt="外食餐點或菜單採樣" className="w-full h-full object-cover" />
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center"
                        >
                          <span className="text-xs font-bold text-white bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-600 flex items-center gap-1.5">
                            <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> 更換照片
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick sample pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {Object.values(sampleFoods).map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => loadPresetSample(sample.id)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap border border-slate-700 transition"
                      >
                        {sample.badge}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={handleStartAnalysis}
                    className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 hover:brightness-110 active:scale-[0.99] transition shadow-neon-cyan flex items-center justify-center gap-2 cursor-pointer ${
                      isAnalyzing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>{isAnalyzing ? 'AI 營養估算與收斂推薦中...' : '啟動導覽員｜估算營養並推薦 3 選項'}</span>
                  </button>
                </div>
              </section>

              {/* Right Column: Module 2 Nutrition Output + Module 3 Recommendations */}
              <section className="lg:col-span-7 space-y-6">
                {!isAnalyzing && !result && (
                  <div className="bg-[#0e101c]/70 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[580px]">
                    <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                      <Compass className="w-9 h-9 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-black text-white">準備好告別「不知道吃什麼」了嗎？</h3>
                    <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
                      左側已載入台灣外食範例！確認預算、心情與忌口後點擊「啟動導覽員」，AI 將為您完成熱量與三大營養素估算，並依據選擇過載研究 [4] 精準收斂出 <strong className="text-cyan-300">3 個推薦選項</strong>。
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-2.5 text-left max-w-md w-full">
                      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300">
                        <strong className="text-cyan-300 block mb-0.5">模組 2｜營養估算 [7][8][9]</strong>
                        自動識別餐點或菜單，推算熱量、蛋白質／碳水／脂肪與我的餐盤缺口。
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300">
                        <strong className="text-emerald-300 block mb-0.5">模組 3｜3 選項輕推 [4][5][6]</strong>
                        不給一長串菜單，只精選 3 個最貼合預算的組合並附上營養識讀小知識。
                      </div>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="bg-[#0e101c]/95 border border-cyan-400/50 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[580px] border-glow-cyan">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                      <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-emerald-400 rounded-full animate-spin" />
                      <Sparkles className="w-9 h-9 text-cyan-400 animate-pulse" />
                    </div>
                    <h3 className="text-base font-black text-white">
                      {loadingStep === 1
                        ? '[模組 2] 多模態影像辨識菜色與估算份量中...'
                        : loadingStep === 2
                        ? '[模組 1+4] 比對預算、忌口與本週蔬果缺口...'
                        : '[模組 3] 啟動數位輕推，收斂為 3 個精準選項...'}
                    </h3>
                    <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 transition-all duration-700"
                        style={{
                          width: loadingStep === 1 ? '35%' : loadingStep === 2 ? '70%' : '95%',
                        }}
                      />
                    </div>
                  </div>
                )}

                {result && !isAnalyzing && (
                  <div className="space-y-5">
                    {/* Module 2 Result Header + Nutrition Summary */}
                    <div className="bg-[#0e101c]/95 border border-white/10 rounded-3xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
                              {result.inputKind === 'menu' ? '菜單看板辨識 [8]' : '餐點影像辨識 [7][8]'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {result.category}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                              {result.verdict}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-white">
                            {result.detectedName}
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">{result.summary}</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-center flex-shrink-0">
                          <span className="block text-[10px] font-mono text-slate-400">均衡綜合分</span>
                          <span className="text-2xl font-display font-black text-cyan-300">
                            {result.overallScore}
                          </span>
                        </div>
                      </div>

                      {/* Radar + Macros & MyPlate */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-800/80">
                        <div className="md:col-span-6 flex items-center justify-center">
                          <RadarChart scores={result.scores} tone={currentTone} />
                        </div>

                        <div className="md:col-span-6 space-y-3 flex flex-col justify-center">
                          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="font-bold text-slate-300">估算熱量與三大營養素</span>
                              <span className="font-mono text-amber-300 font-bold">
                                ~${result.estimatedPrice}｜{result.calories} kcal
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-slate-950/80 rounded-xl p-2 border border-slate-800">
                                <span className="block text-[10px] text-slate-400">蛋白質</span>
                                <span className="text-sm font-mono font-bold text-cyan-300">
                                  {result.macros.protein}g
                                </span>
                              </div>
                              <div className="bg-slate-950/80 rounded-xl p-2 border border-slate-800">
                                <span className="block text-[10px] text-slate-400">碳水</span>
                                <span className="text-sm font-mono font-bold text-amber-300">
                                  {result.macros.carbs}g
                                </span>
                              </div>
                              <div className="bg-slate-950/80 rounded-xl p-2 border border-slate-800">
                                <span className="block text-[10px] text-slate-400">脂肪</span>
                                <span className="text-sm font-mono font-bold text-pink-400">
                                  {result.macros.fat}g
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-2">
                              膳食纖維約 {result.macros.fiberGrams}g｜蔬菜 {result.macros.vegServings} 份｜水果 {result.macros.fruitServings} 份
                            </p>
                          </div>

                          {/* MyPlate Checklist */}
                          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
                            <span className="block text-xs font-bold text-slate-300 mb-2">
                              國健署「我的餐盤」檢核
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { key: 'wholeGrains', label: '全穀雜糧' },
                                { key: 'protein', label: '豆魚蛋肉' },
                                { key: 'vegetables', label: '蔬菜' },
                                { key: 'fruit', label: '水果' },
                                { key: 'dairyOrNuts', label: '乳品/堅果' },
                              ].map((item) => {
                                const met = result.myPlateCheck[item.key as keyof typeof result.myPlateCheck];
                                return (
                                  <span
                                    key={item.key}
                                    className={`text-[10px] px-2 py-1 rounded-lg border font-bold ${
                                      met
                                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                                        : 'bg-slate-800 text-slate-500 border-slate-700'
                                    }`}
                                  >
                                    {met ? '✓ ' : '缺 '}
                                    {item.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Honest Disclaimer per Reference [9] */}
                          <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/25 rounded-xl p-2.5">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>
                              {result.disclaimer ||
                                '熱量與三大營養素為多模態 AI 視覺估算值，僅供日常飲食參考（Fridolfsson et al., 2025 [9]）。'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Voice Guide Box */}
                    <div className={`bg-[#0e101c]/95 border rounded-3xl p-4 sm:p-5 ${activeToneProfile.glowClass}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{activeToneProfile.avatar}</span>
                          <div>
                            <h3 className="text-sm font-black text-white">{activeToneProfile.name}</h3>
                            <p className="text-[11px] text-slate-400">{result.myPlateLesson}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayTTS()}
                          disabled={isAudioLoading}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition self-start sm:self-center cursor-pointer"
                        >
                          {isAudioLoading ? (
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          ) : isPlayingAudio ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isAudioLoading
                              ? '語音合成中...'
                              : isPlayingAudio
                              ? '停止朗讀'
                              : '語音播放導覽'}
                          </span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/70 rounded-2xl p-3 border border-slate-800">
                        「{result.voiceScripts[currentTone] || result.summary}」
                      </p>
                    </div>

                    {/* Module 3: Strictly 3 Personalized Recommendations [4][5][6] */}
                    <div className="bg-[#0e101c]/95 border border-white/10 rounded-3xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                            模組 3｜個人化推薦（認知減負與數位輕推 [4][5][6]）
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-white mt-1.5">
                            為您精準收斂為「3 個最佳選項」
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          避免選擇過載 [4]，點選即可存入週飲食儀表板
                        </span>
                      </div>

                      <div className="space-y-3">
                        {result.recommendations.map((opt, idx) => {
                          const isAdopted = selectedOptionId === opt.id;
                          return (
                            <div
                              key={opt.id}
                              className={`rounded-2xl p-4 border transition space-y-2.5 ${
                                idx === 0
                                  ? 'bg-gradient-to-br from-emerald-500/12 via-slate-900/90 to-slate-900/90 border-emerald-400/50'
                                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <span className="text-[11px] font-bold text-emerald-300">
                                    選項 {idx + 1}｜{opt.badge}
                                  </span>
                                  <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                                    {opt.title}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 border border-slate-800">
                                    約 ${opt.estimatedPrice}
                                  </span>
                                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800">
                                    {opt.calories} kcal
                                  </span>
                                  <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-300">
                                    契合度 {opt.matchScore}%
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed">
                                <strong className="text-white">推薦原因：</strong>
                                {opt.reason}
                              </p>

                              <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-2.5 text-[11px] text-cyan-200 leading-relaxed">
                                <strong>📖 我的餐盤・營養識讀：</strong>
                                {opt.nutritionTip}
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                                <span className="text-[11px] text-slate-400">
                                  💡 點餐小技巧：{opt.actionHint}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAdoptOption(opt)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer flex-shrink-0 ${
                                    isAdopted
                                      ? 'bg-emerald-500 text-slate-950'
                                      : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{isAdopted ? '已採納並記錄！' : '就決定吃這餐（記錄）'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setActiveTab('dashboard')}
                          className="text-xs text-emerald-300 hover:underline flex items-center gap-1.5"
                        >
                          <BarChart3 className="w-3.5 h-3.5" /> 前往「週飲食紀錄儀表板」查看趨勢
                        </button>
                        <button
                          type="button"
                          onClick={copyDecisionReport}
                          className="text-xs text-slate-200 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition"
                        >
                          {copySuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>已複製決策報告！</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>複製 3 選項導覽報告</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      <TamSurveyModal
        isOpen={isTamOpen}
        entries={tamEntries}
        onClose={() => setIsTamOpen(false)}
        onSubmit={(entry) => {
          const updated = [entry, ...tamEntries];
          setTamEntries(updated);
          localStorage.setItem(TAM_STORAGE_KEY, JSON.stringify(updated));
        }}
      />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 max-w-sm bg-slate-900 border border-cyan-400 text-white text-xs p-4 rounded-2xl shadow-2xl z-50 flex items-start gap-3 backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold mb-0.5">今日食光導覽員提示</p>
            <p className="text-slate-300">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-500 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
