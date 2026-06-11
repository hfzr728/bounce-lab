"use client";
import { useState, useEffect, useMemo } from "react";

const LOG_KEY = "bounce-training-log";
const PLAN_START_KEY = "bounce-plan-start-week";

interface LogEntry {
  id: string; date: string; type: string; focus: string;
  duration: number; intensity: number; exercises: string; notes: string;
}

const TYPE_COLORS: Record<string, string> = {
  "力量": "bg-red-500", "增强式": "bg-orange-500", "速度": "bg-blue-500",
  "恢复": "bg-green-500", "综合": "bg-purple-500", "其他": "bg-slate-500",
};
const TYPE_DOT: Record<string, string> = {
  "力量": "🔴", "增强式": "🟠", "速度": "🔵",
  "恢复": "🟢", "综合": "🟣", "其他": "⚪",
};
const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

export default function TrainingLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [todayPlan, setTodayPlan] = useState<string | null>(null);
  const [planWeekNum, setPlanWeekNum] = useState<number | null>(null);
  const [todayPlanDay, setTodayPlanDay] = useState<string>("");
  const [viewDate, setViewDate] = useState(new Date());
  const [planStartDate, setPlanStartDate] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [form, setForm] = useState<Omit<LogEntry, "id">>({
    date: "", type: "力量", focus: "", duration: 60, intensity: 7, exercises: "", notes: ""
  });

  useEffect(() => {
    try { setLogs(JSON.parse(localStorage.getItem(LOG_KEY) || "[]")); } catch { setLogs([]); }
    const saved = localStorage.getItem(PLAN_START_KEY);
    if (saved) setPlanStartDate(saved);
  }, []);

  useEffect(() => {
    if (logs.length === 0) return;
    try {
      const plan = JSON.parse(sessionStorage.getItem("bounce-plan") || "{}");
      if (!plan.aiGenerated) return;
      const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const todayName = dayNames[new Date().getDay()];
      setTodayPlanDay(todayName);
      const idx = plan.aiGenerated.indexOf(todayName);
      if (idx >= 0) setTodayPlan(plan.aiGenerated.slice(idx, idx + 300));
      if (planStartDate) {
        const start = new Date(planStartDate);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const wn = Math.floor(diffDays / 7) + 1;
        if (wn >= 1 && wn <= 12) setPlanWeekNum(wn);
      }
    } catch {}
  }, [logs, planStartDate]);

  // 日历数据
  const calendar = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startPad = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { date: string; day: number; isCurrentMonth: boolean; logs: LogEntry[] }[] = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startPad - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push({ date: `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`, day: d, isCurrentMonth: false, logs: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ date: ds, day: d, isCurrentMonth: true, logs: logs.filter(l => l.date === ds) });
    }
    return days;
  }, [viewDate, logs]);

  const today = new Date().toISOString().split("T")[0];

  const openDay = (date: string, dayLogs: LogEntry[]) => {
    setSelectedDate(date);
    if (dayLogs.length > 0) {
      setEditingLog(dayLogs[0]);
      setForm({ date, type: dayLogs[0].type, focus: dayLogs[0].focus, duration: dayLogs[0].duration, intensity: dayLogs[0].intensity, exercises: dayLogs[0].exercises, notes: dayLogs[0].notes });
    } else {
      setEditingLog(null);
      setForm({ date, type: "力量", focus: "", duration: 60, intensity: 7, exercises: "", notes: "" });
    }
    setShowForm(true);
  };

  const saveLog = () => {
    const id = editingLog?.id || Date.now().toString();
    const entry: LogEntry = { ...form, id };
    const updated = editingLog ? logs.map(l => l.id === id ? entry : l) : [entry, ...logs];
    setLogs(updated);
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
    setShowForm(false);
    setEditingLog(null);
  };

  const deleteLog = () => {
    if (!editingLog) return;
    const updated = logs.filter(l => l.id !== editingLog.id);
    setLogs(updated);
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
    setShowForm(false);
    setEditingLog(null);
  };

  const savePlanStart = () => {
    localStorage.setItem(PLAN_START_KEY, planStartDate);
    alert("✅ 训练起始周已设定");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-[#0f172a] min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">📅 训练日志</h1>
        <p className="text-slate-400">日历视图 · 记录每一次训练</p>
      </div>

      {/* 计划起始周设定 */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-4 mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-400 shrink-0">📆 训练起始周：</span>
        <input type="date" value={planStartDate} onChange={e => setPlanStartDate(e.target.value)}
          className="bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50" />
        <button onClick={savePlanStart}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-lg transition-all">
          设为第1周
        </button>
        {planWeekNum && (
          <span className="text-xs text-amber-400 ml-auto">📍 当前为计划第 {planWeekNum} 周</span>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 日历 */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
              className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700">◀ 上月</button>
            <h2 className="text-lg font-bold text-white">{viewDate.getFullYear()}年{viewDate.getMonth() + 1}月</h2>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
              className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700">下月 ▶</button>
          </div>
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-700/50">
              {WEEKDAYS.map(w => (
                <div key={w} className="p-2 text-center text-xs font-medium text-slate-400">
                  {w === "六" || w === "日" ? <span className="text-amber-400/70">{w}</span> : w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendar.map((d, i) => {
                const isToday = d.date === today;
                const hasLog = d.logs.length > 0;
                return (
                  <button key={i} onClick={() => openDay(d.date, d.logs)}
                    className={`min-h-[65px] p-1.5 border-b border-r border-slate-700/30 text-left transition-all hover:bg-slate-700/30 ${
                      !d.isCurrentMonth ? "opacity-30" : ""
                    } ${isToday ? "bg-amber-500/10 ring-1 ring-amber-500/30" : ""}`}>
                    <span className={`text-xs ${isToday ? "text-amber-400 font-bold" : d.isCurrentMonth ? "text-slate-300" : "text-slate-600"}`}>{d.day}</span>
                    {hasLog && <div className="mt-1 flex flex-wrap gap-0.5">{d.logs.map((l, j) => (
                      <span key={j} className={`inline-block w-2 h-2 rounded-full ${TYPE_COLORS[l.type] || "bg-slate-500"}`} title={l.type} />
                    ))}</div>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {Object.entries(TYPE_DOT).map(([t, dot]) => <span key={t} className="text-xs text-slate-500">{dot} {t}</span>)}
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="space-y-4">
          {todayPlan && (
            <div className="bg-[#1e293b] border border-amber-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-amber-400 mb-3">📋 今日训练{todayPlanDay ? `（${todayPlanDay}）` : ""}{planWeekNum ? ` · 第${planWeekNum}周` : ""}</h3>
              <div className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap max-h-[280px] overflow-y-auto">{todayPlan}</div>
              <p className="text-[10px] text-slate-600 mt-3">设定「训练起始周」后自动计算当前处于第几周</p>
            </div>
          )}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">📊 统计</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{logs.length}</p>
                <p className="text-xs text-slate-500">总次数</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{logs.filter(l => {
                  const d = new Date(l.date); const now = new Date();
                  const sow = new Date(now); sow.setDate(now.getDate() - (now.getDay() + 6) % 7);
                  return d >= sow;
                }).length}</p>
                <p className="text-xs text-slate-500">本周</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{logs.filter(l => new Date(l.date).getMonth() === new Date().getMonth()).length}</p>
                <p className="text-xs text-slate-500">本月</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{logs.reduce((s, l) => s + l.duration, 0)}</p>
                <p className="text-xs text-slate-500">总时长(分)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 弹窗：日志编辑 */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#1e293b] border border-slate-600/50 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">
              {editingLog ? "✏️ 编辑训练记录" : "📝 新增训练记录"}
              <span className="text-sm text-slate-400 ml-2">{selectedDate}</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">训练类型</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white">
                  {Object.keys(TYPE_COLORS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">训练重点</label>
                <input type="text" value={form.focus} onChange={e => setForm({ ...form, focus: e.target.value })}
                  placeholder="如：深蹲3x5、跳深4x3..."
                  className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">时长(分)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">强度 1-10</label>
                  <input type="number" value={form.intensity} onChange={e => setForm({ ...form, intensity: Number(e.target.value) })} min={1} max={10}
                    className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">备注</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                  placeholder="感受、PR、注意事项..."
                  className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveLog} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm">保存</button>
              {editingLog && <button onClick={deleteLog} className="px-4 py-2.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-sm hover:bg-red-600/30">删除</button>}
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-xl text-sm">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
