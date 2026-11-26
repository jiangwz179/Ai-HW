import React from 'react';
import { BookOpen, ExternalLink, Layers, Users, BarChart2, CheckCircle2 } from 'lucide-react';
import {
  LITERATURE_REFERENCES,
  MODULE_SPECS,
  PHASE_A_SURVEY_STATS,
  TEAM_MEMBERS,
} from '../data/literature';

export const LiteraturePanel: React.FC = () => {
  const stageBadgeColor = (stage: string) => {
    switch (stage) {
      case '痛點存在':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case '理論依據':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case '技術可行':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
      case '系統評估':
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Positioning & Phase A Evidence */}
      <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
              專題理論定位與 B 階段架構
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              【今日食光導覽員】多模態 AI 外食決策與營養導覽系統
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              副標：用拍照與語音告別「不知道吃什麼」｜定位為「外食族的營養識讀學習夥伴」
            </p>
          </div>
          <a
            href={PHASE_A_SURVEY_STATS.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 self-start transition"
          >
            <BarChart2 className="w-4 h-4" />
            <span>開啟 A 階段前期調研儀表板</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400">前期問卷痛點 1：決策困難</span>
            <p className="text-2xl font-display font-black text-rose-400 mt-1">
              {PHASE_A_SURVEY_STATS.decisionDifficultyRate}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">外食上班族與學生經常面臨不知道吃什麼</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400">前期問卷痛點 2：決策耗時</span>
            <p className="text-2xl font-display font-black text-amber-300 mt-1">
              {PHASE_A_SURVEY_STATS.decisionTimeRate}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              每次需花費 {PHASE_A_SURVEY_STATS.decisionTimeRange} 決定餐點
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400">核心預算區間與設計目標</span>
            <p className="text-2xl font-display font-black text-emerald-300 mt-1">
              {PHASE_A_SURVEY_STATS.typicalBudget}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              以「3 個精準選項」降低選擇過載 [4] 並附國健署我的餐盤知識
            </p>
          </div>
        </div>
      </div>

      {/* 4 AI Functional Modules */}
      <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 sm:p-6">
        <h3 className="text-sm font-black text-white flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-cyan-400" /> 四大 AI 功能模組與文獻對應架構
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULE_SPECS.map((mod) => (
            <div
              key={mod.number}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-white">
                  模組 {mod.number}｜{mod.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {mod.modality}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {mod.refs}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{mod.description}</p>
              <p className="text-[11px] text-emerald-300/90 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{mod.highlight}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 10 References */}
      <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" /> 10 篇核心支持文獻（痛點存在 → 理論依據 → 技術可行 → 系統評估）
          </h3>
          <span className="text-[11px] text-slate-400">
            嚴謹檢核引用品質，排除具撤稿爭議之 Wansink 研究
          </span>
        </div>

        <div className="space-y-3">
          {LITERATURE_REFERENCES.map((ref) => (
            <div
              key={ref.id}
              className="bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">[{ref.id}]</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${stageBadgeColor(ref.stage)}`}>
                    {ref.stage}
                  </span>
                </div>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>來源連結</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">{ref.citation}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300">支持論點：</strong>
                {ref.finding}
              </p>
              <p className="text-[11px] text-cyan-300/90 leading-relaxed">
                <strong className="text-cyan-300">本系統應用：</strong>
                {ref.systemMapping}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team & Module Ownership */}
      <div className="bg-[#0e101c]/90 border border-white/10 rounded-3xl p-5 sm:p-6">
        <h3 className="text-sm font-black text-white flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-pink-400" /> 小組成員與模組分工
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-300">{member.id}</span>
                  <span className="text-sm font-bold text-white">{member.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{member.moduleRole}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
