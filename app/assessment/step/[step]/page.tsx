"use client";

// 问卷步骤页 — 动态路由 /assessment/step/[step]
// ============================================================

import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { QuestionnaireProvider, useQuestionnaire } from "@/components/questionnaire/questionnaire-context";
import { ProgressBar } from "@/components/questionnaire/progress-bar";
import { QuestionCard } from "@/components/questionnaire/question-card";
import { StepNavigator } from "@/components/questionnaire/step-navigator";
import { getStep, totalSteps, totalQuestions } from "@/lib/questionnaire/steps";
import { getQuestionById } from "@/lib/questionnaire/questions";

function StepContent() {
  const params = useParams();
  const router = useRouter();
  const stepParam = Number(params.step);
  const { state, goToStep, dispatch } = useQuestionnaire();

  const stepConfig = getStep(stepParam);

  // useLayoutEffect fires BEFORE useEffect — ensures step syncs before localStorage load
  useLayoutEffect(() => {
    if (stepParam >= 1 && stepParam <= totalSteps) {
      goToStep(stepParam);
    }
  }, [stepParam]);

  if (!stepConfig || stepParam < 1 || stepParam > totalSteps) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-100 mb-4">步骤不存在</h1>
        <p className="text-slate-400 mb-6">请从第 1 步开始评估。</p>
        <a href="/assessment/step/1" className="text-amber-400 hover:underline font-semibold">
          回到第一步 →
        </a>
      </div>
    );
  }

  const isLastStep = stepParam === totalSteps;

  const handleSubmit = async () => {
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      const response = await fetch("/api/diagnose/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: state.answers }),
      });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取流");
      const decoder = new TextDecoder();
      let engineResult: any = null, aiText = "", buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.dimensionScores) {
              engineResult = data;
              sessionStorage.setItem("bounce-diagnosis", JSON.stringify({ ...data, aiAnalysis: "" }));
              sessionStorage.setItem("bounce-answers", JSON.stringify(state.answers));
            } else if (data.text) {
              aiText += data.text;
            }
          } catch {}
        }
      }
      if (engineResult) {
        engineResult.aiAnalysis = aiText;
        sessionStorage.setItem("bounce-diagnosis", JSON.stringify(engineResult));
      }
      router.push("/report");
    } catch {
      alert("诊断生成失败，请稍后重试。");
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const questions = stepConfig.questionIds
    .map((id) => getQuestionById(id))
    .filter(Boolean);

  return (
    <div className="relative max-w-2xl mx-auto px-4 py-8">
      {/* 提交加载遮罩 */}
      {state.isSubmitting && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-500 rounded-full animate-bounce shadow-lg shadow-amber-500/50" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-amber-900/30 rounded-full blur-sm" />
            </div>
            <p className="text-white text-lg font-semibold mb-2">正在生成诊断报告...</p>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              AI 正在深度分析您的多维数据，生成个性化弹跳能力诊断报告，请稍候
            </p>
            <div className="flex justify-center gap-1.5 mt-5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "0ms" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "300ms" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "450ms" }} />
            </div>
          </div>
        </div>
      )}

      <ProgressBar urlStep={stepParam} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">
          步骤 {stepParam}：{stepConfig.title}
        </h1>
        <p className="text-slate-400">{stepConfig.description}</p>
      </div>

      <div>
        {questions.map((q) =>
          q ? <QuestionCard key={q.id} question={q} /> : null
        )}
      </div>

      {isLastStep ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <StepNavigator
            urlStep={stepParam}
            isLastStep={true}
            isSubmitting={state.isSubmitting}
          />
        </form>
      ) : (
        <StepNavigator
          urlStep={stepParam}
          onPrev={() => {
            if (stepParam > 1) {
              router.push(`/assessment/step/${stepParam - 1}`);
            }
          }}
          onNext={() => {
            router.push(`/assessment/step/${stepParam + 1}`);
          }}
        />
      )}
    </div>
  );
}

export default function StepPage() {
  return (
    <QuestionnaireProvider totalQuestionCount={totalQuestions} totalStepCount={totalSteps}>
      <StepContent />
    </QuestionnaireProvider>
  );
}
