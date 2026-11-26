import React from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, Calendar, Award } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onSelect,
  onClear,
  onDeleteOne,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0d0f1a] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">小吃評審紀錄冊</h3>
              <p className="text-[11px] text-slate-400">已儲存 {history.length} 道夜市美味評審檔案</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 flex items-center gap-1.5 transition"
                title="清空所有歷史紀錄"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清空紀錄</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-2xl mb-3">
                🏮
              </div>
              <p className="text-sm font-bold text-slate-400">目前尚無歷史評審紀錄</p>
              <p className="text-xs text-slate-600 mt-1">
                拍下第一道夜市小吃並召喚評審後，報告將自動保存在此處。
              </p>
            </div>
          ) : (
            history.map((item) => {
              const formattedDate = new Date(item.timestamp).toLocaleString('zh-TW', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="group relative bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-4 transition duration-200 cursor-pointer"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.foodName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate mt-1">
                        {item.foodName}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.result.oneLineSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="block text-lg font-black font-mono text-yellow-400">
                        {item.totalScore}
                        <span className="text-xs text-slate-500 font-normal">分</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {item.verdict}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOne(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="刪除此紀錄"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
