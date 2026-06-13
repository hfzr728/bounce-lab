// ============================================================
// 基础版评估问卷 — 10 维度，约 30 题
// 无需任何测量，凭感觉或简单自评即可，5 分钟内完成
// 适合：刚入门、不了解自身数据、不想测试的用户
// ============================================================

import { Question } from "./types";

export const basicQuestions: Question[] = [
  // 维度 1：基础身体信息与运动背景 — 5题
  { id: "bb01", type: "select", text: "你的年龄段是？", options: [
    { label: "15岁及以下", value: "le15" }, { label: "16-25岁", value: "16-25" }, { label: "26-35岁", value: "26-35" }, { label: "36岁及以上", value: "ge36" },
  ], required: true, dimension: "anthropometry" },
  { id: "bb02", type: "select", text: "你觉得自己的体型属于以下哪一种？", options: [
    { label: "偏瘦（看起来很瘦）", value: "lean" }, { label: "匀称（不胖不瘦）", value: "fit" }, { label: "偏壮（肌肉感明显）", value: "muscular" }, { label: "偏胖（腹部有赘肉）", value: "overweight" },
  ], required: true, dimension: "anthropometry" },
  { id: "bb03", type: "select", text: "你平时（过去3个月）的运动频率大概是？", options: [
    { label: "很少运动（每周少于1次）", value: "rare" }, { label: "偶尔运动（每周1-2次）", value: "occasional" }, { label: "规律运动（每周3-4次）", value: "regular" }, { label: "经常运动（每周5次以上）", value: "frequent" },
  ], required: true, dimension: "anthropometry" },
  { id: "bb04", type: "select", text: "你是否经常打篮球、排球等需要频繁跳跃的运动？", options: [
    { label: "是，每周2次以上", value: "yes_often" }, { label: "偶尔，每周1次左右", value: "sometimes" }, { label: "很少或从不", value: "rarely" },
  ], required: true, dimension: "anthropometry" },
  { id: "bb05", type: "select", text: "你之前有专门为弹跳做过力量训练或跳跃训练吗？", options: [
    { label: "完全没有", value: "none" }, { label: "自己随便练过一点", value: "casual" }, { label: "有系统训练过（半年以上）", value: "trained" },
  ], required: true, dimension: "anthropometry" },

  // 维度 2：下肢力量 — 3题
  { id: "bb06", type: "select", text: "你感觉自己的腿部力量如何？", options: [
    { label: "较弱（跑楼梯、下蹲容易腿酸）", value: "weak" }, { label: "一般（和普通人差不多）", value: "average" }, { label: "较强（腿部肌肉明显）", value: "strong" }, { label: "很强（深蹲能轻松扛起一个成人）", value: "very_strong" },
  ], required: true, dimension: "maxStrength" },
  { id: "bb07", type: "select", text: "你能不扶墙单腿站立并下蹲一点点吗？", options: [
    { label: "完全做不到，会倒", value: "cannot" }, { label: "勉强能做到，但很晃", value: "unstable" }, { label: "可以做到，比较稳定", value: "stable" },
  ], required: true, dimension: "maxStrength" },
  { id: "bb08", type: "select", text: "你的小腿（脚踝）力量感觉如何？", options: [
    { label: "较弱（垫脚尖几次就累了）", value: "weak" }, { label: "一般", value: "average" }, { label: "较强（可以连续垫脚尖很多次）", value: "strong" },
  ], required: true, dimension: "maxStrength" },

  // 维度 3：跳跃能力 — 3题
  { id: "bb09", type: "select", text: "你觉得自己的原地起跳高度在朋友中属于？", options: [
    { label: "很差（比别人低很多）", value: "very_low" }, { label: "一般（和大部分人差不多）", value: "average" }, { label: "较好（比别人高一些）", value: "good" }, { label: "很好（明显比别人高）", value: "excellent" },
  ], required: true, dimension: "powerSpeed" },
  { id: "bb10", type: "select", text: "你跑起来跳（助跑起跳）比原地跳明显更高吗？", options: [
    { label: "明显更高（感觉多跳了10cm以上）", value: "much_higher" }, { label: "差不多", value: "similar" }, { label: "反而更低或没区别", value: "lower" },
  ], required: true, dimension: "powerSpeed" },
  { id: "bb11", type: "select", text: "你感觉自己的弹速（起跳快不快）如何？", options: [
    { label: "很慢（需要蓄力很久）", value: "slow" }, { label: "一般", value: "average" }, { label: "很快（像弹簧一样）", value: "fast" },
  ], required: true, dimension: "powerSpeed" },

  // 维度 4：反应与弹性 — 3题
  { id: "bb12", type: "select", text: "你能连续原地小跳（膝盖不弯曲，只用脚踝）多少次不觉得累？", options: [
    { label: "<10次", value: "lt10" }, { label: "10-20次", value: "10-20" }, { label: ">20次", value: "gt20" },
  ], required: true, dimension: "powerSpeed" },
  { id: "bb13", type: "select", text: "你尝试过从矮台阶跳下然后立刻向上跳吗？感觉如何？", options: [
    { label: "没试过", value: "never" }, { label: "试过，跳起来比原地矮", value: "lower" }, { label: "试过，感觉和原地跳差不多或更高", value: "equal" },
  ], required: false, dimension: "powerSpeed" },
  { id: "bb14", type: "select", text: "你觉得自己落地时膝盖缓冲好不好？", options: [
    { label: "落地声音很大，像砸地", value: "loud" }, { label: "一般", value: "average" }, { label: "落地很轻，像猫", value: "soft" },
  ], required: true, dimension: "powerSpeed" },

  // 维度 5：身体柔韧性 — 3题
  { id: "bb15", type: "select", text: "站直双腿伸直弯腰用手指摸脚趾，你能摸到哪？", options: [
    { label: "摸不到小腿一半", value: "poor" }, { label: "能摸到小腿下半段", value: "average" }, { label: "能摸到脚背或地面", value: "good" },
  ], required: true, dimension: "mobility" },
  { id: "bb16", type: "select", text: "做徒手深蹲（蹲到底）时，脚后跟会不自觉地抬起来吗？", options: [
    { label: "会，必须抬起来才能蹲下去", value: "always" }, { label: "偶尔会", value: "sometimes" }, { label: "不会，全脚掌贴地", value: "never" },
  ], required: true, dimension: "mobility" },
  { id: "bb17", type: "select", text: "早上起床时，你会觉得身体僵硬吗？", options: [
    { label: "很僵硬，需要活动很久", value: "very_stiff" }, { label: "有一点", value: "slightly" }, { label: "不僵硬", value: "not_stiff" },
  ], required: true, dimension: "mobility" },

  // 维度 6：臀肌与发力感觉 — 3题
  { id: "bb18", type: "select", text: "跳完几次最大高度后，你感觉哪里最酸？", options: [
    { label: "大腿前侧（股四头肌）", value: "quad" }, { label: "大腿后侧", value: "hamstring" }, { label: "臀部", value: "glute" }, { label: "小腿", value: "calf" }, { label: "没什么感觉", value: "none" },
  ], required: true, dimension: "glute" },
  { id: "bb19", type: "select", text: "做深蹲或从椅子上站起来时，主要感觉哪里在发力？", options: [
    { label: "大腿前侧", value: "quad" }, { label: "大腿后侧", value: "hamstring" }, { label: "臀部", value: "glute" }, { label: "腰", value: "lowback" },
  ], required: true, dimension: "glute" },
  { id: "bb20", type: "select", text: "你平时坐着的时间长吗？", options: [
    { label: "很长（每天超过8小时）", value: "gt8" }, { label: "一般（6-8小时）", value: "6-8" }, { label: "较短（<6小时）", value: "lt6" },
  ], required: true, dimension: "glute" },

  // 维度 7：伤病史 — 3题
  { id: "bb21", type: "multiSelect", text: "过去1年内是否有过膝盖/脚踝/腰的明显疼痛？", options: [
    { label: "无", value: "none" }, { label: "膝盖", value: "knee" }, { label: "脚踝", value: "ankle" }, { label: "腰", value: "lowback" }, { label: "多处有", value: "multiple" },
  ], required: true, dimension: "injury" },
  { id: "bb22", type: "select", text: "你现在是否有任何部位不舒服，让你不敢全力跳？", options: [
    { label: "无", value: "none" }, { label: "有", value: "yes" },
  ], required: true, dimension: "injury" },
  { id: "bb23", type: "select", text: "你是否做过下肢或腰部手术？", options: [
    { label: "无", value: "none" }, { label: "有（1年内）", value: "recent" }, { label: "有（1年以上）", value: "old" },
  ], required: true, dimension: "injury" },

  // 维度 8：训练习惯与恢复 — 3题
  { id: "bb24", type: "select", text: "你平均每晚睡多久？", options: [
    { label: "<6小时", value: "lt6" }, { label: "6-7小时", value: "6-7" }, { label: "7-9小时", value: "7-9" }, { label: ">9小时", value: "gt9" },
  ], required: true, dimension: "recovery" },
  { id: "bb25", type: "select", text: "你平时压力（学习/工作）大吗？", options: [
    { label: "很大", value: "high" }, { label: "中等", value: "medium" }, { label: "较小", value: "low" },
  ], required: true, dimension: "recovery" },
  { id: "bb26", type: "select", text: "你每次训练后感觉累不累？", options: [
    { label: "非常累，一整天没精神", value: "exhausted" }, { label: "有点累，但休息一下就好", value: "tired" }, { label: "反而更有精神", value: "energized" },
  ], required: true, dimension: "recovery" },

  // 维度 9：心理与动机 — 3题
  { id: "bb27", type: "select", text: "你为什么想提高弹跳？", options: [
    { label: "为了打篮球扣篮", value: "dunk" }, { label: "为了排球拦网/扣杀", value: "volleyball" }, { label: "为了变强", value: "stronger" }, { label: "为了好看/好玩", value: "fun" },
  ], required: true, dimension: "psychology" },
  { id: "bb28", type: "select", text: "你觉得自己能坚持12周训练吗？", options: [
    { label: "肯定能", value: "yes" }, { label: "大概能", value: "maybe" }, { label: "不确定", value: "unsure" },
  ], required: true, dimension: "psychology" },
  { id: "bb29", type: "select", text: "遇到进步慢的时候，你通常会？", options: [
    { label: "更努力", value: "push_harder" }, { label: "想放弃", value: "quit" }, { label: "找原因", value: "analyze" },
  ], required: true, dimension: "psychology" },

  // 维度 10：技术感觉 — 3题
  { id: "bb30", type: "select", text: "你觉得自己的跳跃姿势流畅吗？", options: [
    { label: "很流畅", value: "smooth" }, { label: "一般", value: "average" }, { label: "很别扭", value: "awkward" },
  ], required: true, dimension: "technique" },
  { id: "bb31", type: "select", text: "你起跳时手臂会用力向上摆吗？", options: [
    { label: "会，很有力", value: "strong" }, { label: "会，但没力", value: "weak" }, { label: "几乎不摆", value: "none" },
  ], required: true, dimension: "technique" },
  { id: "bb32", type: "select", text: "你落地时膝盖会向内扣吗？", options: [
    { label: "会", value: "yes" }, { label: "偶尔", value: "sometimes" }, { label: "不会", value: "no" },
  ], required: true, dimension: "technique" },
];

export function getBasicQuestionById(id: string): Question | undefined {
  return basicQuestions.find((q) => q.id === id);
}
