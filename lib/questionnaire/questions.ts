// ============================================================
// 弹跳训练专业评估问卷
// 基于 NSCA, FMS, YBT, Force-Velocity Profiling 等运动科学标准
// ============================================================

import { Question } from "./types";

export const allQuestions: Question[] = [

  // ================================================================
  // 模块 1：基础身体信息与运动背景 (anthropometry)
  // ================================================================
  {
    id: "b01", type: "number", text: "你的年龄是多少岁？（请填写周岁）",
    hint: "年龄影响恢复速度、训练强度上限与适应性窗口",
    unit: "岁", numberRange: { min: 0, max: 120 },
    required: true, dimension: "anthropometry",
  },
  {
    id: "b02", type: "select", text: "你的性别是？",
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
    required: true, dimension: "anthropometry",
  },
  {
    id: "b03", type: "number", text: "你的裸足身高是多少厘米？",
    hint: "赤足、靠墙、用硬尺压头顶标记，测量地面至标记点距离",
    unit: "cm", numberRange: { min: 50, max: 250 },
    required: true, dimension: "anthropometry",
  },
  {
    id: "b04", type: "number", text: "你目前的体重是多少公斤？（空腹、晨起、赤足称重）",
    hint: "晨起排尿后、早餐前称重，连续3次取平均",
    unit: "kg", numberRange: { min: 20, max: 200 },
    required: true, dimension: "anthropometry",
  },
  {
    id: "b05", type: "select", text: "你的体脂率大约是多少？（按体感估算）",
    hint: "无需精确测量，选择最接近你体感状态的选项",
    options: [
      { label: "非常低 — 腹肌清晰可见，血管明显（男≤8%，女≤16%）", value: "very_low" },
      { label: "较低 — 腹肌可见但无血管（男9-12%，女17-20%）", value: "low" },
      { label: "一般 — 腹部平坦，无明显腹肌线条（男13-18%，女21-28%）", value: "average" },
      { label: "较高 — 腹部有赘肉（男19-25%，女29-35%）", value: "high" },
      { label: "很高 — 明显肥胖（男>25%，女>35%）", value: "very_high" },
    ],
    required: true, dimension: "anthropometry",
  },
  {
    id: "b06", type: "number", text: "你进行系统性力量/爆发力/跳跃训练（非普通体育课或娱乐玩耍）已有多少年？",
    hint: "可填小数，如 0.5 年。新手 <1年，中级 1-3年，高级 >3年",
    unit: "年", numberRange: { min: 0, max: 30 },
    required: true, dimension: "trainingHx",
  },
  {
    id: "b07", type: "select", text: "你目前最主要参与的运动项目是？",
    options: [
      { label: "篮球", value: "basketball" },
      { label: "排球", value: "volleyball" },
      { label: "田径（跳高/跳远/三级跳）", value: "track_jump" },
      { label: "田径（短跑）", value: "track_sprint" },
      { label: "足球", value: "football" },
      { label: "体操/跑酷", value: "gymnastics" },
      { label: "健身/无专项", value: "general_fitness" },
      { label: "其他", value: "other" },
    ],
    required: true, dimension: "anthropometry",
  },
  {
    id: "b08", type: "number", text: "平均每周所有体育活动的总时间大约是多少小时？",
    hint: "包括训练、比赛、跑步、打球、健身等所有体育活动",
    unit: "小时/周", numberRange: { min: 0.5, max: 40 },
    required: true, dimension: "trainingHx",
  },
  {
    id: "b09", type: "select", text: "你是否有过至少2年规律的跳跃类运动经验？（篮球/排球/田径跳跃等）",
    options: [
      { label: "是 — 有至少2年跳跃类运动经历", value: "yes" },
      { label: "否 — 没有或不足2年", value: "no" },
    ],
    required: true, dimension: "trainingHx",
  },
  {
    id: "b10", type: "number", text: "你最近一次测得的站立垂直跳（有反向摆臂）高度是多少？",
    hint: "侧对墙，站立摸高标记，全力跳起摸高，两标记垂直距离。做3次取最佳。未测过可填 0",
    unit: "cm", numberRange: { min: 0, max: 150 },
    required: false, dimension: "powerSpeed",
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
  // 模块 2：力量素质 (maxStrength) — 10题
  // ================================================================
  {
    id: "s01", type: "number", text: "杠铃深蹲（平行或略低）1RM是多少公斤？",
    hint: "若未测1RM，请填3-5次最大重量，系统将估算。标准深度：髋折痕低于膝盖骨上缘",
    unit: "kg", numberRange: { min: 0, max: 400 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s02", type: "select", text: "深蹲形式与深度（选择最常用的）",
    options: [
      { label: "高杠/肩同宽/平行或略低（推荐）", value: "highbar_parallel" },
      { label: "低杠/宽站距/半蹲", value: "lowbar_half" },
      { label: "前蹲/肩同宽/平行", value: "front_parallel" },
      { label: "全蹲（大腿后侧触小腿）", value: "full_squat" },
      { label: "1/4蹲", value: "quarter" },
    ], required: false, dimension: "maxStrength",
  },
  {
    id: "s03", type: "select", text: "站姿提踵：能否用1.5倍体重完成20次？",
    options: [
      { label: "可以轻松完成", value: "easy" },
      { label: "可以完成但比较吃力", value: "hard" },
      { label: "无法完成", value: "cannot" },
      { label: "未测试过", value: "unknown" },
    ], required: false, dimension: "maxStrength",
  },
  {
    id: "s04", type: "select", text: "保加利亚分腿蹲：单侧负重0.5倍体重能否完成8次？",
    hint: "后脚放在40-50cm高凳上，前脚距离足够远使后膝近触地",
    options: [
      { label: "可以，每侧都能轻松完成", value: "easy_both" },
      { label: "可以完成，但较吃力或左右侧差异大", value: "uneven" },
      { label: "无法完成", value: "cannot" },
      { label: "未测试过", value: "unknown" },
    ], required: false, dimension: "maxStrength",
  },
  {
    id: "s05", type: "select", text: "单腿深蹲（自重）：能否单腿下蹲至大腿平行地面并站起？",
    options: [
      { label: "可以，每侧都能≥5次", value: "easy_5plus" },
      { label: "只能完成1-4次", value: "limited" },
      { label: "无法完成，需借助支撑", value: "assisted" },
      { label: "完全无法完成", value: "cannot" },
      { label: "未测试过", value: "unknown" },
    ], required: false, dimension: "maxStrength",
  },
  {
    id: "s06", type: "number", text: "罗马尼亚硬拉（RDL）1RM是多少公斤？",
    hint: "微屈膝，杠铃沿小腿下放至小腿中部，臀肌发力拉回。若未测1RM可填3-5RM",
    unit: "kg", numberRange: { min: 0, max: 400 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s07", type: "select", text: "俯卧伸髋测试：俯卧单腿伸直上抬，能抬起多少度？",
    options: [
      { label: ">20度（大腿明显离开地面）", value: "gt20" },
      { label: "10-20度", value: "10to20" },
      { label: "<10度（臀大肌激活不足）", value: "lt10" },
      { label: "未测试过", value: "unknown" },
    ], required: false, dimension: "maxStrength",
  },
  {
    id: "s08", type: "number", text: "每周进行几次下肢力量训练（深蹲/硬拉/分腿蹲等）？",
    unit: "次/周", numberRange: { min: 0, max: 7 }, required: false, dimension: "maxStrength",
  },
  {
    id: "s09", type: "select", text: "过去3个月深蹲最大重量变化趋势？",
    options: [
      { label: "持续增长（每月增加≥5%）", value: "growing_fast" },
      { label: "缓慢增长（每月增加2-5%）", value: "growing_slow" },
      { label: "基本稳定", value: "stable" },
      { label: "下降或停滞", value: "declining" },
      { label: "刚开始训练，不清楚", value: "just_started" },
    ], required: true, dimension: "maxStrength",
  },
  {
    id: "s10", type: "multiSelect", text: "力量训练中是否出现过以下部位疼痛？",
    options: [
      { label: "无疼痛", value: "none" },
      { label: "膝盖前方（髌腱/髌股）", value: "knee_front" },
      { label: "下背部", value: "lowback" },
      { label: "臀部/髋关节", value: "hip" },
      { label: "跟腱", value: "achilles" },
      { label: "小腿前侧（胫骨）", value: "shin" },
    ], required: true, dimension: "maxStrength",
  },
  // ================================================================
  // 模块 3：垂直跳表现与爆发力赤字 (powerSpeed) — 11题
  // ================================================================
  {
    id: "sp01", type: "number", text: "站立垂直跳（有反向摆臂）最高高度？",
    hint: "侧对墙，站立摸高标记，全力跳起摸高，两标记垂直距离。做3次取最佳",
    unit: "cm", numberRange: { min: 0, max: 150 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp02", type: "number", text: "跑动双腿跳（3-5步助跑）垂直跳高度？",
    hint: "3-5步助跑后双脚起跳摸高，做3次取最佳",
    unit: "cm", numberRange: { min: 0, max: 150 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp03", type: "number", text: "跑动单腿跳（上篮式助跑单脚起跳）高度？",
    hint: "3-5步助跑单脚起跳摸高，记录起跳腿（左/右）",
    unit: "cm", numberRange: { min: 0, max: 150 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp04", type: "number", text: "深度跳（30-45cm跳箱落下→反弹起跳）高度？",
    hint: "从30-45cm箱自然迈下，双脚着地后立即全力向上跳起，做3次取最佳",
    unit: "cm", numberRange: { min: 0, max: 150 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp05", type: "select", text: "深度跳触地时间（可选，需跳垫或视频分析）",
    options: [
      { label: "<0.2秒（200ms）——踝关节刚度优秀", value: "lt200ms" },
      { label: "0.2-0.25秒", value: "200to250" },
      { label: ">0.25秒——踝关节刚度不足", value: "gt250ms" },
      { label: "无测量条件，跳过", value: "unknown" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "sp06", type: "number", text: "连续膝胸跳（Tuck Jump）：能完成多少次质量良好的？",
    hint: "原地连续跳，每次空中膝盖提至胸部，记录到动作变形为止",
    unit: "次", numberRange: { min: 0, max: 30 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp07", type: "number", text: "连续踝跳（直腿，仅用踝关节）：能完成多少次？",
    hint: "直立双腿伸直，仅用踝关节发力原地跳，记录到足跟触地为止",
    unit: "次", numberRange: { min: 0, max: 50 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp08", type: "number", text: "立定跳远距离？",
    hint: "双脚起跳向前跳远，以脚跟落地最近点测量，做3次取最佳",
    unit: "cm", numberRange: { min: 0, max: 400 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp09", type: "number", text: "30米冲刺跑时间？（可选）",
    hint: "站立式起跑全速跑30米，使用秒表或光门计时",
    unit: "秒", numberRange: { min: 2.5, max: 8 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "sp10", type: "select", text: "垂直跳测试一致性：不同日期测试成绩差异大吗？",
    options: [
      { label: "差异很小（<5%）", value: "stable" },
      { label: "差异中等（5-10%）", value: "moderate" },
      { label: "差异较大（>10%）", value: "unstable" },
      { label: "未关注/未多次测试", value: "unknown" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "sp11", type: "select", text: "增强式训练后通常需要几天完全恢复？",
    options: [
      { label: "1天以内", value: "1d" },
      { label: "2天", value: "2d" },
      { label: "3-4天", value: "3to4d" },
      { label: "≥5天", value: "5dplus" },
      { label: "从未进行过增强式训练", value: "never" },
    ], required: false, dimension: "powerSpeed",
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
  // 模块 5：灵活性/活动度 (mobility) — 10题
  // ================================================================
  {
    id: "m01", type: "select", text: "踝背屈活动度测试（Knee-to-Wall）：脚尖到墙距离？",
    hint: "赤足脚尖贴墙后移脚，屈膝触墙。≥10cm为良好，<8cm为受限",
    options: [
      { label: ">10cm（优秀）", value: "gt10" },
      { label: "8-10cm（良好）", value: "8to10" },
      { label: "5-7cm（一般）", value: "5to7" },
      { label: "<5cm（受限）", value: "lt5" },
      { label: "无法触墙", value: "none" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m02", type: "select", text: "深蹲时足跟是否会不自觉抬起离地？",
    options: [
      { label: "从不抬起", value: "never" },
      { label: "偶尔抬起（尤其最低点）", value: "sometimes" },
      { label: "经常抬起", value: "often" },
      { label: "必须垫高足跟才能完成标准深蹲", value: "must_elevate" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m03", type: "select", text: "深蹲最低点时下背部是否会明显圆起（腰椎屈曲）？",
    options: [
      { label: "始终保持平直或微反弓", value: "flat" },
      { label: "偶尔在最低点圆起", value: "sometimes" },
      { label: "经常圆起，需刻意控制", value: "often" },
      { label: "即使刻意控制也无法避免", value: "unavoidable" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m04", type: "select", text: "坐姿体前屈：手指能否触到脚尖？",
    options: [
      { label: "手腕超过脚尖（柔韧性优秀）", value: "excellent" },
      { label: "指尖触到脚尖", value: "touch" },
      { label: "指尖距脚尖5-10cm", value: "5to10" },
      { label: "指尖距脚尖>10cm", value: "gt10" },
      { label: "未测试过", value: "unknown" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m05", type: "select", text: "托马斯测试：仰卧抱单膝至胸前，对侧大腿能否后伸至水平面以下？",
    hint: "检测髋屈肌（髂腰肌）紧张度",
    options: [
      { label: "可以，大腿自然下落至水平以下", value: "pass" },
      { label: "大腿与床面平行，无法再下落", value: "parallel" },
      { label: "大腿上抬（高于水平面）——髋屈肌过紧", value: "tight" },
      { label: "未测试过", value: "unknown" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m06", type: "select", text: "过顶深蹲：双手举轻杆过头顶，能否保持手臂在耳后且躯干直立？",
    options: [
      { label: "可以，手臂保持在耳后，躯干直立", value: "pass" },
      { label: "手臂前移，但躯干仍能保持", value: "arms_forward" },
      { label: "手臂前移且躯干明显前倾", value: "lean_forward" },
      { label: "无法完成过顶深蹲", value: "cannot" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m07", type: "select", text: "髋内/外旋范围（坐姿屈膝90°）？",
    options: [
      { label: "外旋≥45°且内旋≥45°", value: "both_good" },
      { label: "外旋或内旋一个方向受限", value: "one_limited" },
      { label: "两个方向都受限", value: "both_limited" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m08", type: "number", text: "闭眼单腿站立：能保持稳定多少秒？",
    hint: "赤足闭眼单腿站立双手叉腰，记录到脚移动或明显晃动为止",
    unit: "秒", numberRange: { min: 0, max: 120 }, required: false, dimension: "mobility",
  },
  {
    id: "m09", type: "multiSelect", text: "通常在哪些情况下感到身体僵硬？",
    options: [
      { label: "早起后", value: "morning" },
      { label: "长时间坐着后", value: "sitting" },
      { label: "训练后第二天", value: "post_training" },
      { label: "很少感到僵硬", value: "rarely" },
    ], required: false, dimension: "mobility",
  },
  {
    id: "m10", type: "select", text: "每周进行专门灵活性/活动度训练（拉伸/泡沫轴/瑜伽等）的频率？",
    options: [
      { label: "每周≥4次", value: "ge4" },
      { label: "每周2-3次", value: "2to3" },
      { label: "每周1次", value: "1" },
      { label: "每月1-2次", value: "monthly" },
      { label: "几乎不做", value: "never" },
    ], required: false, dimension: "mobility",
  },
  // ================================================================
  // 模块 6：反应力量与增强式专项 (reactivePlyo) — 10题
  // ================================================================
  {
    id: "r01", type: "select", text: "你对跳深（Depth Jump）的熟悉程度？",
    options: [
      { label: "从未做过", value: "never" },
      { label: "做过但很少（<6次/月）", value: "rarely" },
      { label: "经常做（1-2次/周）", value: "regular" },
      { label: "系统训练过（>3个月规律练习）", value: "trained" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "r02", type: "select", text: "单腿跳深：从低箱落下单脚着地后立即反弹起跳，能完成吗？",
    options: [
      { label: "可以，左右腿都能完成且轻盈", value: "both_easy" },
      { label: "只能优势腿完成", value: "dominant_only" },
      { label: "尝试过但无法控制落地", value: "cannot_control" },
      { label: "从未尝试", value: "never" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "r03", type: "select", text: "跨栏跳深：从箱落下后跳过面前跨栏，能完成吗？",
    options: [
      { label: "经常做，能轻松跳过小腿高度", value: "easy" },
      { label: "偶尔做，只能跳过低障碍（<20cm）", value: "low_only" },
      { label: "试过但无法完成", value: "cannot" },
      { label: "从未尝试", value: "never" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "r04", type: "number", text: "单腿侧向连续跳：能连续跳过地面直线或低障碍（<10cm）多少次？",
    hint: "左右腿分别测试，记录较少一侧的次数",
    unit: "次", numberRange: { min: 0, max: 30 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "r05", type: "number", text: "立定三级跳远（左右左或右左右连续跨步跳）总距离？",
    unit: "cm", numberRange: { min: 0, max: 1200 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "r06", type: "select", text: "增强式训练后需要几天完全恢复？",
    options: [
      { label: "1天以内", value: "1d" },
      { label: "2天", value: "2d" },
      { label: "3-4天", value: "3to4d" },
      { label: "≥5天", value: "5dplus" },
      { label: "从未进行过增强式", value: "never" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "r07", type: "multiSelect", text: "增强式训练中是否出现过以下部位疼痛？",
    options: [
      { label: "无疼痛", value: "none" },
      { label: "跟腱", value: "achilles" },
      { label: "膝盖前方（髌腱）", value: "patellar" },
      { label: "胫骨前侧（骨膜炎）", value: "shin" },
      { label: "足底筋膜", value: "plantar" },
      { label: "下背部", value: "lowback" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "r08", type: "select", text: "增强式训练通常在哪里进行？",
    options: [
      { label: "木质篮球场/健身房（推荐）", value: "wood" },
      { label: "水泥/沥青（高冲击风险）", value: "concrete" },
      { label: "草地或塑胶跑道（最佳）", value: "grass" },
      { label: "家用地砖/地毯", value: "indoor" },
    ], required: false, dimension: "powerSpeed",
  },
  {
    id: "r09", type: "number", text: "每周专门增强式训练次数？",
    hint: "推荐：中级1-2次/周，每次40-80触地；高级2次/周，每次60-100触地",
    unit: "次/周", numberRange: { min: 0, max: 7 }, required: false, dimension: "powerSpeed",
  },
  {
    id: "r10", type: "number", text: "每次增强式训练约多少次触地（跳跃/着地次数）？",
    unit: "次", numberRange: { min: 0, max: 300 }, required: false, dimension: "powerSpeed",
  },
  // ================================================================
  // 模块 7：臀肌功能 (glute) — 10题
  // ================================================================
  {
    id: "g01", type: "select", text: "你是否能主动感受到臀肌在深蹲/跳跃中的收缩参与？",
    hint: "许多运动员存在臀肌抑制（glute amnesia），无法在发力中激活臀肌",
    options: [
      { label: "能清晰感受到臀肌主导发力", value: "yes_clear" },
      { label: "偶尔能感觉到，但股四头肌主导", value: "sometimes" },
      { label: "几乎感觉不到臀肌，主要靠大腿发力", value: "rarely" },
      { label: "不确定/没注意过", value: "unknown" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g02", type: "select", text: "杠铃臀推（Barbell Hip Thrust）1RM 或常用重量？",
    options: [
      { label: ">2倍体重——强大", value: "gt2x" },
      { label: "1.5-2倍体重——良好", value: "1.5-2x" },
      { label: "1-1.5倍体重——基础水平", value: "1-1.5x" },
      { label: "<1倍体重——需加强", value: "lt1x" },
      { label: "未测试/从未做过此动作", value: "unknown" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g03", type: "select", text: "单腿臀桥（Single-Leg Glute Bridge）：能否标准完成10次且臀肌发力明显？",
    options: [
      { label: "可以，双侧均轻松完成，臀肌灼烧感明显", value: "easy_both" },
      { label: "可以完成10次，但动作不稳或一侧明显弱", value: "asymmetry" },
      { label: "只能完成5-10次，且股四头/腘绳肌代偿", value: "struggle" },
      { label: "无法标准完成单腿臀桥", value: "cannot" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g04", type: "select", text: "侧卧髋外展（臀中肌）：能否标准完成 15次/侧 且有明显灼烧感？",
    hint: "臀中肌薄弱→膝内扣（valgus）→跳跃落地时ACL损伤风险增加",
    options: [
      { label: "可以，双侧均标准完成且臀中肌孤立发力", value: "yes" },
      { label: "能完成但需代偿（侧腰/阔筋膜张肌）", value: "compensation" },
      { label: "只能完成<10次或无法标准执行", value: "struggle" },
      { label: "从未做过此测试", value: "unknown" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g05", type: "select", text: "俯卧单腿伸髋（Prone Hip Extension）：能否标准完成 15次/侧？",
    hint: "检测臀大肌上束和腘绳肌协调——跳跃中 hip hyperextension 的关键",
    options: [
      { label: "可以，臀大肌主导，无下背代偿", value: "clean" },
      { label: "可以完成但下背/腘绳肌代偿明显", value: "compensation" },
      { label: "只能完成<10次或动作不稳定", value: "struggle" },
      { label: "从未做过此测试", value: "unknown" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g06", type: "select", text: "深蹲/硬拉时髋铰链（Hip Hinge）质量？",
    options: [
      { label: "优秀——髋主导发力，下背始终保持中立", value: "excellent" },
      { label: "良好——偶尔下背代偿但意识后可纠正", value: "good" },
      { label: "一般——经常下背代偿或骨盆后倾", value: "average" },
      { label: "差——无法区分髋铰链与下蹲", value: "poor" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g07", type: "select", text: "跳跃后第二天臀肌是否有明显酸痛？",
    options: [
      { label: "经常——臀肌酸痛明显，说明有效参与发力", value: "often" },
      { label: "偶尔——取决于训练强度", value: "sometimes" },
      { label: "很少——通常酸的是大腿/膝盖/下背", value: "rarely" },
      { label: "从未酸痛——臀肌可能未被有效激活", value: "never" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g08", type: "select", text: "每周专门臀肌训练（臀推/臀桥/髋外展/RDL等）频率？",
    options: [
      { label: "每周≥3次——专门安排臀肌训练日", value: "ge3" },
      { label: "每周2次", value: "2" },
      { label: "每周1次", value: "1" },
      { label: "很少/只在力量训练中顺带练", value: "rarely" },
      { label: "从不专门练臀肌", value: "never" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g09", type: "select", text: "单腿站立能否保持骨盆水平（无对侧骨盆下沉）？",
    hint: "Trendelenburg 测试——反映臀中肌功能性力量",
    options: [
      { label: "可以，双侧均稳如磐石", value: "stable_both" },
      { label: "一侧明显比另一侧差（骨盆倾斜）", value: "asymmetry" },
      { label: "双侧均不稳——臀中肌功能性严重不足", value: "unstable" },
      { label: "未测试过", value: "unknown" },
    ], required: false, dimension: "glute",
  },
  {
    id: "g10", type: "select", text: "你是否出现过因臀肌无力导致的代偿问题？",
    options: [
      { label: "无——臀肌功能良好", value: "none" },
      { label: "膝内扣（跳跃/深蹲时膝盖向内塌）", value: "valgus" },
      { label: "下背痛（髋伸时代偿性腰椎前凸）", value: "lowback" },
      { label: "腘绳肌频繁拉伤（臀肌不发力→腘绳肌过载）", value: "hamstring" },
      { label: "不确定", value: "unknown" },
    ], required: false, dimension: "glute",
  },
  // ================================================================
  // 模块 8：伤病历史与风险管理 (injury) — 10题
  // ================================================================
  {
    id: "i01", type: "multiSelect", text: "过往是否有过以下伤病（导致停训≥2周）？",
    options: [
      { label: "以上均无——无重大伤病史", value: "none" },
      { label: "髌腱炎/跳跃膝（Jumper's Knee）", value: "patellar" },
      { label: "ACL 损伤/撕裂", value: "acl" },
      { label: "半月板撕裂/损伤", value: "meniscus" },
      { label: "踝关节韧带损伤（反复扭伤）", value: "ankle" },
      { label: "跟腱炎/跟腱病变", value: "achilles" },
      { label: "胫骨骨膜炎（Shin Splints）", value: "shin" },
      { label: "足底筋膜炎", value: "plantar" },
      { label: "应力性骨折", value: "stress_fx" },
      { label: "下背痛/腰椎间盘突出", value: "lowback" },
      { label: "髋关节撞击/盂唇撕裂", value: "hip" },
    ], required: true, dimension: "injury",
  },
  {
    id: "i02", type: "select", text: "最新一次伤病距今多久？",
    options: [
      { label: "目前仍在伤病期/康复中", value: "current" },
      { label: "<3个月——近期伤病，组织尚未完全重塑", value: "lt3m" },
      { label: "3-6个月——过渡期，需渐进负荷", value: "3to6m" },
      { label: "6-12个月——已基本恢复", value: "6to12m" },
      { label: ">1年——充分恢复", value: "gt1y" },
      { label: "无伤病史", value: "never" },
    ], required: true, dimension: "injury",
  },
  {
    id: "i03", type: "multiSelect", text: "当前是否在以下部位有持续疼痛或不适？",
    options: [
      { label: "无——当前无疼痛", value: "none" },
      { label: "膝盖前侧（髌腱/髌骨）", value: "knee_front" },
      { label: "膝盖内侧/外侧", value: "knee_side" },
      { label: "跟腱/足跟", value: "achilles" },
      { label: "胫骨前侧", value: "shin" },
      { label: "足底/足弓", value: "plantar" },
      { label: "下背部/骶髂关节", value: "lowback" },
      { label: "髋关节/腹股沟", value: "hip" },
    ], required: true, dimension: "injury",
  },
  {
    id: "i04", type: "select", text: "伤病复发情况？",
    options: [
      { label: "无伤病史", value: "na" },
      { label: "从未复发——完全康复", value: "never_recur" },
      { label: "偶尔复发（每年1次）——训练量大时出现", value: "sometimes" },
      { label: "频繁复发（每年≥2次）——需排查根本原因", value: "frequent" },
      { label: "慢性持续——长期受影响", value: "chronic" },
    ], required: false, dimension: "injury",
  },
  {
    id: "i05", type: "select", text: "是否获得过医生/物理治疗师的运动许可？",
    options: [
      { label: "是——已获得全面运动许可", value: "cleared" },
      { label: "是——但有限制条件", value: "restricted" },
      { label: "否——未咨询过专业人士", value: "not_consulted" },
      { label: "无伤病史", value: "na" },
    ], required: false, dimension: "injury",
  },
  {
    id: "i06", type: "select", text: "是否了解跳跃训练相关的伤病预防知识？",
    options: [
      { label: "系统了解——知道负荷管理、渐进原则、疼痛信号", value: "systematic" },
      { label: "大致了解——知道热身和拉伸重要", value: "basic" },
      { label: "了解很少——靠感觉训练", value: "little" },
      { label: "不了解——需要指导", value: "none" },
    ], required: false, dimension: "injury",
  },
  {
    id: "i07", type: "select", text: "训练中是否会因疼痛而调整/跳过某些动作？",
    options: [
      { label: "从不——无疼痛", value: "never" },
      { label: "偶尔——轻微不适但可自行调整", value: "sometimes" },
      { label: "经常——多个动作需调整或跳过", value: "often" },
      { label: "总是——疼痛严重影响训练", value: "always" },
    ], required: false, dimension: "injury",
  },
  {
    id: "i08", type: "select", text: "是否有做过步态/跑步/跳跃动作的视频分析？",
    options: [
      { label: "有——专业生物力学分析", value: "pro" },
      { label: "有——自己/朋友手机拍摄分析", value: "self" },
      { label: "没有做过", value: "none" },
    ], required: false, dimension: "injury",
  },
  {
    id: "i09", type: "select", text: "近6个月内是否因训练导致过任何急性损伤（扭伤/拉伤等）？",
    options: [
      { label: "无——训练安全", value: "none" },
      { label: "1次——轻微", value: "1_minor" },
      { label: "2-3次——需注意训练负荷管理", value: "2-3" },
      { label: ">3次——高风险，需彻底评估", value: "gt3" },
    ], required: false, dimension: "injury",
  },
  {
    id: "i10", type: "select", text: "从伤病中恢复后，你如何判断自己已准备好回归训练？",
    options: [
      { label: "无伤病史", value: "na" },
      { label: "有系统回归标准（无痛+全ROM+力量对称+逐级测试）", value: "systematic" },
      { label: "感觉不疼了就回归", value: "feel" },
      { label: "不明确——没考虑过", value: "unclear" },
    ], required: false, dimension: "injury",
  },
  // ================================================================
  // 模块 9：恢复与生活习惯 (recovery) — 10题
  // ================================================================
  {
    id: "h01", type: "select", text: "每天平均睡眠时长？",
    options: [
      { label: "≥8小时——理想恢复区间", value: "ge8" },
      { label: "7-8小时——可接受", value: "7to8" },
      { label: "6-7小时——略不足", value: "6to7" },
      { label: "<6小时——严重影响恢复与睾酮分泌", value: "lt6" },
    ], required: true, dimension: "recovery",
  },
  {
    id: "h02", type: "select", text: "睡眠质量？",
    options: [
      { label: "优秀——入睡<15min，整夜不醒，醒后精力充沛", value: "excellent" },
      { label: "良好——偶尔醒来但能快速再入睡", value: "good" },
      { label: "一般——入睡困难或夜间多醒", value: "average" },
      { label: "差——严重失眠或醒后极度疲劳", value: "poor" },
    ], required: true, dimension: "recovery",
  },
  {
    id: "h03", type: "select", text: "日常饮食营养质量？",
    hint: "弹跳训练需蛋白质 1.6-2.2g/kg/天 + 充足碳水供能",
    options: [
      { label: "很讲究——计算宏量营养素，注重训练前后营养时机", value: "strict" },
      { label: "比较注意——大致均衡，保证蛋白质摄入", value: "moderate" },
      { label: "一般——不特别注意营养搭配", value: "average" },
      { label: "不太好——不规律，蛋白质明显不足", value: "poor" },
    ], required: true, dimension: "recovery",
  },
  {
    id: "h04", type: "select", text: "每日饮水量？",
    options: [
      { label: "≥3L——充足", value: "ge3" },
      { label: "2-3L——正常", value: "2to3" },
      { label: "1-2L——偏少", value: "1to2" },
      { label: "<1L——严重不足，影响代谢与恢复", value: "lt1" },
    ], required: false, dimension: "recovery",
  },
  {
    id: "h05", type: "select", text: "饮酒频率？",
    hint: "酒精干扰蛋白质合成、睾酮分泌和深度睡眠——对弹跳训练影响显著",
    options: [
      { label: "不喝酒", value: "none" },
      { label: "偶尔——社交场合，月1-2次", value: "rare" },
      { label: "每周1-2次", value: "weekly" },
      { label: "每周≥3次——可能显著影响训练适应", value: "frequent" },
    ], required: true, dimension: "recovery",
  },
  {
    id: "h06", type: "slider", text: "当前生活/工作/学业压力水平？",
    hint: "1=几乎无压力，10=极大压力。高皮质醇直接影响恢复和训练效果",
    sliderRange: { min: 1, max: 10, step: 1 },
    sliderLabels: { min: "无压力", max: "极大压力" },
    required: true, dimension: "recovery",
  },
  {
    id: "h07", type: "multiSelect", text: "常用恢复手段（可多选）？",
    options: [
      { label: "泡沫轴/筋膜枪（SMR）", value: "smr" },
      { label: "静态/动态拉伸", value: "stretch" },
      { label: "运动按摩/物理治疗", value: "massage" },
      { label: "冷热交替浴/冰浴", value: "contrast" },
      { label: "压缩衣/气压恢复", value: "compression" },
      { label: "冥想/正念/呼吸训练", value: "meditation" },
      { label: "充足睡眠优先", value: "sleep" },
      { label: "营养补剂（蛋白粉/肌酸等）", value: "supplements" },
      { label: "无特别恢复手段", value: "none" },
    ], required: true, dimension: "recovery",
  },
  {
    id: "h08", type: "select", text: "每天久坐时间（学习/工作）？",
    hint: "久坐→髋屈肌缩短→臀肌抑制→跳跃力学受损",
    options: [
      { label: "<4小时", value: "lt4" },
      { label: "4-8小时", value: "4to8" },
      { label: "8-12小时", value: "8to12" },
      { label: ">12小时——需特别注意髋屈肌紧张问题", value: "gt12" },
    ], required: true, dimension: "recovery",
  },
  {
    id: "h09", type: "select", text: "是否有规律的主动恢复日（低强度活动日）？",
    options: [
      { label: "每周1-2天——系统恢复安排", value: "regular" },
      { label: "偶尔有低强度活动日", value: "occasional" },
      { label: "休息日完全不动", value: "sedentary" },
      { label: "几乎无休息日——过度训练风险", value: "over" },
    ], required: false, dimension: "recovery",
  },
  {
    id: "h10", type: "select", text: "是否使用运动营养补剂？",
    options: [
      { label: "系统使用——蛋白粉+肌酸+其他（按需）", value: "systematic" },
      { label: "基础使用——蛋白粉为主", value: "basic" },
      { label: "不使用补剂", value: "none" },
    ], required: false, dimension: "recovery",
  },
  // ================================================================
  // 模块 10：心理素质与训练投入 (psychology) — 8题
  // ================================================================
  {
    id: "ps01", type: "select", text: "当前训练动机水平？",
    options: [
      { label: "极高——每天期待训练，自主驱动", value: "very_high" },
      { label: "较高——大部分时间有动力", value: "high" },
      { label: "中等——需要外部督促或计划推动", value: "moderate" },
      { label: "较低——容易懈怠，难以坚持", value: "low" },
    ], required: true, dimension: "psychology",
  },
  {
    id: "ps02", type: "select", text: "当训练表现停滞或退步时的反应？",
    options: [
      { label: "冷静分析原因，调整计划继续前进", value: "analyze" },
      { label: "有点沮丧但坚持训练", value: "persist" },
      { label: "明显受挫，需要外部鼓励", value: "frustrated" },
      { label: "容易放弃或频繁更换计划", value: "quit" },
    ], required: false, dimension: "psychology",
  },
  {
    id: "ps03", type: "select", text: "你是否设定了明确的弹跳训练目标（SMART）？",
    options: [
      { label: "有明确数字目标+时间节点+可执行计划", value: "smart" },
      { label: "有大方向目标但不够具体", value: "vague" },
      { label: "目标比较模糊——'想跳得更高'", value: "unclear" },
      { label: "没有具体目标", value: "none" },
    ], required: false, dimension: "psychology",
  },
  {
    id: "ps04", type: "select", text: "训练一致性（最近3个月）？",
    options: [
      { label: "高度一致——每周按计划完成≥90%的训练", value: "consistent" },
      { label: "基本一致——完成70-90%", value: "mostly" },
      { label: "不太稳定——完成50-70%", value: "unstable" },
      { label: "经常中断——完成<50%", value: "inconsistent" },
    ], required: false, dimension: "psychology",
  },
  {
    id: "ps05", type: "select", text: "你是否会进行心理意象/可视化训练（想象跳跃动作）？",
    options: [
      { label: "经常——系统进行运动意象训练", value: "often" },
      { label: "偶尔——比赛/测试前会做", value: "sometimes" },
      { label: "很少", value: "rarely" },
      { label: "从不——不了解这个方法", value: "never" },
    ], required: false, dimension: "psychology",
  },
  {
    id: "ps06", type: "select", text: "对教练反馈或训练建议的接受度？",
    options: [
      { label: "非常开放——主动寻求反馈并执行", value: "open" },
      { label: "会听取但需自己理解后才执行", value: "cautious" },
      { label: "倾向于按自己的方式训练", value: "self" },
      { label: "没有教练/反馈来源", value: "na" },
    ], required: false, dimension: "psychology",
  },
  {
    id: "ps07", type: "select", text: "是否因担心受伤而不敢全力训练？",
    options: [
      { label: "从不——在安全范围内全力输出", value: "never" },
      { label: "偶尔——某些高风险动作会有顾虑", value: "sometimes" },
      { label: "经常——害怕受伤限制了我的训练强度", value: "often" },
      { label: "是——这是限制我进步的主要原因之一", value: "major" },
    ], required: false, dimension: "psychology",
  },
  {
    id: "ps08", type: "select", text: "训练环境支持度？",
    options: [
      { label: "有教练/训练伙伴/支持性社群", value: "supported" },
      { label: "独自训练但自我驱动强", value: "self_motivated" },
      { label: "独自训练，偶尔感到孤立", value: "isolated" },
      { label: "缺乏支持——家人/朋友不理解我的训练投入", value: "unsupported" },
    ], required: false, dimension: "psychology",
  },
  // ================================================================
  // 模块 11：技术评估 (technique) — 8题
  // ================================================================
  {
    id: "t01", type: "select", text: "你对自身跳跃技术（起跳+腾空+落地）的自我评分？",
    options: [
      { label: "优秀——技术成熟，能自我纠正", value: "excellent" },
      { label: "良好——基本技术正确，偶尔需要调整", value: "good" },
      { label: "一般——知道有问题但不清楚如何改进", value: "average" },
      { label: "差——技术存在明显缺陷", value: "poor" },
    ], required: false, dimension: "technique",
  },
  {
    id: "t02", type: "select", text: "摆臂与起跳协调性？",
    hint: "摆臂贡献跳跃高度的 10-15%",
    options: [
      { label: "优秀——摆臂流畅有力，与起跳完美同步", value: "excellent" },
      { label: "良好——协调性好，偶尔不流畅", value: "good" },
      { label: "一般——摆臂僵硬或与起跳不同步", value: "average" },
      { label: "差——摆臂几乎不参与发力", value: "poor" },
    ], required: false, dimension: "technique",
  },
  {
    id: "t03", type: "select", text: "反向动作（Countermovement）质量？",
    hint: "预蹲→快速反向→起跳。SSC（拉长-缩短周期）利用效率直接影响跳跃高度",
    options: [
      { label: "优秀——CMJ明显高于SJ，SSC效率高", value: "excellent" },
      { label: "良好——CMJ比SJ高5-10cm", value: "good" },
      { label: "一般——CMJ与SJ差异<5cm，SSC利用一般", value: "average" },
      { label: "差——CMJ与SJ几乎无差异，SSC利用率低", value: "poor" },
      { label: "不清楚——未测试过CMJ vs SJ", value: "unknown" },
    ], required: false, dimension: "technique",
  },
  {
    id: "t04", type: "select", text: "落地力学（着陆缓冲）质量？",
    options: [
      { label: "优秀——屈髋屈膝缓冲，声音轻，重心稳定", value: "excellent" },
      { label: "良好——基本正确但偶尔过硬", value: "good" },
      { label: "一般——落地声音大，膝盖内扣或躯干前倾", value: "average" },
      { label: "差——落地僵硬、膝内扣严重、需刻意纠正", value: "poor" },
    ], required: false, dimension: "technique",
  },
  {
    id: "t05", type: "select", text: "起跳脚偏好与双侧差异？",
    options: [
      { label: "双腿起跳——双侧均衡", value: "bilateral" },
      { label: "双腿起跳——有明显优势侧", value: "asymmetric" },
      { label: "单腿起跳为主——双腿都能跳", value: "both_single" },
      { label: "单腿起跳为主——一侧明显强于另一侧", value: "single_asym" },
    ], required: false, dimension: "technique",
  },
  {
    id: "t06", type: "select", text: "助跑起跳（Approach Jump）一致性？",
    options: [
      { label: "优秀——助跑节奏稳定，每次起跳点精准", value: "excellent" },
      { label: "良好——基本稳定，偶尔步点不准", value: "good" },
      { label: "一般——助跑不稳定，经常调整步幅", value: "average" },
      { label: "很少/不做助跑起跳", value: "rarely" },
    ], required: false, dimension: "technique",
  },
  {
    id: "t07", type: "select", text: "是否定期拍摄/分析自己的跳跃动作视频？",
    options: [
      { label: "定期——每周拍摄并对比分析", value: "weekly" },
      { label: "偶尔——每月1-2次", value: "monthly" },
      { label: "很少——想起来才拍", value: "rarely" },
      { label: "从不——没拍过", value: "never" },
    ], required: false, dimension: "technique",
  },
  {
    id: "t08", type: "select", text: "技术纠正能力？",
    options: [
      { label: "强——教练指出后能立即纠正并保持", value: "strong" },
      { label: "中等——需要多次提醒才能改正", value: "moderate" },
      { label: "较弱——知道问题但改不了", value: "weak" },
      { label: "不清楚——没接受过技术指导", value: "unknown" },
    ], required: false, dimension: "technique",
  },
  // ================================================================
  // 模块 12（旧）：训练经验与专项背景 (trainingHx) — 待替换
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
