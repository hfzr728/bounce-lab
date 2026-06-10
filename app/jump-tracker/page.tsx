"use client";
// 弹跳测试追踪器 — 记录垂直跳/立定跳远 PR + 进步曲线
import { useState, useEffect } from "react";

const TRACK_KEY = "bounce-jump-tracker";

interface JumpRecord {
  id: string; date: string;
  cmj: number; sj: number; approach: number; broadJump: number;
  notes: string;
}

export default function JumpTrackerPage() {
  const [records, setRecords] = useState<JumpRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<JumpRecord, "id">>({
    date: new Date().toISOString().split("T")[0], cmj: 0, sj: 0, approach: 0, broadJump: 0, notes: ""
  });

  useEffect(() => {
    try { setRecords(JSON.parse(localStorage.getItem(TRACK_KEY) || "[]")); } catch { setRecords([]); }
  }, []);

  const save = () => {
    const entry: JumpRecord = { ...form, id: Date.now().toString() };
    const updated = [entry, ...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setRecords(updated);
    localStorage.setItem(TRACK_KEY, JSON.stringify(updated));
    setForm({ date: new Date().toISOString().split("T")[0], cmj: 0, sj: 0, approach: 0, broadJump: 0, notes: "" });
    setShowForm(false);
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem(TRACK_KEY, JSON.stringify(updated));
  };

  const best = (field: keyof JumpRecord) => records.reduce((max, r) => Math.max(max, Number(r[field]) || 0), 0);
  const latest = records[records.length - 1];
  const trend = records.length >= 2 ? (Number(latest?.cmj) || 0) - (Number(records[records.length - 2]?.cmj) || 0) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50">📈 弹跳测试追踪</h1>
          <p className="text-slate-400 mt-1">记录每次弹跳测试数据，追踪进步轨迹</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a14] font-bold rounded-xl transition-all shadow-md text-sm">
          {showForm ? "取消" : "+ 记录测试"}
        </button>
      </div>

      {/* PR 面板 */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "CMJ 最佳", value: `${best("cmj")}cm`, sub: latest ? `最近: ${latest.cmj}cm` : "—" },
            { label: "SJ 最佳", value: `${best("sj")}cm`, sub: latest ? `最近: ${latest.sj}cm` : "—" },
            { label: "助跑摸高最佳", value: `${best("approach")}cm`, sub: latest ? `最近: ${latest.approach}cm` : "—" },
            { label: "立定跳远最佳", value: `${best("broadJump")}cm`, sub: trend !== 0 ? `CMJ趋势: ${trend > 0 ? "+" : ""}${trend}cm` : "—" },
          ].map(item => (
            <div key={item.label} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">{item.label}</p>
              <p className="text-xl font-extrabold text-amber-400">{item.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* 简易进度条 */}
      {records.length >= 2 && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">CMJ 进步曲线</h3>
          <div className="flex items-end gap-1 h-24">
            {records.map((r, i) => {
              const h = best("cmj") > 0 ? (Number(r.cmj) / best("cmj")) * 100 : 0;
              return (
                <div key={r.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t transition-all hover:from-amber-400" style={{ height: `${Math.max(h, 5)}%` }} />
                  <span className="text-[10px] text-slate-500">{r.date.slice(5)}</span>
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded whitespace-nowrap">{r.cmj}cm</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold text-slate-100">➕ 记录弹跳测试</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">日期</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">CMJ 反向纵跳 (cm)</label>
              <input type="number" value={form.cmj || ""} onChange={e => setForm({ ...form, cmj: Number(e.target.value) })} placeholder="0" className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">SJ 蹲跳 (cm)</label>
              <input type="number" value={form.sj || ""} onChange={e => setForm({ ...form, sj: Number(e.target.value) })} placeholder="0" className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">助跑摸高 (cm)</label>
              <input type="number" value={form.approach || ""} onChange={e => setForm({ ...form, approach: Number(e.target.value) })} placeholder="0" className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">立定跳远 (cm)</label>
              <input type="number" value={form.broadJump || ""} onChange={e => setForm({ ...form, broadJump: Number(e.target.value) })} placeholder="0" className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">备注</label>
              <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="测试条件、感受..." className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
          </div>
          <button onClick={save} className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-[#0a0a14] font-bold rounded-xl transition-all">保存测试记录</button>
        </div>
      )}

      {records.length === 0 && !showForm && (
        <div className="text-center py-16 text-slate-500"><div className="text-5xl mb-4">📈</div><p>还没有弹跳测试记录</p><p className="text-sm mt-1">定期测试追踪进步，建议每2-4周测一次</p></div>
      )}

      <div className="space-y-2">
        {[...records].reverse().map(r => (
          <div key={r.id} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <div className="text-center w-14 flex-shrink-0"><div className="text-sm font-bold text-slate-200">{r.date.slice(5)}</div></div>
            <div className="flex-1 grid grid-cols-4 gap-2 text-center">
              <div><span className="text-xs text-slate-500">CMJ</span><p className="font-semibold text-slate-100">{r.cmj || "—"}</p></div>
              <div><span className="text-xs text-slate-500">SJ</span><p className="font-semibold text-slate-100">{r.sj || "—"}</p></div>
              <div><span className="text-xs text-slate-500">摸高</span><p className="font-semibold text-slate-100">{r.approach || "—"}</p></div>
              <div><span className="text-xs text-slate-500">跳远</span><p className="font-semibold text-slate-100">{r.broadJump || "—"}</p></div>
            </div>
            <button onClick={() => deleteRecord(r.id)} className="text-slate-600 hover:text-red-400 text-sm">删除</button>
          </div>
        ))}
      </div>
    </div>
  );
}
