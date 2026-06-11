"use client";
// 悬浮反馈按钮 + 弹窗
import { useState } from "react";

const STORAGE_KEY = "bounce-feedback-list";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "建议", content: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push({ ...form, time: new Date().toISOString(), page: window.location.href });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {}
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setForm({ name: "", type: "建议", content: "" }); }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full shadow-xl flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
        title="反馈建议"
      >
        💬
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">💬 反馈建议</h3>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white text-lg">✕</button>
            </div>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-slate-300 font-medium">感谢你的反馈！</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="你的称呼（选填）" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 outline-none focus:border-amber-500/50">
                    <option>建议</option><option>Bug 反馈</option><option>功能需求</option><option>其他</option>
                  </select>
                </div>
                <div>
                  <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    required rows={4} placeholder="写下你的想法..."
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50 resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all">
                  提交反馈
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
