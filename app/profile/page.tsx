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
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 检查未保存数据
    try {
      const diag = sessionStorage.getItem("bounce-diagnosis");
      const plan = sessionStorage.getItem("bounce-plan");
      setHasUnsaved(!!(diag || plan));
    } catch { /* SSR safe */ }

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

  const handleSaveCurrent = () => {
    const diag = sessionStorage.getItem("bounce-diagnosis");
    const plan = sessionStorage.getItem("bounce-plan");
    const answers = sessionStorage.getItem("bounce-answers");
    const now = new Date().toLocaleString("zh-CN");

    if (diag) {
      try {
        const d = JSON.parse(diag);
        const isBasic = answers ? Object.keys(JSON.parse(answers)).some((k: string) => k.startsWith("bb")) : false;
        const isStandard = answers ? Object.keys(JSON.parse(answers)).some((k: string) => k.startsWith("st")) : false;
        const version = isBasic ? "体测版" : isStandard ? "国际标准版" : "专业版";
        const record: SavedRecord = {
          type: "diagnosis",
          date: now,
          version,
          overallScore: d.overallScore,
          summary: `综合评分 ${d.overallScore}/100，优势：${d.strengths?.join("、") || "无"}`,
        };
        localStorage.setItem(`bounce-saved-d-${Date.now()}`, JSON.stringify(record));
      } catch { /* ignore */ }
    }

    if (plan) {
      try {
        const p = JSON.parse(plan);
        const record: SavedRecord = {
          type: "plan",
          date: now,
          version: "",
          summary: (p.aiGenerated || "").slice(0, 100) + "..." || "训练计划已保存",
          planText: p.aiGenerated || "",
        };
        localStorage.setItem(`bounce-saved-p-${Date.now()}`, JSON.stringify(record));
      } catch { /* ignore */ }
    }

    // 清除 sessionStorage 标记为已保存
    sessionStorage.removeItem("bounce-diagnosis");
    sessionStorage.removeItem("bounce-plan");
    setHasUnsaved(false);
    setSaved(prev => !prev); // 触发刷新
  };

  const clearAll = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("bounce-saved-")) keys.push(key);
    }
    keys.forEach(k => localStorage.removeItem(k));
    setRecords([]);
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

      {hasUnsaved && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 text-center">
          <p className="text-amber-300 mb-3">检测到当前有未保存的评估/计划结果</p>
          <button
            onClick={handleSaveCurrent}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25"
          >
            💾 保存到个人记录
          </button>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">📭</div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">暂无保存记录</h2>
          <p className="text-slate-400 mb-8">完成评估后，在报告页点击"保存到个人记录"即可</p>
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
            className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/50 hover:bg-[#1e293b]/80 transition-all cursor-pointer"
          >
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
        <div className="text-center mt-10">
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
