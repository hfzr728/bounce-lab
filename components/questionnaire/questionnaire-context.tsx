"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { AnswersMap } from "@/lib/questionnaire/types";

// ---- State ----
interface QuestionnaireState { currentStep: number; answers: AnswersMap; isSubmitting: boolean; }
const initialState: QuestionnaireState = { currentStep: 1, answers: {}, isSubmitting: false };

type Action =
  | { type: "SET_ANSWER"; questionId: string; value: string | number | string[] }
  | { type: "NEXT_STEP" } | { type: "PREV_STEP" } | { type: "GO_TO_STEP"; step: number }
  | { type: "SET_SUBMITTING"; value: boolean } | { type: "LOAD_STATE"; state: QuestionnaireState }
  | { type: "LOAD_ANSWERS"; answers: AnswersMap }
  | { type: "RESET" };

function reducer(state: QuestionnaireState, action: Action): QuestionnaireState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
      };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.step };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value };
    case "LOAD_STATE":
      return action.state;
    case "LOAD_ANSWERS":
      return { ...state, answers: action.answers };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ---- Context ----
interface QuestionnaireContextValue {
  state: QuestionnaireState;
  dispatch: React.Dispatch<Action>;
  setAnswer: (questionId: string, value: string | number | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  currentStep: number;
  totalSteps: number;
  progress: number;
  answeredCount: number;
  totalQuestions: number;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(null);

export function QuestionnaireProvider({ children, totalQuestionCount, totalStepCount }: {
  children: React.ReactNode;
  totalQuestionCount: number;
  totalStepCount: number;
}) {
  // 三版本用不同的存储 key：体测版(5步)、国际标准版(7步)、专业版(10步)
  const storageKey = totalStepCount <= 5 ? "bounce-questionnaire-basic" : totalStepCount <= 7 ? "bounce-questionnaire-standard" : "bounce-questionnaire";
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // 仅在客户端从 localStorage 恢复答案（不恢复 currentStep——URL 是步骤的唯一权威来源）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as QuestionnaireState;
        // 只恢复答案，保持当前步骤不变（由页面 URL 决定）
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          dispatch({ type: "LOAD_ANSWERS", answers: parsed.answers });
        }
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, [storageKey]);

  // 自动保存答案到 localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && hydrated) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          currentStep: state.currentStep, answers: state.answers, isSubmitting: false,
        }));
      } catch { /* ignore */ }
    }
  }, [state.answers, storageKey, hydrated]);

  const setAnswer = useCallback(
    (questionId: string, value: string | number | string[]) => {
      dispatch({ type: "SET_ANSWER", questionId, value });
    },
    []
  );

  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
    // 注意：实际最大步数由 step 页面路由控制，这里仅更新内部状态
  }, []);
  const prevStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);
  const goToStep = useCallback((step: number) => dispatch({ type: "GO_TO_STEP", step }), []);
  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    if (typeof window !== "undefined") localStorage.removeItem(storageKey);
  }, [storageKey]);

  const answeredCount = Object.keys(state.answers).length;
  const progress = Math.round((state.currentStep / totalStepCount) * 100);

  return (
    <QuestionnaireContext.Provider
      value={{
        state, dispatch, setAnswer, nextStep, prevStep, goToStep, reset,
        currentStep: state.currentStep,
        totalSteps: totalStepCount,
        progress, answeredCount, totalQuestions: totalQuestionCount,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx) {
    throw new Error("useQuestionnaire must be used within QuestionnaireProvider");
  }
  return ctx;
}
