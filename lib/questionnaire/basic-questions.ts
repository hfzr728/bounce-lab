// ============================================================
// 基础版评估问卷 — 约 30 题，用大学体测数据 + 简单自评代替专业测试
// 适合：普通运动爱好者，无专业测试设备
// ============================================================

import { Question } from "./types";

export const basicQuestions: Question[] = [
  // 基础信息
  { id: "bb01", type: "number", text: "您的年龄？", unit: "岁", numberRange: { min: 12, max: 60 }, required: true, dimension: "anthropometry" },
  { id: "bb02", type: "select", text: "您的性别？", options: [{ label: "男", value: "male" }, { label: "女", value: "female" }], required: true, dimension: "anthropometry" },
  { id: "bb03", type: "number", text: "您的身高？", unit: "cm", numberRange: { min: 140, max: 230 }, required: true, dimension: "anthropometry" },
  { id: "bb04", type: "number", text: "您的体重？", unit: "kg", numberRange: { min: 35, max: 180 }, required: true, dimension: "anthropometry" },
  { id: "bb05", type: "slider", text: "您的体型自评？", hint: "1=非常瘦，5=适中，10=偏胖", sliderRange: { min: 1, max: 10, step: 1 }, sliderLabels: { min: "非常瘦", max: "偏胖" }, required: true, dimension: "anthropometry" },
  { id: "bb06", type: "select", text: "您的骨架粗细（目测即可）？", options: [{ label: "偏细", value: "small" }, { label: "中等", value: "medium" }, { label: "偏粗", value: "large" }], required: true, dimension: "anthropometry" },
  { id: "bb07", type: "number", text: "您的站立摸高（大概即可）？", hint: "站直单手尽量向上伸", unit: "cm", numberRange: { min: 180, max: 310 }, required: false, dimension: "anthropometry" },

  // 大学体测数据
  { id: "bb08", type: "number", text: "您的 50 米跑成绩（大约即可）？", unit: "秒", numberRange: { min: 5.0, max: 12.0 }, required: false, dimension: "powerSpeed" },
  { id: "bb09", type: "number", text: "您的立定跳远成绩？", unit: "cm", numberRange: { min: 120, max: 350 }, required: false, dimension: "powerSpeed" },
  { id: "bb10", type: "number", text: "您的坐位体前屈成绩？", hint: "指尖超过脚尖为正", unit: "cm", numberRange: { min: -30, max: 40 }, required: false, dimension: "mobility" },
  { id: "bb11", type: "select", text: "您的引体向上数量（男）/ 仰卧起坐（女）？", options: [{ label: "0-3 个", value: "low" }, { label: "4-8 个", value: "mid" }, { label: "9-15 个", value: "good" }, { label: "15 个以上", value: "high" }, { label: "没测过", value: "unknown" }], required: false, dimension: "maxStrength" },
  { id: "bb12", type: "select", text: "您的 1000m（男）/ 800m（女）跑成绩？", options: [{ label: "3分30以内（优秀）", value: "excellent" }, { label: "3分30-4分30（良好）", value: "good" }, { label: "4分30-5分30（及格）", value: "average" }, { label: "5分30以上（需加强）", value: "poor" }, { label: "没测过", value: "unknown" }], required: false, dimension: "endurance" },

  // 力量自评
  { id: "bb13", type: "select", text: "您的下肢力量水平？", options: [{ label: "很强（能轻松做单腿蹲）", value: "strong" }, { label: "还行（能做标准深蹲多组）", value: "good" }, { label: "一般（深蹲有点吃力）", value: "average" }, { label: "较弱", value: "weak" }], required: true, dimension: "maxStrength" },
  { id: "bb14", type: "select", text: "您的核心力量？", options: [{ label: "很好（平板支撑 >90s）", value: "strong" }, { label: "还行（30-90s）", value: "good" }, { label: "一般（<30s）", value: "average" }, { label: "较弱", value: "weak" }], required: true, dimension: "maxStrength" },
  { id: "bb15", type: "select", text: "您的左右腿力量差异？", options: [{ label: "基本一样", value: "balanced" }, { label: "一边略弱", value: "slight" }, { label: "差异明显", value: "moderate" }, { label: "不清楚", value: "unknown" }], required: true, dimension: "maxStrength" },

  // 爆发力自评
  { id: "bb16", type: "select", text: "您的弹跳水平自评？", options: [{ label: "很好（轻松抓框/摸板）", value: "excellent" }, { label: "还行（能摸到篮板）", value: "good" }, { label: "一般（跳得比普通人高点）", value: "average" }, { label: "较差", value: "poor" }], required: true, dimension: "powerSpeed" },
  { id: "bb17", type: "select", text: "您的短跑速度？", options: [{ label: "很快", value: "fast" }, { label: "还行", value: "good" }, { label: "一般", value: "average" }, { label: "偏慢", value: "slow" }], required: true, dimension: "powerSpeed" },
  { id: "bb18", type: "select", text: "您觉得自己爆发力好还是耐力好？", options: [{ label: "爆发力好（跳得高跑得快但不持久）", value: "power" }, { label: "耐力好（持久但不太能跳）", value: "endurance" }, { label: "都还行", value: "balanced" }, { label: "都不太行", value: "neither" }], required: true, dimension: "powerSpeed" },

  // 柔韧平衡
  { id: "bb19", type: "select", text: "您的柔韧性？", options: [{ label: "很好（弯腰能摸到地）", value: "excellent" }, { label: "还行（能摸到脚踝）", value: "good" }, { label: "一般（勉强摸到小腿）", value: "average" }, { label: "很硬（弯腰困难）", value: "poor" }], required: true, dimension: "mobility" },
  { id: "bb20", type: "select", text: "您的平衡感？", options: [{ label: "很好（闭眼单腿站 >30s）", value: "excellent" }, { label: "还行（10-30s）", value: "good" }, { label: "一般（<10s）", value: "average" }, { label: "较差", value: "poor" }], required: true, dimension: "mobility" },

  // 训练经验与伤病
  { id: "bb21", type: "select", text: "您有运动训练经验吗？", options: [{ label: "经常运动（每周3次以上）", value: "frequent" }, { label: "偶尔运动", value: "occasional" }, { label: "很少运动", value: "rare" }, { label: "几乎不运动", value: "never" }], required: true, dimension: "trainingHx" },
  { id: "bb22", type: "select", text: "您以前专门练过弹跳吗？", options: [{ label: "系统练过", value: "yes_sys" }, { label: "随便练过一些", value: "yes_casual" }, { label: "没练过", value: "no" }], required: true, dimension: "trainingHx" },
  { id: "bb23", type: "multiSelect", text: "您有过哪些伤病？（可多选）", options: [{ label: "膝盖伤", value: "knee" }, { label: "踝关节伤", value: "ankle" }, { label: "腰背伤", value: "back" }, { label: "以上均无", value: "none" }], required: true, dimension: "trainingHx" },
  { id: "bb24", type: "select", text: "最近一次伤病是什么时候？", options: [{ label: "目前有伤", value: "current" }, { label: "半年内", value: "6m" }, { label: "半年到一年前", value: "1y" }, { label: "一年以上", value: "old" }, { label: "没有受过伤", value: "never" }], required: true, dimension: "trainingHx" },

  // 生活方式
  { id: "bb25", type: "select", text: "您每天睡多久？", options: [{ label: "8小时以上", value: "8+" }, { label: "7-8小时", value: "7-8" }, { label: "6-7小时", value: "6-7" }, { label: "不到6小时", value: "<6" }], required: true, dimension: "lifestyle" },
  { id: "bb26", type: "select", text: "您的饮食质量？", options: [{ label: "很注意营养搭配", value: "good" }, { label: "一般般", value: "average" }, { label: "不太注意", value: "poor" }], required: true, dimension: "lifestyle" },
  { id: "bb27", type: "slider", text: "您的生活压力大吗？", sliderRange: { min: 1, max: 10, step: 1 }, sliderLabels: { min: "没压力", max: "压力很大" }, required: true, dimension: "lifestyle" },
  { id: "bb28", type: "select", text: "您抽烟喝酒吗？", options: [{ label: "都不沾", value: "none" }, { label: "偶尔应酬", value: "occasional" }, { label: "比较频繁", value: "frequent" }], required: true, dimension: "lifestyle" },

  // 时间与目标
  { id: "bb29", type: "select", text: "您每周能训练几天？", options: [{ label: "4-5天", value: "4-5" }, { label: "3天", value: "3" }, { label: "2天", value: "2" }, { label: "1天", value: "1" }], required: true, dimension: "availability" },
  { id: "bb30", type: "select", text: "您每次能练多久？", options: [{ label: "1.5小时以上", value: "90+" }, { label: "1-1.5小时", value: "60-90" }, { label: "45-60分钟", value: "45-60" }, { label: "不到45分钟", value: "<45" }], required: true, dimension: "availability" },
  { id: "bb31", type: "select", text: "您的训练场地？", options: [{ label: "健身房", value: "gym" }, { label: "家里（有基础器械）", value: "home" }, { label: "户外/无器械", value: "none" }], required: true, dimension: "availability" },
  { id: "bb32", type: "number", text: "您希望跳多高？（大概目标）", hint: "量力而行，设定一个努力够得着的目标", unit: "cm", numberRange: { min: 30, max: 100 }, required: true, dimension: "availability" },
  { id: "bb33", type: "select", text: "您的主要目标？", options: [{ label: "就是想跳得更高", value: "max_jump" }, { label: "提升运动表现", value: "performance" }, { label: "变强壮+跳得高", value: "power" }, { label: "健康为主+顺便练弹跳", value: "health" }], required: true, dimension: "availability" },
  { id: "bb34", type: "select", text: "您能接受的训练强度？", options: [{ label: "越大越好", value: "max" }, { label: "比较努力", value: "high" }, { label: "适中就行", value: "moderate" }], required: true, dimension: "availability" },
  { id: "bb35", type: "select", text: "您是否熟悉举重类动作（高翻、抓举、挺举等）？", hint: "不熟悉的话AI会推荐效果相近的替代动作，不用勉强", options: [{ label: "非常熟悉，能标准完成", value: "proficient" }, { label: "略懂，动作还不够标准", value: "novice" }, { label: "完全不会/没接触过", value: "never" }], required: true, dimension: "trainingHx" },
];

export function getBasicQuestionById(id: string): Question | undefined {
  return basicQuestions.find((q) => q.id === id);
}
