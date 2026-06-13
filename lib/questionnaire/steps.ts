// ============================================================
// 问卷步骤划分 — 10 步流程（10 维度专业评估）
// ============================================================

import { QuestionnaireStep } from "./types";

export const questionnaireSteps: QuestionnaireStep[] = [
  {
    step: 1,
    title: "基础身体信息与运动背景",
    description: "年龄、性别、身高、体重、体脂率、训练年限、主要运动、运动时长、跳跃经验、垂直跳高度",
    questionIds: ["b01", "b02", "b03", "b04", "b05", "b06", "b07", "b08", "b09", "b10"],
  },
  {
    step: 2,
    title: "力量素质",
    description: "深蹲1RM、深蹲形式、提踵、分腿蹲、单腿深蹲、RDL、俯卧伸髋、训练频率、深蹲趋势、力量疼痛",
    questionIds: ["s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09", "s10"],
  },
  {
    step: 3,
    title: "垂直跳表现与爆发力",
    description: "站立垂直跳、跑动双腿跳、单腿跳、深度跳、触地时间、膝胸跳、踝跳、立定跳远、30m冲刺、测试一致性、增强式恢复",
    questionIds: ["sp01", "sp02", "sp03", "sp04", "sp05", "sp06", "sp07", "sp08", "sp09", "sp10", "sp11"],
  },
  {
    step: 4,
    title: "灵活性/活动度",
    description: "踝背屈、足跟抬起、下背圆起、体前屈、托马斯测试、过顶深蹲、髋旋转、单腿平衡、僵硬感、拉伸频率",
    questionIds: ["m01", "m02", "m03", "m04", "m05", "m06", "m07", "m08", "m09", "m10"],
  },
  {
    step: 5,
    title: "反应力量与增强式",
    description: "跳深熟悉度、单腿跳深、跨栏跳深、侧向连续跳、三级跳远、增强式恢复、增强式疼痛、训练地面、训练频率、触地次数",
    questionIds: ["r01", "r02", "r03", "r04", "r05", "r06", "r07", "r08", "r09", "r10"],
  },
  {
    step: 6,
    title: "臀肌功能评估",
    description: "臀肌激活感知、臀推力量、单腿臀桥、臀中肌、俯卧伸髋、髋铰链、臀肌酸痛、臀肌训练频率、骨盆稳定、代偿问题",
    questionIds: ["g01", "g02", "g03", "g04", "g05", "g06", "g07", "g08", "g09", "g10"],
  },
  {
    step: 7,
    title: "伤病历史与风险管理",
    description: "过往伤病、最近受伤时间、当前疼痛、复发情况、医疗许可、预防知识、训练调整、视频分析、近期急性损伤、回归标准",
    questionIds: ["i01", "i02", "i03", "i04", "i05", "i06", "i07", "i08", "i09", "i10"],
  },
  {
    step: 8,
    title: "恢复与生活习惯",
    description: "睡眠时长、睡眠质量、营养质量、饮水量、饮酒频率、压力水平、恢复手段、久坐时间、主动恢复、运动补剂",
    questionIds: ["h01", "h02", "h03", "h04", "h05", "h06", "h07", "h08", "h09", "h10"],
  },
  {
    step: 9,
    title: "心理素质与训练投入",
    description: "训练动机、挫折应对、目标设定、训练一致性、心理意象、反馈接受度、受伤恐惧、环境支持",
    questionIds: ["ps01", "ps02", "ps03", "ps04", "ps05", "ps06", "ps07", "ps08"],
  },
  {
    step: 10,
    title: "跳跃技术评估",
    description: "技术自评、摆臂协调、反向动作质量、落地力学、起跳脚偏好、助跑一致性、视频分析习惯、技术纠正能力",
    questionIds: ["t01", "t02", "t03", "t04", "t05", "t06", "t07", "t08"],
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
