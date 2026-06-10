"use client";
// 用户反馈建议页
import { useState } from "react";

const STORAGE_KEY = "bounce-feedback-list";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", type: "建议", content: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push({ ...form, time: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch { /* ignore */ }
    setSubmitted(true);
    setForm({ name: "", contact: "", type: "建议", content: "" });
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">感谢你的反馈！</h1>
        <p className="text-gray-500 mb-6">你的建议已保存，我们会认真对待每一条反馈，持续改进 BounceLab。</p>
        <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">继续提交新建议</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">💬 反馈与建议</h1>
        <p className="text-gray-500">你的意见帮助我们做得更好。功能需求、Bug 反馈、训练经验——都可以写。</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">称呼（选填）</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="你的名字" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">联系方式（选填）</label>
            <input type="text" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="微信/邮箱" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
            <option>建议</option><option>Bug 反馈</option><option>功能需求</option><option>训练经验分享</option><option>其他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">详细内容（必填）</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={5} placeholder="写下你想说的话..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg">提交反馈</button>
      </form>
      <p className="text-xs text-gray-400 text-center mt-4">反馈保存在本地浏览器中。后续版本将支持直接发送给开发者。</p>
    </div>
  );
}
