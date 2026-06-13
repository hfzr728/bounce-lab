"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/context";

interface DiagnosisData {
  dimensionScores?: { name: string; score: number }[];
  weaknesses: string[];
  strengths: string[];
  injuryRisk: { level: string; factors: string[] };
  answers: Record<string, unknown>;
  diagnosisSummary?: string;
  version?: string;
  overallScore?: number;
  timestamp?: string;
}

interface SavedDiagnosis {
  type: string;
  date: string;
  version: string;
  summary: string;
  weaknesses?: string[];
  strengths?: string[];
  overallScore?: number;
  fullDiagnosis?: DiagnosisData;
  diagnosisSummary?: string;
  answers?: Record<string, unknown>;
  injuryRisk?: { level: string; factors: string[] };
}

export default function PlanGenerationPage() {
  const { isLoggedIn } = useUser();
  const [planText, setPlanText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Current diagnosis selection
  const [selectedDiag, setSelectedDiag] = useState<DiagnosisData | null>(null);
  const [savedDiagnoses, setSavedDiagnoses] = useState<SavedDiagnosis[]>([]);
  const [showDiagPicker, setShowDiagPicker] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDays, setImportDays] = useState<{ week: number; dayName: string; dayOfWeek: number; content: string; selected: boolean }[]>([]);
  const [importStartWeek, setImportStartWeek] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [dayMapping, setDayMapping] = useState<number[]>([]); // ordinal position → dayOfWeek
  const [useOrdinalMapping, setUseOrdinalMapping] = useState(false);

  // Load: 1) saved plan for viewing, 2) recent diagnosis, 3) saved diagnoses list
  useEffect(() => {
    // Load saved diagnoses always (needed for plan generation after viewing saved plan)
    const diags: SavedDiagnosis[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("bounce-saved-d-")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "");
          diags.push(data);
        } catch {}
      }
    }
    diags.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedDiagnoses(diags);

    // Check for a saved plan to view (from profile page)
    const savedPlan = sessionStorage.getItem("bounce-plan");
    if (savedPlan) {
      try {
        const p = JSON.parse(savedPlan);
        if (p.aiGenerated) {
          setPlanText(p.aiGenerated);
          sessionStorage.removeItem("bounce-plan");
          return;
        }
      } catch {}
    }

    // Check for fresh diagnosis (just completed assessment)
    const freshDiag = sessionStorage.getItem("bounce-diagnosis");
    if (freshDiag) {
      try {
        const d = JSON.parse(freshDiag);
        setSelectedDiag(d);
        return;
      } catch {}
    }
    // Auto-select most recent saved diagnosis
    if (diags.length > 0) {
      selectDiagInternal(diags[0]);
    }
  }, []);

  const selectDiagInternal = (diag: SavedDiagnosis) => {
    const fd = diag.fullDiagnosis;
    const d: DiagnosisData = {
      weaknesses: diag.weaknesses || fd?.weaknesses || [],
      strengths: diag.strengths || fd?.strengths || [],
      injuryRisk: diag.injuryRisk || fd?.injuryRisk || { level: "未评估", factors: [] },
      answers: diag.answers || fd?.answers || {},
      diagnosisSummary: diag.diagnosisSummary || fd?.diagnosisSummary || diag.summary || "",
      version: diag.version || fd?.version || "",
      overallScore: diag.overallScore ?? fd?.overallScore,
    };
    setSelectedDiag(d);
    setShowDiagPicker(false);
    setPlanText("");
    setError("");
  };

  const selectDiagnosis = (diag: SavedDiagnosis) => selectDiagInternal(diag);

  const handleGenerate = useCallback(async () => {
    if (!selectedDiag || loading) return;

    // 取消前一次请求
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true); setError(""); setPlanText(""); setSaved(false);
    try {
      const response = await fetch("/api/plan/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: selectedDiag.answers || {},
          weaknesses: selectedDiag.weaknesses || [],
          injuryRisk: selectedDiag.injuryRisk || { level: "未评估", factors: [] },
          diagnosisSummary: selectedDiag.diagnosisSummary || "综合诊断已完成",
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "生成失败" }));
        setError(err.error || `请求失败 (${response.status})`);
        setLoading(false);
        return;
      }

      // SSE 流式读取
      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取流");

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6);
          try {
            const data = JSON.parse(raw);
            if (data.text) {
              accumulated += data.text;
              setPlanText(accumulated);
            }
          } catch { /* skip */ }
        }
      }

      // 保存
      if (accumulated) {
        const savedPlan = { type: "plan", date: new Date().toISOString(), version: selectedDiag.version || "unknown", summary: accumulated.slice(0, 120) + "...", planText: accumulated, weaknesses: selectedDiag.weaknesses };
        localStorage.setItem("bounce-saved-p-" + Date.now(), JSON.stringify(savedPlan));
        setSaved(true);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return; // 被取消的请求不算错误
      setError(err.message || "网络异常");
    }
    setLoading(false);
    setTimeout(() => planRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [selectedDiag, loading]);

  // Parse AI plan text into week/day entries
  const parsePlanForImport = () => {
    if (!planText) return;
    const dayMap: Record<string, number> = {
      "周一": 0, "周二": 1, "周三": 2, "周四": 3, "周五": 4, "周六": 5, "周日": 6,
      "星期一": 0, "星期二": 1, "星期三": 2, "星期四": 3, "星期五": 4, "星期六": 5, "星期日": 6,
      "第一天": 0, "第二天": 1, "第三天": 2, "第四天": 3, "第五天": 4, "第六天": 5, "第七天": 6,
    };
    const lines = planText.split("\n");
    const entries: { week: number; dayName: string; dayOfWeek: number; content: string; selected: boolean }[] = [];
    let currentWeek = 0;
    let currentDay = "";
    let currentDayOfWeek = -1;
    let currentContent: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      // Match week: "第1周" through "第12周" (may be inside **bold** markers)
      const weekMatch = trimmed.match(/第\s*(\d{1,2})\s*周/);
      if (weekMatch) {
        if (currentDay && currentContent.length > 0) {
          entries.push({ week: currentWeek, dayName: currentDay, dayOfWeek: currentDayOfWeek, content: currentContent.join("\n"), selected: true });
        }
        currentWeek = parseInt(weekMatch[1]);
        currentDay = ""; currentDayOfWeek = -1; currentContent = [];
        continue;
      }
      // Strip **bold** markers for day matching
      const cleanLine = trimmed.replace(/\*\*/g, "");
      // Match day: "周一" or "第一天" etc.
      let dayMatched = false;
      for (const [name, idx] of Object.entries(dayMap)) {
        if (cleanLine.startsWith(name) || cleanLine.includes(name)) {
          if (currentDay && currentContent.length > 0) {
            entries.push({ week: currentWeek, dayName: currentDay, dayOfWeek: currentDayOfWeek, content: currentContent.join("\n"), selected: true });
          }
          currentDay = name; currentDayOfWeek = idx; currentContent = [];
          dayMatched = true;
          break;
        }
      }
      if (dayMatched) continue;
      // Accumulate content for current day - skip blank lines and week headers
      if (currentDay && currentWeek > 0 && trimmed && !trimmed.match(/^第\s*\d{1,2}\s*周/)) {
        // Clean up content: remove leading * or - list markers
        const cleaned = trimmed.replace(/^\*\s*/, "").replace(/^-\s*/, "");
        if (cleaned) currentContent.push(cleaned);
      }
    }
    // Flush last day
    if (currentDay && currentContent.length > 0) {
      entries.push({ week: currentWeek, dayName: currentDay, dayOfWeek: currentDayOfWeek, content: currentContent.join("\n"), selected: true });
    }
    setImportDays(entries);
    // Detect if ordinal days used (第一天 instead of 周一)
    const hasOrdinal = entries.some(e => e.dayName.startsWith("第") && e.dayName.endsWith("天"));
    setUseOrdinalMapping(hasOrdinal);
    if (hasOrdinal) {
      // Get unique ordinal positions
      const positions = [...new Set(entries.map(e => e.dayOfWeek))].sort((a,b) => a-b);
      // Default mapping: spread evenly across week
      const defaultMapping: number[] = [];
      if (positions.length === 1) defaultMapping.push(0); // Mon
      else if (positions.length === 2) { defaultMapping.push(0); defaultMapping.push(3); } // Mon, Thu
      else if (positions.length === 3) { defaultMapping.push(0); defaultMapping.push(2); defaultMapping.push(4); } // Mon, Wed, Fri
      else if (positions.length === 4) { defaultMapping.push(0); defaultMapping.push(1); defaultMapping.push(3); defaultMapping.push(4); } // Mon, Tue, Thu, Fri
      else if (positions.length === 5) { defaultMapping.push(0); defaultMapping.push(1); defaultMapping.push(2); defaultMapping.push(3); defaultMapping.push(4); } // Mon-Fri
      else { for (let i = 0; i < positions.length; i++) defaultMapping.push(i % 7); }
      setDayMapping(defaultMapping);
    }
    const now = new Date();
    const jan4 = new Date(now.getFullYear(), 0, 4);
    const weekNum = Math.ceil(((now.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7);
    setImportStartWeek(`${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`);
    setShowImportModal(true);
  };

  // Execute import: create calendar plans from selected entries
  const executeImport = () => {
    if (!importStartWeek || importDays.filter(d => d.selected).length === 0) return;
    setImportLoading(true);
    const [y, w] = importStartWeek.split("-W").map(Number);
    if (!y || !w) { setImportLoading(false); return; }
    const jan4 = new Date(y, 0, 4);
    const baseMonday = new Date(jan4);
    baseMonday.setDate(jan4.getDate() - (jan4.getDay() + 6) % 7 + (w - 1) * 7);

    const CALENDAR_PLANS_KEY = "bounce-calendar-plans";
    const existing: any[] = (() => { try { return JSON.parse(localStorage.getItem(CALENDAR_PLANS_KEY) || "[]"); } catch { return []; } })();

    const selected = importDays.filter(d => d.selected);
    for (const entry of selected) {
      const weekOffset = entry.week - 1;
      // Use dayMapping for ordinal days, otherwise entry.dayOfWeek
      const actualDayOfWeek = useOrdinalMapping ? (dayMapping[entry.dayOfWeek] ?? entry.dayOfWeek) : entry.dayOfWeek;
      const planDate = new Date(baseMonday);
      planDate.setDate(baseMonday.getDate() + weekOffset * 7 + actualDayOfWeek);
      const y2 = planDate.getFullYear();
      const m2 = String(planDate.getMonth() + 1).padStart(2, "0");
      const d2 = String(planDate.getDate()).padStart(2, "0");
      const dateStr = `${y2}-${m2}-${d2}`;

      existing.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: `第${entry.week}周${entry.dayName}训练`,
        dayOfWeek: actualDayOfWeek,
        exercises: [], // AI text content - stored as raw
        rawContent: entry.content,
        createdAt: dateStr,
      });
    }
    localStorage.setItem(CALENDAR_PLANS_KEY, JSON.stringify(existing));
    // Also save start week
    localStorage.setItem("bounce-training-start-week", importStartWeek);
    setImportLoading(false);
    setShowImportModal(false);
    setError("");
    // Redirect to calendar
    window.location.href = "/program-builder";
  };

  if (!isLoggedIn) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center bg-[#0f172a] min-h-screen">
      <div className="text-6xl mb-6">🔒</div>
      <h1 className="text-3xl font-extrabold text-white mb-4">AI 训练计划生成</h1>
      <p className="text-slate-400 mb-8">此功能需要登录后才能使用。点击右上角登录按钮创建你的档案。</p>
      <Link href="/assessment" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#0a0a14] font-bold rounded-xl text-lg">先去评估</Link>
    </div>
  );

  if (!selectedDiag && savedDiagnoses.length === 0 && !planText) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center bg-[#0f172a] min-h-screen">
      <div className="text-6xl mb-6">📋</div>
      <h1 className="text-3xl font-extrabold text-white mb-4">AI 训练计划生成</h1>
      <p className="text-slate-400 mb-3 text-lg">尚未完成评估诊断</p>
      <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">训练计划的生成需要基于你的弹跳能力评估结果。请先完成评估问卷，系统将分析你的短板和优势，然后AI生成12周训练方案。</p>
      <Link href="/assessment" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-[#0a0a14] font-bold rounded-xl text-lg transition-all shadow-lg shadow-amber-500/25">先去评估</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-[#0f172a] min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">AI 训练计划生成</h1>
        <p className="text-slate-400">基于评估诊断结果，生成个性化12周训练方案</p>
      </div>

      {/* 查看已保存的计划 */}
      {planText && !selectedDiag && (
        <div ref={planRef} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">已保存的训练计划</h3>
            <Link href="/profile" className="text-xs text-slate-400 hover:text-slate-200 border border-slate-600 rounded-lg px-3 py-1">← 返回个人主页</Link>
          </div>
          <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{planText}</div>
          <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-3">
            <button onClick={() => setPlanText("")} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all">返回生成新计划</button>
            <button onClick={parsePlanForImport} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm hover:bg-emerald-500/20 transition-all">📅 导入到训练日历</button>
            <Link href="/program-builder" className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all">去训练组装器手动调整</Link>
          </div>
        </div>
      )}

      {/* 诊断选择区 */}
      {!planText && (
        <>
          {/* 已选诊断摘要 */}
          {selectedDiag && (
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-400">当前诊断</h2>
                {savedDiagnoses.length > 0 && (
                  <button onClick={() => setShowDiagPicker(!showDiagPicker)} className="text-xs text-amber-400 hover:text-amber-300">
                    {showDiagPicker ? "收起" : "更换诊断"}
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div><p className="text-slate-500 mb-1">短板方向</p><p className="text-amber-300">{selectedDiag.weaknesses?.length ? selectedDiag.weaknesses.join("、") : "未识别"}</p></div>
                <div><p className="text-slate-500 mb-1">优势方向</p><p className="text-emerald-300">{selectedDiag.strengths?.length ? selectedDiag.strengths.join("、") : "未识别"}</p></div>
                <div><p className="text-slate-500 mb-1">受伤风险</p><p className="font-bold text-emerald-400">{selectedDiag.injuryRisk?.level || "未评估"}</p></div>
              </div>
            </div>
          )}

          {/* 诊断选择器 */}
          {showDiagPicker && savedDiagnoses.length > 0 && (
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 mb-4">
              <h2 className="text-sm font-semibold text-slate-400 mb-3">选择历史诊断（{savedDiagnoses.length} 条记录）</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedDiagnoses.map((d, i) => (
                  <button key={i} onClick={() => selectDiagnosis(d)}
                    className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/50 hover:border-amber-500/30 transition-all text-sm">
                    <span className="text-slate-200 font-medium">{d.summary?.slice(0, 60) || "诊断记录"}</span>
                    <span className="text-slate-500 ml-2 text-xs">{d.date?.slice(0, 10)} · {d.version === "basic" ? "体测版" : d.version === "standard" ? "标准版" : "专业版"}</span>
                    {d.overallScore && <span className="ml-2 text-amber-400 text-xs">综合{d.overallScore}分</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 没有诊断但有待选的 */}
          {!selectedDiag && savedDiagnoses.length > 0 && (
            <div className="text-center mb-6">
              <p className="text-slate-400 mb-4">请选择一份评估诊断来生成训练计划</p>
              <button onClick={() => setShowDiagPicker(true)} className="px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm hover:bg-amber-500/20 transition-all">
                从历史诊断中选择 →
              </button>
            </div>
          )}

          {/* 生成按钮 */}
          {selectedDiag && (
            <div className="text-center mb-10">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`px-10 py-4 rounded-xl text-lg font-extrabold transition-all shadow-lg ${
                  loading
                    ? "bg-amber-500/50 text-[#0a0a14]/50 cursor-wait"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-[#0a0a14] shadow-amber-500/25"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    AI 正在生成训练方案...
                  </span>
                ) : (
                  "生成12周训练计划 →"
                )}
              </button>
              {!loading && <p className="text-xs text-slate-600 mt-3">AI 生成需要约 30-60 秒，请耐心等待</p>}
            </div>
          )}
        </>
      )}

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm text-center">{error}</div>}

      {/* 生成的计划 */}
      {planText && selectedDiag && (
        <div ref={planRef} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-bold text-white">你的12周训练计划</h3>
            {saved && <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20">已自动保存</span>}
          </div>
          <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{planText}</div>
          <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-3">
            <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm hover:bg-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-wait">
              {loading ? "🔄 生成中..." : "重新生成"}
            </button>
            <button onClick={parsePlanForImport} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm hover:bg-emerald-500/20 transition-all">📅 导入到训练日历</button>
            <Link href="/program-builder" className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all">去训练组装器手动调整</Link>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-600 mt-8">AI训练计划仅供参考，请在专业教练指导下执行</p>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowImportModal(false)}>
          <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">📅 导入AI训练计划到日历</h3>
            <p className="text-xs text-slate-500 mb-4">
              已解析出 {importDays.length} 个训练日（{new Set(importDays.map(d => d.week)).size} 周）。
              选择要导入的训练日，设定起始周后一键导入。
            </p>

            {/* Start week */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400 shrink-0">起始周：</span>
              <input type="week" value={importStartWeek} onChange={e => setImportStartWeek(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-amber-500/50" />
            </div>

            {/* Day mapping for ordinal days */}
            {useOrdinalMapping && (
              <div className="mb-4 bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
                <p className="text-xs font-medium text-amber-400 mb-2">📅 将计划中的「第X天」映射到具体周几：</p>
                <div className="space-y-1.5">
                  {[...new Set(importDays.map(d => d.dayOfWeek))].sort((a,b) => a-b).map(pos => (
                    <div key={pos} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-16">第{pos + 1}天 →</span>
                      <div className="flex gap-1">
                        {["周一","周二","周三","周四","周五","周六","周日"].map((wd, i) => (
                          <button key={i} onClick={() => {
                            setDayMapping(prev => { const next = [...prev]; next[pos] = i; return next; });
                          }}
                          className={`px-2 py-1 text-xs rounded transition-all ${
                            (dayMapping[pos] ?? 0) === i
                              ? "bg-amber-500 text-slate-900 font-bold"
                              : "bg-slate-700 text-slate-400 hover:text-slate-200"
                          }`}>
                            {wd.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Consecutive day warning */}
                {(() => {
                  const sorted = dayMapping.slice().sort((a,b) => a-b);
                  let hasConsecutive = false;
                  for (let i = 1; i < sorted.length; i++) {
                    if (sorted[i] - sorted[i-1] === 1 || (sorted[i-1] === 6 && sorted[i] === 0)) hasConsecutive = true;
                  }
                  return hasConsecutive ? (
                    <p className="text-xs text-red-400 mt-2">⚠️ 检测到连续训练日（如周日+周一）。建议训练日之间留出恢复日，与生活节奏合理结合。</p>
                  ) : (
                    <p className="text-xs text-emerald-400 mt-2">✅ 训练日分布合理，有充足的恢复间隔</p>
                  );
                })()}
                <p className="text-[10px] text-slate-500 mt-1">💡 默认按一周均匀分布，可点击调整。「第X天」会映射到所选星期并贯穿所有12周</p>
              </div>
            )}

            {/* Select all / deselect */}
            <div className="flex gap-2 mb-3">
              <button onClick={() => setImportDays(prev => prev.map(d => ({ ...d, selected: true })))}
                className="text-xs text-amber-400 hover:text-amber-300">全选</button>
              <button onClick={() => setImportDays(prev => prev.map(d => ({ ...d, selected: false })))}
                className="text-xs text-slate-500 hover:text-slate-300">取消全选</button>
              <span className="text-xs text-slate-600 ml-auto">{importDays.filter(d => d.selected).length}/{importDays.length} 选中</span>
            </div>

            {/* Day list grouped by week */}
            <div className="space-y-2 mb-4 max-h-[50vh] overflow-y-auto">
              {(() => {
                const weeks = [...new Set(importDays.map(d => d.week))].sort((a,b) => a-b);
                return weeks.map(w => (
                  <div key={w}>
                    <p className="text-xs font-bold text-amber-400 mb-1">第{w}周</p>
                    {importDays.filter(d => d.week === w).map((d, i) => (
                      <label key={i} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                        d.selected ? "bg-amber-500/10 border border-amber-500/20" : "bg-slate-800/50 border border-slate-700/30 hover:border-slate-600"
                      }`}>
                        <input type="checkbox" checked={d.selected} onChange={() => {
                          setImportDays(prev => prev.map(x => x === d ? { ...x, selected: !x.selected } : x));
                        }} className="accent-amber-500" />
                        <span className="text-xs text-slate-300 font-medium w-16">{d.dayName}</span>
                        <span className="text-[10px] text-slate-500 truncate flex-1">{d.content.slice(0, 50)}...</span>
                      </label>
                    ))}
                  </div>
                ));
              })()}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => setShowImportModal(false)}
                className="flex-1 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-600 rounded-lg transition-colors">取消</button>
              <button onClick={executeImport} disabled={importLoading || importDays.filter(d => d.selected).length === 0}
                className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-40">
                {importLoading ? "导入中..." : `导入 ${importDays.filter(d => d.selected).length} 个训练日 →`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
