// 进阶版问卷步骤 — 10 步流程（约 59 题）
import { QuestionnaireStep } from "./types";

export const standardSteps: QuestionnaireStep[] = [
  { step: 1, title: "基础身体信息", description: "年龄、性别、身高、体型、训练年限、跳跃经验", questionIds: ["av01","av02","av03","av05","av06","av09"] },
  { step: 2, title: "力量素质", description: "深蹲相对力量、单腿深蹲、单腿提踵、训练频率、力量趋势、力量疼痛", questionIds: ["av11","av13","av14","av17","av18","av19"] },
  { step: 3, title: "垂直跳与爆发力", description: "站立跳高度、助跑vs站立、深度跳感受、膝胸跳、立定跳远、成绩波动", questionIds: ["av20","av21","av23","av24","av26","av29"] },
  { step: 4, title: "反应力量与增强式", description: "跳深经验、单腿跳深、30m速度、增强式恢复、跳跃疼痛、增强式频率", questionIds: ["av30","av32","av35","av36","av37","av39"] },
  { step: 5, title: "灵活性/活动度", description: "深蹲足跟、下背圆起、坐姿体前屈、髋屈肌、单腿平衡、过顶深蹲", questionIds: ["av40","av41","av42","av43","av44","av47"] },
  { step: 6, title: "臀肌功能", description: "跳跃后酸痛、深蹲后酸痛、单腿臀桥、落地膝内扣、久坐时间、激活训练", questionIds: ["av50","av51","av52","av53","av57","av58"] },
  { step: 7, title: "伤病史与安全", description: "膝盖疼痛、跟腱疼痛、下背疼痛、踝扭伤、当前疼痛", questionIds: ["av60","av61","av62","av63","av69"] },
  { step: 8, title: "训练习惯与恢复", description: "训练频率、每次时长、睡眠时长、睡眠质量、压力、减载习惯", questionIds: ["av70","av71","av73","av74","av77","av79"] },
  { step: 9, title: "心理与动机", description: "训练目标、记录习惯、坚持度、平台期应对、自我激励、预期耐心", questionIds: ["av80","av82","av83","av84","av86","av88"] },
  { step: 10, title: "跳跃技术", description: "下蹲深度、手臂摆动、落地缓冲、跑动流畅、单腿稳定、技术自评", questionIds: ["av90","av91","av93","av94","av95","av97"] },
];

export const standardTotalSteps = standardSteps.length;
export const standardTotalQuestions = standardSteps.reduce((sum, s) => sum + s.questionIds.length, 0);

export function getStandardStep(step: number): QuestionnaireStep | undefined {
  return standardSteps.find((s) => s.step === step);
}
