"use client";
// 用户按钮 — 显示在导航栏右侧
import { useState } from "react";
import { createPortal } from "react-dom";
import { useUser, LEVEL_LABELS } from "@/lib/user/context";

export function UserButton() {
  const { user, isLoggedIn, login, logout, findUser, verifyUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("🏀");

  const AVATARS = ["🏀", "⚡", "🔥", "💪", "🦘", "🏃", "🎯", "🏆"];

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedPwd = password.trim();
    if (!trimmedName || !trimmedPwd) return;
    const existing = findUser(trimmedName);
    if (existing) { setError("该昵称已注册，请切换到登录"); return; }
    await login({ name: trimmedName, password: trimmedPwd, avatar });
    setShowModal(false);
    setError("");
  };

  const handleLogin = async () => {
    const trimmedName = name.trim();
    const trimmedPwd = password.trim();
    if (!trimmedName || !trimmedPwd) return;
    const existing = findUser(trimmedName);
    if (!existing) { setError("该用户不存在，请先注册"); return; }
    const valid = await verifyUser(trimmedName, trimmedPwd);
    if (!valid) { setError("密码错误"); return; }
    await login({ name: trimmedName, password: trimmedPwd, avatar: existing.avatar });
    setShowModal(false);
    setError("");
  };

  if (!isLoggedIn) {
    return (
      <>
        <button onClick={() => { setShowModal(true); setMode("register"); setError(""); }}
          className="text-sm text-slate-400 hover:text-[#00F5FF] transition-colors border border-white/10 hover:border-[#00F5FF]/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <span>👤</span> 登录
        </button>

        {showModal && createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="glass-card max-w-[340px] w-full p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors text-sm">✕</button>

              {/* 注册/登录切换 */}
              <div className="flex mb-5 bg-white/5 rounded-lg p-0.5">
                <button onClick={() => { setMode("register"); setError(""); }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "register" ? "bg-[#00F5FF]/20 text-[#00F5FF]" : "text-slate-500 hover:text-slate-300"}`}>注册</button>
                <button onClick={() => { setMode("login"); setError(""); }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "login" ? "bg-[#00F5FF]/20 text-[#00F5FF]" : "text-slate-500 hover:text-slate-300"}`}>登录</button>
              </div>

              <h2 className="text-base font-bold text-white mb-0.5">{mode === "register" ? "👋 创建新账号" : "🔑 登录账号"}</h2>
              <p className="text-xs text-slate-500 mb-4">数据仅保存在本地浏览器</p>

              {error && <p className="text-xs text-red-400 mb-3 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">{error}</p>}

              <div className="mb-3">
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="昵称"
                  className="input-glow w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:border-[#00F5FF]/50 transition-colors" />
              </div>
              <div className="mb-4">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "设置密码" : "输入密码"}
                  className="input-glow w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:border-[#00F5FF]/50 transition-colors" />
              </div>

              {/* 头像选择（仅注册时显示） */}
              {mode === "register" && (
                <div className="mb-5">
                  <p className="text-xs text-slate-500 mb-2">选择头像</p>
                  <div className="flex gap-2 flex-wrap">
                    {AVATARS.map(a => (
                      <button key={a} onClick={() => setAvatar(a)}
                        className={`w-9 h-9 text-lg rounded-lg transition-all ${avatar === a ? "bg-[#00F5FF]/20 border border-[#00F5FF]/50 scale-110 shadow-[0_0_10px_rgba(0,245,255,0.2)]" : "bg-white/5 border border-white/10 hover:border-white/20"}`}>{a}</button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={mode === "register" ? handleRegister : handleLogin} disabled={!name.trim() || !password.trim()}
                className="btn-skew bg-[#00F5FF] text-[#0A0A0A] text-sm w-full disabled:opacity-40 disabled:cursor-not-allowed">
                {mode === "register" ? "注册并开始使用 →" : "登录 →"}
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
      <button onClick={() => setShowModal(true)}
        className="text-sm text-slate-300 hover:text-[#00F5FF] transition-colors flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-[#00F5FF]/30 rounded-lg px-3 py-1.5">
        <span>{user?.avatar || "🏀"}</span>
        <span className="max-w-[80px] truncate">{user?.name}</span>
      </button>

      {showModal && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card max-w-[300px] w-full p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors text-sm">✕</button>

            <div className="text-center mb-5">
              <span className="text-5xl mb-2 block">{user?.avatar}</span>
              <h2 className="text-lg font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                {LEVEL_LABELS[user?.level || "intermediate"]}训练者 · {user?.height}cm · {user?.weight}kg
              </p>
            </div>

            <div className="space-y-1.5 mb-5">
              {[
                ["训练水平", LEVEL_LABELS[user?.level || "intermediate"]],
                ["体重", `${user?.weight} kg`],
                ["身高", `${user?.height} cm`],
                ["年龄", `${user?.age} 岁`],
                ["加入日期", user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("zh-CN") : "-"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs text-slate-400 bg-white/[0.03] rounded-lg px-3 py-2">
                  <span>{label}</span>
                  <span className="text-slate-200 font-medium">{value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => { logout(); setShowModal(false); }}
              className="w-full py-2 text-sm text-[#FF3B3B] border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 transition-colors font-medium">
              退出登录
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
