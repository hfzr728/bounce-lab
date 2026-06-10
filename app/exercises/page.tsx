"use client";
// 动作库 — 分类浏览 + 搜索 + 详细展开
import { useState, useMemo } from "react";
import { CATEGORIES, EXERCISES, getExercisesByCategory, searchExercises, type Exercise } from "@/lib/exercises/data";

export default function ExercisesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (search.trim()) return searchExercises(search);
    if (activeCategory === "all") return EXERCISES;
    return getExercisesByCategory(activeCategory);
  }, [activeCategory, search]);

  const diffColors: Record<string, string> = { "初级": "bg-green-500/10 text-green-400 border-green-500/20", "中级": "bg-amber-500/10 text-amber-400 border-amber-500/20", "高级": "bg-red-500/10 text-red-400 border-red-500/20" };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-50 mb-2">🏋️ 训练动作库</h1>
        <p className="text-slate-400">弹跳训练全部动作详解——按部位分类，含专业教练提示</p>
      </div>

      {/* 搜索 */}
      <div className="mb-6">
        <input
          type="text" value={search} onChange={e => { setSearch(e.target.value); setActiveCategory("all"); }}
          placeholder="搜索动作名称或目标肌群..." className="w-full px-5 py-3 bg-[#1e293b] border border-slate-600 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-sm"
        />
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setActiveCategory("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === "all" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-[#1e293b] text-slate-400 border border-slate-700 hover:border-slate-500"}`}>全部动作</button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeCategory === cat.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-[#1e293b] text-slate-400 border border-slate-700 hover:border-slate-500"}`}>
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* 分类说明 */}
      {activeCategory !== "all" && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 mb-6">
          {(() => { const cat = CATEGORIES.find(c => c.id === activeCategory); return cat ? <p className="text-sm text-slate-400">{cat.icon} {cat.description}</p> : null; })()}
        </div>
      )}

      {/* 动作列表 */}
      <div className="grid md:grid-cols-2 gap-4 items-start">
        {filtered.map(ex => (
          <div key={ex.id} className="bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden transition-all hover:border-slate-500/70">
            <button onClick={() => setExpandedId(expandedId === ex.id ? null : ex.id)} className="w-full text-left p-5 flex items-start gap-4">
              <div className="text-3xl flex-shrink-0 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">{ex.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-100">{ex.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColors[ex.difficulty]}`}>{ex.difficulty}</span>
                </div>
                <p className="text-xs text-slate-500">{ex.nameEn} · {ex.targetMuscles}</p>
              </div>
              <svg className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform mt-2 ${expandedId === ex.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {expandedId === ex.id && (
              <div className="px-5 pb-5 border-t border-slate-700/50 pt-4 space-y-4 animate-fade-in-up">
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed">{ex.description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">🎯 教练提示</h4>
                  <ul className="space-y-1">
                    {ex.coachingCues.map((cue, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> {cue}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-slate-400 mb-1">推荐组次</h4>
                    <p className="text-sm text-slate-300 whitespace-pre-line">{ex.setsReps}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-slate-400 mb-1">目标肌群</h4>
                    <p className="text-sm text-slate-300">{ex.targetMuscles}</p>
                  </div>
                </div>
                {ex.caution && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-red-400 mb-1">⚠️ 注意事项</h4>
                    <p className="text-sm text-red-300">{ex.caution}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-4">🔍</div>
          <p>未找到匹配的动作</p>
          <p className="text-sm mt-1">试试其他关键词或分类</p>
        </div>
      )}
    </div>
  );
}
