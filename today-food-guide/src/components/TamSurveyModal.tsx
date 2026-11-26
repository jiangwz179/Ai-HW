import React, { useState, useMemo } from 'react';
import { X, ClipboardCheck, Star, CheckCircle2 } from 'lucide-react';
import { TamSurveyEntry } from '../types';

interface TamSurveyModalProps {
  isOpen: boolean;
  entries: TamSurveyEntry[];
  onClose: () => void;
  onSubmit: (entry: TamSurveyEntry) => void;
}

export const TamSurveyModal: React.FC<TamSurveyModalProps> = ({
  isOpen,
  entries,
  onClose,
  onSubmit,
}) => {
  const [usefulness, setUsefulness] = useState(5);
  const [easeOfUse, setEaseOfUse] = useState(5);
  const [reducesOverload, setReducesOverload] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const avgStats = useMemo(() => {
    if (entries.length === 0) return null;
    const avgPU = entries.reduce((a, b) => a + b.usefulnessScore, 0) / entries.length;
    const avgPEOU = entries.reduce((a, b) => a + b.easeOfUseScore, 0) / entries.length;
    const avgOverload = entries.reduce((a, b) => a + b.reducesOverloadScore, 0) / entries.length;
    return {
      count: entries.length,
      pu: avgPU.toFixed(1),
      peou: avgPEOU.toFixed(1),
      overload: avgOverload.toFixed(1),
    };
  }, [entries]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Date.now().toString(),
      timestamp: Date.now(),
      usefulnessScore: usefulness,
      easeOfUseScore: easeOfUse,
      reducesOverloadScore: reducesOverload,
      comment: comment.trim(),
    });
    setSubmitted(true);
    setComment('');
    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  const renderScale = (
    label: string,
    sub: string,
    value: number,
    onChange: (n: number) => void
  ) => (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
      <div>
        <p className="text-xs font-bold text-white">{label}</p>
        <p className="text-[11px] text-slate-400">{sub}</p>
      </div>
      <div className="flex items-center justify-between gap-1.5">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-1 ${
              value === num
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Star className={`w-3 h-3 ${value >= num ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{num}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0d0f1a] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">系統接受度回饋問卷（TAM）[10]</h3>
              <p className="text-[11px] text-slate-400">
                依據 Davis (1989) 知覺有用性與知覺易用性量表
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
          {avgStats && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-cyan-200 font-bold">已收集 {avgStats.count} 份體驗回饋</span>
              <span className="font-mono text-cyan-300">
                有用性 {avgStats.pu} / 易用性 {avgStats.peou} / 減負 {avgStats.overload}
              </span>
            </div>
          )}

          {renderScale(
            '1. 知覺有用性（Perceived Usefulness）',
            '系統能有效縮短我決定外食的時間，並幫助注意營養均衡',
            usefulness,
            setUsefulness
          )}

          {renderScale(
            '2. 知覺易用性（Perceived Ease of Use）',
            '透過拍照與語音點餐需求的操作門檻低、直覺好上手',
            easeOfUse,
            setEaseOfUse
          )}

          {renderScale(
            '3. 選擇減負感受（Choice Overload Reduction [4]）',
            '收斂為「3 個推薦選項」比看到一整長串清單更容易做決定',
            reducesOverload,
            setReducesOverload
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              質性建議（選填）
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="例如：喜歡我的餐盤小知識、希望之後可支援更多飲料店菜單..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {submitted && (
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-2.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>已儲存您的 TAM 回饋數據，感謝協助完成系統評估閉環！</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 text-xs font-black tracking-wider transition cursor-pointer"
          >
            送出 TAM 體驗評估
          </button>
        </form>
      </div>
    </div>
  );
};
