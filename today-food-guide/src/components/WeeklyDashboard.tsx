import React, { useMemo } from 'react';
import {
  BarChart3,
  Clock,
  Wallet,
  Leaf,
  Flame,
  Trash2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { DietLogEntry } from '../types';

interface WeeklyDashboardProps {
  logs: DietLogEntry[];
  onDeleteOne: (id: string) => void;
  onClearAll: () => void;
  onRestoreDemo: () => void;
  onInspectLog: (entry: DietLogEntry) => void;
}

export const WeeklyDashboard: React.FC<WeeklyDashboardProps> = ({
  logs,
  onDeleteOne,
  onClearAll,
  onRestoreDemo,
  onInspectLog,
}) => {
  const stats = useMemo(() => {
    if (logs.length === 0) {
      return {
        avgPrice: 0,
        totalSpend: 0,
        avgCalories: 0,
        avgDecisionSeconds: 0,
        avgVegServings: 0,
        avgFruitServings: 0,
        vegTargetRate: 0,
        uniqueCategories: 0,
        macroPct: { protein: 0, carbs: 0, fat: 0 },
      };
    }

    const totalSpend = logs.reduce((acc, item) => acc + item.price, 0);
    const totalCal = logs.reduce((acc, item) => acc + item.calories, 0);
    const totalSec = logs.reduce((acc, item) => acc + item.decisionSeconds, 0);
    const totalVeg = logs.reduce((acc, item) => acc + item.vegServings, 0);
    const totalFruit = logs.reduce((acc, item) => acc + (item.fruitServings || 0), 0);

    const proteinCal = logs.reduce((acc, item) => acc + item.macros.protein * 4, 0);
    const carbsCal = logs.reduce((acc, item) => acc + item.macros.carbs * 4, 0);
    const fatCal = logs.reduce((acc, item) => acc + item.macros.fat * 9, 0);
    const macroTotal = Math.max(1, proteinCal + carbsCal + fatCal);

    const vegGoodCount = logs.filter((item) => item.vegServings >= 1.5).length;
    const categories = new Set(logs.map((item) => item.category));

    return {
      avgPrice: Math.round(totalSpend / logs.length),
      totalSpend,
      avgCalories: Math.round(totalCal / logs.length),
      avgDecisionSeconds: Math.round(totalSec / logs.length),
      avgVegServings: Number((totalVeg / logs.length).toFixed(1)),
      avgFruitServings: Number((totalFruit / logs.length).toFixed(1)),
      vegTargetRate: Math.round((vegGoodCount / logs.length) * 100),
      uniqueCategories: categories.size,
      macroPct: {
        protein: Math.round((proteinCal / macroTotal) * 100),
        carbs: Math.round((carbsCal / macroTotal) * 100),
        fat: Math.round((fatCal / macroTotal) * 100),
      },
    };
  }, [logs]);

  const maxCal = useMemo(
    () => Math.max(800, ...logs.map((item) => item.calories)),
    [logs]
  );

  const recentChartLogs = useMemo(() => [...logs].slice(0, 7).reverse(), [logs]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
              模組 4｜飲食紀錄儀表板
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              文獻依據 [1][2]
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            一週外食營養均衡、預算花費與決策效能儀表板
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            對照國健署調查指出「八成以上外食員工每日未達 3 蔬 2 果」[1] 及「青年七至九成每日至少一餐外食」[2]，追蹤您的餐盤均衡與決策時間縮短幅度。
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onRestoreDemo}
            className="text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>載入示範週紀錄</span>
          </button>
          {logs.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空紀錄</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e101c]/90 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Clock className="w-4 h-4 text-cyan-400" /> 平均決策時間
            </span>
            <span className="text-[10px] font-mono text-emerald-400">vs 問卷 5–30 分</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-black text-cyan-300">
              {stats.avgDecisionSeconds || '--'}
            </span>
            <span className="text-xs text-slate-400">秒 / 餐</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            前期問卷 94.7% 受訪者耗時 5–30 分鐘；收斂為 3 選項大幅縮短選餐時間 [4]。
          </p>
        </div>

        <div className="bg-[#0e101c]/90 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Wallet className="w-4 h-4 text-amber-400" /> 單餐平均花費
            </span>
            <span className="text-[10px] font-mono text-amber-300">目標 100–200 元</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-black text-amber-300">
              ${stats.avgPrice}
            </span>
            <span className="text-xs text-slate-400">累計 ${stats.totalSpend}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {stats.avgPrice <= 200
              ? '穩定控制在多數外食族 100–200 元核心預算區間內。'
              : '近期均價略高於 200 元，可優先採納「高 CP 選項」平衡。'}
          </p>
        </div>

        <div className="bg-[#0e101c]/90 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Leaf className="w-4 h-4 text-emerald-400" /> 每餐平均蔬菜
            </span>
            <span className="text-[10px] font-mono text-emerald-300">達標率 {stats.vegTargetRate}%</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-black text-emerald-300">
              {stats.avgVegServings}
            </span>
            <span className="text-xs text-slate-400">份 / 餐（水果 {stats.avgFruitServings} 份）</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            對齊國健署「3 蔬 2 果」與「我的餐盤」標準，建議每餐至少 1.5 份蔬菜 [1]。
          </p>
        </div>

        <div className="bg-[#0e101c]/90 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Flame className="w-4 h-4 text-pink-400" /> 單餐平均熱量
            </span>
            <span className="text-[10px] font-mono text-purple-300">多樣性 {stats.uniqueCategories} 類</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-black text-pink-400">
              {stats.avgCalories}
            </span>
            <span className="text-xs text-slate-400">kcal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            熱量為 AI 視覺估算僅供參考 [9]；保持多樣類別能降低單一飲食風險。
          </p>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Calories & Spend Trend Bar Chart */}
        <div className="lg:col-span-7 bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> 近期外食熱量與花費趨勢
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">最近 {recentChartLogs.length} 餐</span>
          </div>

          {recentChartLogs.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-slate-500 text-xs">
              <p>尚無外食紀錄，請至「AI 飲食決策導覽」選擇餐點並記錄！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentChartLogs.map((entry) => {
                const widthPct = Math.max(12, Math.round((entry.calories / maxCal) * 100));
                const dateLabel = new Date(entry.timestamp).toLocaleDateString('zh-TW', {
                  month: 'numeric',
                  day: 'numeric',
                });
                return (
                  <div key={entry.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[65%]">
                        <span className="text-slate-500 font-mono mr-2">{dateLabel}</span>
                        {entry.selectedOptionTitle}
                      </span>
                      <span className="font-mono text-slate-300 flex-shrink-0">
                        <span className="text-amber-300">${entry.price}</span> ·{' '}
                        <span className="text-cyan-300">{entry.calories} kcal</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Macros Ratio & Nutrition Reflection */}
        <div className="lg:col-span-5 bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" /> 三大營養素熱量佔比與飲食反思
            </h3>

            {/* Stacked Macro Bar */}
            <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800 mb-3">
              <div
                style={{ width: `${stats.macroPct.protein}%` }}
                className="bg-cyan-400 h-full transition-all"
                title={`蛋白質 ${stats.macroPct.protein}%`}
              />
              <div
                style={{ width: `${stats.macroPct.carbs}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`碳水化合物 ${stats.macroPct.carbs}%`}
              />
              <div
                style={{ width: `${stats.macroPct.fat}%` }}
                className="bg-pink-500 h-full transition-all"
                title={`脂肪 ${stats.macroPct.fat}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                <span className="block text-[10px] text-slate-400">蛋白質</span>
                <span className="font-mono font-bold text-cyan-300">{stats.macroPct.protein}%</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                <span className="block text-[10px] text-slate-400">碳水化合物</span>
                <span className="font-mono font-bold text-amber-300">{stats.macroPct.carbs}%</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                <span className="block text-[10px] text-slate-400">脂肪</span>
                <span className="font-mono font-bold text-pink-400">{stats.macroPct.fat}%</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4" /> 本週「我的餐盤」正向行動回饋
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {logs.length === 0
                ? '開始記錄您的第一餐，系統將自動追蹤您是否補足蔬菜與控制單餐預算！'
                : stats.avgVegServings >= 1.5
                ? `很棒！您近期平均每餐攝取 ${stats.avgVegServings} 份蔬菜，明顯優於多數職場外食族，且決策耗時平均僅 ${stats.avgDecisionSeconds} 秒！`
                : `目前平均每餐蔬菜為 ${stats.avgVegServings} 份（水果 ${stats.avgFruitServings} 份），下次點便當或麵食時可試著採納「加點燙青菜或飯後一顆芭樂」輕推建議。`}
            </p>
          </div>
        </div>
      </div>

      {/* History Log Table / List */}
      <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white">外食決策紀錄明細（共 {logs.length} 筆）</h3>
          <span className="text-[11px] text-slate-500">資料儲存於瀏覽器 localStorage</span>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">目前尚無外食紀錄。</p>
        ) : (
          <div className="space-y-2.5">
            {logs.map((entry) => {
              const formattedDate = new Date(entry.timestamp).toLocaleString('zh-TW', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {entry.imageUrl ? (
                      <img
                        src={entry.imageUrl}
                        alt={entry.detectedName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                        🍽️
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {entry.category}
                        </span>
                        {entry.isDemo && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            示範資料
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-mono">{formattedDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate mt-1">
                        {entry.selectedOptionTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        P {entry.macros.protein}g / C {entry.macros.carbs}g / F {entry.macros.fat}g · 蔬菜 {entry.vegServings} 份 · 決策 {entry.decisionSeconds} 秒
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 flex-shrink-0">
                    <div className="text-right mr-2">
                      <span className="block text-sm font-mono font-bold text-amber-300">${entry.price}</span>
                      <span className="block text-[11px] font-mono text-slate-400">{entry.calories} kcal</span>
                    </div>

                    {entry.analysisResult && (
                      <button
                        type="button"
                        onClick={() => onInspectLog(entry)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs flex items-center gap-1 transition"
                        title="回看完整分析報告"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">回看</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteOne(entry.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
                      title="刪除紀錄"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
