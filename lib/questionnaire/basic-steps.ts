// 基础版问卷步骤 — 10 步简化流程（约 32 题）
import { QuestionnaireStep } from "./types";

export const basicSteps: QuestionnaireStep[] = [
  { step: 1, title: "基础身体信息", description: "年龄段、体型、运动频率、跳跃习惯、训练经验", questionIds: ["bb01","bb02","bb03","bb04","bb05"] },
  { step: 2, title: "下肢力量", description: "腿部力量、单腿稳定性、小腿力量", questionIds: ["bb06","bb07","bb08"] },
  { step: 3, title: "跳跃能力", description: "原地跳自评、助跑跳vs原地、弹速感觉", questionIds: ["bb09","bb10","bb11"] },
  { step: 4, title: "反应与弹性", description: "连续踝跳、深度跳感受、落地缓冲", questionIds: ["bb12","bb13","bb14"] },
  { step: 5, title: "身体柔韧性", description: "体前屈、深蹲足跟、早起僵硬", questionIds: ["bb15","bb16","bb17"] },
  { step: 6, title: "臀肌与发力", description: "跳跃后酸痛、深蹲发力感、久坐时间", questionIds: ["bb18","bb19","bb20"] },
  { step: 7, title: "伤病史", description: "过去疼痛、当前不适、手术史", questionIds: ["bb21","bb22","bb23"] },
  { step: 8, title: "训练与恢复", description: "睡眠、压力、训练后疲劳", questionIds: ["bb24","bb25","bb26"] },
  { step: 9, title: "心理与动机", description: "训练动机、坚持信心、平台期应对", questionIds: ["bb27","bb28","bb29"] },
  { step: 10, title: "技术感觉", description: "姿势流畅度、手臂摆动、膝盖内扣", questionIds: ["bb30","bb31","bb32"] },
];

export const basicTotalSteps = basicSteps.length;
export const basicTotalQuestions = basicSteps.reduce((sum, s) => sum + s.questionIds.length, 0);

export function getBasicStep(step: number): QuestionnaireStep | undefined {
  return basicSteps.find((s) => s.step === step);
}
