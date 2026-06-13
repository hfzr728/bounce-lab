"use client";

// ============================================================
// 问卷题目卡片组件 — 根据题型渲染不同的输入控件
// ============================================================

import { Question } from "@/lib/questionnaire/types";
import { useQuestionnaire } from "./questionnaire-context";
import { validateAnswer } from "@/lib/questionnaire/validation";
import { useState, useCallback } from "react";

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { state, setAnswer } = useQuestionnaire();
  const currentValue = state.answers[question.id];
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((value: string | number | string[]) => {
    setAnswer(question.id, value);
    // 实时校验
    const err = validateAnswer(question, value);
    setError(err?.message ?? null);
  }, [question, setAnswer]);

  const renderInput = () => {
    switch (question.type) {
      case "number":
        return (
          <div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={question.numberRange?.min}
                max={question.numberRange?.max}
                required={question.required}
                value={currentValue ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  // 允许清空输入框（用户可能想重新输入）
                  if (raw === "") {
                    handleChange("");
                    return;
                  }
                  const num = Number(raw);
                  // 忽略非数字输入（如 "12abc" → NaN）
                  if (isNaN(num)) return;
                  handleChange(num);
                }}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className={`w-32 px-4 py-3 bg-[#0f172a] border rounded-lg focus:ring-1 focus:outline-none text-lg text-center text-slate-100 placeholder-slate-500 transition-colors ${
                  error
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
                    : "border-[#334155] focus:border-amber-500 focus:ring-amber-500/30"
                }`}
                placeholder="输入"
              />
              {question.unit && (
                <span className="text-gray-400 text-lg">{question.unit}</span>
              )}
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div>
            <div className="grid gap-2">
              {question.options?.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                    currentValue === opt.value
                      ? "border-amber-500/60 bg-amber-500/10 shadow-md"
                      : "border-[#334155] hover:border-slate-400 hover:bg-[#1a2538]"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.value}
                    checked={currentValue === opt.value}
                    onChange={() => handleChange(opt.value)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                      currentValue === opt.value
                        ? "border-amber-500 bg-amber-500"
                        : "border-slate-500"
                    }`}
                  >
                    {currentValue === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-slate-200">{opt.label}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>
        );

      case "multiSelect":
        const selectedValues: string[] = Array.isArray(currentValue)
          ? (currentValue as string[])
          : [];
        return (
          <div>
            <div className="grid gap-2">
              {question.options?.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-amber-500/60 bg-amber-500/10 shadow-md"
                        : "border-[#334155] hover:border-slate-500 hover:bg-[#1a2538]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        const newValues = isSelected
                          ? selectedValues.filter((v) => v !== opt.value)
                          : [...selectedValues, opt.value];
                        handleChange(newValues);
                      }}
                      className="hidden"
                    />
                  <div
                    className={`w-5 h-5 rounded border mr-3 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-500"
                        : "border-slate-500"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-300">{opt.label}</span>
                </label>
              );
            })}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <span>⚠️</span> {error}
            </p>
          )}
        </div>
      );

      case "slider":
        const sliderVal = Number(currentValue) || question.sliderRange?.min || 1;
        return (
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>{question.sliderLabels?.min || "低"}</span>
              <span>{question.sliderLabels?.max || "高"}</span>
            </div>
            <input
              type="range"
              min={question.sliderRange?.min || 1}
              max={question.sliderRange?.max || 10}
              step={question.sliderRange?.step || 1}
              value={sliderVal}
              onChange={(e) => setAnswer(question.id, Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-center mt-2">
              <span className="text-3xl font-bold text-amber-400">{sliderVal}</span>
            </div>
          </div>
        );

      case "text":
        return (
          <textarea
            value={(currentValue as string) || ""}
            onChange={(e) => setAnswer(question.id, e.target.value)}
            className="w-full max-w-lg px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-none text-slate-200 placeholder-slate-500"
            rows={3}
            placeholder="请输入..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 mb-4 shadow-lg shadow-black/10">
      <div className="flex items-start gap-3 mb-2">
        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${question.required ? "text-amber-400 bg-amber-500/15" : "text-slate-400 bg-slate-500/10"}`}>
          {question.required ? "必填" : "选填"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-50 mb-2">
        {question.text}
      </h3>
      {question.hint && (
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{question.hint}</p>
      )}
      <div className="mt-4">{renderInput()}</div>
    </div>
  );
}
