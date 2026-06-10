// 基础版问卷步骤 — 5 步简化流程
import { QuestionnaireStep } from "./types";

export const basicSteps: QuestionnaireStep[] = [
  { step: 1, title: "基础信息", description: "年龄、性别、身高、体重、体型、骨架、摸高", questionIds: ["bb01","bb02","bb03","bb04","bb05","bb06","bb07"] },
  { step: 2, title: "体测数据", description: "50米、立定跳远、坐位体前屈、引体/仰卧起坐、耐力跑", questionIds: ["bb08","bb09","bb10","bb11","bb12"] },
  { step: 3, title: "力量与爆发", description: "下肢力量、核心、左右平衡、弹跳自评、速度、爆发/耐力倾向", questionIds: ["bb13","bb14","bb15","bb16","bb17","bb18"] },
  { step: 4, title: "柔韧、经验与生活", description: "柔韧、平衡、运动习惯、弹跳经验、伤病、睡眠、饮食、压力、烟酒", questionIds: ["bb19","bb20","bb21","bb22","bb23","bb24","bb25","bb26","bb27","bb28"] },
  { step: 5, title: "时间与目标", description: "训练天数、时长、场地、目标高度、主要目标、训练强度、举重经验", questionIds: ["bb29","bb30","bb31","bb32","bb33","bb34","bb35"] },
];

export const basicTotalSteps = basicSteps.length;
export const basicTotalQuestions = basicSteps.reduce((sum, s) => sum + s.questionIds.length, 0);

export function getBasicStep(step: number): QuestionnaireStep | undefined {
  return basicSteps.find((s) => s.step === step);
}
