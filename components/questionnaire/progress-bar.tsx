"use client";
import { useQuestionnaire } from "./questionnaire-context";

interface ProgressBarProps {
  /** 从 URL 传入的当前步骤（覆盖 context 中的值，避免同步问题） */
  urlStep?: number;
}

export function ProgressBar({ urlStep }: ProgressBarProps) {
  const { answeredCount, totalQuestions, totalSteps } = useQuestionnaire();
  // URL 是步骤的唯一权威来源
  const currentStep = urlStep ?? 1;
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400">
          步骤 {currentStep} / {totalSteps}
        </span>
        <span className="text-sm text-slate-500">
          已填 {answeredCount}/{totalQuestions} 题
        </span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {["人体", "结构", "力量", "爆发", "活动度", "耐力", "经验", "生活", "目标"].map(
          (label, i) => (
            <span
              key={i}
              className={`text-xs ${
                i + 1 === currentStep
                  ? "text-amber-400 font-semibold"
                  : i + 1 < currentStep
                  ? "text-green-400"
                  : "text-slate-600"
              }`}
            >
              {label}
            </span>
          )
        )}
      </div>
    </div>
  );
}
