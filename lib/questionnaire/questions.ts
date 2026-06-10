// ============================================================
// 弹跳训练专业评估问卷 — 85 题，10+ 科学维度
// 基于 NSCA, FMS, YBT, Force-Velocity Profiling 等运动科学标准
// ============================================================

import { Question } from "./types";

export const allQuestions: Question[] = [

  // ================================================================
  // 模块 1：人体测量学基础 (anthropometry)
  // ================================================================
  {
    id: "b01", type: "number", text: "您的年龄？",
    hint: "年龄影响恢复速度、训练强度上限与适应性窗口", unit: "岁",
    numberRange: { min: 12, max: 60 }, required: true, dimension: "anthropometry",
  },
  {
    id: "b02", type: "select", text: "您的性别？",
    options: [{ label: "男", value: "male" }, { label: "女", value: "female" }],
    required: true, dimension: "anthropometry",
  },
  {
    id: "b03", type: "number", text: "您的赤脚身高？", unit: "cm",
    numberRange: { min: 140, max: 230 }, required: true, dimension: "anthropometry",
  },
  {
    id: "b04", type: "number", text: "您的体重（早晨空腹）？", unit: "kg",
    numberRange: { min: 35, max: 180 }, required: true, dimension: "anthropometry",
  },
  {
    id: "b05", type: "number", text: "您的体脂率大约是多少？",
    hint: "建议用皮脂钳 Jackson-Pollock 7点法测量。无设备可自查：腹肌清晰≈8-10%，隐约可见≈12-15%，平坦无刻度≈16-20%，微凸≈21-25%", unit: "%",
    numberRange: { min: 5, max: 45 }, required: true, dimension: "anthropometry",
  },
  {
    id: "b06", type: "select", text: "您的骨密度与骨骼健康评估？",
    hint: "有 DEXA 扫描数据请以此为准",
    options: [
      { label: "优秀（长期负重训练史，无应力损伤）", value: "excellent" },
      { label: "良好（无异常）", value: "good" },
      { label: "需关注（曾有应力性骨折或反复骨膜炎）", value: "concern" },
      { label: "不清楚 / 未检测", value: "unknown" },
    ], required: true, dimension: "anthropometry",
  },
  {
    id: "b07", type: "select", text: "您的骨架粗细（目测即可）？",
    hint: "看手腕/脚踝粗细相对身高的大致感觉即可，无需精确测量",
    options: [
      { label: "偏细（关节细小，显得修长）", value: "small" },
      { label: "中等（不粗不细）", value: "medium" },
      { label: "偏粗（关节粗壮，骨架宽厚）", value: "large" },
    ], required: true, dimension: "anthropometry",
  },
  {
    id: "b08", type: "number", text: "您的站立单手摸高（赤脚）？",
    hint: "赤足单手尽量向上伸展，指尖到地面的距离", unit: "cm",
    numberRange: { min: 180, max: 310 }, required: true, dimension: "anthropometry",
  },
  // ================================================================
  // 模块 2：身体比例与肌骨结构 (proportion)
  // ================================================================
  {
    id: "p01", type: "number", text: "您的下肢长度（大转子到足底）？",
    hint: "站立测量髋大转子到地面的垂直距离", unit: "cm",
    numberRange: { min: 60, max: 130 }, required: false, dimension: "proportion",
  },
  {
    id: "p02", type: "select", text: "您的上下身长度比（下身/上身）？",
    hint: "下身(大转子到足底) / 上身(身高-下身长)。>1.08 对跳跃力学有利",
    options: [
      { label: "下身明显较长（>1.08）", value: "long_legs" },
      { label: "比例均衡（0.95-1.08）", value: "balanced" },
      { label: "上身较长（<0.95）", value: "long_torso" },
      { label: "未测量", value: "unknown" },
    ], required: true, dimension: "proportion",
  },
  {
    id: "p03", type: "select", text: "您的跟腱（Achilles）视觉长度？",
    hint: "选填。注意：跟腱长度与弹跳能力并无决定性关联，仅作参考。坐姿观察小腿后方肌腱可见长度即可",
    options: [
      { label: "较长（>15cm，仅作参考）", value: "long" },
      { label: "中等（10-15cm）", value: "medium" },
      { label: "较短（<10cm，无需担心）", value: "short" },
      { label: "未评估 / 跳过", value: "unknown" },
    ], required: false, dimension: "proportion",
  },
  {
    id: "p04", type: "select", text: "您的足弓类型？",
    hint: "湿脚踩纸法或足印分析。正常足弓缓冲与刚性传递最优",
    options: [
      { label: "高足弓（Pes Cavus）", value: "high" },
      { label: "正常足弓", value: "normal" },
      { label: "低足弓/扁平足（Pes Planus）", value: "flat" },
      { label: "未评估", value: "unknown" },
    ], required: false, dimension: "proportion",
  },
  {
    id: "p05", type: "select", text: "您的整体运动协调性与本体感觉？",
    options: [
      { label: "优秀（学新动作极快，动作流畅精准）", value: "excellent" },
      { label: "良好", value: "good" },
      { label: "一般（需较多练习）", value: "average" },
      { label: "较差（动作学习困难）", value: "poor" },
    ], required: true, dimension: "proportion",
  },
  {
    id: "p06", type: "select", text: "您是否有明显的结构性体态问题？",
    options: [
      { label: "骨盆前倾（Anterior Pelvic Tilt）", value: "apt" },
      { label: "驼背/圆肩（Kyphosis）", value: "kyphosis" },
      { label: "脊柱侧弯（Scoliosis）", value: "scoliosis" },
      { label: "X型腿/O型腿", value: "leg_align" },
      { label: "无明显体态问题", value: "none" },
    ], required: true, dimension: "proportion",
  },
  {
    id: "p07", type: "select", text: "您的足踝刚性（Ankle Stiffness）自感？",
    hint: "足踝刚性高→更好的力量传递但可能影响缓冲",
    options: [
      { label: "刚性高（起跳蹬地感脆，落地响声大）", value: "high" },
      { label: "适中", value: "moderate" },
      { label: "偏软/缓冲型", value: "low" },
      { label: "不清楚", value: "unknown" },
    ], required: false, dimension: "proportion",
  },
  // ================================================================
  // 模块 3：最大力量水平 (maxStrength)
  // ================================================================
  {
    id: "s01", type: "number", text: "杠铃后蹲（Back Squat）1RM 或估算？", unit: "kg",
    numberRange: { min: 0, max: 350 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s02", type: "number", text: "传统硬拉（Conventional Deadlift）1RM？", unit: "kg",
    numberRange: { min: 0, max: 400 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s03", type: "number", text: "杠铃前蹲（Front Squat）1RM？",
    hint: "前蹲对弹跳的迁移性优于后蹲——更接近跳跃躯干角度", unit: "kg",
    numberRange: { min: 0, max: 250 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s04", type: "number", text: "杠铃高翻（Power Clean）1RM？",
    hint: "高翻是爆发力评估的黄金标准", unit: "kg",
    numberRange: { min: 0, max: 200 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s05", type: "number", text: "保加利亚分腿蹲单侧最大重量？",
    hint: "单侧力量对弹跳至关重要——检测左右不平衡", unit: "kg（单手负重）",
    numberRange: { min: 0, max: 80 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s06", type: "select", text: "您的相对力量水平（深蹲重量/体重）？",
    hint: "弹跳运动员理想范围 1.75-2.5x BW",
    options: [
      { label: "精英级（≥2.0x BW）", value: "elite" },
      { label: "高级（1.5-2.0x BW）", value: "advanced" },
      { label: "中级（1.0-1.5x BW）", value: "intermediate" },
      { label: "初级（0.5-1.0x BW）", value: "novice" },
      { label: "几乎无杠铃训练经验", value: "none" },
    ], required: true, dimension: "maxStrength",
  },
  {
    id: "s07", type: "select", text: "核心抗旋/抗伸能力？",
    hint: "Pallof Press、Dead Bug 等表现",
    options: [
      { label: "很强（Pallof ≥25kg，Ab Wheel 全程≥10次）", value: "strong" },
      { label: "良好", value: "good" },
      { label: "一般（平板支撑<60s）", value: "average" },
      { label: "较弱（平板支撑<30s即颤抖）", value: "weak" },
    ], required: true, dimension: "maxStrength",
  },
  {
    id: "s08", type: "select", text: "左右侧力量不对称程度？",
    options: [
      { label: "<5%（非常均衡）", value: "balanced" },
      { label: "5-10%（可接受）", value: "slight" },
      { label: "10-20%（需关注）", value: "moderate" },
      { label: ">20%（高风险，需优先纠正）", value: "severe" },
      { label: "未测试", value: "unknown" },
    ], required: true, dimension: "maxStrength",
  },
  {
    id: "s09", type: "select", text: "臀肌激活与髋主导发力模式？",
    hint: "单腿臀桥测试：能否在无代偿下完成 15+次？",
    options: [
      { label: "优秀（臀肌主导，单腿臀桥20+无代偿）", value: "excellent" },
      { label: "良好（轻微代偿）", value: "good" },
      { label: "一般（股四/下背明显代偿）", value: "average" },
      { label: "臀肌不足（股四主导型）", value: "quad_dom" },
    ], required: false, dimension: "maxStrength",
  },
  {
    id: "s10", type: "number", text: "负重引体向上最大额外负重？", unit: "kg",
    numberRange: { min: 0, max: 80 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s11", type: "select", text: "离心力量控制能力（落地缓冲质量）？",
    hint: "从高箱跳下：能否安静稳定吸收冲击？",
    options: [
      { label: "优秀（落地安静且姿势稳定）", value: "excellent" },
      { label: "良好（落地稳定，略响）", value: "good" },
      { label: "一般（膝关节内扣倾向）", value: "average" },
      { label: "较差（落地不稳，需手撑）", value: "poor" },
    ], required: true, dimension: "maxStrength",
  },
  {
    id: "s12", type: "select", text: "足部内在肌力？",
    hint: "短足练习、单腿提踵稳定性",
    options: [
      { label: "优秀（单腿提踵>30次，足弓控制强）", value: "excellent" },
      { label: "良好", value: "good" },
      { label: "一般", value: "average" },
      { label: "较弱（扁平足倾向）", value: "weak" },
    ], required: false, dimension: "maxStrength",
  },
  // ================================================================
  // 模块 4：爆发力与速度 (powerSpeed)
  // ================================================================
  {
    id: "sp01", type: "number", text: "原地反向纵跳 CMJ 高度（无摆臂）？",
    hint: "Countermovement Jump，双手叉腰，快速下蹲起跳。用 My Jump 2 App 或测力台测量", unit: "cm",
    numberRange: { min: 15, max: 100 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp02", type: "number", text: "原地蹲跳 SJ 高度（无预蹲）？",
    hint: "Squat Jump，从半蹲静止位起跳。CMJ-SJ 差值反映 SSC 效率", unit: "cm",
    numberRange: { min: 10, max: 90 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp03", type: "number", text: "助跑双脚起跳最大摸高？", unit: "cm",
    numberRange: { min: 220, max: 400 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp04", type: "number", text: "立定跳远（Standing Long Jump）成绩？", unit: "cm",
    numberRange: { min: 120, max: 350 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp05", type: "number", text: "30 米冲刺时间？",
    hint: "反映加速能力——弹跳训练的关键速度指标", unit: "秒",
    numberRange: { min: 3.0, max: 7.0 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp06", type: "select", text: "发力率（RFD）自评？",
    hint: "Rate of Force Development——从静止到最大力量输出的速度",
    options: [
      { label: "极快（起跳迅猛）", value: "explosive" },
      { label: "良好", value: "good" },
      { label: "一般（有力量但爆发速度不够）", value: "slow_str" },
      { label: "偏慢（需较长蓄力过程）", value: "slow" },
    ], required: true, dimension: "powerSpeed",
  },
  {
    id: "sp07", type: "select", text: "拉伸-缩短周期 SSC 利用效率？",
    hint: "CMJ/SJ 比值：>1.15 优秀，<1.05 需增强式训练",
    options: [
      { label: "优秀（比值>1.15，弹性势能利用好）", value: "excellent" },
      { label: "良好（1.05-1.15）", value: "good" },
      { label: "一般（<1.05，偏力量型）", value: "poor" },
      { label: "未测试", value: "unknown" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "sp08", type: "select", text: "连续跳跃能力（Repeated Jump Test）？",
    hint: "连续 10 次最大 CMJ，后 5 次下降幅度",
    options: [
      { label: "几乎不下降（<5%）——爆发力耐力优秀", value: "stable" },
      { label: "略下降（5-10%）", value: "slight" },
      { label: "明显下降（10-20%）", value: "moderate" },
      { label: "大幅下降（>20%）——无氧耐力或恢复不足", value: "big" },
      { label: "未测试", value: "unknown" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "sp09", type: "select", text: "您最接近哪种力-速曲线特征？",
    hint: "力量型=慢速大力量；速度型=快速轻负荷。Jiménez-Reyes等(2017)研究表明基于F-V曲线的个体化训练可显著提升弹跳表现",
    options: [
      { label: "力量主导型（深蹲强但跳跃不如力量预期——力-速曲线偏力端）", value: "force_dom" },
      { label: "速度主导型（跳跃好但最大力量相对弱——力-速曲线偏速端）", value: "velo_dom" },
      { label: "均衡型（力量与速度匹配良好）", value: "balanced" },
      { label: "不确定", value: "unknown" },
    ], required: true, dimension: "powerSpeed",
  },
  // F-V 专项评估
  {
    id: "sp10", type: "select", text: "您是否了解自己的力-速曲线（F-V Profile）不平衡方向？",
    hint: "力-速不平衡（F-Vimb）指你的发力特征偏离最佳曲线。Barrera-Domínguez等(2023)发现针对F-Vimb的个体化训练比传统训练更有效",
    options: [
      { label: "是——偏向力量不足（需要更多力量训练）", value: "force_deficit" },
      { label: "是——偏向速度不足（需要更多速度/增强式训练）", value: "velocity_deficit" },
      { label: "是——基本平衡", value: "balanced" },
      { label: "不清楚 / 未测试", value: "unknown" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "sp11", type: "select", text: "您的训练中力量训练与增强式训练的比例？",
    hint: "Sánchez-Sixto等(2021)研究表明力量+增强式结合训练优于纯增强式训练，能同时维持力量水平和提升跳跃表现",
    options: [
      { label: "以力量训练为主（>70%）", value: "strength_heavy" },
      { label: "力量与增强式各半（50/50）", value: "balanced" },
      { label: "以增强式为主（>70%）", value: "plyo_heavy" },
      { label: "不确定/无明确比例", value: "unknown" },
    ], required: false, dimension: "powerSpeed",
  },
  // ================================================================
  // 模块 5：柔韧性与活动度 (mobility)
  // ================================================================
  {
    id: "m01", type: "number", text: "坐位体前屈（Sit and Reach）成绩？",
    hint: "坐姿双腿伸直，指尖超过脚尖为正", unit: "cm",
    numberRange: { min: -30, max: 40 }, required: false, dimension: "mobility",
  },
  {
    id: "m02", type: "select", text: "踝关节背屈活动度（Weight-Bearing Lunge Test）？",
    hint: "膝盖靠墙测试：脚尖距墙最大距离。弹跳最关键关节活动度之一",
    options: [
      { label: "优秀（>13cm）", value: "excellent" },
      { label: "良好（10-13cm）", value: "good" },
      { label: "一般（6-10cm）——可能限制深蹲和起跳角度", value: "average" },
      { label: "受限（<6cm）——显著影响跳跃力学", value: "poor" },
      { label: "未测试", value: "unknown" },
    ], required: true, dimension: "mobility",
  },
  {
    id: "m03", type: "select", text: "髋关节屈曲活动度？",
    hint: "仰卧位抱膝贴胸，对侧腿保持伸直贴地",
    options: [
      { label: "优秀（轻松触胸，对侧腿无抬起）", value: "excellent" },
      { label: "良好", value: "good" },
      { label: "一般（对侧腿明显抬起）", value: "average" },
      { label: "受限", value: "poor" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m04", type: "select", text: "胸椎旋转活动度？",
    hint: "坐姿双臂交叉抱肩左右旋转——影响摆臂幅度",
    options: [
      { label: "优秀（>45°旋转，无不适）", value: "excellent" },
      { label: "良好（30-45°）", value: "good" },
      { label: "一般（<30°或有卡顿）", value: "average" },
      { label: "受限", value: "poor" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m05", type: "select", text: "腘绳肌柔韧性（ASLR 测试）？",
    hint: "仰卧直腿抬高 Active Straight Leg Raise",
    options: [
      { label: "优秀（>80°无骨盆后倾）", value: "excellent" },
      { label: "良好（60-80°）", value: "good" },
      { label: "一般（40-60°）", value: "average" },
      { label: "紧张（<40°）——显著限制跳跃幅度", value: "tight" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m06", type: "select", text: "单腿平衡与稳定性（闭眼单腿站立）？",
    options: [
      { label: "优秀（>60s，稳定无晃动）", value: "excellent" },
      { label: "良好（30-60s）", value: "good" },
      { label: "一般（10-30s）", value: "average" },
      { label: "较差（<10s或无法完成）——本体感觉不足", value: "poor" },
    ], required: true, dimension: "mobility",
  },
  {
    id: "m07", type: "select", text: "FMS 过头深蹲模式评分？",
    hint: "功能性动作筛查 Functional Movement Screen",
    options: [
      { label: "3分——完美执行", value: "3" },
      { label: "2分——能完成但有代偿", value: "2" },
      { label: "1分——无法完成基础动作", value: "1" },
      { label: "未做过 FMS", value: "unknown" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m08", type: "select", text: "Y-Balance 测试下肢结果？",
    hint: "YBT 预测下肢受伤风险的有效工具",
    options: [
      { label: "通过——三方向均衡且综合评分>95%", value: "passed" },
      { label: "存在不对称（>4cm差异）——受伤风险增加", value: "asymmetry" },
      { label: "综合评分偏低", value: "low" },
      { label: "未做过 YBT", value: "unknown" },
    ], required: false, dimension: "mobility",
  },
  // ================================================================
  // 模块 6：能量系统与耐力 (endurance)
  // ================================================================
  {
    id: "e01", type: "select", text: "有氧基础水平？",
    hint: "良好有氧基础=更好的组间恢复和训练耐受",
    options: [
      { label: "优秀（5km<22min 或 VO₂max 估计>50）", value: "excellent" },
      { label: "良好（5km 22-27min）", value: "good" },
      { label: "中等（5km 27-35min）", value: "average" },
      { label: "初级（5km>35min 或无法跑完3km）", value: "poor" },
    ], required: true, dimension: "endurance",
  },
  {
    id: "e02", type: "select", text: "无氧乳酸耐力水平？",
    hint: "高强度间歇后的恢复速度",
    options: [
      { label: "优秀（高强度间歇后 2min 内心率恢复 40+）", value: "excellent" },
      { label: "良好", value: "good" },
      { label: "一般（后半程力量下降明显）", value: "average" },
      { label: "较差（1-2组后即大幅下降）", value: "poor" },
    ], required: true, dimension: "endurance",
  },
  {
    id: "e03", type: "select", text: "单次训练课可持续高质量输出时长？",
    options: [
      { label: ">90min", value: "90+" },
      { label: "60-90min", value: "60-90" },
      { label: "30-60min", value: "30-60" },
      { label: "<30min", value: "<30" },
    ], required: true, dimension: "endurance",
  },
  {
    id: "e04", type: "select", text: "高强度训练后 DOMS 持续多久？",
    options: [
      { label: "1天——恢复极快", value: "1d" },
      { label: "2-3天——正常", value: "2-3d" },
      { label: "3-5天——偏慢", value: "3-5d" },
      { label: ">5天——恢复能力显著不足", value: "5d+" },
    ], required: false, dimension: "endurance",
  },
  {
    id: "e05", type: "select", text: "每周有氧/代谢训练频率？",
    options: [
      { label: "3次以上", value: "frequent" },
      { label: "1-2次", value: "occasional" },
      { label: "偶尔", value: "rare" },
      { label: "几乎不做", value: "never" },
    ], required: true, dimension: "endurance",
  },
  {
    id: "e06", type: "select", text: "早晨静息心率？",
    hint: "反映自主神经系统恢复状态",
    options: [
      { label: "<50 bpm——优秀", value: "<50" },
      { label: "50-60 bpm——良好", value: "50-60" },
      { label: "60-70 bpm——正常", value: "60-70" },
      { label: ">70 bpm——可能恢复不足", value: ">70" },
      { label: "不清楚", value: "unknown" },
    ], required: false, dimension: "endurance",
  },
  // ================================================================
  // 模块 7：训练经验与专项背景 (trainingHx)
  // ================================================================
  {
    id: "ex01", type: "select", text: "系统力量训练年限？",
    options: [
      { label: "5年以上——资深训练者", value: "5+" },
      { label: "3-5年", value: "3-5" },
      { label: "1-3年", value: "1-3" },
      { label: "6个月-1年", value: "0.5-1" },
      { label: "<6个月——新手", value: "<0.5" },
      { label: "从未系统训练", value: "never" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex02", type: "select", text: "弹跳专项训练经历？",
    options: [
      { label: "系统练过（Vert Code/PJF/Jump Manual等）", value: "systematic" },
      { label: "零散增强式训练经验", value: "casual" },
      { label: "只做过一般跳跃练习", value: "some" },
      { label: "从未做过弹跳专项", value: "never" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex03", type: "select", text: "当前训练频率与结构？",
    options: [
      { label: "系统训练：每周4-6天，有计划周期化安排", value: "structured" },
      { label: "规律训练：每周3-4天，有基本计划", value: "regular" },
      { label: "不规律：每周1-2天", value: "irregular" },
      { label: "目前中断/无训练", value: "none" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex04", type: "multiSelect", text: "主要运动/训练背景（可多选）？",
    options: [
      { label: "篮球", value: "basketball" },
      { label: "排球", value: "volleyball" },
      { label: "田径——跳跃项目", value: "track_jump" },
      { label: "田径——短跑/跨栏", value: "track_sprint" },
      { label: "足球", value: "football" },
      { label: "举重/力量举", value: "weightlifting" },
      { label: "CrossFit/功能性训练", value: "crossfit" },
      { label: "格斗/武术", value: "martial" },
      { label: "健身/健美", value: "bodybuilding" },
      { label: "其他运动", value: "other" },
      { label: "无特定运动背景", value: "none" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex05", type: "multiSelect", text: "伤病史（可多选）？",
    hint: "诚实填写——直接影响训练安全性设计",
    options: [
      { label: "髌腱炎（Jumper's Knee）", value: "patellar" },
      { label: "ACL损伤/重建", value: "acl" },
      { label: "半月板损伤", value: "meniscus" },
      { label: "踝关节扭伤（反复/严重）", value: "ankle" },
      { label: "跟腱炎/跟腱病变", value: "achilles" },
      { label: "足底筋膜炎", value: "plantar" },
      { label: "胫骨骨膜炎（Shin Splints）", value: "shin" },
      { label: "应力性骨折", value: "stress_fx" },
      { label: "下背痛/腰椎间盘", value: "lowback" },
      { label: "髋关节撞击/FAI", value: "hip" },
      { label: "肩部伤病", value: "shoulder" },
      { label: "以上均无", value: "none" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex06", type: "select", text: "最近一次伤病距今多久？",
    options: [
      { label: "目前仍在伤病/康复期", value: "current" },
      { label: "<3个月——近期伤病，需谨慎", value: "<3m" },
      { label: "3-6个月——过渡期", value: "3-6m" },
      { label: "6-12个月", value: "6-12m" },
      { label: ">1年——已完全恢复", value: ">1y" },
      { label: "无伤病史", value: "never" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex07", type: "select", text: "训练前热身习惯？",
    options: [
      { label: "系统热身：15min+ RAMP原则（激活→有氧→动态拉伸→神经激活→专项准备）", value: "ramp" },
      { label: "充分热身：10-15min 有氧+动态拉伸+激活", value: "good" },
      { label: "简单热身：5min 跑跳+简略拉伸", value: "brief" },
      { label: "基本不热身——高风险", value: "never" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex08", type: "select", text: "训练后整理与恢复习惯？",
    options: [
      { label: "系统整理：15min+ 低强度有氧+静态拉伸+泡沫轴+必要时冰敷", value: "systematic" },
      { label: "基本整理：10min 拉伸+泡沫轴", value: "basic" },
      { label: "偶尔做", value: "sometimes" },
      { label: "基本不做——影响恢复", value: "never" },
    ], required: true, dimension: "trainingHx",
  },
  {
    id: "ex09", type: "select", text: "是否做过专业力量/爆发力测试？",
    options: [
      { label: "有——专业设备（GymAware/Force Plate等）", value: "pro" },
      { label: "有——基本测试（My Jump App/秒表等）", value: "basic" },
      { label: "从未测试", value: "never" },
    ], required: false, dimension: "trainingHx",
  },
  {
    id: "ex10", type: "select", text: "训练日志习惯？",
    options: [
      { label: "详细记录（重量/组数/次数/RPE/感受）", value: "detailed" },
      { label: "简单记录主要数据", value: "basic" },
      { label: "偶尔记", value: "sometimes" },
      { label: "从不记录——难以追踪进步", value: "never" },
    ], required: false, dimension: "trainingHx",
  },
  // ================================================================
  // 模块 8：营养、恢复与生活方式 (lifestyle)
  // ================================================================
  {
    id: "l01", type: "select", text: "每天平均睡眠时长？",
    options: [
      { label: "8-9小时——理想恢复区间", value: "8-9" },
      { label: "7-8小时——可接受", value: "7-8" },
      { label: "6-7小时——略不足", value: "6-7" },
      { label: "<6小时——严重影响恢复与表现", value: "<6" },
    ], required: true, dimension: "lifestyle",
  },
  {
    id: "l02", type: "select", text: "睡眠质量？",
    options: [
      { label: "优秀（入睡<15min，整夜不醒，精力充沛）", value: "excellent" },
      { label: "良好（偶尔醒来但能快速入睡）", value: "good" },
      { label: "一般（入睡困难或多醒）", value: "average" },
      { label: "差（严重失眠或醒后极度疲劳）", value: "poor" },
    ], required: true, dimension: "lifestyle",
  },
  {
    id: "l03", type: "select", text: "日常营养质量？",
    hint: "弹跳训练需蛋白质 1.6-2.2g/kg/d 和充足碳水",
    options: [
      { label: "很讲究——计算宏量营养素，注重训练前后营养时机", value: "strict" },
      { label: "比较注意——大致均衡", value: "moderate" },
      { label: "一般——不特别注意", value: "average" },
      { label: "不太好——不规律，蛋白质明显不足", value: "poor" },
    ], required: true, dimension: "lifestyle",
  },
  {
    id: "l04", type: "slider", text: "当前生活/学业/工作压力水平？",
    hint: "1=几乎无压力，10=极大压力。高皮质醇直接影响恢复和训练效果",
    sliderRange: { min: 1, max: 10, step: 1 },
    sliderLabels: { min: "无压力", max: "极大压力" },
    required: true, dimension: "lifestyle",
  },
  {
    id: "l05", type: "select", text: "是否使用烟草？",
    options: [
      { label: "不吸烟", value: "no" },
      { label: "偶尔", value: "occasional" },
      { label: "经常——显著影响心肺和恢复", value: "frequent" },
    ], required: true, dimension: "lifestyle",
  },
  {
    id: "l06", type: "select", text: "饮酒频率？",
    hint: "酒精干扰蛋白质合成、睾酮和睡眠——对弹跳训练影响显著",
    options: [
      { label: "不喝酒", value: "no" },
      { label: "偶尔（社交场合，月1-2次）", value: "rare" },
      { label: "每周1-2次", value: "weekly" },
      { label: "每周3次以上——可能影响训练适应", value: "frequent" },
    ], required: true, dimension: "lifestyle",
  },
  {
    id: "l07", type: "multiSelect", text: "常用恢复手段（可多选）？",
    options: [
      { label: "泡沫轴/筋膜枪（SMR）", value: "smr" },
      { label: "静态/动态拉伸", value: "stretch" },
      { label: "运动按摩/理疗", value: "massage" },
      { label: "冷热交替浴/冰浴", value: "contrast" },
      { label: "压缩衣/气压恢复", value: "compression" },
      { label: "冥想/正念/呼吸训练", value: "meditation" },
      { label: "营养补剂（蛋白粉/肌酸等）", value: "supplements" },
      { label: "无特别恢复手段", value: "none" },
    ], required: true, dimension: "lifestyle",
  },
  {
    id: "l08", type: "select", text: "每天久坐时间（学习/工作）？",
    hint: "久坐→髋屈肌缩短→臀肌抑制→对跳跃力学不利",
    options: [
      { label: "<4小时", value: "<4" },
      { label: "4-8小时", value: "4-8" },
      { label: "8-12小时", value: "8-12" },
      { label: ">12小时——需注意髋屈肌紧张问题", value: "12+" },
    ], required: true, dimension: "lifestyle",
  },
  {
    id: "l09", type: "select", text: "是否有规律的主动恢复日？",
    options: [
      { label: "每周1-2天——系统恢复安排", value: "regular" },
      { label: "偶尔低强度活动", value: "occasional" },
      { label: "休息日完全不动", value: "sedentary" },
      { label: "几乎无休息日——过度训练风险", value: "over" },
    ], required: false, dimension: "lifestyle",
  },
  {
    id: "l10", type: "select", text: "是否使用运动补剂？",
    options: [
      { label: "有——系统补充（蛋白粉+肌酸+其他）", value: "systematic" },
      { label: "有——基础补充", value: "basic" },
      { label: "不使用补剂", value: "none" },
    ], required: false, dimension: "lifestyle",
  },
  // ================================================================
  // 模块 9：可用训练资源与目标 (availability)
  // ================================================================
  {
    id: "a01", type: "select", text: "每周可用于训练的天数？",
    options: [
      { label: "6-7天——充足训练窗口", value: "6-7" },
      { label: "4-5天——理想频率", value: "4-5" },
      { label: "3天——基本够用", value: "3" },
      { label: "2天——需高效安排", value: "2" },
      { label: "1天——严重受限", value: "1" },
    ], required: true, dimension: "availability",
  },
  {
    id: "a02", type: "select", text: "每次训练可用时长？",
    options: [
      { label: "2小时以上——充分", value: "120+" },
      { label: "1.5-2小时——良好", value: "90-120" },
      { label: "1-1.5小时——可接受", value: "60-90" },
      { label: "45-60分钟——需精简高效", value: "45-60" },
      { label: "<45分钟——严重受限", value: "<45" },
    ], required: true, dimension: "availability",
  },
  {
    id: "a03", type: "select", text: "训练场地与设备条件？",
    options: [
      { label: "专业体能训练中心——全套杠铃/哑铃/增强式设备/测力设备", value: "pro" },
      { label: "标准商业健身房——杠铃/哑铃/有氧设备", value: "gym" },
      { label: "家庭健身房——基础杠铃/哑铃/弹力带", value: "home_gym" },
      { label: "几乎无器械——自重训练为主", value: "bodyweight" },
    ], required: true, dimension: "availability",
  },
  {
    id: "a04", type: "number", text: "期望达到的垂直弹跳目标（CMJ）？",
    hint: "设定 SMART 目标：具体、可测量、可达、相关、有时限", unit: "cm",
    numberRange: { min: 30, max: 150 }, required: true, dimension: "availability",
  },
  {
    id: "a05", type: "select", text: "训练首要目标？",
    options: [
      { label: "最大化垂直弹跳高度", value: "max_jump" },
      { label: "综合运动表现（弹跳+速度+敏捷）", value: "performance" },
      { label: "提升力量与爆发力基础", value: "power" },
      { label: "改善身体素质+降低受伤风险+弹跳", value: "health" },
      { label: "减脂塑形+发展弹跳", value: "bodycomp" },
    ], required: true, dimension: "availability",
  },
  {
    id: "a06", type: "number", text: "期望在多少周内看到明显进步？",
    hint: "生理适应周期：神经2-4周，肌肥大4-8周，力量峰值8-12周", unit: "周",
    numberRange: { min: 4, max: 52 }, required: true, dimension: "availability",
  },
  {
    id: "a07", type: "select", text: "是否有教练/训练伙伴？",
    options: [
      { label: "有专业教练指导", value: "coach" },
      { label: "有固定训练伙伴", value: "partner" },
      { label: "独自训练", value: "solo" },
    ], required: false, dimension: "availability",
  },
  {
    id: "a08", type: "select", text: "能接受的最大训练 RPE？",
    hint: "RPE 1-10：有效弹跳训练通常需 7-9",
    options: [
      { label: "RPE 9-10——愿挑战极限", value: "max" },
      { label: "RPE 7-8——高强度但保留余力", value: "high" },
      { label: "RPE 5-6——中等强度", value: "moderate" },
      { label: "RPE <5——偏好轻松训练", value: "low" },
    ], required: true, dimension: "availability",
  },
  {
    id: "a09", type: "select", text: "您是否熟悉举重类动作（高翻、抓举、挺举等）？",
    hint: "不熟悉的话AI会推荐效果相近的替代动作，无需勉强",
    options: [
      { label: "非常熟悉，能标准完成", value: "proficient" },
      { label: "略懂，动作还不够标准", value: "novice" },
      { label: "完全不会/没接触过", value: "never" },
    ], required: true, dimension: "trainingHx",
  },
];

// ---- 辅助函数 ----
export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}

export const questionsByDimension: Record<string, string[]> = {};
allQuestions.forEach((q) => {
  if (!questionsByDimension[q.dimension]) questionsByDimension[q.dimension] = [];
  questionsByDimension[q.dimension].push(q.id);
});
