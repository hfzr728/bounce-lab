"use client";
// 用户按钮 — 显示在导航栏右侧
import { useState } from "react";
import { createPortal } from "react-dom";
import { useUser, LEVEL_LABELS, type UserProfile } from "@/lib/user/context";

export function UserButton() {
  const { user, isLoggedIn, login, logout, updateProfile } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({
    name: "",
    avatar: "🏀",
    level: "intermediate",
    weight: 70,
    height: 175,
    age: 22,
    goal: "提升垂直弹跳",
  });

  const AVATARS = ["🏀", "⚡", "🔥", "💪", "🦘", "🏃", "🎯", "🏆"];

  const handleLogin = () => {
    if (!form.name?.trim()) return;
    login({ ...form, name: form.name.trim() });
    setShowModal(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        <button onClick={() => setShowModal(true)} className="text-sm text-slate-400 hover:text-amber-400 transition-colors border border-slate-600 hover:border-amber-500/50 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <span>👤</span> 登录
        </button>

        {showModal && createPortal(
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-[320px] w-full p-5 shadow-2xl relative" onClick={e => e.stopPropagation()}>
              {/* Close button */}
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors text-sm">✕</button>
              <h2 className="text-base font-bold text-slate-100 mb-0.5">👋 创建你的档案</h2>
              <p className="text-xs text-slate-500 mb-4">数据仅保存在本地浏览器</p>

              {/* Avatar picker */}
              <div className="mb-3">
                <div className="flex gap-1.5 flex-wrap">
                  {AVATARS.map(a => (
                    <button key={a} onClick={() => setForm(f => ({ ...f, avatar: a }))}
                      className={`w-8 h-8 text-lg rounded-lg flex items-center justify-center transition-all ${
                        form.avatar === a ? "bg-amber-500/20 border-2 border-amber-500/50 scale-110" : "bg-slate-800 border border-slate-700 hover:border-slate-500"
                      }`}>{a}</button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="mb-2.5">
                <input type="text" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="你的昵称" className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50" />
              </div>

              {/* Level */}
              <div className="mb-2.5">
                <div className="flex gap-1.5">
                  {(Object.entries(LEVEL_LABELS) as [string, string][]).map(([key, label]) => (
                    <button key={key} onClick={() => setForm(f => ({ ...f, level: key as UserProfile["level"] }))}
                      className={`flex-1 py-1.5 text-xs rounded-lg transition-all ${
                        form.level === key ? "bg-amber-500/20 text-amber-300 border border-amber-500/50" : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500"
                      }`}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                <div>
                  <input type="number" value={form.weight || 70} onChange={e => setForm(f => ({ ...f, weight: parseInt(e.target.value) || 70 }))}
                    placeholder="体重" className="w-full px-2 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200 text-center outline-none focus:border-amber-500/50" />
                  <p className="text-[10px] text-slate-600 text-center mt-0.5">kg</p>
                </div>
                <div>
                  <input type="number" value={form.height || 175} onChange={e => setForm(f => ({ ...f, height: parseInt(e.target.value) || 175 }))}
                    placeholder="身高" className="w-full px-2 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200 text-center outline-none focus:border-amber-500/50" />
                  <p className="text-[10px] text-slate-600 text-center mt-0.5">cm</p>
                </div>
                <div>
                  <input type="number" value={form.age || 22} onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || 20 }))}
                    placeholder="年龄" className="w-full px-2 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200 text-center outline-none focus:border-amber-500/50" />
                  <p className="text-[10px] text-slate-600 text-center mt-0.5">岁</p>
                </div>
              </div>

              {/* Goal */}
              <div className="mb-4">
                <input type="text" value={form.goal || ""} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                  placeholder="训练目标，如：扣篮" className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50" />
              </div>

              <button onClick={handleLogin} disabled={!form.name?.trim()}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl text-sm transition-all hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
                开始使用 BounceLab →
              </button>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  // Logged in
  return (
    <>
      <button onClick={() => setShowModal(true)} className="text-sm text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5">
        <span>{user?.avatar || "🏀"}</span>
        <span className="max-w-[80px] truncate">{user?.name}</span>
      </button>

      {showModal && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-[300px] w-full p-5 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors text-sm">✕</button>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">{user?.avatar}</span>
              <h2 className="text-lg font-bold text-slate-100">{user?.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {LEVEL_LABELS[user?.level || "intermediate"]}训练者 · {user?.height}cm · {user?.weight}kg
              </p>
            </div>

            <div className="space-y-1.5 mb-4">
              {[
                ["训练水平", LEVEL_LABELS[user?.level || "intermediate"]],
                ["体重", `${user?.weight} kg`],
                ["身高", `${user?.height} cm`],
                ["年龄", `${user?.age} 岁`],
                ["加入日期", user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("zh-CN") : "-"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2">
                  <span>{label}</span>
                  <span className="text-slate-200">{value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => { logout(); setShowModal(false); }}
              className="w-full py-2 text-sm text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">
              退出登录
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
