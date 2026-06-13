"use client";

// 国际标准版问卷步骤页 — /assessment/standard/step/[step]

// 为静态托管预渲染所有 10 个步骤的 HTML
export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ step: String(i + 1) }));
}

import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { QuestionnaireProvider, useQuestionnaire } from "@/components/questionnaire/questionnaire-context";
import { ProgressBar } from "@/components/questionnaire/progress-bar";
import { QuestionCard } from "@/components/questionnaire/question-card";
import { StepNavigator } from "@/components/questionnaire/step-navigator";
import { getStandardStep, standardTotalSteps, standardTotalQuestions } from "@/lib/questionnaire/standard-steps";
import { getStandardQuestionById, standardQuestions } from "@/lib/questionnaire/standard-questions";
import { validateAllAnswers } from "@/lib/questionnaire/validation";

function StepContent() {
  const params = useParams();
  const router = useRouter();
  const stepParam = Number(params.step);
  const { state, goToStep, dispatch } = useQuestionnaire();

  const stepConfig = getStandardStep(stepParam);

  // useLayoutEffect fires BEFORE useEffect — ensures step syncs before localStorage load
  useLayoutEffect(() => {
    if (stepParam >= 1 && stepParam <= standardTotalSteps) {
      goToStep(stepParam);
    }
  }, [stepParam]);

  if (!stepConfig || stepParam < 1 || stepParam > standardTotalSteps) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-100 mb-4">步骤不存在</h1>
        <p className="text-slate-400 mb-6">请从第 1 步开始评估。</p>
        <a href="/assessment/standard/step/1" className="text-amber-400 hover:underline font-semibold">回到第一步 →</a>
      </div>
    );
  }

  const isLastStep = stepParam === standardTotalSteps;

  const handleSubmit = async () => {
    // 提交前最终校验：所有必填项 + 数字范围
    const allIds = standardQuestions.map(q => q.id);
    const errors = validateAllAnswers(allIds, getStandardQuestionById, state.answers);
    if (errors.length > 0) {
      const msg = errors.slice(0, 5).map(e => e.message).join("\n");
      alert(`请修正以下问题后再提交：\n\n${msg}${errors.length > 5 ? `\n...还有 ${errors.length - 5} 个问题` : ""}`);
      return;
    }

    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: state.answers }),
      });
      if (!response.ok) throw new Error("诊断请求失败: " + response.status);
      const engineResult = await response.json();
      engineResult.aiAnalysis = engineResult.aiAnalysis || "";
      sessionStorage.setItem("bounce-diagnosis", JSON.stringify(engineResult));
      sessionStorage.setItem("bounce-answers", JSON.stringify(state.answers));
      // 自动保存到个人主页
      const now = new Date().toLocaleString("zh-CN");
      const summary = `综合评分 ${engineResult.overallScore}/100，优势：${(engineResult.strengths || []).join("、")}`;
      const dup = (() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith("bounce-saved-d-")) { try { if (JSON.parse(localStorage.getItem(k) || "").summary === summary) return true; } catch {} } } return false; })();
      if (!dup) localStorage.setItem(`bounce-saved-d-${Date.now()}`, JSON.stringify({ type: "diagnosis", date: now, version: "国际标准版", overallScore: engineResult.overallScore, summary, fullDiagnosis: engineResult }));
      // 评估完成，清除所有版本的问卷进度
      localStorage.removeItem("bounce-questionnaire-basic");
      localStorage.removeItem("bounce-questionnaire-standard");
      localStorage.removeItem("bounce-questionnaire");
      router.push("/report");
    } catch {
      alert("诊断生成失败，请稍后重试。");
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const questions = stepConfig.questionIds
    .map((id) => getStandardQuestionById(id))
    .filter(Boolean);

  return (
    <div className="relative max-w-2xl mx-auto px-4 py-8">
      {/* 提交加载遮罩 */}
      {state.isSubmitting && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center max-w-sm px-4">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-500 rounded-full animate-bounce shadow-lg shadow-amber-500/50" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-amber-900/30 rounded-full blur-sm" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-400 rounded-full animate-pulse opacity-50" />
              <div className="absolute top-2 left-[30%] w-4 h-4 bg-amber-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: "300ms" }} />
              <div className="absolute top-2 right-[30%] w-4 h-4 bg-amber-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: "600ms" }} />
            </div>
            <p className="text-white text-xl font-bold mb-2">正在生成诊断报告...</p>
            <p className="text-amber-400 text-sm mb-6">
              AI 正在逐项分析你的 {standardTotalQuestions} 条数据
            </p>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-6">深度分析需要约 20-40 秒，请耐心等待</p>
          </div>
        </div>
      )}

      <ProgressBar urlStep={stepParam} />
      <div className="mb-6">
        <p className="text-sm text-slate-500">国际标准版 · 第 {stepParam} 步 / 共 {standardTotalSteps} 步</p>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">步骤 {stepParam}：{stepConfig.title}</h1>
        <p className="text-sm text-slate-400 mt-1">{stepConfig.description}</p>
      </div>
      <div className="space-y-4">
        {questions.map((q: any) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
      <StepNavigator
        urlStep={stepParam}
        onPrev={stepParam > 1 ? () => router.push(`/assessment/standard/step/${stepParam - 1}`) : undefined}
        onNext={isLastStep ? handleSubmit : () => router.push(`/assessment/standard/step/${stepParam + 1}`)}
        isLastStep={isLastStep}
        isSubmitting={state.isSubmitting}
      />
    </div>
  );
}

export default function StandardStepPage() {
  return (
    <QuestionnaireProvider totalQuestionCount={standardTotalQuestions} totalStepCount={standardTotalSteps}>
      <StepContent />
    </QuestionnaireProvider>
  );
}
