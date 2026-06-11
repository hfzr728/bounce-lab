"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "bounce-feedback-list";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", type: "建议", content: "" });
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    try { setFeedbacks(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch {}
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push({ ...form, time: new Date().toISOString(), page: window.location.href });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {}
    setSubmitted(true);
    setForm({ name: "", contact: "", type: "建议", content: "" });
  };

  const exportAll = () => {
    const text = feedbacks.map((f, i) =>
      `[${i + 1}] ${f.type} | ${f.name || "匿名"} | ${new Date(f.time).toLocaleString("zh-CN")}\n${f.content}\n---`
    ).join("\n\n");
    navigator.clipboard.writeText(text).then(() => alert("已复制全部反馈到剪贴板！"));
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12 bg-[#0f172a] min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">💬 反馈与建议</h1>
        <p className="text-slate-400">功能需求、Bug 反馈、训练经验——都可以写</p>
      </div>

      {submitted ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">感谢你的反馈！</h1>
          <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-3 bg-amber-500 text-slate-900 rounded-xl font-bold">继续提交新建议</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">称呼（选填）</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="你的名字" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">联系方式（选填）</label>
              <input type="text" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="微信/邮箱" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">类型</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 outline-none focus:border-amber-500/50">
              <option>建议</option><option>Bug 反馈</option><option>功能需求</option><option>训练经验分享</option><option>其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">详细内容（必填）</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={5} placeholder="写下你想说的话..." className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50 resize-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all">提交反馈</button>
        </form>
      )}

      {feedbacks.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">📋 已提交的反馈（{feedbacks.length}条）</h3>
            <button onClick={exportAll} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors">📋 导出全部</button>
          </div>
          <div className="space-y-3">
            {feedbacks.slice().reverse().map((f, i) => (
              <div key={i} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">{f.type}</span>
                  <span className="text-xs text-slate-500">{new Date(f.time).toLocaleString("zh-CN")}</span>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{f.content}</p>
                {f.name && <p className="text-xs text-slate-500 mt-1">— {f.name}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
