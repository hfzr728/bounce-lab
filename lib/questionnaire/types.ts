// ============================================================
// 问卷系统 — 全部 TypeScript 类型定义
// ============================================================

/** 单道题目 */
export interface Question {
  id: string;
  /** 题型 */
  type: "number" | "select" | "multiSelect" | "slider" | "text";
  /** 题目文本 */
  text: string;
  /** 辅助说明 */
  hint?: string;
  /** 单位（如 cm, kg） */
  unit?: string;
  /** 选项（select / multiSelect） */
  options?: { label: string; value: string; score?: number }[];
  /** 滑块范围 */
  sliderRange?: { min: number; max: number; step: number };
  /** 滑块标签 */
  sliderLabels?: { min: string; max: string };
  /** 数字输入范围 */
  numberRange?: { min: number; max: number };
  /** 必填 */
  required: boolean;
  /** 所属维度 */
  dimension: DimensionKey;
}

/** 评估维度键 */
export type DimensionKey =
  | "anthropometry"
  | "proportion"
  | "maxStrength"
  | "powerSpeed"
  | "mobility"
  | "endurance"
  | "trainingHx"
  | "lifestyle"
  | "availability";

/** 维度中文名映射 */
export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  anthropometry: "人体测量学",
  proportion: "身体比例与结构",
  maxStrength: "最大力量",
  powerSpeed: "爆发力与速度",
  mobility: "柔韧与活动度",
  endurance: "能量系统",
  trainingHx: "训练经验与伤病",
  lifestyle: "恢复与生活方式",
  availability: "训练资源与目标",
};

/** 问卷回答 */
export type AnswerValue = string | number | string[];

/** 全部回答的映射 */
export type AnswersMap = Record<string, AnswerValue>;

/** 单个维度的得分结果 */
export interface DimensionScore {
  key: DimensionKey;
  label: string;
  score: number;    // 0-100
  maxScore: number;  // 100
  weight: number;    // 在总分中的权重
}

/** 全部诊断结果 */
export interface DiagnosisResult {
  dimensionScores: DimensionScore[];
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  injuryRisk: {
    level: "低" | "中" | "高";
    score: number; // 0-100
    factors: string[];
  };
  aiAnalysis: string;
}

/** 训练日安排 */
export interface TrainingDay {
  day: string;
  focus: string;
  exercises: TrainingExercise[];
  notes: string;
}

/** 单个训练动作 */
export interface TrainingExercise {
  name: string;
  sets: number;
  reps: string;
  intensity: string;
  rest: string;
  note?: string;
}

/** 训练计划 */
export interface TrainingPlan {
  phase: string;
  phaseDescription: string;
  duration: string;
  weeklySchedule: TrainingDay[];
  tips: string[];
  aiGenerated: string;
}

/** 问卷步骤定义 */
export interface QuestionnaireStep {
  step: number;
  title: string;
  description: string;
  questionIds: string[];
}
