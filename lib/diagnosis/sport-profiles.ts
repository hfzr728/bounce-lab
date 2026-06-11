// ============================================================
// 运动专项档案 — 专项特点、常见伤病、发力率需求
// ============================================================

export interface SportProfile {
  id: string;
  name: string;
  /** 运动类型：jump（跳跃类）/ sprint（冲刺类）/ power（力量类）/ endurance（耐力类） */
  category: "jump" | "sprint" | "power" | "endurance";
  /** 发力率(RFD)需求：fast(极快<150ms) / moderate(中等150-250ms) / slow(较慢>250ms) */
  rfdDemand: "fast" | "moderate" | "slow";
  /** 典型起跳方式 */
  jumpType: "single_leg" | "double_leg" | "mixed";
  /** 常见伤病及风险权重 */
  commonInjuries: { injury: string; riskWeight: number; description: string }[];
  /** 运动特点描述 */
  characteristics: string;
  /** 训练重点 */
  trainingPriorities: string[];
  /** 禁忌动作提示 */
  warnings: string[];
}

export const SPORT_PROFILES: Record<string, SportProfile> = {
  basketball: {
    id: "basketball",
    name: "篮球",
    category: "jump",
    rfdDemand: "fast",
    jumpType: "mixed",
    commonInjuries: [
      { injury: "ankle_sprain", riskWeight: 10, description: "踝关节扭伤——急停变向和落地踩脚最常见" },
      { injury: "patellar_tendinopathy", riskWeight: 9, description: "髌腱炎（跳跃膝）——大量起跳落地" },
      { injury: "acl", riskWeight: 6, description: "ACL损伤——非接触性变向损伤" },
      { injury: "achilles", riskWeight: 5, description: "跟腱炎——反复冲刺和跳跃" },
      { injury: "pfps", riskWeight: 4, description: "髌股疼痛——频繁半蹲防守姿势" },
    ],
    characteristics: "高频率跳跃落地+多方向变向+身体对抗。平均每场跳跃40-60次。需要快速SSC（触地<200ms）和出色变向制动能力。",
    trainingPriorities: ["快速SSC增强式训练", "多向落地技术", "髋外展肌群（变向稳定）", "离心制动能力", "核心抗旋"],
    warnings: ["深跳箱高不超过45cm（已承受大量比赛跳跃负荷）", "赛季中减少增强式训练量至40-60触地/周"],
  },
  volleyball: {
    id: "volleyball",
    name: "排球",
    category: "jump",
    rfdDemand: "fast",
    jumpType: "double_leg",
    commonInjuries: [
      { injury: "patellar_tendinopathy", riskWeight: 10, description: "髌腱炎——排球第一高发病，每次训练跳跃100+次" },
      { injury: "ankle_sprain", riskWeight: 8, description: "踝关节扭伤——网前落地踩线" },
      { injury: "shoulder", riskWeight: 7, description: "肩袖损伤——扣球动作反复过顶" },
      { injury: "acl", riskWeight: 5, description: "ACL损伤——单腿落地不稳" },
      { injury: "low_back", riskWeight: 4, description: "下背痛——反复过伸扣球" },
    ],
    characteristics: "极高频率垂直跳跃，训练和比赛中跳跃次数远超其他项目。需要出色的双脚起跳高度和快速的多重跳跃能力。",
    trainingPriorities: ["高频率增强式训练（触地100-140次/周）", "髌腱预康复（等长+离心）", "肩袖稳定性", "单腿落地控制", "核心稳定性"],
    warnings: ["必须每周进行髌腱等长预康复（靠墙静蹲5×45s）", "踝关节保护——优先草地/橡胶面训练"],
  },
  soccer: {
    id: "soccer",
    name: "足球",
    category: "sprint",
    rfdDemand: "fast",
    jumpType: "mixed",
    commonInjuries: [
      { injury: "hamstring", riskWeight: 10, description: "腘绳肌拉伤——冲刺和急停最常见" },
      { injury: "ankle_sprain", riskWeight: 8, description: "踝关节扭伤——变向和对抗" },
      { injury: "acl", riskWeight: 7, description: "ACL损伤——非接触性变向，女性风险更高" },
      { injury: "groin", riskWeight: 6, description: "内收肌拉伤——侧向移动和传球动作" },
      { injury: "knee_mcl", riskWeight: 5, description: "膝关节内侧副韧带——铲球和对抗" },
    ],
    characteristics: "大量冲刺跑(每场800-1200m冲刺距离)+多向变向+单腿起跳争顶。下肢不对称使用明显(惯用脚)。需要极快RFD和高水平离心制动。",
    trainingPriorities: ["北欧腘绳肌训练（预防拉伤）", "冲刺力学优化", "单腿起跳高度", "离心制动训练", "内收肌群强化"],
    warnings: ["腘绳肌离心训练必须纳入每次训练", "避免疲劳状态下冲刺训练（受伤风险3倍）"],
  },
  dunk: {
    id: "dunk",
    name: "扣篮专项",
    category: "jump",
    rfdDemand: "moderate",
    jumpType: "single_leg",
    commonInjuries: [
      { injury: "patellar_tendinopathy", riskWeight: 10, description: "髌腱炎——大量极限高度跳跃" },
      { injury: "achilles", riskWeight: 7, description: "跟腱炎——单腿起跳跟腱负荷极大" },
      { injury: "ankle_sprain", riskWeight: 6, description: "踝关节扭伤——落地不稳" },
      { injury: "shin_splints", riskWeight: 5, description: "胫骨骨膜炎——硬地面反复跳跃" },
    ],
    characteristics: "追求极限单腿起跳高度，助跑速度3-5m/s。起跳触地时间相对较长(180-250ms)，侧重力产生而非纯粹SSC效率。需极限下肢力量+协调性。",
    trainingPriorities: ["最大力量（深蹲目标≥2倍体重）", "单腿1/4蹲（起跳角度特异性）", "助跑起跳技术优化", "肌腱刚度训练", "落地安全技术"],
    warnings: ["极限跳跃训练每周≤2次", "跟腱和髌腱负荷监控——任何持续疼痛立即停止", "优先草地/橡胶面训练，避免水泥地"],
  },
  track_field: {
    id: "track_field",
    name: "田径（跳跃项目）",
    category: "jump",
    rfdDemand: "fast",
    jumpType: "mixed",
    commonInjuries: [
      { injury: "achilles", riskWeight: 8, description: "跟腱炎——高强度跳跃和冲刺" },
      { injury: "hamstring", riskWeight: 7, description: "腘绳肌拉伤——冲刺加速" },
      { injury: "patellar_tendinopathy", riskWeight: 6, description: "髌腱炎——跳高/跳远专项" },
      { injury: "shin_splints", riskWeight: 5, description: "胫骨骨膜炎——跑道训练量大" },
    ],
    characteristics: "爆发力+速度结合，技术精度要求高。不同项目有不同的起跳方式（跳高=单腿/跳远=单腿/三级跳=单腿交替）。需要极高的RFD和SSC效率。",
    trainingPriorities: ["奥林匹克举（高翻/高抓）", "短触地时间深度跳（<200ms）", "最大速度训练", "专项起跳技术", "全身爆发力协调"],
    warnings: ["增强式训练量严格监控（触地≤120次/周高级）", "技术训练优先于力量训练在训练课中的顺序"],
  },
  general_fitness: {
    id: "general_fitness",
    name: "综合体能 / 无专项",
    category: "power",
    rfdDemand: "slow",
    jumpType: "double_leg",
    commonInjuries: [
      { injury: "general_overuse", riskWeight: 5, description: "一般过度使用——需全面预防" },
    ],
    characteristics: "无特定专项，以提升整体弹跳能力为目标。训练可以更均衡地覆盖力量、速度、增强式各方面，不受专项比赛日程限制。",
    trainingPriorities: ["均衡发展力量/速度/增强式", "动作模式建立", "伤病预防体系", "渐进负荷"],
    warnings: ["避免过度追求单一方面（如只练深蹲不练跳跃）", "每4周安排减载周"],
  },
};

/**
 * 根据运动专项ID获取专项信息
 */
export function getSportProfile(sportId: string): SportProfile | undefined {
  return SPORT_PROFILES[sportId];
}

/**
 * 获取专项的常见伤病风险加权
 */
export function getSportInjuryRisk(sportId: string, existingInjuries: string[]): { riskScore: number; factors: string[] } {
  const profile = getSportProfile(sportId);
  if (!profile) return { riskScore: 0, factors: [] };

  let score = 0;
  const factors: string[] = [];

  for (const inj of profile.commonInjuries) {
    // 如果用户已有该部位伤病史，风险加倍
    const hasHistory = existingInjuries.some(ei => 
      ei.includes(inj.injury) || inj.description.includes(ei)
    );
    const weight = hasHistory ? inj.riskWeight * 2 : inj.riskWeight;
    score += weight;
    if (hasHistory) {
      factors.push(`${inj.description}（已有伤病史——风险加倍）`);
    }
  }

  // 专项本身的基础风险
  if (score >= 20) factors.unshift(`${profile.name}本身属于高风险项目——需系统性伤病预防`);
  
  return { riskScore: Math.min(40, score), factors };
}
