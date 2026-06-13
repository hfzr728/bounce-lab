// ============================================================
// 伤病禁忌动作系统 — 基于运动科学与康复指南
// ============================================================

/** 用户伤病信息 */
export interface InjuryInfo {
  /** 伤病类型标识 */
  types: string[];
  /** 伤病时间：current | <3m | 3-6m | 6m-1y | >1y | never */
  recency: string;
  /** 原始用户回答（用于补充上下文） */
  raw?: string;
}

/** 受限动作条目 */
export interface RestrictedExercise {
  /** 动作关键词（中英文） */
  keywords: string[];
  /** 替代建议 */
  alternatives: string[];
  /** 风险原因 */
  reason: string;
}

// ============================================================
// 伤病 → 禁忌动作 映射表
// 原理：高冲击动作会放大关节剪切力/压缩力，特定伤病部位需严格避免
// ============================================================

export const INJURY_RESTRICTIONS: Record<string, RestrictedExercise[]> = {
  // ---- 膝盖伤病 ----
  knee: [
    {
      keywords: ["深蹲跳", "jump squat", "蛙跳", "frog jump", "立定跳远", "broad jump",
        "跳箱落地", "depth jump", "深跳", "跳深", "连续跳箱", "跳箱", "box jump landing"],
      alternatives: ["箱式深蹲（控制下落）", "单腿坐蹲", "等长靠墙静蹲", "低冲击提踵跳"],
      reason: "高冲击落地瞬间膝关节承受 4-6 倍体重剪切力，髌腱/半月板/ACL 损伤风险极高",
    },
    {
      keywords: ["全蹲", "ass to grass", "极限重量深蹲", "保加利亚分腿蹲跳"],
      alternatives: ["平行蹲（大腿与地面平行）", "箱式深蹲", "腿举机"],
      reason: "极限屈膝角度增大关节囊内压，对半月板后角和关节软骨不利",
    },
    {
      keywords: ["负重弓步跳", "交替弓步跳", "lunge jump"],
      alternatives: ["静态弓步蹲", "反向弓步", "踏步上台"],
      reason: "动态弓步跳跃时膝关节不稳，易发生外翻塌陷",
    },
  ],

  // ---- ACL 损伤 ----
  acl: [
    {
      keywords: ["深蹲跳", "jump squat", "蛙跳", "frog jump", "立定跳远", "broad jump",
        "深度跳深", "depth jump", "单腿跳深", "跳箱", "连续跳箱", "box jump"],
      alternatives: ["双腿落地控制训练", "低高度跳落稳定（<30cm）", "等长提踵", "腿举机"],
      reason: "ACL 重建后需避免高冲击剪切力，优先重建落地控制与本体感觉",
    },
    {
      keywords: ["急停变向", "侧切", "cutting", "折返跑", "shuttle run full speed"],
      alternatives: ["直线减速训练", "弧形慢跑变向", "水中变向训练"],
      reason: "急停变向产生最大 ACL 张力，完全康复前需避免",
    },
  ],

  // ---- 半月板损伤 ----
  meniscus: [
    {
      keywords: ["深蹲跳", "jump squat", "蛙跳", "全蹲", "ass to grass", "深度跳深"],
      alternatives: ["半蹲", "箱式深蹲", "腿举", "等长训练"],
      reason: "深屈曲+旋转组合动作是半月板撕裂的经典机制",
    },
    {
      keywords: ["负重旋转", "伐木式", "russian twist weighted", "旋转跳"],
      alternatives: ["抗旋转核心训练（Pallof Press）", "平板支撑", "死虫式"],
      reason: "负重旋转压缩半月板，旋转跳使胫骨平台剪切力增大",
    },
  ],

  // ---- 髌腱炎（跳跃膝） ----
  patellar: [
    {
      keywords: ["深蹲跳", "jump squat", "蛙跳", "frog jump", "立定跳远", "broad jump",
        "连续跳深", "跳深", "depth jump", "连续跳箱", "box jump series"],
      alternatives: ["等长伸膝（靠墙静蹲 45s×5）", "离心慢放深蹲（3-4秒下放）", "游泳/水中跳"],
      reason: "高频率跳跃使髌腱承受反复牵拉应力，加重退行性变",
    },
    {
      keywords: ["爆发力跳", "max jump", "极限摸高", "全力起跳"],
      alternatives: ["次最大强度跳（70-80%）", "技术跳", "低强度增强式"],
      reason: "极限发力时股四头肌离心-向心转换瞬间髌腱张力最大",
    },
  ],

  // ---- 踝关节伤病 ----
  ankle: [
    {
      keywords: ["跳深", "depth jump", "深跳", "高跳箱落地", "单脚跳深", "不稳定面跳"],
      alternatives: ["低高度跳落（20cm）", "平衡垫单腿站", "弹力带踝关节强化"],
      reason: "高冲击落地对踝关节外侧韧带产生过度内翻力矩，易致再次扭伤",
    },
    {
      keywords: ["急停变向跳", "侧向跳", "lateral bound", "侧切跳"],
      alternatives: ["直线跳", "垂直跳", "控制性侧向踏步"],
      reason: "侧向跳跃时踝关节内翻风险高，韧带未完全愈合时需避免",
    },
  ],

  // ---- 跟腱炎 ----
  achilles: [
    {
      keywords: ["深蹲跳", "jump squat", "蛙跳", "连续跳深", "depth jump series",
        "跳箱系列", "负重提踵跳", "calf jump weighted"],
      alternatives: ["等长提踵", "离心慢放提踵（Alfredson 方案）", "坐姿提踵"],
      reason: "反复快速蹬伸使跟腱承受高频牵拉应力，加重肌腱退变",
    },
  ],

  // ---- 下背痛 / 腰椎间盘 ----
  lowback: [
    {
      keywords: ["负重深蹲", "barbell squat heavy", "爆发力硬拉", "deadlift heavy",
        "负重弓步跳", "深蹲跳负重", "clean", "snatch", "高翻", "抓举"],
      alternatives: ["前蹲（轻-中负荷）", "六角杠硬拉", "臀推", "单腿训练"],
      reason: "重负荷脊柱轴向压缩 + 屈曲增加椎间盘后侧压力，可能加重突出",
    },
    {
      keywords: ["负重弓步跳", "lunge jump weighted", "负重爆发力"],
      alternatives: ["自重弓步", "踏步上台", "反向弓步"],
      reason: "动态跳跃中脊柱反复屈伸，腰椎稳定性不足时易诱发疼痛",
    },
  ],

  // ---- 肩部伤病 ----
  shoulder: [
    {
      keywords: ["杠铃卧推大重量", "barbell bench heavy", "负重引体爆发力",
        "借力推举", "push press heavy", "倒立撑"],
      alternatives: ["哑铃卧推（中性握）", "弹力带水平推", "俯卧撑", "肩胛骨稳定训练"],
      reason: "肩袖肌群在过顶动作中需维持肱骨头稳定，伤病期需避免极限负荷",
    },
  ],
};

// ============================================================
// 伤病聚合分类：将详细伤病史映射到通用禁忌类别
// ============================================================

/** 将具体伤病类型映射到限制类别 key */
export function mapInjuriesToRestrictions(injuryTypes: string[]): Set<string> {
  const result = new Set<string>();

  const typeMap: Record<string, string[]> = {
    // 膝盖相关 → knee + 专项
    knee: ["knee"],
    acl: ["acl", "knee"],
    meniscus: ["meniscus", "knee"],
    patellar: ["patellar", "knee"],
    patellar_tendinopathy: ["patellar", "knee"],
    pfps: ["patellar", "knee"],

    // 踝关节
    ankle: ["ankle"],
    ankle_sprain: ["ankle"],

    // 跟腱
    achilles: ["achilles", "ankle"],

    // 腰背
    back: ["lowback"],
    lowback: ["lowback"],
    spine: ["lowback"],

    // 肩部
    shoulder: ["shoulder"],
  };

  for (const t of injuryTypes) {
    const mapped = typeMap[t] || (t ? [t] : []);
    for (const m of mapped) result.add(m);
  }

  return result;
}

// ============================================================
// Prompt 约束生成
// ============================================================

/** 根据用户伤病信息，生成注入到 AI prompt 的强制约束文本 */
export function buildInjuryConstraintText(injury: InjuryInfo): string {
  if (!injury.types.length || injury.types.includes("none")) return "";

  const restrictionKeys = mapInjuriesToRestrictions(injury.types);
  if (restrictionKeys.size === 0) return "";

  const lines: string[] = [];
  lines.push("\n## ⚠️ 伤病安全约束（必须严格遵守，违反此约束的计划不合格）\n");

  // 时间紧急度
  const recencyMap: Record<string, string> = {
    current: "⚠️ 用户当前正在伤病/康复期，所有训练必须以康复安全为第一优先级。",
    "<3m": "⚠️ 用户伤病距今不足 3 个月，组织愈合尚未完全，需高度谨慎。",
    "3-6m": "⚠️ 用户伤病距今 3-6 个月，处于恢复后期但仍有再伤风险。",
    "6m-1y": "用户伤病距今 6 个月以上，基本恢复但仍需注意负荷递进。",
    ">1y": "用户伤病距今超过 1 年，已完全恢复。",
  };
  if (recencyMap[injury.recency]) {
    lines.push(recencyMap[injury.recency]);
  }

  lines.push("\n以下动作类别**绝对禁止**出现在训练计划中：\n");

  // 收集所有禁止动作
  const forbiddenExercises: Set<string> = new Set();
  const allAlternatives: Set<string> = new Set();
  const allReasons: string[] = [];

  for (const key of restrictionKeys) {
    const restrictions = INJURY_RESTRICTIONS[key];
    if (!restrictions) continue;

    for (const r of restrictions) {
      for (const kw of r.keywords) forbiddenExercises.add(kw);
      for (const alt of r.alternatives) allAlternatives.add(alt);
      if (!allReasons.includes(r.reason)) allReasons.push(r.reason);
    }
  }

  lines.push(`禁止动作（含中英文和变体）：${[...forbiddenExercises].join("、")}`);
  lines.push(`\n推荐的安全替代动作：${[...allAlternatives].join("、")}`);
  lines.push(`\n医学依据：${allReasons.join("；")}`);

  lines.push("\n若计划中必须出现爆发力训练，只能使用安全替代动作，且标注「伤病安全版」。");

  return lines.join("\n");
}

// ============================================================
// 后处理：扫描 AI 返回内容，检测违禁动作并追加警告
// ============================================================

export interface PostProcessResult {
  /** 处理后的文本（可能添加了警告） */
  text: string;
  /** 检测到的违禁动作 */
  violations: string[];
  /** 是否有高风险违反 */
  hasViolations: boolean;
}

/** 扫描 AI 生成的计划文本，查找违禁动作并标记 */
export function scanAndWarnPlan(
  planText: string,
  injury: InjuryInfo,
): PostProcessResult {
  const restrictionKeys = mapInjuriesToRestrictions(injury.types);
  if (restrictionKeys.size === 0) return { text: planText, violations: [], hasViolations: false };

  // 收集所有禁止关键词
  const forbiddenPatterns: { pattern: RegExp; reason: string; alt: string }[] = [];
  for (const key of restrictionKeys) {
    const restrictions = INJURY_RESTRICTIONS[key];
    if (!restrictions) continue;
    for (const r of restrictions) {
      for (const kw of r.keywords) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        forbiddenPatterns.push({
          pattern: new RegExp(escaped, "gi"),
          reason: r.reason,
          alt: r.alternatives.join("、"),
        });
      }
    }
  }

  // 扫描
  const violations: string[] = [];
  for (const fp of forbiddenPatterns) {
    const match = planText.match(fp.pattern);
    if (match) {
      for (const m of match) {
        if (!violations.includes(m)) violations.push(m);
      }
    }
  }

  if (violations.length === 0) {
    return { text: planText, violations: [], hasViolations: false };
  }

  // 构建安全警告横幅
  const warningBanner = [
    "",
    "---",
    "> ⚠️ **安全警告：系统检测到以下动作可能不适合你的伤病史**",
    `> 检测到的动作：${violations.map(v => `**${v}**`).join("、")}`,
    `> 建议替换为安全替代动作（已在计划中标注），或在教练指导下评估可行性。`,
    `> 如果计划中已同时提供了「伤病安全版」替代动作，请忽略本警告并优先选择安全版。`,
    "> 任何训练中如出现疼痛，请立即停止并咨询康复医师。",
    "---",
    "",
  ].join("\n");

  return {
    text: warningBanner + planText,
    violations,
    hasViolations: true,
  };
}

/** 从问卷答案中提取伤病信息 */
export function extractInjuryInfo(answers: Record<string, unknown>): InjuryInfo {
  const types: string[] = [];

  // 基础版伤病数据 (bb23: multiSelect, bb24: recency)
  const bb23 = answers["bb23"];
  if (Array.isArray(bb23)) {
    types.push(...bb23.filter((v: string) => v !== "none"));
  }

  // 标准版伤病数据 (ex05: multiSelect)
  const ex05 = answers["ex05"];
  if (Array.isArray(ex05)) {
    types.push(...ex05.filter((v: string) => v !== "none" && !types.includes(v)));
  }

  // 伤病时间
  const bb24 = answers["bb24"] as string | undefined;
  const ex06 = answers["ex06"] as string | undefined;
  const recency = ex06 || bb24 || "unknown";

  return {
    types: [...new Set(types)],
    recency,
    raw: JSON.stringify({ bb23, bb24, ex05, ex06 }),
  };
}
