"use client";

// 诊断报告页 — 雷达图 + 优劣势 + 受伤风险 + AI 分析
// ============================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RadarChart } from "@/components/report/radar-chart";
import type { DiagnosisResult } from "@/lib/questionnaire/types";

export default function ReportPage() {
  const router = useRouter();
  const [data, setData] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("bounce-diagnosis");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
        // Auto-save diagnosis to localStorage for plan generation
        const savedDiag = {
          type: "diagnosis",
          date: new Date().toISOString(),
          version: parsed.version || "unknown",
          summary: parsed.diagnosisSummary || `综合评分 ${parsed.overallScore || "?"}/100`,
          overallScore: parsed.overallScore,
          weaknesses: parsed.weaknesses,
          strengths: parsed.strengths,
          injuryRisk: parsed.injuryRisk,
          answers: parsed.answers,
          diagnosisSummary: parsed.diagnosisSummary,
          fullDiagnosis: parsed,
        };
        // Deduplicate: check by summary content (ignore date)
        let isDup = false;
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k?.startsWith("bounce-saved-d-")) {
            try {
              const d = JSON.parse(localStorage.getItem(k) || "");
              if (d.summary === savedDiag.summary) { isDup = true; break; }
            } catch {}
          }
        }
        if (!isDup) {
          localStorage.setItem("bounce-saved-d-" + Date.now(), JSON.stringify(savedDiag));
        }
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          {/* 弹跳动画 */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-500 rounded-full animate-bounce shadow-lg shadow-amber-500/50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-amber-900/30 rounded-full blur-sm" />
          </div>
          <p className="text-slate-300 text-lg font-medium mb-2">正在加载诊断报告...</p>
          <div className="flex justify-center gap-1 mt-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "200ms" }} />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-6">📋</div>
          <h1 className="text-2xl font-bold text-slate-100 mb-4">未找到诊断数据</h1>
          <p className="text-slate-400 mb-8">请先完成弹跳能力评估问卷，系统将为您生成专业的个性化诊断报告。</p>
          <a href="/assessment" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25">
            开始评估 →
          </a>
        </div>
      </div>
    );
  }

  const riskColor =
    data.injuryRisk.level === "高"
      ? "text-red-600 bg-red-50 border-red-200"
      : data.injuryRisk.level === "中"
      ? "text-yellow-600 bg-yellow-50 border-yellow-200"
      : "text-green-600 bg-green-50 border-green-200";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          📊 弹跳能力诊断报告
        </h1>
        <p className="text-gray-400">基于您的问卷数据生成的个性化分析</p>
      </div>

      {/* 综合评分 */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 text-[#0a0a14] mb-8 text-center shadow-lg shadow-amber-500/25">
        <p className="text-amber-900 mb-1">综合弹跳潜力评分</p>
        <div className="text-6xl font-extrabold mb-2">{data.overallScore}</div>
        <p className="text-blue-100 text-sm">满分 100</p>
      </div>

      {/* 雷达图 */}
      <RadarChart dimensionScores={data.dimensionScores} />

      {/* 优势与弱项 */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#12122a] border border-white/5 rounded-2xl p-6 border-l-2 border-l-green-500">
          <h3 className="text-lg font-bold text-green-400 mb-3">💪 您的优势</h3>
          <ul className="space-y-2">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 mt-1">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-bold text-orange-700 mb-3">⚠️ 需要提升</h3>
          <ul className="space-y-2">
            {data.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-orange-500 mt-1">→</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 受伤风险 */}
      <div className={`mt-8 rounded-2xl border p-6 ${riskColor}`}>
        <h3 className="text-lg font-bold mb-2">🏥 受伤风险评估</h3>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl font-extrabold">
            {data.injuryRisk.level}
          </span>
          <span className="text-sm opacity-75">风险评分 {data.injuryRisk.score}/100</span>
        </div>
        {data.injuryRisk.factors.length > 0 && (
          <ul className="space-y-1 text-sm">
            {data.injuryRisk.factors.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        )}
        {data.injuryRisk.factors.length === 0 && (
          <p className="text-sm">未检测到显著风险因素，继续保持！</p>
        )}
      </div>

      {/* AI 分析 */}
      <div className="mt-8 bg-[#1e293b] border border-slate-700/50 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-white mb-4">🤖 AI 深度分析</h3>
        <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
          {data.aiAnalysis}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-10 justify-center">
        <Link
          href="/profile"
          className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-600/30"
        >
          ← 返回个人主页
        </Link>
        <Link
          href="/plan"
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-[#0a0a14] font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25"
        >
          📋 生成训练计划 →
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("bounce-questionnaire-basic");
            localStorage.removeItem("bounce-questionnaire-standard");
            localStorage.removeItem("bounce-questionnaire");
            sessionStorage.removeItem("bounce-diagnosis");
            sessionStorage.removeItem("bounce-answers");
            router.push("/assessment");
          }}
          className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-600/30"
        >
          重新评估
        </button>
      </div>
    </div>
  );
}
