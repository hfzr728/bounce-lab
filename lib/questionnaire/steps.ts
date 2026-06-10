// ============================================================
// 问卷步骤划分 — 9 步流程（匹配 85 题专业评估）
// ============================================================

import { QuestionnaireStep } from "./types";

export const questionnaireSteps: QuestionnaireStep[] = [
  {
    step: 1,
    title: "人体测量学基础",
    description: "年龄、性别、身高、体重、体脂率、骨密度、骨架类型、站立摸高",
    questionIds: ["b01", "b02", "b03", "b04", "b05", "b06", "b07", "b08"],
  },
  {
    step: 2,
    title: "身体比例与肌骨结构",
    description: "下肢长度、上下身比、跟腱长度、足弓类型、协调性、体态问题、足踝刚性",
    questionIds: ["p01", "p02", "p03", "p04", "p05", "p06", "p07"],
  },
  {
    step: 3,
    title: "最大力量水平",
    description: "深蹲、硬拉、前蹲、高翻、分腿蹲、相对力量、核心抗旋、左右对称、臀肌激活、离心控制、足部肌力",
    questionIds: ["s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09", "s10", "s11", "s12"],
  },
  {
    step: 4,
    title: "爆发力与速度",
    description: "CMJ、SJ、助跑摸高、立定跳远、30m冲刺、RFD、SSC效率、连续跳跃、力速曲线",
    questionIds: ["sp01", "sp02", "sp03", "sp04", "sp05", "sp06", "sp07", "sp08", "sp09"],
  },
  {
    step: 5,
    title: "柔韧性与活动度",
    description: "坐位体前屈、踝背屈、髋屈曲、胸椎旋转、腘绳肌、单腿平衡、FMS深蹲、YBT",
    questionIds: ["m01", "m02", "m03", "m04", "m05", "m06", "m07", "m08"],
  },
  {
    step: 6,
    title: "能量系统与耐力",
    description: "有氧基础、无氧乳酸耐力、高强度输出时长、DOMS、有氧频率、静息心率",
    questionIds: ["e01", "e02", "e03", "e04", "e05", "e06"],
  },
  {
    step: 7,
    title: "训练经验与专项背景",
    description: "训练年限、弹跳专项经验、训练频率、运动背景、伤病史、热身习惯、恢复习惯、测试经验、训练日志",
    questionIds: ["ex01", "ex02", "ex03", "ex04", "ex05", "ex06", "ex07", "ex08", "ex09", "ex10"],
  },
  {
    step: 8,
    title: "恢复与生活方式",
    description: "睡眠时长与质量、营养、压力、烟酒、恢复手段、久坐时间、主动恢复、运动补剂",
    questionIds: ["l01", "l02", "l03", "l04", "l05", "l06", "l07", "l08", "l09", "l10"],
  },
  {
    step: 9,
    title: "训练资源与目标",
    description: "训练天数、每次时长、场地设备、目标高度、首要目标、期望周期、教练、RPE、举重经验",
    questionIds: ["a01", "a02", "a03", "a04", "a05", "a06", "a07", "a08", "a09"],
  },
];

export const totalSteps = questionnaireSteps.length;
export const totalQuestions = questionnaireSteps.reduce(
  (sum, step) => sum + step.questionIds.length,
  0
);

export function getStep(step: number): QuestionnaireStep | undefined {
  return questionnaireSteps.find((s) => s.step === step);
}
