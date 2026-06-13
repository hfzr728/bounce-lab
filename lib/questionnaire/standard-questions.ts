// ============================================================
// 进阶版评估问卷 — 10 维度，约 59 题
// 无需专业设备，简单测量即可，8-10 分钟完成
// 适合：有训练基础、想获得专业级诊断的运动者
// ============================================================

import { Question } from "./types";

export const standardQuestions: Question[] = [
  // 维度 1：基础身体信息与运动背景 — 6题
  { id: "av01", type: "number", text: "你的年龄是多少岁？", unit: "岁", numberRange: { min: 12, max: 70 }, required: true, dimension: "anthropometry" },
  { id: "av02", type: "select", text: "你的性别是？", options: [{ label: "男", value: "male" }, { label: "女", value: "female" }], required: true, dimension: "anthropometry" },
  { id: "av03", type: "number", text: "你的裸足身高？", hint: "赤足靠墙站立测量", unit: "cm", numberRange: { min: 140, max: 230 }, required: true, dimension: "anthropometry" },
  { id: "av05", type: "select", text: "你的体型属于？", options: [
    { label: "偏瘦（男≤12%，女≤18%）", value: "lean" }, { label: "标准（男13-18%，女19-25%）", value: "standard" }, { label: "偏高（男19-25%，女26-32%）", value: "high" }, { label: "肥胖（男>25%，女>32%）", value: "obese" },
  ], required: true, dimension: "anthropometry" },
  { id: "av06", type: "select", text: "规律力量/爆发力/跳跃训练已有多少年？", options: [
    { label: "不到半年", value: "lt05" }, { label: "半年到1年", value: "05-1" }, { label: "1-3年", value: "1-3" }, { label: "3年以上", value: "gt3" },
  ], required: true, dimension: "anthropometry" },
  { id: "av09", type: "select", text: "是否曾连续至少2年规律参与跳跃类运动？", options: [
    { label: "是", value: "yes" }, { label: "否", value: "no" },
  ], required: true, dimension: "anthropometry" },

  // 维度 2：力量素质 — 6题
  { id: "av11", type: "select", text: "杠铃深蹲最大重量约体重的多少倍？", options: [
    { label: "无法完成自重深蹲", value: "none" }, { label: "可完成自重深蹲", value: "bw" }, { label: "<1倍体重", value: "lt1x" }, { label: "1-1.3倍", value: "1-1.3x" }, { label: "1.3-1.6倍", value: "1.3-1.6x" }, { label: "1.6-2.0倍", value: "1.6-2x" }, { label: ">2.0倍", value: "gt2x" },
  ], required: true, dimension: "maxStrength" },
  { id: "av13", type: "select", text: "能否不扶墙单腿下蹲至大腿平行地面？", options: [
    { label: "左右都能轻松≥5次", value: "both_easy" }, { label: "只能1-4次或仅单侧", value: "limited" }, { label: "无法完成", value: "cannot" }, { label: "未尝试", value: "unknown" },
  ], required: false, dimension: "maxStrength" },
  { id: "av14", type: "select", text: "单腿提踵（踮脚尖）最多连续多少次？", options: [
    { label: "<10次", value: "lt10" }, { label: "10-15次", value: "10-15" }, { label: "16-25次", value: "16-25" }, { label: ">25次", value: "gt25" }, { label: "未测", value: "unknown" },
  ], required: false, dimension: "maxStrength" },
  { id: "av17", type: "select", text: "每周下肢力量训练天数？", options: [
    { label: "0天", value: "0" }, { label: "1天", value: "1" }, { label: "2天", value: "2" }, { label: "3天", value: "3" }, { label: "≥4天", value: "ge4" },
  ], required: true, dimension: "maxStrength" },
  { id: "av18", type: "select", text: "过去3个月深蹲力量变化趋势？", options: [
    { label: "明显增长", value: "growing" }, { label: "缓慢增长", value: "slow" }, { label: "基本稳定", value: "stable" }, { label: "下降或停滞", value: "decline" }, { label: "刚开始训练", value: "new" },
  ], required: false, dimension: "maxStrength" },
  { id: "av19", type: "multiSelect", text: "下肢力量训练中是否出现过以下疼痛？", options: [
    { label: "无疼痛", value: "none" }, { label: "膝盖前侧", value: "knee" }, { label: "下背部", value: "lowback" }, { label: "跟腱", value: "achilles" }, { label: "腹股沟/髋", value: "hip" },
  ], required: true, dimension: "maxStrength" },

  // 维度 3：垂直跳与爆发力 — 6题
  { id: "av20", type: "select", text: "站立垂直跳高度大约？", options: [
    { label: "很低（<30cm）", value: "lt30" }, { label: "较低（30-40cm）", value: "30-40" }, { label: "中等（40-55cm）", value: "40-55" }, { label: "较高（55-70cm）", value: "55-70" }, { label: "很高（>70cm）", value: "gt70" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av21", type: "select", text: "3-5步助跑起跳与站立跳相比？", options: [
    { label: "明显更高（高出10-20cm）", value: "much_higher" }, { label: "略高（5-10cm）", value: "slightly" }, { label: "差不多（<5cm）", value: "same" }, { label: "从未比较", value: "unknown" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av23", type: "select", text: "从30-50cm箱跳下立即反弹起跳，感觉？", options: [
    { label: "从未尝试", value: "never" }, { label: "反弹跳与站立跳差不多或更高", value: "equal" }, { label: "反弹跳明显更低", value: "lower" }, { label: "落地时膝盖/脚踝压力大", value: "painful" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av24", type: "select", text: "连续膝胸跳（膝盖提到胸部）最多多少次？", options: [
    { label: "<6次", value: "lt6" }, { label: "6-10次", value: "6-10" }, { label: "11-15次", value: "11-15" }, { label: ">15次", value: "gt15" }, { label: "未尝试", value: "unknown" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av26", type: "select", text: "立定跳远大约多远？", options: [
    { label: "未测量", value: "unknown" }, { label: "<200cm", value: "lt200" }, { label: "200-230cm", value: "200-230" }, { label: "230-260cm", value: "230-260" }, { label: ">260cm", value: "gt260" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av29", type: "select", text: "不同日期垂直跳成绩波动大吗？", options: [
    { label: "波动很小（±5%）", value: "small" }, { label: "波动中等（5-10%）", value: "medium" }, { label: "波动很大（>10%）", value: "large" }, { label: "未关注", value: "unknown" },
  ], required: false, dimension: "powerSpeed" },

  // 维度 4：反应力量与增强式 — 6题
  { id: "av30", type: "select", text: "是否有跳深（Depth Jump）训练经验？", options: [
    { label: "从未尝试", value: "never" }, { label: "很少（<每月2次）", value: "rare" }, { label: "偶尔（每月2-4次）", value: "occasional" }, { label: "规律训练（每周≥1次）", value: "regular" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av32", type: "select", text: "单腿跳深（单脚着地反弹起跳）能力？", options: [
    { label: "从未尝试", value: "never" }, { label: "只能优势腿或不稳定", value: "unstable" }, { label: "左右腿都能完成", value: "both_stable" }, { label: "落地很轻盈", value: "light" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av35", type: "select", text: "你的短跑速度（30米）在伙伴中属于？", options: [
    { label: "很慢", value: "very_slow" }, { label: "偏慢", value: "slow" }, { label: "中等", value: "medium" }, { label: "较快", value: "fast" }, { label: "很快", value: "very_fast" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av36", type: "select", text: "高强度跳跃训练后需要几天恢复？", options: [
    { label: "1天内", value: "1d" }, { label: "2天", value: "2d" }, { label: "3-4天", value: "3-4d" }, { label: "≥5天", value: "ge5d" }, { label: "未做过增强式", value: "never" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av37", type: "multiSelect", text: "跳跃训练中是否出现过以下疼痛？", options: [
    { label: "无疼痛", value: "none" }, { label: "跟腱", value: "achilles" }, { label: "膝盖前侧", value: "knee" }, { label: "胫骨前侧", value: "shin" }, { label: "足底", value: "plantar" },
  ], required: false, dimension: "powerSpeed" },
  { id: "av39", type: "select", text: "每周专门增强式训练次数？", options: [
    { label: "0次", value: "0" }, { label: "1次", value: "1" }, { label: "2次", value: "2" }, { label: "≥3次", value: "ge3" },
  ], required: false, dimension: "powerSpeed" },

  // 维度 5：灵活性/活动度 — 6题
  { id: "av40", type: "select", text: "徒手深蹲时足跟是否抬离地面？", options: [
    { label: "从不", value: "never" }, { label: "偶尔", value: "sometimes" }, { label: "经常", value: "often" }, { label: "必须垫高才能蹲", value: "must_elevate" },
  ], required: false, dimension: "mobility" },
  { id: "av41", type: "select", text: "深蹲最低点时下背部是否明显圆起？", options: [
    { label: "保持平直", value: "flat" }, { label: "偶尔圆起", value: "sometimes" }, { label: "经常圆起", value: "often" }, { label: "无法避免", value: "unavoidable" },
  ], required: false, dimension: "mobility" },
  { id: "av42", type: "select", text: "坐姿体前屈手指能触到哪？", options: [
    { label: "手掌超过脚尖", value: "excellent" }, { label: "指尖触到脚尖", value: "touch" }, { label: "距脚尖5-10cm", value: "5-10" }, { label: "距脚尖>10cm", value: "gt10" },
  ], required: false, dimension: "mobility" },
  { id: "av43", type: "select", text: "仰卧抱膝至胸前，另一侧大腿位置？", options: [
    { label: "明显上抬（高于水平）", value: "tight" }, { label: "与床面平行", value: "parallel" }, { label: "自然下落", value: "loose" }, { label: "未测试", value: "unknown" },
  ], required: false, dimension: "mobility" },
  { id: "av44", type: "select", text: "闭眼单腿站立能保持多少秒？", options: [
    { label: "<5秒", value: "lt5" }, { label: "5-10秒", value: "5-10" }, { label: "10-20秒", value: "10-20" }, { label: ">20秒", value: "gt20" }, { label: "未测试", value: "unknown" },
  ], required: false, dimension: "mobility" },
  { id: "av47", type: "select", text: "过顶深蹲（轻杆过头）躯干会前倾吗？", options: [
    { label: "躯干直立", value: "upright" }, { label: "略微前倾", value: "slight" }, { label: "明显前倾", value: "lean" }, { label: "无法完成", value: "cannot" },
  ], required: false, dimension: "mobility" },

  // 维度 6：臀肌功能 — 6题
  { id: "av50", type: "select", text: "10次最大垂直跳后哪里最酸？", options: [
    { label: "臀部（臀肌主导）", value: "glute" }, { label: "轻微臀感", value: "slight" }, { label: "大腿前侧（股四头肌主导）", value: "quad" }, { label: "从未注意", value: "unknown" },
  ], required: false, dimension: "glute" },
  { id: "av51", type: "select", text: "深蹲训练后24-48小时哪里最酸痛？", options: [
    { label: "臀部", value: "glute" }, { label: "大腿前侧", value: "quad" }, { label: "大腿后侧", value: "hamstring" }, { label: "下背部", value: "lowback" }, { label: "几乎不酸痛", value: "none" },
  ], required: false, dimension: "glute" },
  { id: "av52", type: "select", text: "单腿臀桥能维持骨盆稳定多少秒？", options: [
    { label: "<10秒", value: "lt10" }, { label: "10-20秒", value: "10-20" }, { label: "20-30秒", value: "20-30" }, { label: ">30秒", value: "gt30" }, { label: "未测试", value: "unknown" },
  ], required: false, dimension: "glute" },
  { id: "av53", type: "select", text: "从高处落地时膝盖是否内扣？", options: [
    { label: "从不", value: "never" }, { label: "偶尔", value: "sometimes" }, { label: "经常", value: "often" }, { label: "未注意", value: "unknown" },
  ], required: false, dimension: "glute" },
  { id: "av57", type: "select", text: "平均每天久坐时间？", options: [
    { label: "<4小时", value: "lt4" }, { label: "4-6小时", value: "4-6" }, { label: "6-8小时", value: "6-8" }, { label: ">8小时", value: "gt8" },
  ], required: true, dimension: "glute" },
  { id: "av58", type: "select", text: "每周有意识地做臀肌激活训练？", options: [
    { label: "每次训练前", value: "always" }, { label: "每周2-3次", value: "2-3" }, { label: "每周1次", value: "1" }, { label: "偶尔", value: "rarely" }, { label: "从不", value: "never" },
  ], required: false, dimension: "glute" },

  // 维度 7：伤病史与安全 — 5题
  { id: "av60", type: "select", text: "过去1年内膝盖前侧疼痛（跳跃/下蹲时）？", options: [
    { label: "无", value: "none" }, { label: "偶尔轻微", value: "mild" }, { label: "经常，曾减少训练", value: "frequent" }, { label: "目前有痛", value: "current" },
  ], required: true, dimension: "injury" },
  { id: "av61", type: "select", text: "跟腱或小腿后侧是否出现过疼痛？", options: [
    { label: "无", value: "none" }, { label: "偶尔轻微", value: "mild" }, { label: "经常或目前存在", value: "frequent" },
  ], required: true, dimension: "injury" },
  { id: "av62", type: "select", text: "过去1年内下背部疼痛（深蹲/跳跃时）？", options: [
    { label: "无", value: "none" }, { label: "偶尔休息后消失", value: "mild" }, { label: "经常或目前存在", value: "frequent" },
  ], required: true, dimension: "injury" },
  { id: "av63", type: "select", text: "脚踝曾扭伤过吗？现在感觉不稳？", options: [
    { label: "从未扭伤", value: "never" }, { label: "1-2次已康复", value: "healed" }, { label: "多次或感觉不稳", value: "unstable" },
  ], required: true, dimension: "injury" },
  { id: "av69", type: "select", text: "现在有疼痛让你不敢全力跳吗？", options: [
    { label: "无，可全力训练", value: "none" }, { label: "轻微不适", value: "mild" }, { label: "明显疼痛", value: "significant" }, { label: "医生建议暂停", value: "stop" },
  ], required: true, dimension: "injury" },

  // 维度 8：训练习惯与恢复 — 6题
  { id: "av70", type: "select", text: "每周下肢专项训练天数？", options: [
    { label: "0-1天", value: "0-1" }, { label: "2天", value: "2" }, { label: "3天", value: "3" }, { label: "≥4天", value: "ge4" },
  ], required: true, dimension: "recovery" },
  { id: "av71", type: "select", text: "平均每次下肢训练时长？", options: [
    { label: "<30分钟", value: "lt30" }, { label: "30-60分钟", value: "30-60" }, { label: "60-90分钟", value: "60-90" }, { label: ">90分钟", value: "gt90" },
  ], required: true, dimension: "recovery" },
  { id: "av73", type: "select", text: "平均每晚睡多少小时？", options: [
    { label: "<6小时", value: "lt6" }, { label: "6-7小时", value: "6-7" }, { label: "7-9小时", value: "7-9" }, { label: ">9小时", value: "gt9" },
  ], required: true, dimension: "recovery" },
  { id: "av74", type: "select", text: "睡眠质量如何？", options: [
    { label: "很差（常醒难入睡）", value: "very_poor" }, { label: "较差", value: "poor" }, { label: "一般", value: "average" }, { label: "较好", value: "good" }, { label: "很好（精力充沛）", value: "excellent" },
  ], required: true, dimension: "recovery" },
  { id: "av77", type: "select", text: "近一个月总体压力水平？", options: [
    { label: "很低", value: "very_low" }, { label: "较低", value: "low" }, { label: "中等", value: "medium" }, { label: "较高", value: "high" }, { label: "很高", value: "very_high" },
  ], required: true, dimension: "recovery" },
  { id: "av79", type: "select", text: "是否定期安排减载周（轻训周）？", options: [
    { label: "有，每4-6周一次", value: "yes" }, { label: "偶尔但不规律", value: "irregular" }, { label: "从不", value: "never" }, { label: "刚开始训练", value: "new" },
  ], required: false, dimension: "recovery" },

  // 维度 9：心理与动机 — 6题
  { id: "av80", type: "select", text: "提高弹跳的最主要目标？", options: [
    { label: "比赛扣篮/盖帽", value: "dunk" }, { label: "达到某个数字", value: "number" }, { label: "享受过程", value: "process" }, { label: "提升整体表现", value: "performance" }, { label: "其他", value: "other" },
  ], required: true, dimension: "psychology" },
  { id: "av82", type: "select", text: "是否记录训练数据（深蹲/跳高/增强式）？", options: [
    { label: "详细记录", value: "detailed" }, { label: "偶尔记录", value: "sometimes" }, { label: "凭感觉不记录", value: "never" },
  ], required: false, dimension: "psychology" },
  { id: "av83", type: "select", text: "过去6个月因动力下降中断训练超2周？", options: [
    { label: "无中断", value: "none" }, { label: "中断1次", value: "1" }, { label: "中断≥2次", value: "ge2" },
  ], required: false, dimension: "psychology" },
  { id: "av84", type: "select", text: "跳高几周没进步时通常会？", options: [
    { label: "更努力加量", value: "push_harder" }, { label: "分析调整", value: "analyze" }, { label: "沮丧减少训练", value: "frustrated" }, { label: "放弃", value: "quit" }, { label: "未遇到", value: "never" },
  ], required: false, dimension: "psychology" },
  { id: "av86", type: "select", text: "尝试最大跳跃时对自己说什么？", options: [
    { label: "'快！爆！跳！'", value: "explosive" }, { label: "'轻一点''控制住'", value: "inhibitory" }, { label: "什么都不想", value: "nothing" }, { label: "过于关注技术细节", value: "overthink" },
  ], required: false, dimension: "psychology" },
  { id: "av88", type: "select", text: "如果12周只增加5-8cm，你会？", options: [
    { label: "接受长期积累", value: "accept" }, { label: "略失望但继续", value: "continue" }, { label: "很失望想换方法", value: "disappointed" }, { label: "无法接受", value: "unacceptable" },
  ], required: false, dimension: "psychology" },

  // 维度 10：跳跃技术 — 6题
  { id: "av90", type: "select", text: "最大垂直跳时起跳前下蹲深度？", options: [
    { label: "很浅（<30度）", value: "shallow" }, { label: "中等（45-60度）", value: "medium" }, { label: "较深（70-90度）", value: "deep" }, { label: "很深（>90度）", value: "very_deep" },
  ], required: false, dimension: "technique" },
  { id: "av91", type: "select", text: "跳跃时手臂摆动幅度？", options: [
    { label: "充分摆臂同步", value: "full" }, { label: "有摆臂但幅度小/不同步", value: "partial" }, { label: "几乎不摆臂", value: "none" },
  ], required: false, dimension: "technique" },
  { id: "av93", type: "select", text: "跳起落地时膝盖通常？", options: [
    { label: "屈膝充分，轻盈", value: "soft" }, { label: "有弯曲但声大", value: "moderate" }, { label: "直腿硬着陆", value: "stiff" }, { label: "膝盖内扣", value: "valgus" },
  ], required: false, dimension: "technique" },
  { id: "av94", type: "select", text: "跑动起跳的助跑→起跳转换是否流畅？", options: [
    { label: "非常流畅", value: "smooth" }, { label: "偶尔停顿", value: "sometimes" }, { label: "不流畅有减速", value: "choppy" }, { label: "未做过", value: "never" },
  ], required: false, dimension: "technique" },
  { id: "av95", type: "select", text: "单腿跳起跳瞬间膝盖稳定吗？", options: [
    { label: "稳定", value: "stable" }, { label: "偶尔晃动", value: "slight" }, { label: "经常内扣或不稳", value: "unstable" }, { label: "未做过", value: "never" },
  ], required: false, dimension: "technique" },
  { id: "av97", type: "number", text: "综合跳跃技术自评（1=差，10=完美）？", numberRange: { min: 1, max: 10 }, required: false, dimension: "technique" },
];

export function getStandardQuestionById(id: string): Question | undefined {
  return standardQuestions.find((q) => q.id === id);
}
