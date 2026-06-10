"use client";
import { useQuestionnaire } from "./questionnaire-context";

interface StepNavigatorProps {
  onNext?: () => void; onPrev?: () => void;
  isLastStep?: boolean; isSubmitting?: boolean;
  /** 从 URL 传入的当前步骤（覆盖 context 中的值） */
  urlStep?: number;
}

export function StepNavigator({ onNext, onPrev, isLastStep = false, isSubmitting = false, urlStep }: StepNavigatorProps) {
  const { totalSteps } = useQuestionnaire();
  const step = urlStep ?? 1;

  const handlePrev = () => {
    if (onPrev) onPrev();
  };

  const handleNext = () => {
    if (onNext) onNext();
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={handlePrev}
        disabled={step <= 1}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          step <= 1
            ? "bg-white/5 text-slate-600 cursor-not-allowed"
            : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
        }`}
      >
        ← 上一步
      </button>

      <span className="text-sm text-slate-400">
        {step} / {totalSteps}
      </span>

      {isLastStep ? (
        <button
          type="submit"
          onClick={onNext}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg font-semibold text-[#0a0a14] transition-all ${
            isSubmitting
              ? "bg-amber-400 cursor-wait"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/25"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              生成诊断报告中...
            </span>
          ) : (
            "提交 → 生成诊断报告"
          )}
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a14] hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
        >
          下一步 →
        </button>
      )}
    </div>
  );
}
