// ============================================================
// 国际标准版评估问卷 — 约 50 题，基于 NSCA/FMS/YBT 等标准
// 无需测力台、无需专业设备，用简单工具即可完成
// 适合：有训练基础、想获得专业级诊断的运动者
// ============================================================

import { Question } from "./types";

export const standardQuestions: Question[] = [
  // ================================================================
  // 模块 1：人体测量 (anthropometry)
  // ================================================================
  { id: "st01", type: "number", text: "您的年龄？", unit: "岁", numberRange: { min: 12, max: 60 }, required: true, dimension: "anthropometry" },
  { id: "st02", type: "select", text: "您的性别？", options: [{ label: "男", value: "male" }, { label: "女", value: "female" }], required: true, dimension: "anthropometry" },
  { id: "st03", type: "number", text: "您的赤脚身高？", unit: "cm", numberRange: { min: 140, max: 230 }, required: true, dimension: "anthropometry" },
  { id: "st04", type: "number", text: "您的体重（早晨空腹）？", unit: "kg", numberRange: { min: 35, max: 180 }, required: true, dimension: "anthropometry" },
  { id: "st05", type: "number", text: "您的体脂率大约是多少？", hint: "用皮脂钳（几十元）或体脂秤测量；无设备可自估：腹肌清晰≈8-10%，隐约可见≈12-15%，平坦≈16-20%", unit: "%", numberRange: { min: 5, max: 45 }, required: true, dimension: "anthropometry" },
  { id: "st06", type: "number", text: "您的站立单手摸高（赤脚）？", hint: "赤足单手尽量向上伸展", unit: "cm", numberRange: { min: 180, max: 310 }, required: true, dimension: "anthropometry" },
  { id: "st07", type: "select", text: "您的骨架粗细（目测即可）？", options: [{ label: "偏细", value: "small" }, { label: "中等", value: "medium" }, { label: "偏粗", value: "large" }], required: true, dimension: "anthropometry" },

  // ================================================================
  // 模块 2：身体比例与结构 (proportion)
  // ================================================================
  { id: "st08", type: "select", text: "您的上下身比例（下身/上身）？", hint: "下身(大转子到足底)/上身(身高-下身)。>1.08 对跳跃有利", options: [{ label: "下身较长（>1.08）", value: "long_legs" }, { label: "比例均衡（0.95-1.08）", value: "balanced" }, { label: "上身较长（<0.95）", value: "long_torso" }, { label: "未测量", value: "unknown" }], required: true, dimension: "proportion" },
  { id: "st09", type: "select", text: "您的足弓类型？", hint: "湿脚踩纸法观察足印", options: [{ label: "高足弓", value: "high" }, { label: "正常足弓", value: "normal" }, { label: "扁平足", value: "flat" }, { label: "未评估", value: "unknown" }], required: false, dimension: "proportion" },
  { id: "st10", type: "select", text: "您的整体运动协调性？", options: [{ label: "优秀（学新动作快）", value: "excellent" }, { label: "良好", value: "good" }, { label: "一般", value: "average" }, { label: "较差", value: "poor" }], required: true, dimension: "proportion" },
  { id: "st11", type: "multiSelect", text: "您是否有明显体态问题？（可多选）", options: [{ label: "骨盆前倾", value: "apt" }, { label: "驼背/圆肩", value: "kyphosis" }, { label: "X/O型腿", value: "leg_align" }, { label: "无明显问题", value: "none" }], required: true, dimension: "proportion" },

  // ================================================================
  // 模块 3：力量水平 (maxStrength) — 无需1RM实测，可用估算
  // ================================================================
  { id: "st12", type: "select", text: "您的杠铃深蹲水平（估算即可）？", hint: "如不确定1RM，按「能做5次的重量×1.15」估算", options: [{ label: "精英（≥2.0倍体重）", value: "elite" }, { label: "高级（1.5-2.0xBW）", value: "advanced" }, { label: "中级（1.0-1.5xBW）", value: "intermediate" }, { label: "初级（0.5-1.0xBW）", value: "novice" }, { label: "几乎无杠铃训练", value: "none" }], required: true, dimension: "maxStrength" },
  { id: "st13", type: "select", text: "您的硬拉水平（估算即可）？", options: [{ label: "精英（≥2.5xBW）", value: "elite" }, { label: "高级（2.0-2.5xBW）", value: "advanced" }, { label: "中级（1.5-2.0xBW）", value: "intermediate" }, { label: "初级（1.0-1.5xBW）", value: "novice" }, { label: "几乎无硬拉训练", value: "none" }], required: false, dimension: "maxStrength" },
  { id: "st14", type: "select", text: "您的保加利亚分腿蹲单侧能力？", hint: "单侧力量对弹跳至关重要", options: [{ label: "优秀（负重>50%体重×8次）", value: "excellent" }, { label: "良好（负重30-50%体重）", value: "good" }, { label: "一般（自重8-12次）", value: "average" }, { label: "较弱（自重<5次）", value: "weak" }, { label: "未做过", value: "unknown" }], required: true, dimension: "maxStrength" },
  { id: "st15", type: "select", text: "您的核心抗旋能力（Pallof Press）？", options: [{ label: "强（弹力带/龙门架 ≥20kg 稳定）", value: "strong" }, { label: "良好", value: "good" }, { label: "一般（平板支撑 30-60s）", value: "average" }, { label: "较弱（平板支撑 <30s）", value: "weak" }], required: true, dimension: "maxStrength" },
  { id: "st16", type: "select", text: "您的左右腿力量差异？", options: [{ label: "<5%（很均衡）", value: "balanced" }, { label: "5-10%（可接受）", value: "slight" }, { label: "10-20%（需关注）", value: "moderate" }, { label: ">20%（高风险）", value: "severe" }, { label: "未测试", value: "unknown" }], required: true, dimension: "maxStrength" },
  { id: "st17", type: "select", text: "您的臀肌激活模式？", hint: "单腿臀桥测试：能否无代偿完成15次以上？", options: [{ label: "优秀（臀主导，无代偿）", value: "excellent" }, { label: "良好（轻微代偿）", value: "good" }, { label: "一般（股四头肌/下背代偿明显）", value: "average" }, { label: "臀肌不足", value: "quad_dom" }], required: false, dimension: "maxStrength" },

  // ================================================================
  // 模块 4：爆发力与速度 (powerSpeed) — 用手机App即可测量
  // ================================================================
  { id: "st18", type: "number", text: "您的原地反向纵跳 CMJ 高度？", hint: "用 My Jump 2（免费App）拍摄跳跃即可自动计算，无需测力台", unit: "cm", numberRange: { min: 15, max: 100 }, required: false, dimension: "powerSpeed" },
  { id: "st19", type: "number", text: "您的助跑摸高最大高度？", hint: "助跑后单脚或双脚起跳摸高", unit: "cm", numberRange: { min: 220, max: 400 }, required: false, dimension: "powerSpeed" },
  { id: "st20", type: "number", text: "您的立定跳远成绩？", unit: "cm", numberRange: { min: 120, max: 350 }, required: false, dimension: "powerSpeed" },
  { id: "st21", type: "number", text: "您的 30 米冲刺时间？", hint: "用手机秒表或计时App即可", unit: "秒", numberRange: { min: 3.0, max: 7.0 }, required: false, dimension: "powerSpeed" },
  { id: "st22", type: "select", text: "您的发力率（RFD）自评？", hint: "从静止到最大力量输出的速度——起跳是否迅猛", options: [{ label: "极快（起跳迅猛干脆）", value: "explosive" }, { label: "良好", value: "good" }, { label: "一般（有力量但爆发速度不够）", value: "slow_str" }, { label: "偏慢", value: "slow" }], required: true, dimension: "powerSpeed" },
  { id: "st23", type: "select", text: "您最接近哪种力-速特征？", hint: "力量型=慢速大力量；速度型=快速轻负荷", options: [{ label: "力量主导（深蹲强但跳跃表现不如预期）", value: "force_dom" }, { label: "速度主导（跳跃好但力量相对弱）", value: "velo_dom" }, { label: "均衡型", value: "balanced" }, { label: "不确定", value: "unknown" }], required: true, dimension: "powerSpeed" },
  { id: "st24", type: "select", text: "您的训练中力量与增强式比例？", options: [{ label: "以力量为主（>70%）", value: "strength_heavy" }, { label: "各半（50/50）", value: "balanced" }, { label: "以增强式为主（>70%）", value: "plyo_heavy" }, { label: "不确定", value: "unknown" }], required: false, dimension: "powerSpeed" },

  // ================================================================
  // 模块 5：FMS 功能性运动筛查 (mobility) — 7项基础动作，无需设备
  // ================================================================
  { id: "st25", type: "select", text: "【FMS-1】深蹲（Deep Squat）— 双手举杆过头蹲？", hint: "用扫帚杆或PVC管即可。满分3分=杆在脚正上方、躯干与胫骨平行、大腿低于水平、膝不超脚尖", options: [{ label: "3分—完美完成", value: "3" }, { label: "2分—完成但有代偿（如垫高脚跟）", value: "2" }, { label: "1分—无法完成", value: "1" }, { label: "0分—动作引起疼痛", value: "0" }], required: true, dimension: "mobility" },
  { id: "st26", type: "select", text: "【FMS-2】跨栏步（Hurdle Step）— 单腿跨过胫骨高度障碍？", hint: "障碍高度=胫骨粗隆高度。满分=髋膝踝对齐、躯干稳定", options: [{ label: "3分—完美完成", value: "3" }, { label: "2分—完成但有晃动", value: "2" }, { label: "1分—触碰障碍或失衡", value: "1" }, { label: "0分—疼痛", value: "0" }], required: true, dimension: "mobility" },
  { id: "st27", type: "select", text: "【FMS-3】直线弓步（Inline Lunge）— 前后脚在一条线上蹲？", hint: "后脚脚尖距前脚脚跟=胫骨长度。满分=杆接触脊柱三点、躯干稳定", options: [{ label: "3分—完美完成", value: "3" }, { label: "2分—完成但有晃动或脚跟离地", value: "2" }, { label: "1分—无法保持平衡", value: "1" }, { label: "0分—疼痛", value: "0" }], required: true, dimension: "mobility" },
  { id: "st28", type: "select", text: "【FMS-4】肩部活动度（Shoulder Mobility）— 双手背后互触？", hint: "一只手从上往下、另一只从下往上在背后靠拢。满分=双拳距<一只手长", options: [{ label: "3分—双拳距离<手长", value: "3" }, { label: "2分—双拳距离<1.5手长", value: "2" }, { label: "1分—双拳距离>1.5手长", value: "1" }, { label: "0分—疼痛", value: "0" }], required: true, dimension: "mobility" },
  { id: "st29", type: "select", text: "【FMS-5】主动直腿抬高（ASLR）— 仰卧单腿直抬？", hint: "满分=外踝垂线超过对侧大腿中点", options: [{ label: "3分—超过大腿中点", value: "3" }, { label: "2分—超过膝盖", value: "2" }, { label: "1分—不到膝盖", value: "1" }, { label: "0分—疼痛", value: "0" }], required: true, dimension: "mobility" },
  { id: "st30", type: "select", text: "【FMS-6】躯干稳定俯卧撑（Trunk Stability Pushup）— 俯卧撑起？", hint: "男性拇指对齐额头、女性拇指对齐下巴。满分=身体整体撑起无滞后", options: [{ label: "3分—完美完成", value: "3" }, { label: "2分—拇指在下巴位置完成", value: "2" }, { label: "1分—无法完成", value: "1" }, { label: "0分—疼痛", value: "0" }], required: true, dimension: "mobility" },
  { id: "st31", type: "select", text: "【FMS-7】旋转稳定性（Rotary Stability）— 四足跪姿对侧伸展？", hint: "满分=同侧完成（肩膝同时伸展后肘膝触碰）", options: [{ label: "3分—同侧完美完成", value: "3" }, { label: "2分—对侧方式完成", value: "2" }, { label: "1分—无法完成", value: "1" }, { label: "0分—疼痛", value: "0" }], required: true, dimension: "mobility" },
  { id: "st32", type: "number", text: "您的坐位体前屈成绩？", hint: "指尖超过脚尖为正", unit: "cm", numberRange: { min: -30, max: 40 }, required: false, dimension: "mobility" },
  { id: "st33", type: "select", text: "您的踝关节背屈活动度（膝到墙测试）？", hint: "脚尖距墙多远时膝盖能触墙。弹跳最关键关节活动度", options: [{ label: "优秀（>13cm）", value: "excellent" }, { label: "良好（10-13cm）", value: "good" }, { label: "一般（6-10cm）", value: "average" }, { label: "受限（<6cm）", value: "poor" }, { label: "未测试", value: "unknown" }], required: true, dimension: "mobility" },

  // ================================================================
  // 模块 6：YBT 下肢平衡测试 (功能性) 
  // ================================================================
  { id: "st34", type: "select", text: "单腿站立稳定性？", hint: "闭眼单腿站立持续时间", options: [{ label: "优秀（>60秒）", value: "excellent" }, { label: "良好（30-60秒）", value: "good" }, { label: "一般（10-30秒）", value: "average" }, { label: "较差（<10秒）", value: "poor" }], required: true, dimension: "mobility" },
  { id: "st35", type: "select", text: "单腿跳跃落地稳定性？", hint: "单腿跳远后落地能否稳定保持2秒不晃动？", options: [{ label: "优秀（落地安静稳定）", value: "excellent" }, { label: "良好（轻微晃动）", value: "good" }, { label: "一般（明显晃动或另一脚触地）", value: "average" }, { label: "较差（无法稳定落地）", value: "poor" }], required: true, dimension: "mobility" },

  // ================================================================
  // 模块 7：耐力与能量系统 (endurance)
  // ================================================================
  { id: "st36", type: "select", text: "您的有氧基础水平？", hint: "能否轻松完成30分钟持续运动（跑步/骑车/游泳）？", options: [{ label: "优秀（轻松跑5km）", value: "excellent" }, { label: "良好（能跑3km）", value: "good" }, { label: "一般（勉强1-2km）", value: "average" }, { label: "较差（跑几分钟就喘）", value: "poor" }], required: true, dimension: "endurance" },
  { id: "st37", type: "select", text: "高强度训练后恢复速度？", hint: "做完一组高强度训练后多久能恢复？", options: [{ label: "很快（1-2分钟即可）", value: "fast" }, { label: "正常（2-3分钟）", value: "normal" }, { label: "偏慢（3-5分钟）", value: "slow" }, { label: "很慢（>5分钟）", value: "very_slow" }], required: true, dimension: "endurance" },
  { id: "st38", type: "select", text: "您的静息心率大约？", hint: "早晨醒来躺着测", options: [{ label: "<50 bpm（优秀有氧基础）", value: "excellent" }, { label: "50-65 bpm（良好）", value: "good" }, { label: "65-80 bpm（一般）", value: "average" }, { label: ">80 bpm（需改善）", value: "poor" }, { label: "不清楚", value: "unknown" }], required: false, dimension: "endurance" },

  // ================================================================
  // 模块 8：训练经验与伤病 (trainingHx)
  // ================================================================
  { id: "st39", type: "select", text: "您的系统训练年限？", options: [{ label: "5年以上", value: "5y+" }, { label: "2-5年", value: "2-5y" }, { label: "1-2年", value: "1-2y" }, { label: "6个月-1年", value: "6m-1y" }, { label: "<6个月", value: "<6m" }], required: true, dimension: "trainingHx" },
  { id: "st40", type: "select", text: "您是否有弹跳专项训练经验？", options: [{ label: "系统训练过（有教练或有计划）", value: "yes_sys" }, { label: "自己练过一些", value: "yes_casual" }, { label: "没练过", value: "no" }], required: true, dimension: "trainingHx" },
  { id: "st41", type: "multiSelect", text: "您有过哪些下肢伤病？（可多选）", options: [{ label: "膝盖伤（髌腱炎/半月板/ACL等）", value: "knee" }, { label: "踝关节扭伤", value: "ankle" }, { label: "腰背伤", value: "back" }, { label: "跟腱炎", value: "achilles" }, { label: "胫骨骨膜炎", value: "shin" }, { label: "以上均无", value: "none" }], required: true, dimension: "trainingHx" },
  { id: "st42", type: "select", text: "最近一次伤病是什么时候？", options: [{ label: "目前有伤", value: "current" }, { label: "半年内", value: "6m" }, { label: "半年到一年前", value: "1y" }, { label: "一年以上", value: "old" }, { label: "没有受过伤", value: "never" }], required: true, dimension: "trainingHx" },
  { id: "st43", type: "select", text: "您每次训练前是否有系统热身习惯？", options: [{ label: "有，10分钟以上系统热身", value: "yes_full" }, { label: "有，但比较简单", value: "yes_brief" }, { label: "偶尔热身", value: "occasional" }, { label: "从不热身", value: "never" }], required: true, dimension: "trainingHx" },

  // ================================================================
  // 模块 9：恢复与生活方式 (lifestyle)
  // ================================================================
  { id: "st44", type: "select", text: "您每天平均睡眠时长？", options: [{ label: "8小时以上", value: "8+" }, { label: "7-8小时", value: "7-8" }, { label: "6-7小时", value: "6-7" }, { label: "不到6小时", value: "<6" }], required: true, dimension: "lifestyle" },
  { id: "st45", type: "select", text: "您的睡眠质量？", options: [{ label: "很好（入睡快、醒来精神）", value: "good" }, { label: "一般", value: "average" }, { label: "较差（入睡困难/易醒）", value: "poor" }], required: true, dimension: "lifestyle" },
  { id: "st46", type: "select", text: "您的饮食营养质量？", options: [{ label: "很注意（蛋白质/碳水/脂肪均衡）", value: "good" }, { label: "一般", value: "average" }, { label: "不太注意", value: "poor" }], required: true, dimension: "lifestyle" },
  { id: "st47", type: "slider", text: "您的生活压力程度？", sliderRange: { min: 1, max: 10, step: 1 }, sliderLabels: { min: "几乎无压力", max: "压力很大" }, required: true, dimension: "lifestyle" },
  { id: "st48", type: "select", text: "您是否有主动恢复习惯？", hint: "泡沫轴、拉伸、按摩、冷热交替等", options: [{ label: "经常做（每周3次以上）", value: "frequent" }, { label: "偶尔做", value: "occasional" }, { label: "很少做", value: "rare" }, { label: "从不", value: "never" }], required: true, dimension: "lifestyle" },

  // ================================================================
  // 模块 10：训练资源与目标 (availability)
  // ================================================================
  { id: "st49", type: "select", text: "您每周能用于训练的天数？", options: [{ label: "5-7天", value: "5-7" }, { label: "3-4天", value: "3-4" }, { label: "1-2天", value: "1-2" }], required: true, dimension: "availability" },
  { id: "st50", type: "select", text: "您每次训练可用时长？", options: [{ label: "90分钟以上", value: "90+" }, { label: "60-90分钟", value: "60-90" }, { label: "30-60分钟", value: "30-60" }, { label: "<30分钟", value: "<30" }], required: true, dimension: "availability" },
  { id: "st51", type: "select", text: "您可以使用的训练设备？", options: [{ label: "完整健身房（杠铃/哑铃/龙门架）", value: "full_gym" }, { label: "基础器械（哑铃/弹力带）", value: "basic" }, { label: "几乎无设备（自重训练）", value: "bodyweight" }], required: true, dimension: "availability" },
  { id: "st52", type: "select", text: "您的弹跳提升目标？", options: [{ label: "提升 5-10cm", value: "5-10" }, { label: "提升 10-20cm", value: "10-20" }, { label: "提升 20cm 以上", value: "20+" }, { label: "维持现有水平", value: "maintain" }], required: true, dimension: "availability" },
  { id: "st53", type: "select", text: "您的主要运动项目？", options: [{ label: "篮球", value: "basketball" }, { label: "排球", value: "volleyball" }, { label: "足球", value: "football" }, { label: "田径（跳高/跳远/短跑）", value: "track" }, { label: "健身/综合", value: "fitness" }, { label: "其他", value: "other" }], required: true, dimension: "availability" },
  { id: "st54", type: "select", text: "您是否熟悉举重类动作（高翻、抓举、挺举等）？", hint: "不熟悉的话AI会推荐效果相近的替代动作，不用勉强", options: [{ label: "非常熟悉，能标准完成", value: "proficient" }, { label: "略懂，动作还不够标准", value: "novice" }, { label: "完全不会/没接触过", value: "never" }], required: true, dimension: "trainingHx" },
];

export function getStandardQuestionById(id: string): Question | undefined {
  return standardQuestions.find(q => q.id === id);
}
