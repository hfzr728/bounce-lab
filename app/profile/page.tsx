"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/context";

interface SavedRecord {
  type: "diagnosis" | "plan";
  date: string;
  version: string;
  overallScore?: number;
  summary: string;
  planText?: string;
}

export default function ProfilePage() {
  const { user, isLoggedIn } = useUser();
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 加载已保存记录
    const savedRecords: SavedRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("bounce-saved-")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "");
          savedRecords.push(data);
        } catch { /* skip */ }
      }
    }
    savedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecords(savedRecords);
  }, [saved]);

  const clearAll = () => { if (confirm("确定清除所有记录？")) { const keys: string[] = []; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key?.startsWith("bounce-saved-")) keys.push(key); } keys.forEach(k => localStorage.removeItem(k)); setRecords([]); } };

  const deleteOne = (r: any) => {
    if (!confirm("确定删除这条记录？")) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("bounce-saved-")) {
        try {
          const d = JSON.parse(localStorage.getItem(key) || "");
          if (d.date === r.date && d.type === r.type && d.summary === r.summary) {
            localStorage.removeItem(key);
            break;
          }
        } catch {}
      }
    }
    setSaved(prev => !prev);
  };

  const openRecord = (r: any) => {
    if (r.type === "plan" && r.planText) {
      sessionStorage.setItem("bounce-plan", JSON.stringify({ aiGenerated: r.planText }));
      window.location.href = "/plan";
    } else if (r.type === "diagnosis" && r.fullDiagnosis) {
      sessionStorage.setItem("bounce-diagnosis", JSON.stringify(r.fullDiagnosis));
      window.location.href = "/report";
    } else if (r.type === "plan") {
      window.location.href = "/plan";
    } else {
      window.location.href = "/report";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-[#0f172a] min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">👤 个人主页</h1>
        <p className="text-slate-400">{isLoggedIn ? `${user?.avatar || "🏀"} ${user?.name} 的训练档案` : "登录后可查看已保存的评估记录与训练计划"}</p>
      </div>

      {/* 未登录提示 */}
      {!isLoggedIn && (
        <div className="text-center py-12">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">请先登录</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">个人主页需要登录后才能使用。点击右上角「👤 登录」按钮创建你的档案，数据仅保存在本地浏览器。</p>
          <Link
            href="/assessment"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25"
          >
            先去评估 →
          </Link>
        </div>
      )}

      {/* 已登录才显示以下内容 */}
      {isLoggedIn && (
      <>
      {/* 用户信息卡 */}
      {user && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 mb-8 flex items-center gap-4">
          <span className="text-4xl">{user.avatar || "🏀"}</span>
          <div>
            <p className="text-lg font-bold text-white">{user.name}</p>
            <p className="text-xs text-slate-400">
              {user.age}岁 · {user.height}cm · {user.weight}kg · 目标：{user.goal}
            </p>
          </div>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">📭</div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">暂无保存记录</h2>
          <p className="text-slate-400 mb-8">完成评估后，报告和训练计划将自动保存到这里</p>
          <Link
            href="/assessment"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25"
          >
            开始评估 →
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {records.map((r, i) => (
          <div
            key={i}
            onClick={() => openRecord(r)}
            className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/50 hover:bg-[#1e293b]/80 transition-all cursor-pointer relative group"
          >
            <button
              onClick={(e) => { e.stopPropagation(); deleteOne(r); }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-700 hover:bg-red-600 text-slate-400 hover:text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              title="删除"
            >✕</button>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${r.type === "diagnosis" ? "bg-amber-500/20 text-amber-400" : "bg-green-500/20 text-green-400"}`}>
                {r.type === "diagnosis" ? "📊 评估报告" : "📋 训练计划"}
              </span>
              <span className="text-xs text-slate-500">{r.date}</span>
            </div>
            {r.version && <p className="text-xs text-slate-500 mb-1">版本：{r.version}</p>}
            {r.overallScore !== undefined && (
              <p className="text-2xl font-bold text-amber-400 mb-1">{r.overallScore}<span className="text-sm text-slate-500">/100</span></p>
            )}
            <p className="text-sm text-slate-300 leading-relaxed">{r.summary}</p>
            <p className="text-xs text-slate-500 mt-2">点击查看详情 →</p>
          </div>
        ))}
      </div>

      {records.length > 0 && (
        <div className="text-center mt-10 space-y-4">
          <div className="flex justify-center gap-4">
            <Link href="/plan" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-[#0a0a14] font-bold rounded-xl transition-all shadow-lg">
              🧠 去生成训练计划 →
            </Link>
            <Link href="/assessment" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl transition-all border border-slate-600">
              🔬 去评估
            </Link>
          </div>
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm text-slate-500 hover:text-red-400 transition-colors"
          >
            清除所有记录
          </button>
        </div>
      )}
      </>
      )}
    </div>
  );
}
