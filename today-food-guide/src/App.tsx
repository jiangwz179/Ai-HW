import React, { useState, useEffect, useRef } from 'react';
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
  Flame,
  GlassWater,
  Lightbulb,
  Sparkles,
  ChevronDown,
  History,
  Radio,
  Share2,
} from 'lucide-react';

import {
  CriticType,
  CritiqueResult,
  CriticProfile,
  HistoryItem,
} from './types';
import { sampleFoods } from './data/samples';
import { RadarChart } from './components/RadarChart';
import { CameraModal } from './components/CameraModal';
import { HistoryModal } from './components/HistoryModal';
import {
  playStampSound,
  playScoreFanfare,
  toggleNightMarketSizzle,
} from './utils/audio';

const CRITIC_PROFILES: Record<CriticType, CriticProfile> = {
  toxic: {
    id: 'toxic',
    name: '高登式・毒舌美食戰神',
    avatar: '🌶️',
    frontTitle: '評審官・極度毒舌點評',
    badgeText: '毒舌點評中',
    colorName: 'pink',
    themeHex: '#ff007f',
    glowClass: 'border-glow-pink',
    manifesto:
      '「如果你端出這盤爛油炸麵團是為了侮辱我的舌頭，那恭喜你成功了！評分絕不留情面。」',
    quoteSample: '連吸血鬼聞到這蒜泥都要連夜退租！',
  },
  cozy: {
    id: 'cozy',
    name: '溫馨療癒・巷弄美食部落客',
    avatar: '🧁',
    frontTitle: '評審官・暖心療癒點評',
    badgeText: '溫馨分享中',
    colorName: 'yellow',
    themeHex: '#ffe600',
    glowClass: 'border-glow-yellow',
    manifesto:
      '「每一道夜市小吃都是市井生活的溫暖煙火氣。用包容與感恩的心，品味舌尖上的樸實幸福。」',
    quoteSample: '酥脆與溫潤在舌尖化開，那是歸家般的踏實慰藉。',
  },
  michelin: {
    id: 'michelin',
    name: '米其林密探・挑剔評鑑特派員',
    avatar: '⭐',
    frontTitle: '評審官・星級密探審查',
    badgeText: '星級嚴審中',
    colorName: 'cyan',
    themeHex: '#00f3ff',
    glowClass: 'border-glow-cyan',
    manifesto:
      '「探究食材的風土表現、梅納反應的火候掌握與酸甜油脂平衡。在街頭小吃中尋找極致的工藝標準。」',
    quoteSample: '油溫控制與發酵菌種展現出成熟的街頭熟成工藝。',
  },
};

const QUICK_TAGS = ['+外皮超酥脆', '+蒜泥加爆', '+微辣爆汁', '+稍微偏油', '+排隊20分鐘', '+CP值極高'];

export default function App() {
  // Application State
  const [currentCritic, setCurrentCritic] = useState<CriticType>('toxic');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [tastingNotes, setTastingNotes] = useState<string>('');
  
  // Evaluation & Results
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Audio & Speech
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isSizzleActive, setIsSizzleActive] = useState<boolean>(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Speech Recognition (Dictation)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Modals & UI
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from LocalStorage & set initial sample
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nm_critic_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load history', e);
    }
    // Load default sample
    loadPresetSample('stinkyTofu');
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Preset sample loader
  const loadPresetSample = (key: string) => {
    const sample = sampleFoods[key];
    if (!sample) return;
    const base64Data = btoa(unescape(encodeURIComponent(sample.svg)));
    const dataUrl = `data:image/svg+xml;base64,${base64Data}`;
    setImageSrc(dataUrl);
    setImageBase64(base64Data);
    setImageMimeType('image/svg+xml');
    setTastingNotes(sample.notes);
    setIsPresetDropdownOpen(false);
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('請上傳有效的照片檔案 (JPG, PNG, WEBP 等)');
      return;
    }
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageSrc(dataUrl);
      const b64 = dataUrl.split(',')[1];
      setImageBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  // Camera snapshot handler
  const handleCameraCapture = (b64: string, mime: string) => {
    const dataUrl = `data:${mime};base64,${b64}`;
    setImageSrc(dataUrl);
    setImageBase64(b64);
    setImageMimeType(mime);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Speech Recognition (Dictation)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('您的瀏覽器未支援語音輸入功能，請直接使用鍵盤輸入。');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-TW';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTastingNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  // Quick tag append
  const addQuickTag = (tag: string) => {
    setTastingNotes((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  // Sound sizzle toggle
  const handleToggleSizzle = () => {
    const nextState = !isSizzleActive;
    setIsSizzleActive(nextState);
    toggleNightMarketSizzle(nextState);
  };

  // Analyze Food Submission
  const handleStartAnalysis = async () => {
    if (!imageBase64) {
      showToast('請先拍攝或上傳小吃照片，或選擇上方範例美食！');
      return;
    }

    stopAudio();
    setIsAnalyzing(true);
    setLoadingStep(1);
    setResult(null);

    // Step simulation
    const timer1 = setTimeout(() => setLoadingStep(2), 1200);
    const timer2 = setTimeout(() => setLoadingStep(3), 2600);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: imageMimeType,
          notes: tastingNotes,
          critic: currentCritic,
        }),
      });

      if (!response.ok) {
        throw new Error('伺服器評審連線異常');
      }

      const data: CritiqueResult = await response.json();
      setResult(data);
      playStampSound();

      if (data.totalScore >= 85) {
        playScoreFanfare();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff007f', '#00f3ff', '#ffe600', '#39ff14'],
        });
      }

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        foodName: data.foodName,
        category: data.category,
        totalScore: data.totalScore,
        verdict: data.verdict,
        critic: currentCritic,
        imageUrl: imageSrc,
        result: data,
      };

      setHistory((prev) => {
        const updated = [newHistoryItem, ...prev.slice(0, 19)];
        localStorage.setItem('nm_critic_history', JSON.stringify(updated));
        return updated;
      });

      // Automatically play voice review if not muted
      if (!isMuted) {
        setTimeout(() => {
          handlePlayTTS(data, currentCritic);
        }, 600);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      showToast('小吃解析已為您啟用老饕特級備案！');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsAnalyzing(false);
    }
  };

  // TTS Voice Playback
  const handlePlayTTS = async (
    targetResult: CritiqueResult | null = result,
    critic: CriticType = currentCritic
  ) => {
    if (!targetResult) return;

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    const reviewText = targetResult.reviews[critic] || targetResult.oneLineSummary;
    setIsAudioLoading(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reviewText,
          critic,
        }),
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
          playBrowserSpeech(reviewText, critic);
        };

        await audio.play();
        setIsPlayingAudio(true);
      } else {
        // Fallback to Web Speech API
        playBrowserSpeech(reviewText, critic);
      }
    } catch (e) {
      console.warn('TTS request error, using browser speech synthesis fallback', e);
      playBrowserSpeech(reviewText, critic);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const playBrowserSpeech = (text: string, critic: CriticType) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';

    if (critic === 'toxic') {
      utterance.rate = 1.25;
      utterance.pitch = 1.1;
    } else if (critic === 'cozy') {
      utterance.rate = 0.95;
      utterance.pitch = 1.15;
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
    }

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

  // Critic profile selector
  const selectCritic = (type: CriticType) => {
    setCurrentCritic(type);
    if (result && isPlayingAudio) {
      stopAudio();
    }
  };

  // Copy report
  const copyShareReport = () => {
    if (!result) return;
    const profile = CRITIC_PROFILES[currentCritic];
    const text = `🏮【夜市小吃評審官報告】🏮
小吃名稱：${result.foodName} (${result.category})
綜合總分：${result.totalScore} 分 [${result.verdict}]
五維評分：色 ${result.scores.color} | 香 ${result.scores.aroma} | 味 ${result.scores.taste} | 份量 ${result.scores.portion} | CP ${result.scores.value}
🔥熱量罪惡值：${result.calories} kcal (${result.exerciseEquiv})
🧋推薦解膩飲品：${result.pairedDrink.name}
💡內行避雷秘訣：${result.proTip}
${profile.avatar}【${profile.name}】點評：
「${result.reviews[currentCritic]}」`;

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const activeCriticProfile = CRITIC_PROFILES[currentCritic];

  return (
    <div className="relative min-h-screen bg-[#07080e] text-slate-100 font-sans overflow-x-hidden">
      {/* Subtle CRT Scanline Overlay */}
      <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none opacity-40" />

      {/* Ambient Cyberpunk Glow Orbs */}
      <div className="fixed -top-24 -left-24 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-[550px] h-[550px] bg-cyan-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/2 right-1/4 w-[360px] h-[360px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-white/10 bg-[#0e101c]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-neon-pink">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-yellow-400/15 text-yellow-300 border border-yellow-400/40">
                  TAIWAN NIGHT MARKET
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  v2.5 AI Powered
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500">
                夜市小吃評審官{' '}
                <span className="font-display text-sm tracking-normal text-cyan-400">CRITIC APP</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Quick Preset Selector */}
            <div className="relative">
              <button
                onClick={() => setIsPresetDropdownOpen((prev) => !prev)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden sm:inline">試玩範例小吃</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isPresetDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono">
                    精選夜市經典
                  </div>
                  {Object.values(sampleFoods).map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => loadPresetSample(sample.id)}
                      className="w-full text-left text-xs p-2 hover:bg-slate-800 rounded-xl flex items-center space-x-2 text-slate-300 hover:text-white transition"
                    >
                      <span className="text-sm">
                        {sample.id === 'stinkyTofu'
                          ? '🥢'
                          : sample.id === 'friedChicken'
                          ? '🍗'
                          : sample.id === 'oysterOmelet'
                          ? '🍳'
                          : '🍠'}
                      </span>
                      <span className="truncate">{sample.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sizzle Sound Generator Toggle */}
            <button
              onClick={handleToggleSizzle}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition ${
                isSizzleActive
                  ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400 shadow-neon-yellow'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isSizzleActive ? '關閉夜市油鍋嘶嘶聲' : '播放夜市油鍋嘶嘶環境音'}
            >
              <Radio className="w-4 h-4" />
            </button>

            {/* History Records Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="relative w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition flex items-center justify-center text-sm"
              title="查看歷史評審紀錄"
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white rounded-full text-[9px] font-mono flex items-center justify-center font-bold">
                  {history.length}
                </span>
              )}
            </button>

            {/* Audio Mute/Unmute */}
            <button
              onClick={() => {
                if (!isMuted) stopAudio();
                setIsMuted((prev) => !prev);
              }}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-pink-400 hover:border-pink-400 transition flex items-center justify-center text-sm"
              title={isMuted ? '開啟自動語音朗讀' : '靜音語音朗讀'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Critic Persona Selection Banner */}
        <section className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-4 sm:p-5 relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-black tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> 請選擇今日當值「評審風格」
              </span>
              <p className="text-xs text-slate-400">
                不同評審官擁有截然不同的犀利視角、評判口吻、推薦手搖飲與專屬語音演繹
              </p>
            </div>

            {/* 3 Critic Buttons */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md w-full">
              {(['toxic', 'cozy', 'michelin'] as CriticType[]).map((type) => {
                const profile = CRITIC_PROFILES[type];
                const isSelected = currentCritic === type;
                return (
                  <button
                    key={type}
                    onClick={() => selectCritic(type)}
                    className={`group relative p-2.5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? type === 'toxic'
                          ? 'border-pink-500/80 bg-pink-500/15 text-white shadow-neon-pink'
                          : type === 'cozy'
                          ? 'border-yellow-400/80 bg-yellow-400/15 text-white shadow-neon-yellow'
                          : 'border-cyan-400/80 bg-cyan-400/15 text-white shadow-neon-cyan'
                        : 'border-white/10 bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition">
                      {profile.avatar}
                    </span>
                    <span className="text-xs font-black tracking-wide text-center">
                      {type === 'toxic' ? '毒舌評審' : type === 'cozy' ? '溫馨部落客' : '米其林密探'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono scale-90">
                      {type === 'toxic' ? '高登暴躁風' : type === 'cozy' ? '暖心療癒感' : '精準挑剔派'}
                    </span>
                    {isSelected && (
                      <div
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                          type === 'toxic'
                            ? 'bg-pink-500 shadow-neon-pink'
                            : type === 'cozy'
                            ? 'bg-yellow-400 shadow-neon-yellow'
                            : 'bg-cyan-400 shadow-neon-cyan'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Two-Column Grid: Sampling & Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Photo & Tasting Notes Input */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400" />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <CameraIcon className="w-4 h-4 text-pink-400" /> 1. 小吃採樣拍照 / 上傳
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <CameraIcon className="w-3 h-3" />
                    <span>即時鏡頭</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <Upload className="w-3 h-3" />
                    <span>相簿上傳</span>
                  </button>
                </div>
              </div>

              {/* Dropzone Container */}
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
                  <div className="flex flex-col items-center text-center p-6 space-y-3 pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400 text-2xl group-hover:scale-110 shadow-neon-cyan transition-all duration-300">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">點擊上傳或拖曳夜市小吃照片</p>
                      <p className="text-xs text-slate-500 mt-1">夜市昏暗也沒關係，AI 智慧深度辨析</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={imageSrc}
                      alt="夜市小吃採樣照片"
                      className="w-full h-full object-cover"
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center"
                    >
                      <span className="text-xs font-bold text-white bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-600 flex items-center gap-1.5 shadow-lg">
                        <RotateCw className="w-4 h-4 text-cyan-400" /> 更換照片
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Sample Selector Pills */}
              <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[11px] text-slate-400 whitespace-nowrap">試吃範例：</span>
                {Object.values(sampleFoods).map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => loadPresetSample(sample.id)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap border border-slate-700 transition"
                  >
                    {sample.id === 'stinkyTofu'
                      ? '🥢 臭豆腐'
                      : sample.id === 'friedChicken'
                      ? '🍗 雞排'
                      : sample.id === 'oysterOmelet'
                      ? '🍳 蚵仔煎'
                      : '🍠 地瓜球'}
                  </button>
                ))}
              </div>

              {/* Step 2: Tasting Notes & Voice Input */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-yellow-400" /> 2. 語音心得 / 補充線索
                  </label>
                  {isRecording && (
                    <span className="text-[11px] text-pink-400 font-mono font-bold animate-pulse flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500" /> 正在語音辨識中...
                    </span>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={tastingNotes}
                    onChange={(e) => setTastingNotes(e.target.value.slice(0, 200))}
                    placeholder="例如：「外皮超級酥脆，咬下去會爆汁！蒜泥給很多很過癮，但稍微有點油...」"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-3 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition resize-none"
                  />

                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs transition ${
                        isRecording
                          ? 'bg-pink-500 text-white border-pink-400 shadow-neon-pink'
                          : 'bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-yellow-400 border-yellow-400/40'
                      }`}
                      title="點擊用語音說出試吃心得"
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTastingNotes('')}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition flex items-center justify-center text-xs"
                      title="清空文字"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Tasting Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addQuickTag(tag)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>💡 支援中文語音辨識；也可點擊常用標籤快速補充。</span>
                  <span className="font-mono text-slate-600">{tastingNotes.length}/200</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleStartAnalysis}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-widest uppercase text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 hover:brightness-110 active:scale-[0.99] transition duration-200 shadow-neon-pink flex items-center justify-center gap-2 cursor-pointer ${
                    isAnalyzing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>{isAnalyzing ? '評審官深度審核中...' : '召喚評審開始評分'}</span>
                </button>
              </div>
            </div>

            {/* Critic Manifesto Card */}
            <div className="bg-[#0e101c]/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  currentCritic === 'toxic'
                    ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                    : currentCritic === 'cozy'
                    ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300'
                    : 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'
                }`}
              >
                {activeCriticProfile.avatar}
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-slate-200 text-sm">{activeCriticProfile.name}</h4>
                <p className="text-slate-400 mt-0.5 line-clamp-2">{activeCriticProfile.manifesto}</p>
              </div>
            </div>
          </section>

          {/* Right Column: Dynamic Dashboard & Interactive Report */}
          <section className="lg:col-span-7 space-y-6">
            {/* Empty State */}
            {!isAnalyzing && !result && (
              <div className="bg-[#0e101c]/70 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[540px] relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-4xl mb-4 relative">
                  <Utensils className="w-10 h-10 text-slate-600" />
                  <div className="absolute inset-0 rounded-full border border-dashed border-slate-700 animate-[spin_20s_linear_infinite]" />
                </div>
                <h3 className="text-lg font-black text-slate-300">等待夜市小吃上桌審查</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
                  請在左側拍下美食照片，或點擊「試玩範例小吃」。評審官將會立即給出五維感官雷達評分、熱量預估、解膩手搖飲搭配及原聲語音講評！
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <span className="text-[11px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                    ⚡ 五維感官雷達圖
                  </span>
                  <span className="text-[11px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                    🔥 熱量罪惡值預估
                  </span>
                  <span className="text-[11px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                    🧋 絕配解膩手搖推薦
                  </span>
                  <span className="text-[11px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                    🎙️ AI 原聲語音播報
                  </span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <div className="bg-[#0e101c]/95 border border-cyan-400/50 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[540px] relative overflow-hidden border-glow-cyan">
                <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-pink-500 rounded-full animate-spin" />
                  <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
                </div>
                <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 tracking-wider">
                  {loadingStep === 1
                    ? '評審官正在瞇起眼睛檢視油光與火候...'
                    : loadingStep === 2
                    ? '調動夜市風味大數據，計算熱量罪惡值...'
                    : '評審官揮毫簽署評分卡，草擬獨門點評...'}
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {loadingStep === 1
                    ? '[1/3] 分析外觀金黃色澤與酥脆層次...'
                    : loadingStep === 2
                    ? '[2/3] 結合現場口感試吃心得，調配解膩飲品...'
                    : '[3/3] 正在生成五維感官雷達圖與原聲語音...'}
                </p>
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 transition-all duration-700"
                    style={{
                      width: loadingStep === 1 ? '35%' : loadingStep === 2 ? '70%' : '95%',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Result State */}
            {result && !isAnalyzing && (
              <div className="space-y-6">
                {/* Food Header Banner */}
                <div className="bg-[#0e101c]/95 border border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-300 border border-cyan-400/40">
                          {result.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            currentCritic === 'toxic'
                              ? 'bg-pink-500/15 text-pink-300 border-pink-500/40'
                              : currentCritic === 'cozy'
                              ? 'bg-yellow-400/15 text-yellow-300 border-yellow-400/40'
                              : 'bg-cyan-400/15 text-cyan-300 border-cyan-400/40'
                          }`}
                        >
                          {activeCriticProfile.badgeText}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                        {result.foodName}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 italic">
                        「{result.oneLineSummary}」
                      </p>

                      {/* Flavor Tags */}
                      {result.flavorTags && result.flavorTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {result.flavorTags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Overall Score Circular Widget */}
                    <div className="flex items-center self-end sm:self-center gap-3 bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl flex-shrink-0">
                      <div className="text-right">
                        <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          OVERALL SCORE
                        </span>
                        <span className="text-xs text-yellow-400 font-bold">
                          {result.verdict}
                        </span>
                      </div>
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="27"
                            stroke="#1f2937"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="27"
                            stroke={
                              result.totalScore >= 85
                                ? '#ffe600'
                                : result.totalScore >= 75
                                ? '#00f3ff'
                                : '#ff007f'
                            }
                            strokeWidth="4"
                            strokeDasharray="169.6"
                            strokeDashoffset={169.6 - (result.totalScore / 100) * 169.6}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute text-xl font-display font-black text-yellow-400">
                          {result.totalScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radar Chart & Nutrition Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Radar Chart (md: 7 cols) */}
                  <div className="md:col-span-7 bg-[#0e101c]/90 border border-white/10 rounded-3xl p-4 sm:p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> 五維感官雷達分析
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono">滿分 10.0</span>
                    </div>

                    <RadarChart scores={result.scores} critic={currentCritic} />

                    {/* 5 Dimension Badges */}
                    <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-800 text-center">
                      <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
                        <span className="block text-[10px] text-slate-400">色澤</span>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {result.scores.color.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
                        <span className="block text-[10px] text-slate-400">香氣</span>
                        <span className="text-xs font-mono font-bold text-pink-400">
                          {result.scores.aroma.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
                        <span className="block text-[10px] text-slate-400">味道</span>
                        <span className="text-xs font-mono font-bold text-yellow-400">
                          {result.scores.taste.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
                        <span className="block text-[10px] text-slate-400">份量</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {result.scores.portion.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
                        <span className="block text-[10px] text-slate-400">CP值</span>
                        <span className="text-xs font-mono font-bold text-purple-400">
                          {result.scores.value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Calories & Drink Pairing (md: 5 cols) */}
                  <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
                    {/* Calorie Box */}
                    <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-4 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-pink-500" /> 熱量罪惡指數
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          約{result.exerciseEquiv}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                          {result.calories}
                        </span>
                        <span className="text-xs text-slate-400 font-mono font-bold">
                          kcal / 份
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {result.calorieTip}
                      </p>
                    </div>

                    {/* Drink Pairing */}
                    <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-4 relative overflow-hidden">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                        <GlassWater className="w-3.5 h-3.5 text-cyan-400" /> 評審推薦解膩手搖
                      </span>
                      <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-xl flex-shrink-0">
                          🧋
                        </div>
                        <div className="text-xs">
                          <h5 className="font-bold text-white text-sm">
                            {result.pairedDrink.name}
                          </h5>
                          <p className="text-slate-400 mt-0.5 line-clamp-2">
                            {result.pairedDrink.reason}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Night Market Wisdom */}
                    <div className="bg-gradient-to-br from-purple-500/15 via-slate-900/80 to-slate-900/80 border border-purple-500/30 rounded-3xl p-4">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-purple-400" /> 內行老饕避雷建議
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {result.proTip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3D Flip Card: Active Critic Review */}
                <div className="perspective-1000">
                  <div
                    className={`flip-card-inner relative w-full rounded-3xl min-h-[220px] ${
                      isCardFlipped ? 'flipped' : ''
                    }`}
                  >
                    {/* Front Face: Review */}
                    <div
                      className={`flip-card-front w-full bg-[#0e101c]/95 border rounded-3xl p-5 sm:p-6 ${activeCriticProfile.glowClass}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{activeCriticProfile.avatar}</span>
                          <div>
                            <h4 className="text-sm font-black text-white">
                              {activeCriticProfile.frontTitle}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              依據相片光澤與現場試吃心得即時點評
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePlayTTS()}
                            disabled={isAudioLoading}
                            className={`px-4 py-2 rounded-xl text-white text-xs font-black tracking-wider flex items-center gap-2 transition shadow-lg ${
                              currentCritic === 'toxic'
                                ? 'bg-pink-600 hover:bg-pink-500 shadow-neon-pink'
                                : currentCritic === 'cozy'
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-neon-yellow'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-neon-cyan'
                            }`}
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
                                ? '語音調度中...'
                                : isPlayingAudio
                                ? '停止朗讀'
                                : '聆聽評審語音點評'}
                            </span>
                          </button>

                          {/* Pulsing Audio Bar */}
                          {isPlayingAudio && (
                            <div className="flex items-end gap-1 h-6 px-1">
                              <div className="w-1 bg-cyan-400 rounded-full audio-bar" />
                              <div className="w-1 bg-pink-500 rounded-full audio-bar" />
                              <div className="w-1 bg-yellow-400 rounded-full audio-bar" />
                              <div className="w-1 bg-cyan-400 rounded-full audio-bar" />
                              <div className="w-1 bg-pink-500 rounded-full audio-bar" />
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setIsCardFlipped(true)}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
                          >
                            <RotateCw className="w-3.5 h-3.5 inline mr-1" /> 改進建議
                          </button>
                        </div>
                      </div>

                      {/* Review Quote */}
                      <div className="relative pl-6 pr-2 py-2">
                        <span className="absolute left-0 top-0 text-3xl font-serif text-pink-500/60">
                          “
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed tracking-wide italic font-medium">
                          「{result.reviews[currentCritic] || result.oneLineSummary}」
                        </p>
                      </div>
                    </div>

                    {/* Back Face: Improvements */}
                    <div className="flip-card-back absolute inset-0 w-full h-full bg-slate-900 border border-cyan-400/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-glow-cyan">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-cyan-400" />
                            <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider">
                              評審官技術指導・店家改善建議
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCardFlipped(false)}
                            className="text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
                          >
                            返回主點評
                          </button>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-300">
                          {result.improvements.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono text-right pt-2 border-t border-slate-800/80">
                        ✦ TAIWAN NIGHT MARKET CRITIC PROTOCOL ✦
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopAudio();
                      setResult(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <RotateCw className="w-3.5 h-3.5 inline mr-1.5" /> 評審下一道小吃
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyShareReport}
                      className="text-xs text-slate-200 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>已複製報告！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>複製評審報告</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={(item) => {
          setResult(item.result);
          setImageSrc(item.imageUrl);
          setCurrentCritic(item.critic);
        }}
        onClear={() => {
          setHistory([]);
          localStorage.removeItem('nm_critic_history');
        }}
        onDeleteOne={(id) => {
          const updated = history.filter((h) => h.id !== id);
          setHistory(updated);
          localStorage.setItem('nm_critic_history', JSON.stringify(updated));
        }}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 max-w-sm bg-slate-900 border border-cyan-400 text-white text-xs p-4 rounded-2xl shadow-2xl z-50 flex items-start gap-3 backdrop-blur-md animate-bounce">
          <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold mb-0.5">夜市評審提醒</p>
            <p className="text-slate-300">{toastMessage}</p>
          </div>
          <button
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
