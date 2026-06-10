// 国际标准版问卷步骤 — 7 步流程（约 53 题）
import { QuestionnaireStep } from "./types";

export const standardSteps: QuestionnaireStep[] = [
  { step: 1, title: "人体测量", description: "年龄、性别、身高、体重、体脂率、摸高、骨架类型", questionIds: ["st01","st02","st03","st04","st05","st06","st07"] },
  { step: 2, title: "身体比例与结构", description: "上下身比例、足弓、协调性、体态问题", questionIds: ["st08","st09","st10","st11"] },
  { step: 3, title: "力量水平评估", description: "深蹲/硬拉相对力量、分腿蹲、核心抗旋、左右对称、臀肌激活", questionIds: ["st12","st13","st14","st15","st16","st17"] },
  { step: 4, title: "爆发力与速度", description: "CMJ（用手机App）、助跑摸高、立定跳远、30m冲刺、RFD、力-速特征、训练比例", questionIds: ["st18","st19","st20","st21","st22","st23","st24"] },
  { step: 5, title: "FMS 功能性运动筛查", description: "7项FMS基础动作测试（深蹲/跨栏步/直线弓步/肩部/ASLR/俯卧撑/旋转稳定性）+ 坐位体前屈 + 踝背屈", questionIds: ["st25","st26","st27","st28","st29","st30","st31","st32","st33"] },
  { step: 6, title: "平衡、耐力与训练背景", description: "单腿稳定、落地质量、有氧基础、恢复速度、静息心率、训练经验、弹跳专项、伤病史、热身习惯", questionIds: ["st34","st35","st36","st37","st38","st39","st40","st41","st42","st43"] },
  { step: 7, title: "恢复、生活方式与目标", description: "睡眠时长/质量、营养、压力、恢复习惯、训练天数/时长、设备、目标、运动项目、举重经验", questionIds: ["st44","st45","st46","st47","st48","st49","st50","st51","st52","st53","st54"] },
];

export const standardTotalSteps = standardSteps.length;
export const standardTotalQuestions = standardSteps.reduce((sum, s) => sum + s.questionIds.length, 0);

export function getStandardStep(step: number): QuestionnaireStep | undefined {
  return standardSteps.find((s) => s.step === step);
}
