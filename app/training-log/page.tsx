"use client";
import { useState, useEffect } from "react";

const LOG_KEY = "bounce-training-log";

interface LogEntry {
  id: string; date: string; type: string; focus: string;
  duration: number; intensity: number; exercises: string; notes: string;
}

export default function TrainingLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [todayPlan, setTodayPlan] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<LogEntry, "id">>({
    date: new Date().toISOString().split("T")[0], type: "力量", focus: "",
    duration: 60, intensity: 7, exercises: "", notes: ""
  });

  useEffect(() => {
    try { setLogs(JSON.parse(localStorage.getItem(LOG_KEY) || "[]")); } catch { setLogs([]); }
    // 提取今日计划
    try {
      const plan = JSON.parse(sessionStorage.getItem("bounce-plan") || "{}");
      if (plan.aiGenerated) {
        const today = new Date().getDay(); // 0=Sun
        const dayNames = ["周日","周一","周二","周三","周四","周五","周六"];
        const todayName = dayNames[today];
        const regex = new RegExp(`第\\d+周[\\s\\S]*?${todayName}[：:][\\s\\S]*?(?=第\\d+周|$)`, 'g');
        const matches = plan.aiGenerated.match(regex);
        if (matches) {
          setTodayPlan(matches[matches.length - 1].slice(0, 300));
        }
      }
    } catch {}
  }, []);

  const saveLog = () => {
    if (editingId) {
      const updated = logs.map(l => l.id === editingId ? { ...form, id: editingId } : l);
      setLogs(updated);
      localStorage.setItem(LOG_KEY, JSON.stringify(updated));
      setEditingId(null);
    } else {
      const entry: LogEntry = { ...form, id: Date.now().toString() };
      const updated = [entry, ...logs];
      setLogs(updated);
      localStorage.setItem(LOG_KEY, JSON.stringify(updated));
    }
    setForm({ date: new Date().toISOString().split("T")[0], type: "力量", focus: "", duration: 60, intensity: 7, exercises: "", notes: "" });
    setShowForm(false);
  };

  const startEdit = (log: LogEntry) => {
    setForm({ date: log.date, type: log.type, focus: log.focus, duration: log.duration, intensity: log.intensity, exercises: log.exercises, notes: log.notes });
    setEditingId(log.id);
    setShowForm(true);
    setSelectedLog(null);
  };

  const deleteLog = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
  };

  const typeColors: Record<string, string> = { "力量": "bg-red-500/10 text-red-400", "增强式": "bg-orange-500/10 text-orange-400", "速度": "bg-blue-500/10 text-blue-400", "恢复": "bg-green-500/10 text-green-400", "综合": "bg-purple-500/10 text-purple-400" };

  // 统计数据
  const stats = {
    total: logs.length,
    thisWeek: logs.filter(l => {
      const d = new Date(l.date); const now = new Date();
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());
      return d >= startOfWeek;
    }).length,
    thisMonth: logs.filter(l => new Date(l.date).getMonth() === new Date().getMonth()).length,
    totalMinutes: logs.reduce((s, l) => s + l.duration, 0),
    avgIntensity: logs.length ? Math.round(logs.reduce((s, l) => s + l.intensity, 0) / logs.length * 10) / 10 : 0,
    streak: (() => {
      let s = 0; const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const today = new Date(); today.setHours(0, 0, 0, 0);
      for (let i = 0; i < sorted.length; i++) {
        const d = new Date(sorted[i].date); d.setHours(0, 0, 0, 0);
        const expected = new Date(today); expected.setDate(today.getDate() - i);
        if (d.getTime() === expected.getTime()) s++; else break;
      }
      return s;
    })(),
    typeBreakdown: logs.reduce((acc, l) => { acc[l.type] = (acc[l.type] || 0) + 1; return acc; }, {} as Record<string, number>),
  };

  const overloadWarning = stats.thisWeek >= 6 && stats.avgIntensity >= 8;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-[#0f172a] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">📊 训练记录</h1>
          <p className="text-slate-400 mt-1">共 {logs.length} 条记录</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ date: new Date().toISOString().split("T")[0], type: "力量", focus: "", duration: 60, intensity: 7, exercises: "", notes: "" }); }} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-md">
          {showForm ? "取消" : "+ 新增记录"}
        </button>
      </div>

      {/* 今日计划速览 */}
      {todayPlan && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-amber-400 font-medium mb-2">📅 今日训练速览（来自你的12周计划）</p>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{todayPlan}</p>
        </div>
      )}

      {/* 统计面板 */}
      {logs.length > 0 && (
        <div className="mb-6 space-y-3">
          {overloadWarning && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-400 text-sm">训练负荷偏高</p>
                <p className="text-xs text-red-300 mt-0.5">本周已训练 {stats.thisWeek} 次，平均强度 RPE {stats.avgIntensity}。建议增加恢复日或降低强度，避免过度训练。</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "总训练次数", value: stats.total, sub: `${stats.totalMinutes} 分钟` },
              { label: "本周训练", value: stats.thisWeek, sub: `连续 ${stats.streak} 天` },
              { label: "平均强度", value: `RPE ${stats.avgIntensity}`, sub: `本月 ${stats.thisMonth} 次` },
              { label: "训练类型", value: Object.keys(stats.typeBreakdown).length, sub: Object.entries(stats.typeBreakdown).map(([k, v]) => `${k}×${v}`).join(" · ") || "—" },
            ].map(item => (
              <div key={item.label} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="text-2xl font-extrabold text-slate-100">{item.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">{editingId ? "✏️ 编辑训练记录" : "➕ 新增训练记录"}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">训练类型</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500">
                <option>力量</option><option>增强式</option><option>速度</option><option>恢复</option><option>综合</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">时长(分)</label>
              <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">强度 RPE {form.intensity}</label>
              <input type="range" min="1" max="10" value={form.intensity} onChange={e => setForm({ ...form, intensity: Number(e.target.value) })} className="w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">训练重点</label>
            <input type="text" value={form.focus} onChange={e => setForm({ ...form, focus: e.target.value })} placeholder="如：深蹲 4×5 80kg，箱跳 3×8" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">训练内容</label>
            <textarea value={form.exercises} onChange={e => setForm({ ...form, exercises: e.target.value })} rows={3} placeholder="记录具体动作..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="感受、进步、问题..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={saveLog} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md">
            {editingId ? "更新记录" : "保存记录"}
          </button>
        </div>
      )}

      {logs.length === 0 && !showForm && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p>还没有训练记录</p>
          <p className="text-sm mt-1">点击「新增记录」开始追踪你的训练</p>
        </div>
      )}

      <div className="space-y-3">
        {logs.map(log => (
          <div key={log.id}>
            <div
              onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
              className={`bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md ${selectedLog?.id === log.id ? "border-amber-500/50 ring-1 ring-amber-500/20" : ""}`}
            >
              <div className="text-center flex-shrink-0 w-14">
                <div className="text-lg font-bold text-gray-900">{log.date.slice(5)}</div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[log.type] || "bg-gray-100 text-gray-600"}`}>{log.type}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{log.focus || "训练"}</span>
                  <span className="text-xs text-gray-400">{log.duration}分钟 · RPE {log.intensity}/10</span>
                </div>
                {log.exercises && <p className="text-sm text-gray-600 line-clamp-2">{log.exercises}</p>}
                {log.notes && <p className="text-xs text-gray-400 mt-1 truncate">{log.notes}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button onClick={() => startEdit(log)} className="text-gray-300 hover:text-blue-500 text-sm px-1" title="编辑">✏️</button>
                <button onClick={() => deleteLog(log.id)} className="text-gray-300 hover:text-red-500 text-sm px-1" title="删除">🗑️</button>
              </div>
            </div>
            {selectedLog?.id === log.id && (
              <div className="bg-gray-50 rounded-b-xl border border-t-0 border-gray-200 px-5 py-4 ml-4 space-y-3 animate-fade-in-up">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-gray-400">日期</span><p className="font-medium text-gray-800">{log.date}</p></div>
                  <div><span className="text-gray-400">类型</span><p className="font-medium text-gray-800">{log.type}</p></div>
                  <div><span className="text-gray-400">时长 / 强度</span><p className="font-medium text-gray-800">{log.duration}分钟 · RPE {log.intensity}/10</p></div>
                </div>
                <div><span className="text-sm text-gray-400">训练重点</span><p className="font-medium text-gray-800">{log.focus || "—"}</p></div>
                <div><span className="text-sm text-gray-400">训练内容</span><p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{log.exercises || "—"}</p></div>
                <div><span className="text-sm text-gray-400">备注</span><p className="text-gray-600">{log.notes || "—"}</p></div>
                <div className="flex gap-2 pt-2">
                  <button onClick={(e) => { e.stopPropagation(); startEdit(log); }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">✏️ 编辑</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">🗑️ 删除</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
