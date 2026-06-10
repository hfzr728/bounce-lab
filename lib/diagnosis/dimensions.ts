// ============================================================
// 评估维度定义 — 基于运动科学的评分基准
// 参考：NSCA, Bosco Test, Force-Velocity Profile, FMS, YBT
// ============================================================

import { DimensionKey } from "@/lib/questionnaire/types";

export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  anthropometry: 0.05, proportion: 0.05, maxStrength: 0.20,
  powerSpeed: 0.25, mobility: 0.12, endurance: 0.08,
  trainingHx: 0.08, lifestyle: 0.12, availability: 0.05,
};

export const DIMENSION_DESCRIPTIONS: Record<DimensionKey, string> = {
  anthropometry: "人体测量学——身高、体重、体脂率等基础指标，决定弹跳训练起点",
  proportion: "身体比例与肌骨结构——先天结构因素，影响弹跳的力学优势与限制",
  maxStrength: "最大力量——弹跳的根基。相对力量决定地面反作用力产出",
  powerSpeed: "爆发力与速度——弹跳核心。RFD、SSC效率、力-速曲线决定跳跃上限",
  mobility: "柔韧与活动度——关节活动范围决定动作质量。受限活动度=受限跳跃力学",
  endurance: "能量系统——有氧基础和无氧耐力决定训练容量和恢复速度",
  trainingHx: "训练经验与伤病——反映适应性和安全边界",
  lifestyle: "恢复与生活方式——睡眠、营养、压力管理决定训练效果转化率",
  availability: "训练资源与目标——时间、设备和意愿决定计划可行性",
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
