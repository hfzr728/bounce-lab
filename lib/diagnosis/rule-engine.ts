// ============================================================
// 专业规则引擎 — 基于运动科学的逐维度评分算法
// ============================================================

import { AnswersMap, DimensionScore } from "@/lib/questionnaire/types";
import { DIMENSION_WEIGHTS, DIMENSION_DESCRIPTIONS,
  CMJ_NORMS_MALE, CMJ_NORMS_FEMALE, RELATIVE_SQUAT_NORMS,
  BODYFAT_NORMS_MALE, BODYFAT_NORMS_FEMALE } from "./dimensions";
import { getQuestionById, allQuestions } from "@/lib/questionnaire/questions";
import { getBasicQuestionById, basicQuestions } from "@/lib/questionnaire/basic-questions";
import { standardQuestions } from "@/lib/questionnaire/standard-questions";
import { getSportProfile, getSportInjuryRisk, SPORT_PROFILES } from "./sport-profiles";

/** 根据阈值范围查找分数 */
function scoreByRange(value: number, norms: { min: number; max: number; score: number }[]): number {
  for (const n of norms) if (value >= n.min && value < n.max) return n.score;
  return 50;
}

/**
 * 专业评分引擎：每道题 0-100 分
 */
function scoreAnswer(questionId: string, answer: string | number | string[], gender: string): number {
  const val = typeof answer === "string" ? answer : answer;
  const num = Number(answer) || 0;

  // ---- Anthropometry (维度一：基础身体信息与运动背景) ----
  if (questionId === "b05") {
    // 体脂率改为体感估算（select）
    const bfMap: Record<string, number> = {
      very_low: 85, low: 75, average: 55, high: 35, very_high: 20,
    };
    return bfMap[String(val)] ?? 50;
  }
  if (questionId === "b06") {
    // 训练年限（数值）
    if (num >= 5) return 95; if (num >= 3) return 85; if (num >= 1) return 65; if (num >= 0.5) return 45; if (num > 0) return 25; return 10;
  }
  if (questionId === "b07") {
    // 主要运动项目 — 与弹跳相关性评分
    const sportMap: Record<string, number> = {
      basketball: 90, volleyball: 90, track_jump: 95, track_sprint: 80,
      football: 70, gymnastics: 85, general_fitness: 45, other: 50,
    };
    return sportMap[String(val)] ?? 50;
  }
  if (questionId === "b08") {
    // 每周运动总时长：3-10h 为最佳，过低或过高扣分
    if (num >= 6 && num <= 10) return 80; if (num >= 3 && num < 6) return 90; if (num >= 10 && num <= 15) return 65; if (num > 15) return 35; if (num > 0) return 50; return 20;
  }
  if (questionId === "b09") {
    // 跳跃类运动经验
    return val === "yes" ? 85 : 35;
  }
  if (questionId === "b10") {
    // 站立垂直跳（可选）
    if (num >= 80) return 95; if (num >= 65) return 85; if (num >= 50) return 70; if (num >= 35) return 50; if (num > 0) return 30; return 0; // 未测量不加分
  }

  // ---- Proportion ----
  if (questionId === "p02") { return val === "long_legs" ? 90 : val === "balanced" ? 75 : val === "long_torso" ? 45 : 60; }
  if (questionId === "p03") { return val === "long" ? 90 : val === "medium" ? 70 : val === "short" ? 35 : 60; }
  if (questionId === "p04") { return val === "normal" ? 85 : val === "high" ? 60 : val === "flat" ? 40 : 60; }
  if (questionId === "p05") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 25; }
  if (questionId === "p06") { return val === "none" ? 85 : val === "leg_align" ? 50 : 60; }
  if (questionId === "p07") { return val === "high" ? 85 : val === "moderate" ? 70 : val === "low" ? 45 : 55; }

  // ---- 力量素质 (Dimension 2) ----
  if (questionId === "s01") { if (num >= 200) return 95; if (num >= 150) return 80; if (num >= 100) return 60; if (num >= 60) return 40; if (num > 0) return 20; return 10; }
  if (questionId === "s02") { return val === "highbar_parallel" ? 85 : val === "front_parallel" ? 80 : val === "full_squat" ? 70 : val === "lowbar_half" ? 50 : val === "quarter" ? 30 : 50; }
  if (questionId === "s03") { return val === "easy" ? 90 : val === "hard" ? 65 : val === "cannot" ? 30 : 50; }
  if (questionId === "s04") { return val === "easy_both" ? 90 : val === "uneven" ? 55 : val === "cannot" ? 25 : 50; }
  if (questionId === "s05") { return val === "easy_5plus" ? 95 : val === "limited" ? 65 : val === "assisted" ? 35 : val === "cannot" ? 15 : 40; }
  if (questionId === "s06") { if (num >= 180) return 90; if (num >= 130) return 75; if (num >= 80) return 55; if (num >= 40) return 35; if (num > 0) return 20; return 10; }
  if (questionId === "s07") { return val === "gt20" ? 90 : val === "10to20" ? 65 : val === "lt10" ? 30 : 50; }
  if (questionId === "s08") { if (num >= 3 && num <= 4) return 90; if (num === 2) return 75; if (num === 1) return 55; if (num >= 5) return 65; if (num > 0) return 40; return 15; }
  if (questionId === "s09") { return val === "growing_fast" ? 95 : val === "growing_slow" ? 80 : val === "stable" ? 55 : val === "declining" ? 20 : 50; }
  if (questionId === "s10") { const arr = Array.isArray(val) ? val : []; return arr.includes("none") && arr.length === 1 ? 100 : arr.includes("none") ? 80 : arr.length >= 3 ? 15 : arr.length >= 2 ? 30 : arr.length === 1 ? 50 : 60; }

  // ---- 垂直跳表现与爆发力 (Dimension 3) ----
  if (questionId === "sp01") { if (num >= 75) return 95; if (num >= 60) return 85; if (num >= 45) return 70; if (num >= 30) return 50; if (num > 0) return 30; return 10; }
  if (questionId === "sp02") { if (num >= 85) return 95; if (num >= 70) return 80; if (num >= 55) return 60; if (num >= 35) return 40; if (num > 0) return 20; return 10; }
  if (questionId === "sp03") { if (num >= 80) return 95; if (num >= 65) return 80; if (num >= 50) return 60; if (num >= 30) return 40; if (num > 0) return 20; return 10; }
  if (questionId === "sp04") { if (num >= 70) return 95; if (num >= 55) return 80; if (num >= 40) return 60; if (num >= 25) return 40; if (num > 0) return 20; return 10; }
  if (questionId === "sp05") { return val === "lt200ms" ? 95 : val === "200to250" ? 70 : val === "gt250ms" ? 35 : 50; }
  if (questionId === "sp06") { if (num >= 15) return 95; if (num >= 10) return 80; if (num >= 6) return 60; if (num >= 3) return 40; if (num > 0) return 20; return 10; }
  if (questionId === "sp07") { if (num >= 30) return 95; if (num >= 20) return 80; if (num >= 10) return 55; if (num >= 5) return 35; if (num > 0) return 20; return 10; }
  if (questionId === "sp08") { if (num >= 300) return 95; if (num >= 260) return 80; if (num >= 220) return 60; if (num >= 180) return 40; if (num > 0) return 20; return 10; }
  if (questionId === "sp09") { if (num > 0 && num <= 4.3) return 95; if (num <= 4.8) return 80; if (num <= 5.3) return 60; if (num > 5.3) return 30; return 35; }
  if (questionId === "sp10") { return val === "stable" ? 90 : val === "moderate" ? 65 : val === "unstable" ? 30 : 50; }
  if (questionId === "sp11") { return val === "1d" ? 90 : val === "2d" ? 80 : val === "3to4d" ? 55 : val === "5dplus" ? 25 : 40; }

  // ---- Mobility / Flexibility (模块 5) ----
  // m01: ankle dorsiflexion
  if (questionId === "m01") { return val === "gt10" ? 90 : val === "8to10" ? 75 : val === "5to7" ? 50 : val === "lt5" ? 25 : 10; }
  // m02: heel lift in squat
  if (questionId === "m02") { return val === "never" ? 90 : val === "sometimes" ? 70 : val === "often" ? 40 : 15; }
  // m03: back rounding in squat
  if (questionId === "m03") { return val === "flat" ? 90 : val === "sometimes" ? 65 : val === "often" ? 35 : 15; }
  // m04: sit & reach
  if (questionId === "m04") { return val === "excellent" ? 90 : val === "touch" ? 75 : val === "5to10" ? 50 : val === "gt10" ? 25 : 40; }
  // m05: Thomas test
  if (questionId === "m05") { return val === "pass" ? 90 : val === "parallel" ? 65 : val === "tight" ? 30 : 40; }
  // m06: overhead squat
  if (questionId === "m06") { return val === "pass" ? 90 : val === "arms_forward" ? 65 : val === "lean_forward" ? 35 : 15; }
  // m07: hip rotation
  if (questionId === "m07") { return val === "both_good" ? 90 : val === "one_limited" ? 55 : 25; }
  // m08: single-leg balance
  if (questionId === "m08") { if (num >= 60) return 90; if (num >= 30) return 75; if (num >= 15) return 55; if (num >= 5) return 35; return 15; }
  // m09: stiffness (multiSelect — scored by absence)
  if (questionId === "m09") { return val === "rarely" ? 90 : 50; }
  // m10: flexibility training frequency
  if (questionId === "m10") { return val === "ge4" ? 90 : val === "2to3" ? 75 : val === "1" ? 55 : val === "monthly" ? 30 : 10; }

  // ---- Reactive / Plyometric (模块 6) ----
  // r01: depth jump familiarity
  if (questionId === "r01") { return val === "trained" ? 90 : val === "regular" ? 75 : val === "rarely" ? 45 : 15; }
  // r02: single-leg depth jump
  if (questionId === "r02") { return val === "both_easy" ? 90 : val === "dominant_only" ? 60 : val === "cannot_control" ? 30 : 15; }
  // r03: hurdle depth jump
  if (questionId === "r03") { return val === "easy" ? 90 : val === "low_only" ? 55 : val === "cannot" ? 25 : 15; }
  // r04: lateral hop count
  if (questionId === "r04") { if (num >= 15) return 90; if (num >= 10) return 75; if (num >= 5) return 55; if (num >= 2) return 35; return 15; }
  // r05: triple jump
  if (questionId === "r05") { if (num >= 700) return 90; if (num >= 550) return 75; if (num >= 400) return 55; if (num >= 250) return 35; return 15; }
  // r06: recovery days
  if (questionId === "r06") { return val === "1d" ? 90 : val === "2d" ? 75 : val === "3to4d" ? 50 : val === "5dplus" ? 25 : 30; }
  // r07: pain during plyo (multiSelect — scored by absence)
  if (questionId === "r07") { return val === "none" ? 90 : 30; }
  // r08: training surface
  if (questionId === "r08") { return val === "grass" ? 90 : val === "wood" ? 85 : val === "concrete" ? 30 : val === "indoor" ? 45 : 60; }
  // r09: weekly plyo frequency
  if (questionId === "r09") { if (num >= 1 && num <= 2) return 90; if (num === 0) return 30; if (num >= 3) return 70; return 50; }
  // r10: touchdown count
  if (questionId === "r10") { if (num >= 60 && num <= 100) return 90; if (num >= 40 && num < 60) return 75; if (num >= 20 && num < 40) return 55; if (num > 100 && num <= 150) return 65; if (num > 150) return 35; return 20; }

  // ---- Glute Function (模块 7) ----
  // g01: glute activation awareness
  if (questionId === "g01") { return val === "yes_clear" ? 90 : val === "sometimes" ? 65 : val === "rarely" ? 30 : 40; }
  // g02: hip thrust strength
  if (questionId === "g02") { return val === "gt2x" ? 90 : val === "1.5-2x" ? 75 : val === "1-1.5x" ? 50 : val === "lt1x" ? 25 : 30; }
  // g03: single-leg glute bridge
  if (questionId === "g03") { return val === "easy_both" ? 90 : val === "asymmetry" ? 55 : val === "struggle" ? 30 : 15; }
  // g04: side-lying hip abduction (glute medius)
  if (questionId === "g04") { return val === "yes" ? 90 : val === "compensation" ? 55 : val === "struggle" ? 25 : 30; }
  // g05: prone hip extension
  if (questionId === "g05") { return val === "clean" ? 90 : val === "compensation" ? 55 : val === "struggle" ? 25 : 30; }
  // g06: hip hinge quality
  if (questionId === "g06") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 45 : 20; }
  // g07: glute soreness after jumping
  if (questionId === "g07") { return val === "often" ? 85 : val === "sometimes" ? 65 : val === "rarely" ? 35 : 15; }
  // g08: glute training frequency
  if (questionId === "g08") { return val === "ge3" ? 90 : val === "2" ? 75 : val === "1" ? 55 : val === "rarely" ? 30 : 10; }
  // g09: single-leg pelvic stability (Trendelenburg)
  if (questionId === "g09") { return val === "stable_both" ? 90 : val === "asymmetry" ? 50 : val === "unstable" ? 20 : 35; }
  // g10: glute compensation issues
  if (questionId === "g10") { return val === "none" ? 90 : val === "unknown" ? 50 : 25; }

  // ---- Injury History (模块 8) ----
  // i01: past injuries (multiSelect — scored by absence)
  if (questionId === "i01") { return val === "none" ? 95 : 30; }
  // i02: time since last injury
  if (questionId === "i02") { return val === "gt1y" ? 90 : val === "6to12m" ? 75 : val === "3to6m" ? 55 : val === "lt3m" ? 30 : val === "current" ? 10 : 50; }
  // i03: current pain locations (multiSelect — scored by absence)
  if (questionId === "i03") { return val === "none" ? 95 : 25; }
  // i04: injury recurrence
  if (questionId === "i04") { return val === "na" ? 90 : val === "never_recur" ? 85 : val === "sometimes" ? 55 : val === "frequent" ? 20 : 10; }
  // i05: medical clearance
  if (questionId === "i05") { return val === "cleared" ? 90 : val === "restricted" ? 50 : val === "not_consulted" ? 60 : 50; }
  // i06: injury prevention knowledge
  if (questionId === "i06") { return val === "systematic" ? 90 : val === "basic" ? 70 : val === "little" ? 40 : 20; }
  // i07: training adjustment due to pain
  if (questionId === "i07") { return val === "never" ? 90 : val === "sometimes" ? 60 : val === "often" ? 30 : 10; }
  // i08: video analysis experience
  if (questionId === "i08") { return val === "pro" ? 90 : val === "self" ? 65 : 30; }
  // i09: recent acute injuries (6 months)
  if (questionId === "i09") { return val === "none" ? 95 : val === "1_minor" ? 65 : val === "2-3" ? 35 : 10; }
  // i10: return-to-play criteria
  if (questionId === "i10") { return val === "systematic" ? 90 : val === "feel" ? 45 : val === "unclear" ? 20 : 50; }

  // ---- Recovery / Lifestyle (模块 9) ----
  // h01: sleep duration
  if (questionId === "h01") { return val === "ge8" ? 95 : val === "7to8" ? 75 : val === "6to7" ? 50 : 20; }
  // h02: sleep quality
  if (questionId === "h02") { return val === "excellent" ? 95 : val === "good" ? 75 : val === "average" ? 50 : 20; }
  // h03: nutrition quality
  if (questionId === "h03") { return val === "strict" ? 90 : val === "moderate" ? 75 : val === "average" ? 50 : 20; }
  // h04: hydration
  if (questionId === "h04") { return val === "ge3" ? 90 : val === "2to3" ? 75 : val === "1to2" ? 50 : 25; }
  // h05: alcohol
  if (questionId === "h05") { return val === "none" ? 95 : val === "rare" ? 70 : val === "weekly" ? 40 : 10; }
  // h06: stress (slider 1-10)
  if (questionId === "h06") { return Math.max(10, 110 - num * 10); }
  // h07: recovery methods (multiSelect)
  if (questionId === "h07") { const arr = Array.isArray(val) ? val : []; const cnt = arr.filter((a: string) => a !== "none").length; return Math.min(95, 25 + cnt * 14); }
  // h08: sedentary time
  if (questionId === "h08") { return val === "lt4" ? 85 : val === "4to8" ? 70 : val === "8to12" ? 45 : 25; }
  // h09: active recovery
  if (questionId === "h09") { return val === "regular" ? 90 : val === "occasional" ? 65 : val === "sedentary" ? 40 : 15; }
  // h10: supplements
  if (questionId === "h10") { return val === "systematic" ? 85 : val === "basic" ? 65 : 45; }

  // ---- Psychology (模块 10) ----
  // ps01: motivation
  if (questionId === "ps01") { return val === "very_high" ? 90 : val === "high" ? 75 : val === "moderate" ? 50 : 25; }
  // ps02: frustration tolerance
  if (questionId === "ps02") { return val === "analyze" ? 90 : val === "persist" ? 70 : val === "frustrated" ? 40 : 15; }
  // ps03: goal setting
  if (questionId === "ps03") { return val === "smart" ? 90 : val === "vague" ? 60 : val === "unclear" ? 30 : 15; }
  // ps04: training consistency
  if (questionId === "ps04") { return val === "consistent" ? 90 : val === "mostly" ? 70 : val === "unstable" ? 40 : 15; }
  // ps05: visualization
  if (questionId === "ps05") { return val === "often" ? 85 : val === "sometimes" ? 65 : val === "rarely" ? 40 : 15; }
  // ps06: coachability
  if (questionId === "ps06") { return val === "open" ? 90 : val === "cautious" ? 70 : val === "self" ? 45 : 40; }
  // ps07: fear of injury
  if (questionId === "ps07") { return val === "never" ? 90 : val === "sometimes" ? 65 : val === "often" ? 30 : val === "major" ? 10 : 50; }
  // ps08: support environment
  if (questionId === "ps08") { return val === "supported" ? 90 : val === "self_motivated" ? 75 : val === "isolated" ? 45 : 25; }

  // ---- Technique (模块 11) ----
  // t01: self-rated technique
  if (questionId === "t01") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 25; }
  // t02: arm swing coordination
  if (questionId === "t02") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 45 : 20; }
  // t03: countermovement quality
  if (questionId === "t03") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : val === "poor" ? 20 : 35; }
  // t04: landing mechanics
  if (questionId === "t04") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 45 : 20; }
  // t05: take-off preference
  if (questionId === "t05") { return val === "bilateral" ? 90 : val === "asymmetric" ? 55 : val === "both_single" ? 70 : 35; }
  // t06: approach jump consistency
  if (questionId === "t06") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 45 : 25; }
  // t07: video analysis habit
  if (questionId === "t07") { return val === "weekly" ? 90 : val === "monthly" ? 70 : val === "rarely" ? 40 : 15; }
  // t08: technique correction ability
  if (questionId === "t08") { return val === "strong" ? 90 : val === "moderate" ? 65 : val === "weak" ? 30 : 35; }

  // ---- Availability ----
  if (questionId === "a01") { return val === "6-7" ? 95 : val === "4-5" ? 80 : val === "3" ? 60 : val === "2" ? 40 : 25; }
  if (questionId === "a02") { return val === "120+" ? 90 : val === "90-120" ? 80 : val === "60-90" ? 60 : val === "45-60" ? 40 : 25; }
  if (questionId === "a03") { return val === "pro" ? 95 : val === "gym" ? 80 : val === "home_gym" ? 55 : 35; }
  if (questionId === "a07") { return val === "coach" ? 90 : val === "partner" ? 70 : 45; }
  if (questionId === "a08") { return val === "max" ? 90 : val === "high" ? 80 : val === "moderate" ? 55 : 30; }
  if (questionId === "a09") { return val === "proficient" ? 95 : val === "novice" ? 60 : 30; }

  // ---- MultiSelect answers for movement background ----
  if (questionId === "ex04") {
    const sports = Array.isArray(val) ? val as string[] : [val as string];
    if (sports.includes("none")) return 15;
    let s = 50;
    if (sports.includes("track_jump") || sports.includes("volleyball")) s += 20;
    if (sports.includes("basketball") || sports.includes("track_sprint")) s += 15;
    if (sports.includes("weightlifting")) s += 10;
    return Math.min(95, s);
  }

  // ---- Basic Questionnaire (bbXX IDs) 基础版 ----
  if (questionId.startsWith("bb")) {
    if (questionId === "bb01") { return val === "16-25" ? 88 : val === "26-35" ? 72 : val === "le15" ? 50 : 58; }
    if (questionId === "bb02") { return val === "fit" ? 82 : val === "lean" ? 72 : val === "muscular" ? 78 : 38; }
    if (questionId === "bb03") { return val === "regular" ? 85 : val === "frequent" ? 88 : val === "occasional" ? 58 : 28; }
    if (questionId === "bb04") { return val === "yes_often" ? 85 : val === "sometimes" ? 62 : 35; }
    if (questionId === "bb05") { return val === "trained" ? 85 : val === "casual" ? 55 : 25; }
    if (questionId === "bb06") { return val === "very_strong" ? 92 : val === "strong" ? 75 : val === "average" ? 50 : 25; }
    if (questionId === "bb07") { return val === "stable" ? 85 : val === "unstable" ? 48 : 18; }
    if (questionId === "bb08") { return val === "strong" ? 85 : val === "average" ? 58 : 28; }
    if (questionId === "bb09") { return val === "excellent" ? 92 : val === "good" ? 72 : val === "average" ? 50 : 25; }
    if (questionId === "bb10") { return val === "much_higher" ? 85 : val === "similar" ? 55 : 32; }
    if (questionId === "bb11") { return val === "fast" ? 88 : val === "average" ? 55 : 25; }
    if (questionId === "bb12") { return val === "gt20" ? 88 : val === "10-20" ? 65 : 35; }
    if (questionId === "bb13") { return val === "equal" ? 85 : val === "lower" ? 40 : 30; }
    if (questionId === "bb14") { return val === "soft" ? 88 : val === "average" ? 58 : 25; }
    if (questionId === "bb15") { return val === "good" ? 88 : val === "average" ? 58 : 28; }
    if (questionId === "bb16") { return val === "never" ? 88 : val === "sometimes" ? 58 : 22; }
    if (questionId === "bb17") { return val === "not_stiff" ? 88 : val === "slightly" ? 62 : 28; }
    if (questionId === "bb18") { return val === "glute" ? 88 : val === "hamstring" ? 68 : val === "calf" ? 52 : val === "quad" ? 32 : 40; }
    if (questionId === "bb19") { return val === "glute" ? 88 : val === "hamstring" ? 62 : val === "quad" ? 35 : 22; }
    if (questionId === "bb20") { return val === "lt6" ? 85 : val === "6-8" ? 60 : 30; }
    if (questionId === "bb21") { return val === "none" ? 92 : val === "multiple" ? 15 : 30; }
    if (questionId === "bb22") { return val === "none" ? 90 : 20; }
    if (questionId === "bb23") { return val === "none" ? 90 : val === "old" ? 62 : 15; }
    if (questionId === "bb24") { return val === "7-9" ? 90 : val === "gt9" ? 78 : val === "6-7" ? 52 : 20; }
    if (questionId === "bb25") { return val === "low" ? 88 : val === "medium" ? 60 : 25; }
    if (questionId === "bb26") { return val === "energized" ? 88 : val === "tired" ? 60 : 25; }
    if (questionId === "bb27") { return val === "dunk" ? 88 : val === "volleyball" ? 82 : val === "stronger" ? 78 : 65; }
    if (questionId === "bb28") { return val === "yes" ? 88 : val === "maybe" ? 58 : 30; }
    if (questionId === "bb29") { return val === "analyze" ? 88 : val === "push_harder" ? 58 : 22; }
    if (questionId === "bb30") { return val === "smooth" ? 88 : val === "average" ? 55 : 22; }
    if (questionId === "bb31") { return val === "strong" ? 88 : val === "weak" ? 40 : 18; }
    if (questionId === "bb32") { return val === "no" ? 88 : val === "sometimes" ? 55 : 22; }
    return 50;
  }

  // ---- Standard Questionnaire (stXX IDs) 国际标准版 ----
  if (questionId.startsWith("st")) {
    if (questionId === "st05") { const norms = gender === "female" ? BODYFAT_NORMS_FEMALE : BODYFAT_NORMS_MALE; return scoreByRange(num, norms); }
    if (questionId === "st07") { return val === "small" ? 85 : val === "medium" ? 75 : val === "large" ? 45 : 60; }
    if (questionId === "st08") { return val === "long_legs" ? 90 : val === "balanced" ? 75 : val === "long_torso" ? 45 : 60; }
    if (questionId === "st09") { return val === "normal" ? 85 : val === "high" ? 60 : val === "flat" ? 40 : 60; }
    if (questionId === "st10") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 25; }
    if (questionId === "st11") { const arr = Array.isArray(val) ? val : []; return arr.includes("none") ? 85 : arr.length >= 2 ? 45 : 65; }
    if (questionId === "st12") { return val === "elite" ? 95 : val === "advanced" ? 75 : val === "intermediate" ? 50 : val === "novice" ? 25 : 10; }
    if (questionId === "st13") { return val === "elite" ? 95 : val === "advanced" ? 75 : val === "intermediate" ? 50 : val === "novice" ? 25 : 10; }
    if (questionId === "st14") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 50 : val === "weak" ? 25 : 40; }
    if (questionId === "st15") { return val === "strong" ? 85 : val === "good" ? 65 : val === "average" ? 45 : 25; }
    if (questionId === "st16") { return val === "balanced" ? 90 : val === "slight" ? 70 : val === "moderate" ? 40 : val === "severe" ? 15 : 50; }
    if (questionId === "st17") { return val === "excellent" ? 85 : val === "good" ? 65 : val === "average" ? 40 : 20; }
    if (questionId === "st18") { const norms = gender === "female" ? CMJ_NORMS_FEMALE : CMJ_NORMS_MALE; return scoreByRange(num, norms); }
    if (questionId === "st19") { if (num >= 330) return 95; if (num >= 300) return 80; if (num >= 270) return 60; if (num >= 240) return 40; if (num > 0) return 20; return 15; }
    if (questionId === "st20") { if (num >= 280) return 95; if (num >= 250) return 80; if (num >= 220) return 60; if (num >= 190) return 45; if (num > 0) return 25; return 15; }
    if (questionId === "st21") { if (num > 0 && num <= 4.0) return 95; if (num <= 4.5) return 75; if (num <= 5.0) return 55; if (num > 5.0) return 30; return 35; }
    if (questionId === "st22") { return val === "explosive" ? 90 : val === "good" ? 70 : val === "slow_str" ? 45 : 25; }
    if (questionId === "st23") { return val === "balanced" ? 85 : val === "velo_dom" ? 65 : val === "force_dom" ? 60 : 55; }
    if (questionId === "st24") { return val === "balanced" ? 85 : val === "strength_heavy" ? 65 : val === "plyo_heavy" ? 60 : 55; }
    if (questionId === "st25" || questionId === "st26" || questionId === "st27" || questionId === "st28" || questionId === "st29" || questionId === "st30" || questionId === "st31") {
      if (val === "3") return 90; if (val === "2") return 60; if (val === "1") return 30; if (val === "0") return 10; return 50;
    }
    if (questionId === "st32") { if (num >= 20) return 90; if (num >= 10) return 75; if (num >= 0) return 60; if (num >= -10) return 45; return 30; }
    if (questionId === "st33") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : val === "poor" ? 20 : 50; }
    if (questionId === "st34") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 20; }
    if (questionId === "st35") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 45 : 20; }
    if (questionId === "st36") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 45 : 25; }
    if (questionId === "st37") { return val === "fast" ? 90 : val === "normal" ? 70 : val === "slow" ? 40 : 20; }
    if (questionId === "st38") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 50 : val === "poor" ? 25 : 50; }
    if (questionId === "st39") { return val === "5y+" ? 95 : val === "2-5y" ? 75 : val === "1-2y" ? 55 : val === "6m-1y" ? 35 : 15; }
    if (questionId === "st40") { return val === "yes_sys" ? 85 : val === "yes_casual" ? 55 : 25; }
    if (questionId === "st41") { const arr = Array.isArray(val) ? val : []; return arr.includes("none") ? 90 : Math.max(20, 90 - arr.length * 15); }
    if (questionId === "st42") { return val === "never" ? 95 : val === "old" ? 75 : val === "1y" ? 55 : val === "6m" ? 30 : 15; }
    if (questionId === "st43") { return val === "yes_full" ? 90 : val === "yes_brief" ? 70 : val === "occasional" ? 45 : 15; }
    if (questionId === "st44") { return val === "8+" ? 95 : val === "7-8" ? 75 : val === "6-7" ? 45 : 20; }
    if (questionId === "st45") { return val === "good" ? 90 : val === "average" ? 60 : 30; }
    if (questionId === "st46") { return val === "good" ? 90 : val === "average" ? 65 : 35; }
    if (questionId === "st47") { return Math.max(10, 110 - num * 10); }
    if (questionId === "st48") { return val === "frequent" ? 90 : val === "occasional" ? 65 : val === "rare" ? 40 : 15; }
    if (questionId === "st49") { return val === "5-7" ? 95 : val === "3-4" ? 75 : 35; }
    if (questionId === "st50") { return val === "90+" ? 90 : val === "60-90" ? 75 : val === "30-60" ? 50 : 30; }
    if (questionId === "st51") { return val === "full_gym" ? 95 : val === "basic" ? 65 : 40; }
    if (questionId === "st52") { return val === "20+" ? 95 : val === "10-20" ? 80 : val === "5-10" ? 65 : 50; }
    if (questionId === "st54") { return val === "proficient" ? 95 : val === "novice" ? 60 : 30; }
    return 50;
  }

  // ---- Advanced Questionnaire (avXX IDs) 进阶版 ----
  if (questionId.startsWith("av")) {
    // 维度1：基础
    if (questionId === "av01") { if (num >= 16 && num <= 30) return 85; if (num >= 31 && num <= 40) return 70; if (num > 40) return 55; return 60; }
    if (questionId === "av03") { const h = num; const idealM = 178, idealF = 165; const ideal = gender === "female" ? idealF : idealM; return Math.max(15, 95 - Math.abs(h - ideal) * 1.5); }
    if (questionId === "av04") { const idealBMIM = 22, idealBMIF = 21; const bmiIdeal = gender === "female" ? idealBMIF : idealBMIM; return Math.max(15, 95 - Math.abs(bmiIdeal - 22) * 8); }
    if (questionId === "av05") { return val === "lean" ? 90 : val === "standard" ? 78 : val === "high" ? 45 : 20; }
    if (questionId === "av06") { return val === "gt3" ? 90 : val === "1-3" ? 70 : val === "05-1" ? 45 : 25; }
    if (questionId === "av07") { return val === "basketball" || val === "volleyball" || val === "track" ? 85 : val === "football" ? 70 : 50; }
    if (questionId === "av08") { return val === "6-10" ? 85 : val === "3-6" ? 75 : val === "gt10" ? 65 : 40; }
    if (questionId === "av09") { return val === "yes" ? 85 : 35; }
    if (questionId === "av10") { if (num >= 70) return 95; if (num >= 55) return 78; if (num >= 40) return 58; if (num > 0) return 35; return 25; }
    // 维度2：力量
    if (questionId === "av11") { return val === "gt2x" ? 95 : val === "1.6-2x" ? 80 : val === "1.3-1.6x" ? 60 : val === "1-1.3x" ? 40 : val === "lt1x" ? 25 : val === "bw" ? 15 : 5; }
    if (questionId === "av12") { const arr = Array.isArray(val) ? val : []; let s = 50; if (arr.includes("parallel")) s += 20; if (arr.includes("half") || arr.includes("quarter")) s -= 15; return Math.max(10, Math.min(95, s)); }
    if (questionId === "av13") { return val === "both_easy" ? 90 : val === "limited" ? 55 : val === "cannot" ? 25 : 30; }
    if (questionId === "av14") { return val === "gt25" ? 90 : val === "16-25" ? 72 : val === "10-15" ? 50 : val === "lt10" ? 25 : 35; }
    if (questionId === "av15") { return val === "glute" ? 88 : val === "slight" ? 65 : val === "quad" ? 30 : 40; }
    if (questionId === "av16") { return val === "glute" ? 88 : val === "hamstring" ? 50 : val === "lowback" ? 25 : val === "cannot" ? 10 : 35; }
    if (questionId === "av17") { return val === "2" ? 88 : val === "3" ? 80 : val === "1" ? 55 : val === "ge4" ? 65 : 30; }
    if (questionId === "av18") { return val === "growing" ? 90 : val === "slow" ? 72 : val === "stable" ? 50 : val === "decline" ? 20 : 45; }
    if (questionId === "av19") { return val === "none" ? 90 : 25; }
    // 维度3：爆发力
    if (questionId === "av20") { return val === "gt70" ? 95 : val === "55-70" ? 78 : val === "40-55" ? 58 : val === "30-40" ? 40 : 25; }
    if (questionId === "av21") { return val === "much_higher" ? 88 : val === "slightly" ? 70 : val === "same" ? 45 : val === "single_leg" ? 60 : 40; }
    if (questionId === "av22") { return val === "equal_or_higher" ? 90 : val === "slightly_lower" ? 65 : val === "much_lower" ? 35 : 30; }
    if (questionId === "av23") { return val === "equal" ? 88 : val === "lower" ? 45 : val === "painful" ? 20 : 30; }
    if (questionId === "av24") { return val === "gt15" ? 90 : val === "11-15" ? 72 : val === "6-10" ? 50 : val === "lt6" ? 28 : 35; }
    if (questionId === "av25") { return val === "gt30" ? 90 : val === "21-30" ? 72 : val === "10-20" ? 50 : val === "lt10" ? 25 : 35; }
    if (questionId === "av26") { return val === "gt260" ? 95 : val === "230-260" ? 78 : val === "200-230" ? 58 : val === "lt200" ? 35 : 30; }
    if (questionId === "av27") { return val === "higher" ? 88 : val === "slightly" ? 75 : val === "same" ? 60 : val === "lower" ? 35 : 50; }
    if (questionId === "av28") { return val === "always" ? 60 : val === "weekly" ? 78 : val === "biweekly" ? 88 : val === "monthly" ? 70 : 40; }
    if (questionId === "av29") { return val === "small" ? 88 : val === "medium" ? 68 : val === "large" ? 40 : 50; }
    // 维度4：反应力量
    if (questionId === "av30") { return val === "regular" ? 90 : val === "occasional" ? 68 : val === "rare" ? 42 : 20; }
    if (questionId === "av31") { return val === "30-45" ? 85 : val === "50-60" ? 72 : val === "15-25" ? 45 : val === "gt60" ? 60 : 30; }
    if (questionId === "av32") { return val === "light" ? 92 : val === "both_stable" ? 78 : val === "unstable" ? 42 : 20; }
    if (questionId === "av33") { return val === "both" ? 88 : val === "asymmetric" ? 52 : val === "cannot" ? 25 : 30; }
    if (questionId === "av34") { return val === "powerful" ? 90 : val === "normal" ? 68 : val === "poor" ? 38 : 25; }
    if (questionId === "av35") { return val === "very_fast" ? 95 : val === "fast" ? 78 : val === "medium" ? 55 : val === "slow" ? 35 : 20; }
    if (questionId === "av36") { return val === "1d" ? 92 : val === "2d" ? 78 : val === "3-4d" ? 52 : val === "ge5d" ? 25 : 35; }
    if (questionId === "av37") { return val === "none" ? 90 : 25; }
    if (questionId === "av38") { return val === "grass" ? 92 : val === "wood" ? 85 : val === "indoor" ? 50 : val === "concrete" ? 28 : 55; }
    if (questionId === "av39") { return val === "1" || val === "2" ? 85 : val === "0" ? 35 : val === "ge3" ? 68 : 50; }
    // 维度5：活动度
    if (questionId === "av40") { return val === "never" ? 90 : val === "sometimes" ? 65 : val === "often" ? 38 : 15; }
    if (questionId === "av41") { return val === "flat" ? 90 : val === "sometimes" ? 62 : val === "often" ? 32 : 12; }
    if (questionId === "av42") { return val === "excellent" ? 90 : val === "touch" ? 75 : val === "5-10" ? 48 : 25; }
    if (questionId === "av43") { return val === "loose" ? 90 : val === "parallel" ? 62 : val === "tight" ? 28 : 40; }
    if (questionId === "av44") { return val === "gt20" ? 90 : val === "10-20" ? 68 : val === "5-10" ? 42 : val === "lt5" ? 20 : 35; }
    if (questionId === "av45") { return val === "rarely" ? 88 : 48; }
    if (questionId === "av46") { return val === "both" ? 88 : val === "one_limited" ? 55 : val === "both_limited" ? 25 : 45; }
    if (questionId === "av47") { return val === "upright" ? 90 : val === "slight" ? 65 : val === "lean" ? 35 : 15; }
    if (questionId === "av48") { return val === "gt30" ? 90 : val === "20-30" ? 72 : val === "10-20" ? 48 : 25; }
    if (questionId === "av49") { return val === "ge4" ? 90 : val === "2-3" ? 75 : val === "1" ? 52 : 20; }
    // 维度6：臀肌
    if (questionId === "av50") { return val === "glute" ? 88 : val === "slight" ? 65 : val === "quad" ? 30 : 40; }
    if (questionId === "av51") { return val === "glute" ? 88 : val === "hamstring" ? 60 : val === "quad" ? 35 : val === "lowback" ? 25 : 45; }
    if (questionId === "av52") { return val === "gt30" ? 90 : val === "20-30" ? 72 : val === "10-20" ? 48 : val === "lt10" ? 22 : 35; }
    if (questionId === "av53") { return val === "never" ? 90 : val === "sometimes" ? 58 : val === "often" ? 22 : 45; }
    if (questionId === "av54") { return val === "stable" ? 90 : val === "forward" ? 72 : val === "backward" ? 35 : val === "sideways" ? 48 : 40; }
    if (questionId === "av55") { return val === "both" ? 88 : val === "one_side" ? 52 : val === "neither" ? 22 : 35; }
    if (questionId === "av56") { return val === "good" ? 88 : val === "slight_valgus" ? 58 : val === "valgus" ? 25 : val === "lean" ? 35 : 45; }
    if (questionId === "av57") { return val === "lt4" ? 88 : val === "4-6" ? 72 : val === "6-8" ? 48 : 25; }
    if (questionId === "av58") { return val === "always" ? 90 : val === "2-3" ? 75 : val === "1" ? 55 : val === "rarely" ? 32 : 12; }
    if (questionId === "av59") { return val === "glute" ? 88 : val === "hamstring" ? 50 : val === "lowback" ? 25 : val === "cannot" ? 10 : 35; }
    // 维度7：伤病（安全评分——无伤满分，有伤递减）
    if (questionId === "av60") { return val === "none" ? 92 : val === "mild" ? 68 : val === "frequent" ? 32 : 10; }
    if (questionId === "av61") { return val === "none" ? 92 : val === "mild" ? 62 : 22; }
    if (questionId === "av62") { return val === "none" ? 92 : val === "mild" ? 65 : 22; }
    if (questionId === "av63") { return val === "never" ? 92 : val === "healed" ? 72 : 28; }
    if (questionId === "av64") { return val === "never" ? 92 : val === "once" ? 68 : 28; }
    if (questionId === "av65") { return val === "never" ? 92 : val === "mild" ? 62 : 25; }
    if (questionId === "av66") { return val === "never" ? 90 : val === "mild" ? 58 : 22; }
    if (questionId === "av67") { return val === "no" ? 95 : 10; }
    if (questionId === "av68") { return val === "none" ? 90 : 35; }
    if (questionId === "av69") { return val === "none" ? 92 : val === "mild" ? 65 : val === "significant" ? 28 : 8; }
    // 维度8：恢复
    if (questionId === "av70") { return val === "2" || val === "3" ? 88 : val === "ge4" ? 65 : val === "0-1" ? 38 : 50; }
    if (questionId === "av71") { return val === "60-90" ? 88 : val === "30-60" ? 75 : val === "gt90" ? 55 : 35; }
    if (questionId === "av72") { return val === "7-8" ? 82 : val === "le6" ? 88 : 35; }
    if (questionId === "av73") { return val === "7-9" ? 92 : val === "gt9" ? 78 : val === "6-7" ? 52 : 20; }
    if (questionId === "av74") { return val === "excellent" ? 95 : val === "good" ? 78 : val === "average" ? 52 : val === "poor" ? 28 : 12; }
    if (questionId === "av75") { return val === "high" ? 88 : val === "moderate" ? 65 : val === "low" ? 30 : 50; }
    if (questionId === "av76") { return val === "2-3" ? 88 : val === "gt3" ? 90 : val === "1-2" ? 55 : val === "lt1" ? 25 : 45; }
    if (questionId === "av77") { return val === "very_low" ? 92 : val === "low" ? 80 : val === "medium" ? 60 : val === "high" ? 35 : 12; }
    if (questionId === "av78") { return val === "daily" ? 92 : val === "2-3" ? 78 : val === "1" ? 55 : 22; }
    if (questionId === "av79") { return val === "yes" ? 90 : val === "irregular" ? 60 : val === "never" ? 28 : 40; }
    // 维度9：心理
    if (questionId === "av80") { return val === "dunk" ? 88 : val === "performance" ? 82 : val === "number" ? 78 : val === "process" ? 85 : 60; }
    if (questionId === "av81") { return val === "higher" ? 88 : val === "slightly" ? 78 : val === "same" ? 60 : val === "lower" ? 35 : 50; }
    if (questionId === "av82") { return val === "detailed" ? 90 : val === "sometimes" ? 62 : 32; }
    if (questionId === "av83") { return val === "none" ? 90 : val === "1" ? 58 : 25; }
    if (questionId === "av84") { return val === "analyze" ? 90 : val === "push_harder" ? 55 : val === "frustrated" ? 28 : val === "quit" ? 10 : 50; }
    if (questionId === "av85") { return val === "excited" ? 90 : val === "calm" ? 72 : val === "anxious" ? 35 : 50; }
    if (questionId === "av86") { return val === "explosive" ? 90 : val === "nothing" ? 68 : val === "inhibitory" ? 38 : val === "overthink" ? 42 : 55; }
    if (questionId === "av87") { return val === "strongly" ? 90 : val === "somewhat" ? 68 : val === "doubt" ? 32 : 50; }
    if (questionId === "av88") { return val === "accept" ? 90 : val === "continue" ? 72 : val === "disappointed" ? 38 : 18; }
    if (questionId === "av89") { return val === "fun" ? 92 : val === "ok" ? 70 : val === "boring" ? 40 : 18; }
    // 维度10：技术
    if (questionId === "av90") { return val === "medium" ? 88 : val === "deep" ? 65 : val === "shallow" ? 42 : val === "very_deep" ? 55 : 50; }
    if (questionId === "av91") { return val === "full" ? 90 : val === "partial" ? 55 : 20; }
    if (questionId === "av92") { return val === "yes" ? 90 : val === "partial" ? 58 : val === "flat" ? 25 : 50; }
    if (questionId === "av93") { return val === "soft" ? 90 : val === "moderate" ? 62 : val === "stiff" ? 22 : val === "valgus" ? 15 : 50; }
    if (questionId === "av94") { return val === "smooth" ? 90 : val === "sometimes" ? 62 : val === "choppy" ? 32 : 35; }
    if (questionId === "av95") { return val === "stable" ? 90 : val === "slight" ? 58 : val === "unstable" ? 22 : 35; }
    if (questionId === "av96") { return val === "upright" ? 90 : val === "slight_arch" ? 62 : val === "lean" ? 35 : val === "twisted" ? 18 : 50; }
    if (questionId === "av97") { if (num >= 8) return 90; if (num >= 6) return 68; if (num >= 4) return 42; return 20; }
    if (questionId === "av98") { return val === "often" ? 88 : val === "sometimes" ? 65 : val === "willing" ? 48 : 22; }
    if (questionId === "av99") { return val === "always" ? 90 : val === "1-2" ? 72 : val === "rarely" ? 40 : 18; }
    return 50;
  }

  return 50;
}

/** 计算单个维度得分（该维度下所有已回答题目平均分） */
function calculateDimensionScore(dimension: string, answers: AnswersMap, gender: string): number {
  const dimQuestions = allQuestions.filter(q => q.dimension === dimension);
  const answered = dimQuestions.filter(q => answers[q.id] !== undefined && answers[q.id] !== "" && answers[q.id] !== null);
  if (answered.length === 0) return 50;
  const scores = answered.map(q => scoreAnswer(q.id, answers[q.id], gender));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** 检测是否为基本版问卷（id 以 bb 开头） */
function isBasicAnswers(answers: AnswersMap): boolean {
  return Object.keys(answers).some(k => k.startsWith("bb"));
}

/** 检测是否为进阶版问卷（id 以 st 或 av 开头） */
function isStandardAnswers(answers: AnswersMap): boolean {
  return Object.keys(answers).some(k => k.startsWith("st") || k.startsWith("av"));
}

/** 标准版维度得分计算 */
function calculateStandardDimensionScore(dimension: string, answers: AnswersMap, gender: string): number {
  const dimQuestions = standardQuestions.filter(q => q.dimension === dimension);
  const answered = dimQuestions.filter(q => answers[q.id] !== undefined && answers[q.id] !== "" && answers[q.id] !== null);
  if (answered.length === 0) return 50;
  const scores = answered.map(q => scoreAnswer(q.id, answers[q.id], gender));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** 基础版逐题评分（体测版比标准版宽松8-12分，因自评数据不够精确） */
function scoreBasicAnswer(questionId: string, answer: string | number | string[]): number {
  const val = typeof answer === "string" ? answer : answer;
  const num = Number(answer) || 0;
  // 基础版评分采用更宽松的标准——自评/体测数据精确度不如专业测试
  let raw = 50;
  if (questionId === "bb05") { raw = Math.round(110 - num * 10); }
  else if (questionId === "bb06") { raw = val === "small" ? 85 : val === "medium" ? 75 : 50; }
  else if (questionId === "bb08") { if (num>0&&num<=6.5) raw=90; else if (num<=7.5) raw=70; else if (num<=9) raw=45; else if (num>9) raw=25; else raw=35; }
  else if (questionId === "bb09") { if (num>=260) raw=95; else if (num>=230) raw=75; else if (num>=200) raw=55; else if (num>=170) raw=35; else if (num>0) raw=20; else raw=15; }
  else if (questionId === "bb10") { if (num>=15) raw=90; else if (num>=5) raw=70; else if (num>=-5) raw=50; else if (num>=-20) raw=30; else raw=20; }
  else if (questionId === "bb11") { raw = val==="high"?90:val==="good"?70:val==="mid"?45:val==="low"?20:35; }
  else if (questionId === "bb12") { raw = val==="excellent"?90:val==="good"?70:val==="average"?45:val==="poor"?20:35; }
  else if (questionId === "bb13") { raw = val==="strong"?90:val==="good"?70:val==="average"?45:20; }
  else if (questionId === "bb14") { raw = val==="strong"?85:val==="good"?65:val==="average"?40:20; }
  else if (questionId === "bb15") { raw = val==="balanced"?90:val==="slight"?65:val==="moderate"?35:40; }
  else if (questionId === "bb16") { raw = val==="excellent"?90:val==="good"?70:val==="average"?45:20; }
  else if (questionId === "bb17") { raw = val==="fast"?90:val==="good"?70:val==="average"?45:25; }
  else if (questionId === "bb18") { raw = val==="power"?85:val==="balanced"?70:val==="endurance"?55:30; }
  else if (questionId === "bb19") { raw = val==="excellent"?90:val==="good"?70:val==="average"?45:20; }
  else if (questionId === "bb20") { raw = val==="excellent"?90:val==="good"?70:val==="average"?45:20; }
  else if (questionId === "bb21") { raw = val==="frequent"?85:val==="occasional"?60:val==="rare"?30:10; }
  else if (questionId === "bb22") { raw = val==="yes_sys"?90:val==="yes_casual"?55:20; }
  else if (questionId === "bb24") { raw = val==="current"?10:val==="6m"?30:val==="1y"?55:val==="old"?75:val==="never"?90:50; }
  else if (questionId === "bb25") { raw = val==="8+"?90:val==="7-8"?75:val==="6-7"?50:20; }
  else if (questionId === "bb26") { raw = val==="good"?85:val==="average"?55:25; }
  else if (questionId === "bb27") { raw = Math.max(10, 110-num*10); }
  else if (questionId === "bb28") { raw = val==="none"?95:val==="occasional"?55:15; }
  else if (questionId === "bb29") { raw = val==="4-5"?85:val==="3"?65:val==="2"?45:25; }
  else if (questionId === "bb30") { raw = val==="90+"?85:val==="60-90"?70:val==="45-60"?50:30; }
  else if (questionId === "bb31") { raw = val==="gym"?85:val==="home"?60:35; }
  else if (questionId === "bb34") { raw = val==="max"?90:val==="high"?75:50; }
  else if (questionId === "bb35") { raw = val==="proficient"?95:val==="novice"?60:30; }
  // 基础版评分上浮 8 分，因为体测数据/自评与专业测试存在测量误差
  return Math.min(95, raw + 8);
}

/** 基础版维度得分计算 */
function calculateBasicDimensionScore(dimension: string, answers: AnswersMap): number {
  const dimQuestions = basicQuestions.filter(q => q.dimension === dimension);
  const answered = dimQuestions.filter(q => answers[q.id] !== undefined && answers[q.id] !== "" && answers[q.id] !== null);
  if (answered.length === 0) return 50;
  const scores = answered.map(q => scoreBasicAnswer(q.id, answers[q.id]));
  return Math.round(scores.reduce((a,b)=>a+b,0) / scores.length);
}

/** 主诊断引擎 */
export function runDiagnosis(answers: AnswersMap): {
  dimensionScores: DimensionScore[];
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
} {
  const isBasic = isBasicAnswers(answers);
  const isStandard = isStandardAnswers(answers);
  const gender = (answers["b02"] === "female" || answers["bb02"] === "female" || answers["st02"] === "female") ? "female" : "male";
  const dimensions = Object.keys(DIMENSION_WEIGHTS) as Array<keyof typeof DIMENSION_WEIGHTS>;
  const dimensionScores: DimensionScore[] = dimensions.map(key => ({
    key, label: DIMENSION_DESCRIPTIONS[key]?.split("——")[0] || key,
    score: isBasic ? calculateBasicDimensionScore(key, answers) : isStandard ? calculateStandardDimensionScore(key, answers, gender) : calculateDimensionScore(key, answers, gender),
    maxScore: 100, weight: DIMENSION_WEIGHTS[key],
  }));
  const overallScore = Math.round(dimensionScores.reduce((s, d) => s + d.score * d.weight, 0));
  const sorted = [...dimensionScores].sort((a, b) => b.score - a.score);
  return { dimensionScores, overallScore, strengths: sorted.slice(0,3).map(d=>d.label), weaknesses: sorted.slice(-3).reverse().map(d=>d.label) };
}

export function assessInjuryRisk(answers: AnswersMap): { level: "低" | "中" | "高"; score: number; factors: string[] } {
  const factors: string[] = []; let risk = 0;
  const isBasic = isBasicAnswers(answers);
  const isStandard = isStandardAnswers(answers);

  // ===== 运动专项伤病风险 =====
  const sportId = (answers["sport"] || answers["bb_sport"] || answers["st_sport"] || "general_fitness") as string;
  const sportRisk = getSportInjuryRisk(sportId, []);
  if (sportRisk.riskScore > 0) {
    risk += sportRisk.riskScore;
    factors.push(...sportRisk.factors);
  }

  // 基础版受伤风险评估（综合伤病+恢复）
  if (isBasic) {
    const inj = answers["bb21"];
    if (Array.isArray(inj)) { const arr = inj as string[]; if (!arr.includes("none")) { risk += arr.length * 18; factors.push(`${arr.length}处伤病史`); } }
    if (answers["bb22"] === "yes") { risk += 22; factors.push("当前有不适——不建议高强度训练"); }
    if (answers["bb23"] === "recent") { risk += 20; factors.push("1年内有手术——需医生评估"); }
    else if (answers["bb23"] === "old") { risk += 8; factors.push("有手术史——需注意相关部位"); }
    if (answers["bb24"] === "lt6") { risk += 10; factors.push("睡眠<6小时——恢复能力严重受限"); }
    if (answers["bb24"] === "6-7") { risk += 4; factors.push("睡眠偏少——建议增加"); }
    if (answers["bb25"] === "high") { risk += 6; factors.push("高生活压力——影响恢复和免疫"); }
    if (answers["bb07"] === "cannot") { risk += 6; factors.push("单腿稳定性差——落地受伤风险升高"); }
    risk = Math.min(100, risk);
    return { level: risk>=50?"高":risk>=25?"中":"低", score: risk, factors };
  }

  // 标准版/进阶版受伤风险评估（综合伤病+力量平衡+活动度+恢复）
  if (isStandard) {
    // 伤病筛查（新版 av / 旧版 st 回退）
    const kneePain = answers["av60"] || answers["st41"];
    if (kneePain === "frequent" || kneePain === "current") { risk += 20; factors.push("膝盖疼痛需关注——避免高强度跳跃"); }
    const achilles = answers["av61"] || answers["st42"];
    if (achilles === "frequent") { risk += 18; factors.push("跟腱疼痛——禁止跳深/踝跳"); }
    const lowback = answers["av62"] || answers["st42"];
    if (lowback === "frequent") { risk += 12; factors.push("下背疼痛——需减轻训练负荷"); }
    const ankle = answers["av63"];
    if (ankle === "unstable") { risk += 12; factors.push("踝关节不稳——避免单腿跳深"); }
    const current = answers["av69"];
    if (current === "significant" || current === "stop") { risk += 25; factors.push("当前有明显疼痛——不建议高强度训练"); }
    else if (current === "mild") { risk += 10; factors.push("有轻微不适——需谨慎训练"); }
    // 活动度
    if (answers["av40"] === "must_elevate") { risk += 6; factors.push("深蹲足跟抬起——踝背屈受限影响落地"); }
    if (answers["av44"] === "lt5" || answers["av44"] === "5-10") { risk += 6; factors.push("单腿平衡<10秒——踝膝伤风险升高"); }
    // 恢复因素
    if (answers["av73"] === "lt6") { risk += 8; factors.push("睡眠<6小时——恢复能力严重受限"); }
    if (answers["av73"] === "6-7") { risk += 4; factors.push("睡眠偏少——建议增加至7-9小时"); }
    if (answers["av77"] === "high" || answers["av77"] === "very_high") { risk += 6; factors.push("高生活压力——皮质醇影响恢复"); }
    if (answers["av38"] === "concrete") { risk += 5; factors.push("水泥地面跳跃——高冲击风险"); }
    if (answers["st43"] === "never") { risk += 10; factors.push("从不热身——显著增加受伤风险"); }
    else if (answers["st43"] === "occasional") { risk += 4; factors.push("热身不规律——建议养成系统热身习惯"); }
    risk = Math.min(100, risk);
    return { level: risk>=50?"高":risk>=25?"中":"低", score: risk, factors };
  }

  // 专业版综合受伤风险评估（伤病+力量平衡+活动度+力学+恢复+训练习惯）
  const injuries = answers["i01"] || answers["ex05"]; // 新版 i01 / 旧版 ex05
  if (injuries && Array.isArray(injuries)) {
    const inj = injuries as string[];
    const injCount = inj.filter(i => i !== "none").length;
    if (injCount > 0) { risk += Math.min(40, injCount * 12); factors.push(`${injCount} 处伤病史`); }
    if (inj.includes("patellar")) { risk += 8; factors.push("髌腱炎史——跳跃膝高风险"); }
    if (inj.includes("acl")) { risk += 12; factors.push("ACL损伤史——需特别关注落地力学"); }
    if (inj.includes("achilles")) { risk += 8; factors.push("跟腱病史——需控制增强式训练量"); }
    if (inj.includes("shin") || inj.includes("stress_fx")) { risk += 6; factors.push("骨应力损伤史——需监控训练负荷"); }
  }

  const recentInjury = answers["i02"] || answers["ex06"]; // 新版 i02 / 旧版 ex06
  if (recentInjury === "current") { risk += 25; factors.push("目前仍处于伤病/康复期——不建议高强度训练"); }
  else if (recentInjury === "lt3m" || recentInjury === "<3m") { risk += 15; factors.push("3个月内伤病——需保守训练"); }
  else if (recentInjury === "3to6m" || recentInjury === "3-6m") { risk += 8; factors.push("3-6个月前伤病——过渡期需谨慎"); }

  // 活动度与力学（使用新版 m 模块值）
  if (answers["m01"] === "lt5" || answers["m01"] === "none") { risk += 10; factors.push("踝关节背屈严重受限——影响起跳和落地力学"); }
  if (answers["m01"] === "5to7") { risk += 4; factors.push("踝关节活动度一般——建议改善"); }
  if (answers["m02"] === "must_elevate") { risk += 6; factors.push("深蹲足跟抬起——踝背屈受限，落地力学受影响"); }
  if (answers["m06"] === "cannot") { risk += 8; factors.push("过顶深蹲无法完成——胸椎/肩/髋活动度不足"); }
  if (answers["m06"] === "lean_forward") { risk += 4; factors.push("过顶深蹲躯干前倾——核心稳定性和活动度需加强"); }
  // 单腿平衡（新版 m08 是秒数）
  const balanceSec = Number(answers["m08"]);
  if (!isNaN(balanceSec) && balanceSec < 10) { risk += 8; factors.push("单腿平衡<10秒——本体感觉不足，增加踝膝伤风险"); }
  else if (!isNaN(balanceSec) && balanceSec < 20) { risk += 4; factors.push("单腿平衡10-20秒——本体感觉需加强"); }

  // 力量平衡
  if (answers["s08"] === "severe") { risk += 12; factors.push("左右力量严重不对称（>20%）——高风险"); }
  else if (answers["s08"] === "moderate") { risk += 6; factors.push("左右力量不对称（10-20%）"); }
  if (answers["s07"] === "weak" || answers["s07"] === "average") { risk += 4; factors.push("核心抗旋能力不足——腰椎代偿风险增加"); }

  // 落地力学
  if (answers["sp07"] === "poor") { risk += 8; factors.push("落地力学差——膝关节和跟腱冲击大"); }
  if (answers["sp08"] === "big" || answers["sp08"] === "moderate") { risk += 8; factors.push("落地不稳——需训练落地缓冲技术"); }

  // 训练习惯（使用旧版 ex07/ex08 作为回退，新版将在后续维度中添加）
  const warmup = answers["ex07"];
  if (warmup === "never") { risk += 10; factors.push("从不热身——显著增加受伤风险"); }
  const cooldown = answers["ex08"];
  if (cooldown === "never") { risk += 5; factors.push("从不做训练后整理——影响恢复"); }

  // 恢复因素（新版 h 模块 / 旧版 l 模块回退）
  const sleepH = answers["h01"] || answers["l01"];
  if (sleepH === "lt6" || sleepH === "<6") { risk += 8; factors.push("睡眠<6小时——恢复严重不足，睾酮分泌受抑"); }
  const stressH = Number(answers["h06"] || answers["l04"]);
  if (!isNaN(stressH) && stressH >= 8) { risk += 6; factors.push("高生活压力——皮质醇升高影响恢复和免疫"); }
  const recH = answers["h07"] || answers["l07"];
  if (recH === "none" || (Array.isArray(recH) && (recH as string[]).includes("none") && (recH as string[]).length === 1)) { risk += 5; factors.push("缺乏主动恢复手段"); }
  const alcH = answers["h05"] || answers["l05"];
  if (alcH === "weekly" || alcH === "frequent") { risk += 4; factors.push("饮酒习惯——影响恢复和蛋白质合成"); }

  risk = Math.min(100, risk);
  const level = risk >= 50 ? "高" : risk >= 25 ? "中" : "低";
  return { level, score: risk, factors };
}

// 将英文问卷值翻译为中文，避免 AI 输出英文
const VALUE_CN: Record<string, string> = {
  "male": "男", "female": "女",
  "excellent": "优秀", "good": "良好", "average": "一般", "poor": "差",
  "concern": "需关注", "unknown": "未知",
  "small": "偏细", "medium": "中等", "large": "偏粗",
  "long_legs": "长腿型", "balanced": "均衡型", "long_torso": "长躯干型",
  "long": "长", "short": "短",
  "normal": "正常", "high": "偏高", "flat": "偏平",
  "none": "无/没有", "leg_align": "腿型排列问题",
  "low": "低", "moderate": "中等", "severe": "严重",
  "elite": "精英级", "advanced": "高级", "intermediate": "中级", "novice": "新手",
  "strong": "强壮", "slight": "轻微",
  "explosive": "爆发力型", "slow_str": "慢速力量型",
  "stable": "稳定", "big": "大幅度",
  "velo_dom": "速度主导", "force_dom": "力量主导",
  "force_deficit": "力量不足", "velocity_deficit": "速度不足",
  "strength_heavy": "偏力量", "plyo_heavy": "偏增强式",
  "tight": "紧张",
  "passed": "通过", "asymmetry": "不对称",
  "frequent": "频繁", "occasional": "偶尔", "rare": "很少",
  "systematic": "系统训练", "casual": "随意/休闲", "some": "有一定训练",
  "structured": "有结构", "regular": "定期", "irregular": "不定期",
  "ramp": "有热身", "brief": "简短",
  "basic": "基础", "sometimes": "偶尔",
  "pro": "专业", "detailed": "详细记录",
  "gym": "健身房", "home": "家中", "outdoor": "户外",
  "max_jump": "最大化弹跳高度", "dunk": "扣篮", "sport_perf": "运动表现提升", "general_fitness": "综合体能",
  "beginner": "新手入门",
  "1d": "1天", "2-3d": "2-3天", "3-5d": "3-5天",
  "30-60": "30-60分钟", "60-90": "60-90分钟", "90+": "90分钟以上",
  "<50": "低于50", "50-60": "50-60", "60-70": "60-70", ">70": "高于70",
  "0.5-1": "0.5-1年", "1-3": "1-3年", "3-5": "3-5年", "5+": "5年以上", "<0.5": "不足半年",
};

function translateVal(v: unknown): string {
  if (typeof v === "string" && VALUE_CN[v]) return VALUE_CN[v];
  return String(v ?? "");
}

export function generatePlanInput(answers: AnswersMap): string {
  const isBasic = isBasicAnswers(answers);
  // 运动专项：新问卷用 b07，兼容旧字段
  const sportId = (answers["b07"] || answers["sport"] || answers["bb_sport"] || answers["st_sport"] || "general_fitness") as string;
  const sport = getSportProfile(sportId);
  const sportContext = sport
    ? `\n运动专项：${sport.name}（分类：${sport.category === "jump" ? "跳跃类" : sport.category === "sprint" ? "冲刺类" : "力量类"}，RFD需求：${sport.rfdDemand === "fast" ? "极快<150ms" : sport.rfdDemand === "moderate" ? "中等150-250ms" : "较慢>250ms"}，起跳方式：${sport.jumpType === "single_leg" ? "单腿为主" : sport.jumpType === "double_leg" ? "双腿为主" : "混合"}）\n专项特点：${sport.characteristics}\n训练重点：${sport.trainingPriorities.join("、")}\n专项警告：${sport.warnings.join("；")}`
    : "";
  if (isBasic) {
    const d = answers["bb29"] || "3"; const m = translateVal(answers["bb30"] || "60-90");
    const f = translateVal(answers["bb31"] || "gym"); const g = translateVal(answers["bb33"] || "max_jump");
    const w = 12; const exp = translateVal(answers["bb21"] || "occasional");
    return `训练者画像（基础版）：训练习惯=${exp}，每周${d}天，每次${m}，场地=${f}，目标=${g}，期望周期=${w}周${sportContext}`;
  }
  const d = answers["b08"] || answers["a01"] || "3";
  const m = translateVal(answers["a02"] || "60-90");
  const f = translateVal(answers["a03"] || "gym");
  const g = translateVal(answers["ps03"] || answers["a05"] || "max_jump");
  const w = answers["a06"] || 12;
  const exp = translateVal(answers["b06"] || answers["ex01"] || "beginner");
  // 安全回退：训练天数至少为 1；b08 是每周运动小时数，大致换算为天数
  const rawDays = parseInt(String(d)) || 3;
  const safeDays = Math.max(1, Math.min(7, rawDays));
  return `训练者画像：训练经验=${exp}，每周${safeDays}天，每次${m}，场地=${f}，目标=${g}，期望周期=${w}周${sportContext}`;
}
