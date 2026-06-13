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
  const [showGuide, setShowGuide] = useState(false);
  const [chartMetric, setChartMetric] = useState<"cmj" | "sj" | "approach" | "broadJump">("cmj");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50">📈 弹跳测试追踪</h1>
          <p className="text-slate-400 mt-1 text-sm">记录每次弹跳测试数据，追踪进步轨迹</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a14] font-bold rounded-xl transition-all shadow-md text-sm self-start sm:self-auto">
          {showForm ? "取消" : "+ 记录测试"}
        </button>
      </div>

      {/* 测试方法指南 */}
      <div className="mb-6">
        <button onClick={() => setShowGuide(!showGuide)}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 mb-2">
          {showGuide ? "▲" : "▼"} 不知道怎么测？点击查看 CMJ / SJ / 助跑摸高 / 立定跳远 测试方法
        </button>
        {showGuide && (
          <div className="bg-[#1e293b] border border-amber-500/20 rounded-xl p-4 grid md:grid-cols-2 gap-3 text-xs text-slate-400 leading-relaxed">
            <div>
              <p className="text-amber-400 font-bold mb-1">🦘 CMJ（反向纵跳 / Countermovement Jump）</p>
              <p>最常用的弹跳测试。站直后先快速下蹲（反向运动），然后全力向上跳起。测量指尖摸高最高点 — 站立摸高 = 弹跳高度。可用手机慢动作拍摄或摸高测量器。</p>
            </div>
            <div>
              <p className="text-amber-400 font-bold mb-1">🏋️ SJ（蹲跳 / Squat Jump）</p>
              <p>从半蹲姿势（膝角约90°）静止 2-3 秒后，不借助反向运动直接全力起跳。反映纯向心收缩力量，与 CMJ 对比可判断 SSC 利用效率。CMJ 通常比 SJ 高 3-6cm。</p>
            </div>
            <div>
              <p className="text-amber-400 font-bold mb-1">🏃 助跑摸高（Approach Jump）</p>
              <p>3-5 步助跑后单脚或双脚起跳摸高。模拟篮球/排球实战弹跳。测量助跑后摸高最高点 — 站立摸高。注意记录是单脚还是双脚起跳。</p>
            </div>
            <div>
              <p className="text-amber-400 font-bold mb-1">📏 立定跳远（Broad Jump）</p>
              <p>双脚站定后摆臂下蹲，全力向前跳出。测量起跳线到落地最近脚后跟的距离。反映水平爆发力，与垂直弹跳高度相关。</p>
            </div>
          </div>
        )}
      </div>

      {/* PR 面板 */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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

      {/* 进步曲线 — 四合一 */}
      {records.filter(r => Number(r.cmj) > 0 || Number(r.sj) > 0 || Number(r.approach) > 0 || Number(r.broadJump) > 0).length >= 2 && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-300">📈 进步曲线</h3>
            <div className="flex gap-1 flex-wrap">
              {([
                { key: "cmj" as const, label: "CMJ", color: "#f59e0b" },
                { key: "sj" as const, label: "SJ", color: "#3b82f6" },
                { key: "approach" as const, label: "助跑", color: "#10b981" },
                { key: "broadJump" as const, label: "立定跳远", color: "#8b5cf6" },
              ]).map(m => (
                <button key={m.key} onClick={() => setChartMetric(m.key)}
                  className={`px-2 py-0.5 text-xs rounded-full border transition-all ${
                    chartMetric === m.key
                      ? "border-current text-slate-900 font-bold"
                      : "border-slate-600 text-slate-500 hover:border-slate-400"
                  }`}
                  style={chartMetric === m.key ? { backgroundColor: m.color, borderColor: m.color } : {}}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-48 mb-2 overflow-x-auto -mx-2 px-2">
            <svg className="h-full min-w-[300px]" viewBox={`0 0 ${Math.max((records.filter(r => Number(r[chartMetric]) > 0).length - 1) * 60 + 40, 280)} 180`} preserveAspectRatio="xMidYMid meet">
              {[0, 25, 50, 75, 100].map(pct => (
                <line key={pct} x1="0" y1={160 - (pct / 100) * 140} x2="100%" y2={160 - (pct / 100) * 140} stroke="#334155" strokeWidth="0.5" />
              ))}
              {(() => {
                const colors: Record<string, string> = { cmj: "#f59e0b", sj: "#3b82f6", approach: "#10b981", broadJump: "#8b5cf6" };
                const color = colors[chartMetric];
                const validRecords = records.filter(r => Number(r[chartMetric]) > 0);
                if (validRecords.length < 2) return null;
                const maxV = Math.max(...validRecords.map(r => Number(r[chartMetric])));
                const minV = Math.min(...validRecords.map(r => Number(r[chartMetric])));
                const range = maxV - minV || 10;
                const pad = range * 0.15;
                const points = validRecords.map((r, i) => {
                  const x = 20 + i * 60;
                  const y = 160 - ((Number(r[chartMetric]) - (minV - pad)) / (maxV - minV + pad * 2)) * 140;
                  return { x, y, val: Number(r[chartMetric]), date: r.date.slice(5) };
                });
                const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                return (
                  <>
                    <path d={`${linePath} L ${points[points.length - 1].x} 160 L 20 160 Z`} fill={color} opacity="0.1" />
                    <path d={linePath} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#1e293b" stroke={color} strokeWidth="2" />
                        <text x={p.x} y={p.y - 10} textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">{p.val}</text>
                        <text x={p.x} y={178} textAnchor="middle" fill="#64748b" fontSize="11">{p.date}</text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          {/* 图例 */}
          <div className="flex justify-center gap-2 sm:gap-4 text-[10px] text-slate-500 flex-wrap">
            {[
              { key: "cmj" as const, label: "CMJ", color: "#f59e0b" },
              { key: "sj" as const, label: "SJ", color: "#3b82f6" },
              { key: "approach" as const, label: "助跑摸高", color: "#10b981" },
              { key: "broadJump" as const, label: "立定跳远", color: "#8b5cf6" },
            ].map(m => {
              const count = records.filter(r => Number(r[m.key]) > 0).length;
              return <span key={m.key} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: m.color }} /> {m.label} ({count}次)
              </span>;
            })}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold text-slate-100">➕ 记录弹跳测试</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">立定跳远 (cm)</label>
              <input type="number" value={form.broadJump || ""} onChange={e => setForm({ ...form, broadJump: Number(e.target.value) })} placeholder="0" className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">备注</label>
              <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="测试条件、感受..." className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30" />
            </div>
          </div>
          <button onClick={save} className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-[#0a0a14] font-bold rounded-xl transition-all">保存测试记录</button>
        </div>
      )}

      {records.length === 0 && !showForm && (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-4">📈</div>
          <p className="text-lg font-semibold text-slate-300 mb-2">还没有弹跳测试记录</p>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            定期测试 CMJ / SJ / 助跑摸高 / 立定跳远，追踪弹跳能力的进步轨迹。
            <br />
            建议每 2-4 周测试一次。
          </p>
          <button onClick={() => setShowForm(true)} className="mt-5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a14] font-bold rounded-xl transition-all shadow-md text-sm">
            + 记录第一次测试
          </button>
        </div>
      )}

      <div className="space-y-2">
        {[...records].reverse().map(r => (
          <div key={r.id} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="text-center w-14 flex-shrink-0"><div className="text-sm font-bold text-slate-200">{r.date.slice(5)}</div></div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center min-w-0">
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
