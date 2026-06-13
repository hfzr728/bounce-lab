// ============================================================
// 评估维度定义 — 基于运动科学的评分基准
// 参考：NSCA, Bosco Test, Force-Velocity Profile, FMS, YBT
// ============================================================

import { DimensionKey } from "@/lib/questionnaire/types";

export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  anthropometry: 0.05, proportion: 0.03, maxStrength: 0.18,
  powerSpeed: 0.22, mobility: 0.08, endurance: 0.04,
  glute: 0.10, injury: 0.08,
  recovery: 0.07, psychology: 0.05, technique: 0.05,
  trainingHx: 0.03, lifestyle: 0.02, availability: 0.00,
};

export const DIMENSION_DESCRIPTIONS: Record<DimensionKey, string> = {
  anthropometry: "人体测量学——身高、体重、体脂率等基础指标，决定弹跳训练起点",
  proportion: "身体比例与肌骨结构——先天结构因素，影响弹跳的力学优势与限制",
  maxStrength: "最大力量——弹跳的根基。相对力量决定地面反作用力产出",
  powerSpeed: "爆发力与速度——弹跳核心。RFD、SSC效率、力-速曲线决定跳跃上限",
  mobility: "柔韧与活动度——关节活动范围决定动作质量。受限活动度=受限跳跃力学",
  endurance: "能量系统——有氧基础和无氧耐力决定训练容量和恢复速度",
  glute: "臀肌功能——臀肌是跳跃的核心引擎。臀肌抑制或无力将严重限制弹跳上限",
  injury: "伤病历史与风险管理——安全是一切训练的前提。伤病历史决定训练负荷边界",
  recovery: "恢复与生活习惯——睡眠、营养、压力管理决定训练效果转化率",
  psychology: "心理素质——动机、目标设定、挫折耐受力决定长期坚持能力",
  technique: "技术评估——跳跃技术质量直接影响力量转化效率和受伤风险",
  trainingHx: "训练经验（旧）",
  lifestyle: "生活方式（旧）",
  availability: "训练资源（旧）",
};

export const CMJ_NORMS_MALE = [
  { min: 0, max: 25, score: 10 }, { min: 25, max: 35, score: 25 },
  { min: 35, max: 45, score: 40 }, { min: 45, max: 55, score: 55 },
  { min: 55, max: 65, score: 70 }, { min: 65, max: 75, score: 85 },
  { min: 75, max: 999, score: 100 },
];

export const CMJ_NORMS_FEMALE = [
  { min: 0, max: 18, score: 10 }, { min: 18, max: 25, score: 25 },
  { min: 25, max: 32, score: 40 }, { min: 32, max: 40, score: 55 },
  { min: 40, max: 48, score: 70 }, { min: 48, max: 55, score: 85 },
  { min: 55, max: 999, score: 100 },
];

export const RELATIVE_SQUAT_NORMS = [
  { min: 0, max: 0.5, score: 10 }, { min: 0.5, max: 1.0, score: 25 },
  { min: 1.0, max: 1.25, score: 40 }, { min: 1.25, max: 1.5, score: 55 },
  { min: 1.5, max: 1.75, score: 70 }, { min: 1.75, max: 2.0, score: 85 },
  { min: 2.0, max: 99, score: 100 },
];

export const BODYFAT_NORMS_MALE = [
  { min: 6, max: 10, score: 100 }, { min: 10, max: 14, score: 85 },
  { min: 14, max: 18, score: 70 }, { min: 18, max: 22, score: 50 },
  { min: 22, max: 28, score: 35 }, { min: 28, max: 99, score: 20 },
];

export const BODYFAT_NORMS_FEMALE = [
  { min: 14, max: 18, score: 100 }, { min: 18, max: 22, score: 85 },
  { min: 22, max: 26, score: 70 }, { min: 26, max: 30, score: 50 },
  { min: 30, max: 35, score: 35 }, { min: 35, max: 99, score: 20 },
];
