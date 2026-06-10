// ============================================================
// 动态知识库 — 从动作库和诊断维度构建，注入 AI Prompt
// ============================================================

import { EXERCISES, CATEGORIES, type Exercise } from "@/lib/exercises/data";
import { DIMENSION_LABELS, type DimensionKey } from "@/lib/questionnaire/types";
import { formatUserKnowledgeBase } from "./user-knowledge";

// ---- 短板诊断规则 ----
export interface WeaknessRule {
  dimension: DimensionKey;
  priority: number; // 1=最高优先
  condition: string; // 触发条件描述
  explanation: string; // 对弹跳的影响
  recommendedFocus: string; // 训练方向
  exerciseIds: string[]; // 推荐动作ID
}

export const WEAKNESS_RULES: WeaknessRule[] = [
  { dimension: "maxStrength", priority: 1, condition: "深蹲相对力量<1.5xBW 或力量维度得分<40", explanation: "最大力量是爆发力的基础——力量不足如同一辆小排量发动机，无论怎么优化也无法产生足够的推进力。研究表明深蹲<1.5倍体重时，增强式训练效果显著受限(Sánchez-Sixto 2021)。", recommendedFocus: "优先补强下肢最大力量，以杠铃后蹲、六角杠铃硬拉为核心，每周2-3次力量训练", exerciseIds: ["back-squat","trap-bar-deadlift","bulgarian-split-squat","goblet-squat","romanian-deadlift","hip-thrust","walking-lunge"] },
  { dimension: "powerSpeed", priority: 1, condition: "CMJ过低或力-速曲线偏力量端（力量强但跳不高）", explanation: "力-速曲线偏力量端意味着你拥有足够的'马力'但无法快速释放——像一辆卡车引擎装在跑车上。Jiménez-Reyes(2017)证实：针对F-V不平衡的个体化训练比统一方案提升20%以上。", recommendedFocus: "增加速度/增强式训练比例，用深跳、跨栏跳、短跑等训练发力率(RFD)", exerciseIds: ["depth-jump","box-jump","hurdle-hop","sprint-30m","pogo-jump","tuck-jump","seated-box-jump"] },
  { dimension: "powerSpeed", priority: 2, condition: "力-速曲线偏速度端（跳得高但力量弱）", explanation: "你擅长快速发力但最大力量储备不足——好比高转速但低扭矩。需要增加最大力量储备以提升发力'天花板'。", recommendedFocus: "以杠铃后蹲和硬拉为主提升最大力量，增强式维持低量", exerciseIds: ["back-squat","front-squat","deadlift","trap-bar-deadlift","hip-thrust","bulgarian-split-squat","nordic-hamstring-curl"] },
  { dimension: "mobility", priority: 2, condition: "踝背屈<10cm或FMS总分<14", explanation: "受限的关节活动度直接限制起跳深度和发力距离——踝背屈每减少1cm，深蹲深度约减少2-3°，起跳角度受限意味着更少的发力时间产生更少的冲量。", recommendedFocus: "每日进行踝关节背屈拉伸、髋屈肌拉伸和胸椎旋转练习，改善活动度后再逐步增加训练负荷", exerciseIds: ["ankle-dorsiflexion-stretch","couch-stretch","pigeon-stretch","hip-airplane","ankle-abc","thoracic-spine-rotation"] },
  { dimension: "trainingHx", priority: 1, condition: "有下肢伤病史（膝盖/踝关节/腰背）", explanation: "伤病史是未来受伤的最强预测因子。必须优先进行预康复训练以纠正潜在的不平衡和弱点，在安全基础上逐步增加负荷。", recommendedFocus: "以单腿稳定、离心控制和核心抗旋为主，避免高冲击动作直到通过功能筛查", exerciseIds: ["single-leg-balance","single-leg-rdl","pallof-press","dead-bug","banded-glute-bridge","banded-lateral-walk","eccentric-heel-drop","isometric-wall-squat"] },
  { dimension: "proportion", priority: 3, condition: "上下身比例不理想或明显体态问题（骨盆前倾、X/O型腿）", explanation: "体态偏差会改变力量传递路径——骨盆前倾导致臀肌失活和腰椎代偿，跳跃时能量泄漏严重。", recommendedFocus: "优先纠正体态，强化臀肌和核心抗旋，再进行高强度弹跳训练", exerciseIds: ["hip-thrust","banded-glute-bridge","banded-lateral-walk","dead-bug","bird-dog","couch-stretch","pallof-press"] },
  { dimension: "lifestyle", priority: 2, condition: "睡眠<7h、压力大、营养不足", explanation: "训练的效果发生在恢复期而非训练期——睡眠不足直接降低睾酮分泌(Leproult & Van Cauter 2011)，营养不足无法支持肌肉修复。", recommendedFocus: "优先改善睡眠和营养质量，训练量降低至70%直到恢复指标改善", exerciseIds: [] },
  { dimension: "endurance", priority: 3, condition: "有氧基础薄弱或高强度恢复慢", explanation: "无氧耐力不足会影响高强度训练的质量——恢复慢意味着后续组数无法保持爆发力输出。", recommendedFocus: "加入低强度有氧和间歇训练改善能量系统，不替代力量/增强式主训练", exerciseIds: ["sprint-30m","sled-push","resisted-sprint","a-skip"] },
  { dimension: "availability", priority: 3, condition: "训练时间有限（每周<3天）或设备不足", explanation: "训练频率和设备是计划可行性的硬约束——需要最大化每次训练的效率。", recommendedFocus: "采用全身训练+复合动作的高效模式，每次训练同时覆盖力量+增强式", exerciseIds: ["trap-bar-deadlift","bulgarian-split-squat","box-jump","pallof-press","goblet-squat","push-press","pogo-jump"] },
];

// ---- 周期化规则 ----
export interface PeriodizationRule {
  phaseName: string;
  durationWeeks: number;
  weeklyFrequency: number;
  strengthPercent: number; // 力量训练占比
  plyoPercent: number; // 增强式训练占比
  dailyStructure: string; // 每日结构描述
  progressionRule: string; // 渐进规则
}

export const PERIODIZATION_RULES: PeriodizationRule[] = [
  { phaseName: "基础适应期", durationWeeks: 3, weeklyFrequency: 3, strengthPercent: 75, plyoPercent: 25, dailyStructure: "热身(RAMP)→力量主项→辅项→低强度增强式→冷身", progressionRule: "每周增加训练量5-10%，不急于加重" },
  { phaseName: "最大力量期", durationWeeks: 4, weeklyFrequency: 3, strengthPercent: 65, plyoPercent: 35, dailyStructure: "热身→爆发力动作（高翻/跳跃耸肩）→力量主项(深蹲/硬拉)→辅项→增强式→冷身", progressionRule: "每周增加2.5-5%负荷，保持动作质量" },
  { phaseName: "爆发力转化期", durationWeeks: 4, weeklyFrequency: 3, strengthPercent: 40, plyoPercent: 60, dailyStructure: "热身→增强式主项(深跳/跨栏跳)→力量维持(1/4蹲/分腿蹲)→速度训练→冷身", progressionRule: "增加增强式训练的箱高/距离，力量维持不追求突破" },
  { phaseName: "峰值冲刺期", durationWeeks: 2, weeklyFrequency: 2, strengthPercent: 30, plyoPercent: 70, dailyStructure: "热身→高强度低量增强式→技术练习→轻度力量→充分冷身", progressionRule: "训练量降至60%，追求每次跳跃的最大质量" },
];

// ---- 动作安全与禁忌映射 ----
export interface ExerciseSafety {
  id: string;
  contraindications: string[]; // 禁忌症
  riskLevel: "low" | "medium" | "high";
  requiresSpotter: boolean;
  alternatives: string[]; // 替代动作ID
  specialNotes: string;
}

export const EXERCISE_SAFETY: ExerciseSafety[] = [
  { id: "depth-jump", contraindications: ["髌腱炎","跟腱炎","ACL损伤史","<3个月训练基础"], riskLevel: "high", requiresSpotter: false, alternatives: ["box-jump","seated-box-jump","pogo-jump"], specialNotes: "从30cm开始，触地时间必须<0.2秒；落地需缓冲垫；任何膝盖或跟腱疼痛立即停止" },
  { id: "back-squat", contraindications: ["腰椎间盘突出","脊柱侧弯（重度）","膝关节急性损伤"], riskLevel: "medium", requiresSpotter: true, alternatives: ["goblet-squat","trap-bar-deadlift","isometric-wall-squat"], specialNotes: "大重量(>85%1RM)需要保护者；膝盖有不适者用箱式深蹲替代；下背部有问题者用前蹲或六角杠铃硬拉替代" },
  { id: "nordic-hamstring-curl", contraindications: ["腘绳肌拉伤（急性期）","膝关节后侧疼痛"], riskLevel: "high", requiresSpotter: true, alternatives: ["romanian-deadlift","single-leg-rdl"], specialNotes: "离心训练恢复时间较长(48-72h)，每周不超过2次；从上半段ROM开始逐步增加" },
  { id: "power-clean", contraindications: ["腕关节损伤","肩关节不稳定","腰椎问题"], riskLevel: "high", requiresSpotter: false, alternatives: ["jump-shrug","hang-clean","trap-bar-deadlift"], specialNotes: "技术优先于重量——先用空杆或轻重量掌握三关节伸展时机；建议在教练指导下学习" },
  { id: "hang-clean", contraindications: ["腕关节损伤","肩关节不稳定"], riskLevel: "high", requiresSpotter: false, alternatives: ["jump-shrug","power-clean"], specialNotes: "比完整高翻技术门槛低——去掉了第一拉，更专注于爆发力阶段" },
  { id: "single-leg-bound", contraindications: ["踝关节扭伤（<6个月）","膝关节不稳定","<6个月系统训练"], riskLevel: "high", requiresSpotter: false, alternatives: ["broad-jump","lateral-bound","walking-lunge"], specialNotes: "需要至少6个月系统力量基础；落地时必须稳定，不能晃动" },
  { id: "deadlift", contraindications: ["腰椎间盘突出（急性期）","脊柱滑脱"], riskLevel: "medium", requiresSpotter: false, alternatives: ["trap-bar-deadlift","romanian-deadlift","hip-thrust"], specialNotes: "保持背部平直是底线——宁可减轻重量也不能弓背；下背部有伤者用六角杠铃版本" },
  { id: "copenhagen-plank", contraindications: ["内收肌拉伤（急性期）","腹股沟疼痛"], riskLevel: "medium", requiresSpotter: false, alternatives: ["side-plank","suitcase-carry"], specialNotes: "从膝盖着地版(10秒)开始，内收肌有拉伤史者需完全康复后再尝试" },
  { id: "eccentric-heel-drop", contraindications: ["跟腱断裂（急性期<6周）"], riskLevel: "low", requiresSpotter: false, alternatives: ["isometric-wall-squat"], specialNotes: "离心训练可能引起轻微酸痛(VAS<4)——这是正常的；尖锐疼痛则立即停止" },
  { id: "depth-to-broad-jump", contraindications: ["髌腱炎","跟腱炎","踝关节不稳定"], riskLevel: "high", requiresSpotter: false, alternatives: ["box-jump","broad-jump"], specialNotes: "大幅度的方向转换对关节压力大，需熟练掌握深跳和立定跳远后再尝试" },
  { id: "front-squat", contraindications: ["腕关节活动度严重受限","肩关节撞击"], riskLevel: "medium", requiresSpotter: true, alternatives: ["goblet-squat","back-squat"], specialNotes: "手腕活动度不足可用交叉握法或助力带；杠铃必须架在锁骨+前三角肌上而非喉咙" },
  { id: "hurdle-hop", contraindications: ["踝关节不稳定","跟腱炎"], riskLevel: "medium", requiresSpotter: false, alternatives: ["box-jump","pogo-jump"], specialNotes: "栏高从15cm开始；如果落地声音变大或节奏变慢→停止" },
  { id: "resisted-sprint", contraindications: ["腘绳肌拉伤（<3个月）"], riskLevel: "medium", requiresSpotter: false, alternatives: ["sprint-30m","a-skip"], specialNotes: "阻力不超过体重20%；保持正常冲刺姿势——因阻力变形说明太重" },
  { id: "sled-push", contraindications: [], riskLevel: "low", requiresSpotter: false, alternatives: ["resisted-sprint","walking-lunge"], specialNotes: "安全性极高——适合几乎所有训练水平的运动员" },
];

// ---- 知识库构建函数 ----
export function buildKnowledgeBase(answers?: Record<string, any>): string {
  const parts: string[] = [];

  // 1. 动作库
  parts.push("## 动作库 (Exercise Library)");
  for (const cat of CATEGORIES) {
    const exs = EXERCISES.filter(e => e.category === cat.id);
    parts.push(`\n### ${cat.icon} ${cat.label}`);
    parts.push(cat.description);
    for (const ex of exs) {
      const safety = EXERCISE_SAFETY.find(s => s.id === ex.id);
      parts.push(`- **${ex.name}** (${ex.nameEn})`);
      parts.push(`  难度: ${ex.difficulty} | 目标肌群: ${ex.targetMuscles}`);
      parts.push(`  说明: ${ex.description}`);
      parts.push(`  组次建议: ${ex.setsReps.replace(/\n/g, " / ")}`);
      if (safety) {
        parts.push(`  禁忌症: ${safety.contraindications.join("、") || "无特殊禁忌"}`);
        parts.push(`  风险等级: ${safety.riskLevel} | 需保护: ${safety.requiresSpotter ? "是" : "否"}`);
        parts.push(`  替代动作: ${safety.alternatives.join("、")}`);
        parts.push(`  注意事项: ${safety.specialNotes}`);
      }
      if (ex.caution) parts.push(`  额外警告: ${ex.caution}`);
    }
  }

  // 2. 短板诊断规则
  parts.push("\n\n## 短板诊断规则 (Weakness Diagnosis)");
  for (const rule of WEAKNESS_RULES) {
    parts.push(`- **${DIMENSION_LABELS[rule.dimension]}** (优先级${rule.priority})`);
    parts.push(`  触发条件: ${rule.condition}`);
    parts.push(`  影响: ${rule.explanation}`);
    parts.push(`  方向: ${rule.recommendedFocus}`);
    parts.push(`  推荐动作: ${rule.exerciseIds.join("、")}`);
  }

  // 3. 周期化规则
  parts.push("\n\n## 周期化训练规则 (Periodization)");
  for (const rule of PERIODIZATION_RULES) {
    parts.push(`- **${rule.phaseName}**: ${rule.durationWeeks}周, 每周${rule.weeklyFrequency}次, 力量${rule.strengthPercent}%/增强式${rule.plyoPercent}%`);
    parts.push(`  结构: ${rule.dailyStructure}`);
    parts.push(`  进阶: ${rule.progressionRule}`);
  }

  // 4. 用户数据注入
  if (answers && Object.keys(answers).length > 0) {
    parts.push("\n\n## 用户个人数据");
    for (const [key, value] of Object.entries(answers)) {
      if (value !== undefined && value !== "" && value !== null) {
        parts.push(`- ${key}: ${JSON.stringify(value)}`);
      }
    }
  }

  // 5. 用户提供的权威知识库（Triphasic训练、Tuck Jump评估、弹跳专项诊断等）
  parts.push("\n\n");
  parts.push(formatUserKnowledgeBase());

  return parts.join("\n");
}

/** 轻量版知识库（用于诊断 prompt，不含全部动作库和用户知识） */
export function buildCompactKnowledgeBase(): string {
  const parts: string[] = [];

  // 1. 核心短板诊断规则（按 priority 排序，取前 5 个）
  parts.push("## 核心短板诊断规则");
  const topRules = [...WEAKNESS_RULES]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);
  for (const rule of topRules) {
    parts.push(`- **${DIMENSION_LABELS[rule.dimension]}** (P${rule.priority}): ${rule.condition}`);
    parts.push(`  → 训练方向: ${rule.recommendedFocus}`);
  }

  // 2. 周期化摘要（精简）
  parts.push("\n## 训练周期结构");
  for (const rule of PERIODIZATION_RULES) {
    parts.push(`- ${rule.phaseName}: ${rule.durationWeeks}周, 每周${rule.weeklyFrequency}次, 力量${rule.strengthPercent}%/增强式${rule.plyoPercent}%`);
  }

  // 3. 高风险动作安全警示（仅列出高风险）
  parts.push("\n## 高风险动作禁忌");
  const highRisk = EXERCISE_SAFETY.filter(s => s.riskLevel === "high");
  for (const s of highRisk.slice(0, 8)) {
    const ex = EXERCISES.find(e => e.id === s.id);
    parts.push(`- ${ex?.name || s.id}: 禁忌[${s.contraindications.join("、")}], 替代[${s.alternatives.join("、")}]`);
  }

  // 4. 用户核心知识库（精简至 1500 字符以内）
  parts.push("\n## 核心训练原理");
  const coreKB = formatUserKnowledgeBase();
  // 截取前 1500 字符 + 省略标记
  if (coreKB.length > 1500) {
    parts.push(coreKB.slice(0, 1500) + "\n...（知识库已截断，优先引用上述内容）");
  } else {
    parts.push(coreKB);
  }

  return parts.join("\n");
}
