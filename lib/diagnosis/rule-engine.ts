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

  // ---- Anthropometry ----
  if (questionId === "b05") {
    const norms = gender === "female" ? BODYFAT_NORMS_FEMALE : BODYFAT_NORMS_MALE;
    return scoreByRange(num, norms);
  }
  if (questionId === "b06") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "concern" ? 30 : 50; }
  if (questionId === "b07") { return val === "small" ? 85 : val === "medium" ? 75 : val === "large" ? 45 : 60; }

  // ---- Proportion ----
  if (questionId === "p02") { return val === "long_legs" ? 90 : val === "balanced" ? 75 : val === "long_torso" ? 45 : 60; }
  if (questionId === "p03") { return val === "long" ? 90 : val === "medium" ? 70 : val === "short" ? 35 : 60; }
  if (questionId === "p04") { return val === "normal" ? 85 : val === "high" ? 60 : val === "flat" ? 40 : 60; }
  if (questionId === "p05") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 25; }
  if (questionId === "p06") { return val === "none" ? 85 : val === "leg_align" ? 50 : 60; }
  if (questionId === "p07") { return val === "high" ? 85 : val === "moderate" ? 70 : val === "low" ? 45 : 55; }

  // ---- Max Strength ----
  if (questionId === "s01") { if (num >= 180) return 95; if (num >= 140) return 80; if (num >= 100) return 60; if (num >= 60) return 40; if (num > 0) return 20; return 15; }
  if (questionId === "s02") { if (num >= 200) return 95; if (num >= 160) return 80; if (num >= 120) return 60; if (num >= 70) return 40; if (num > 0) return 20; return 15; }
  if (questionId === "s03") { if (num >= 140) return 95; if (num >= 100) return 80; if (num >= 70) return 60; if (num >= 40) return 40; if (num > 0) return 20; return 15; }
  if (questionId === "s04") { if (num >= 100) return 95; if (num >= 75) return 80; if (num >= 50) return 60; if (num >= 30) return 40; if (num > 0) return 20; return 15; }
  if (questionId === "s05") { if (num >= 50) return 90; if (num >= 35) return 75; if (num >= 20) return 55; if (num > 0) return 30; return 20; }
  if (questionId === "s06") { return val === "elite" ? 95 : val === "advanced" ? 75 : val === "intermediate" ? 50 : val === "novice" ? 25 : 10; }
  if (questionId === "s07") { return val === "strong" ? 85 : val === "good" ? 65 : val === "average" ? 45 : 25; }
  if (questionId === "s08") { return val === "balanced" ? 90 : val === "slight" ? 70 : val === "moderate" ? 40 : val === "severe" ? 15 : 50; }
  if (questionId === "s09") { return val === "excellent" ? 85 : val === "good" ? 65 : val === "average" ? 40 : 20; }
  if (questionId === "s10") { if (num >= 40) return 90; if (num >= 25) return 75; if (num >= 10) return 55; if (num > 0) return 30; return 20; }
  if (questionId === "s11") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 45 : 20; }
  if (questionId === "s12") { return val === "excellent" ? 85 : val === "good" ? 65 : val === "average" ? 45 : 25; }

  // ---- Power Speed ----
  if (questionId === "sp01") {
    const norms = gender === "female" ? CMJ_NORMS_FEMALE : CMJ_NORMS_MALE;
    return scoreByRange(num, norms);
  }
  if (questionId === "sp02") { if (num >= 55) return 90; if (num >= 40) return 70; if (num >= 30) return 50; if (num >= 20) return 30; if (num > 0) return 15; return 15; }
  if (questionId === "sp03") { if (num >= 330) return 95; if (num >= 300) return 80; if (num >= 270) return 60; if (num >= 240) return 40; if (num > 0) return 20; return 15; }
  if (questionId === "sp04") { if (num >= 280) return 95; if (num >= 250) return 80; if (num >= 220) return 60; if (num >= 190) return 45; if (num > 0) return 25; return 15; }
  if (questionId === "sp05") { if (num > 0 && num <= 4.0) return 95; if (num <= 4.5) return 75; if (num <= 5.0) return 55; if (num > 5.0) return 30; return 35; }
  if (questionId === "sp06") { return val === "explosive" ? 90 : val === "good" ? 70 : val === "slow_str" ? 45 : 25; }
  if (questionId === "sp07") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "poor" ? 35 : 50; }
  if (questionId === "sp08") { return val === "stable" ? 90 : val === "slight" ? 70 : val === "moderate" ? 45 : val === "big" ? 25 : 50; }
  if (questionId === "sp09") { return val === "balanced" ? 85 : val === "velo_dom" ? 65 : val === "force_dom" ? 60 : 55; }
  if (questionId === "sp10") { return val === "balanced" ? 90 : val === "force_deficit" ? 50 : val === "velocity_deficit" ? 50 : 55; }
  if (questionId === "sp11") { return val === "balanced" ? 85 : val === "strength_heavy" ? 65 : val === "plyo_heavy" ? 60 : 55; }

  // ---- Mobility ----
  if (questionId === "m01") { if (num >= 20) return 90; if (num >= 10) return 75; if (num >= 0) return 60; if (num >= -10) return 45; if (num >= -20) return 30; return 20; }
  if (questionId === "m02") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : val === "poor" ? 20 : 50; }
  if (questionId === "m03") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 25; }
  if (questionId === "m04") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 25; }
  if (questionId === "m05") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : val === "tight" ? 20 : 50; }
  if (questionId === "m06") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 20; }
  if (questionId === "m07") { return val === "3" ? 90 : val === "2" ? 60 : val === "1" ? 30 : 50; }
  if (questionId === "m08") { return val === "passed" ? 90 : val === "asymmetry" ? 40 : val === "low" ? 30 : 50; }

  // ---- Endurance ----
  if (questionId === "e01") { return val === "excellent" ? 90 : val === "good" ? 75 : val === "average" ? 50 : 25; }
  if (questionId === "e02") { return val === "excellent" ? 90 : val === "good" ? 70 : val === "average" ? 45 : 25; }
  if (questionId === "e03") { return val === "90+" ? 90 : val === "60-90" ? 75 : val === "30-60" ? 55 : 30; }
  if (questionId === "e04") { return val === "1d" ? 90 : val === "2-3d" ? 70 : val === "3-5d" ? 40 : 20; }
  if (questionId === "e05") { return val === "frequent" ? 85 : val === "occasional" ? 65 : val === "rare" ? 40 : 15; }
  if (questionId === "e06") { return val === "<50" ? 90 : val === "50-60" ? 75 : val === "60-70" ? 55 : val === ">70" ? 30 : 50; }

  // ---- Training History ----
  if (questionId === "ex01") { return val === "5+" ? 95 : val === "3-5" ? 80 : val === "1-3" ? 60 : val === "0.5-1" ? 40 : val === "<0.5" ? 20 : 10; }
  if (questionId === "ex02") { return val === "systematic" ? 90 : val === "casual" ? 60 : val === "some" ? 35 : 10; }
  if (questionId === "ex03") { return val === "structured" ? 90 : val === "regular" ? 70 : val === "irregular" ? 40 : 10; }
  if (questionId === "ex07") { return val === "ramp" ? 95 : val === "good" ? 75 : val === "brief" ? 40 : 10; }
  if (questionId === "ex08") { return val === "systematic" ? 90 : val === "basic" ? 65 : val === "sometimes" ? 40 : 10; }
  if (questionId === "ex09") { return val === "pro" ? 90 : val === "basic" ? 65 : 35; }
  if (questionId === "ex10") { return val === "detailed" ? 90 : val === "basic" ? 65 : val === "sometimes" ? 40 : 15; }

  // ---- Lifestyle ----
  if (questionId === "l01") { return val === "8-9" ? 95 : val === "7-8" ? 75 : val === "6-7" ? 50 : 20; }
  if (questionId === "l02") { return val === "excellent" ? 95 : val === "good" ? 75 : val === "average" ? 50 : 20; }
  if (questionId === "l03") { return val === "strict" ? 90 : val === "moderate" ? 75 : val === "average" ? 50 : 20; }
  if (questionId === "l04") { return Math.max(10, 110 - num * 10); }
  if (questionId === "l05") { return val === "no" ? 95 : val === "occasional" ? 50 : 10; }
  if (questionId === "l06") { return val === "no" ? 95 : val === "rare" ? 70 : val === "weekly" ? 40 : 10; }
  if (questionId === "l07") { const arr = Array.isArray(val) ? val : []; const cnt = arr.filter((a: string) => a !== "none").length; return Math.min(95, 25 + cnt * 14); }
  if (questionId === "l08") { return val === "<4" ? 85 : val === "4-8" ? 70 : val === "8-12" ? 45 : 25; }
  if (questionId === "l09") { return val === "regular" ? 90 : val === "occasional" ? 65 : val === "sedentary" ? 40 : 15; }
  if (questionId === "l10") { return val === "systematic" ? 85 : val === "basic" ? 65 : 45; }

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

/** 检测是否为国际标准版问卷（id 以 st 开头） */
function isStandardAnswers(answers: AnswersMap): boolean {
  return Object.keys(answers).some(k => k.startsWith("st"));
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

  // 基础版受伤风险评估（综合伤病+力量+恢复）
  if (isBasic) {
    const inj = answers["bb23"];
    if (Array.isArray(inj)) { const arr = inj as string[]; if (!arr.includes("none")) { risk += arr.length * 15; factors.push(`${arr.length}处伤病史`); } }
    if (answers["bb24"] === "current") { risk += 25; factors.push("目前有伤——不建议训练"); }
    else if (answers["bb24"] === "6m") { risk += 12; factors.push("半年内有伤——需谨慎"); }
    if (answers["bb20"] === "poor") { risk += 8; factors.push("平衡能力较差——落地受伤风险升高"); }
    if (answers["bb20"] === "average") { risk += 4; factors.push("平衡能力一般——建议加强本体感觉训练"); }
    if (answers["bb14"] === "weak") { risk += 6; factors.push("核心力量弱——腰椎代偿风险增加"); }
    if (answers["bb15"] === "moderate" || answers["bb15"] === "severe") { risk += 8; factors.push("左右力量不平衡——需关注"); }
    if (answers["bb25"] === "<6") { risk += 8; factors.push("睡眠不足——恢复能力受限"); }
    if (Number(answers["bb27"]) >= 8) { risk += 6; factors.push("生活压力较高——恢复受影响"); }
    if (answers["bb21"] === "rare" || answers["bb21"] === "never") { risk += 5; factors.push("缺乏主动恢复习惯"); }
    risk = Math.min(100, risk);
    return { level: risk>=50?"高":risk>=25?"中":"低", score: risk, factors };
  }

  // 标准版受伤风险评估（综合伤病+力量平衡+活动度+恢复）
  if (isStandard) {
    const inj = answers["st41"];
    if (Array.isArray(inj)) { const arr = inj as string[]; if (!arr.includes("none")) { risk += arr.length * 15; factors.push(`${arr.length}处伤病史`); } }
    if (answers["st42"] === "current" || answers["st42"] === "6m") { risk += 25; factors.push("近期有伤——不建议高强度训练"); }
    else if (answers["st42"] === "1y") { risk += 12; factors.push("一年内有伤——需谨慎"); }
    // 力量平衡
    if (answers["st16"] === "severe") { risk += 12; factors.push("左右力量严重不对称（>20%）——高风险"); }
    else if (answers["st16"] === "moderate") { risk += 6; factors.push("左右力量存在不平衡（10-20%）"); }
    // 活动度
    if (answers["st33"] === "poor") { risk += 8; factors.push("踝关节背屈严重受限——落地缓冲能力不足"); }
    if (answers["st35"] === "poor") { risk += 8; factors.push("单腿落地稳定性差——踝膝伤风险升高"); }
    else if (answers["st35"] === "average") { risk += 4; factors.push("落地稳定性一般——需加强本体感觉训练"); }
    // FMS 总分低
    const fmsIds = ["st25","st26","st27","st28","st29","st30","st31"];
    const fmsTotal = fmsIds.reduce((s, id) => s + (Number(answers[id]) || 0), 0);
    if (fmsTotal <= 7) { risk += 12; factors.push(`FMS总分仅${fmsTotal}/21——动作模式存在明显缺陷`); }
    else if (fmsTotal <= 14) { risk += 6; factors.push(`FMS总分${fmsTotal}/21——建议改善基础动作模式`); }
    // 恢复因素
    if (answers["st44"] === "6-7" || answers["st44"] === "<6") { risk += 8; factors.push("睡眠不足——恢复能力受限"); }
    if (Number(answers["st47"]) >= 7) { risk += 6; factors.push("生活压力较高——皮质醇水平可能影响恢复"); }
    if (answers["st38"] === "poor") { risk += 8; factors.push("有氧基础薄弱——高强度训练恢复慢"); }
    // 热身习惯
    if (answers["st43"] === "never") { risk += 10; factors.push("从不热身——显著增加受伤风险"); }
    else if (answers["st43"] === "occasional") { risk += 4; factors.push("热身不规律——建议养成系统热身习惯"); }
    risk = Math.min(100, risk);
    return { level: risk>=50?"高":risk>=25?"中":"低", score: risk, factors };
  }

  // 专业版综合受伤风险评估（伤病+力量平衡+活动度+力学+恢复+训练习惯）
  const injuries = answers["ex05"];
  if (injuries && Array.isArray(injuries)) {
    const inj = injuries as string[];
    const injCount = inj.filter(i => i !== "none").length;
    if (injCount > 0) { risk += Math.min(40, injCount * 12); factors.push(`${injCount} 处伤病史`); }
    if (inj.includes("patellar")) { risk += 8; factors.push("髌腱炎史——跳跃膝高风险"); }
    if (inj.includes("acl")) { risk += 12; factors.push("ACL损伤史——需特别关注落地力学"); }
    if (inj.includes("achilles")) { risk += 8; factors.push("跟腱病史——需控制增强式训练量"); }
    if (inj.includes("shin") || inj.includes("stress_fx")) { risk += 6; factors.push("骨应力损伤史——需监控训练负荷"); }
  }

  if (answers["ex06"] === "current") { risk += 25; factors.push("目前仍处于伤病/康复期——不建议高强度训练"); }
  else if (answers["ex06"] === "<3m") { risk += 15; factors.push("3个月内伤病——需保守训练"); }
  else if (answers["ex06"] === "3-6m") { risk += 8; factors.push("3-6个月前伤病——过渡期需谨慎"); }

  // 活动度与力学
  if (answers["m02"] === "poor") { risk += 10; factors.push("踝关节背屈严重受限——影响起跳和落地力学"); }
  if (answers["m02"] === "average") { risk += 4; factors.push("踝关节活动度一般——建议改善"); }
  if (answers["m06"] === "poor") { risk += 8; factors.push("单腿平衡差——本体感觉不足，增加踝膝伤风险"); }
  if (answers["m08"] === "asymmetry") { risk += 10; factors.push("YBT不对称——动态平衡不足，受伤风险增加"); }
  if (answers["m08"] === "low") { risk += 6; factors.push("YBT得分偏低——下肢稳定性需加强"); }

  // 力量平衡
  if (answers["s08"] === "severe") { risk += 12; factors.push("左右力量严重不对称（>20%）——高风险"); }
  else if (answers["s08"] === "moderate") { risk += 6; factors.push("左右力量不对称（10-20%）"); }
  if (answers["s07"] === "weak" || answers["s07"] === "average") { risk += 4; factors.push("核心抗旋能力不足——腰椎代偿风险增加"); }

  // 落地力学
  if (answers["sp07"] === "poor") { risk += 8; factors.push("落地力学差——膝关节和跟腱冲击大"); }
  if (answers["sp08"] === "big" || answers["sp08"] === "moderate") { risk += 8; factors.push("落地不稳——需训练落地缓冲技术"); }

  // 训练习惯
  if (answers["ex07"] === "never") { risk += 10; factors.push("从不热身——显著增加受伤风险"); }
  if (answers["ex08"] === "never") { risk += 5; factors.push("从不做训练后整理——影响恢复"); }

  // 恢复因素
  if (answers["l01"] === "<6") { risk += 8; factors.push("睡眠<6小时——恢复严重不足，睾酮分泌受抑"); }
  if (Number(answers["l04"]) >= 8) { risk += 6; factors.push("高生活压力——皮质醇升高影响恢复和免疫"); }
  if (answers["l07"] === "none" || (Array.isArray(answers["l07"]) && (answers["l07"] as string[]).includes("none") && (answers["l07"] as string[]).length === 1)) { risk += 5; factors.push("缺乏主动恢复手段"); }
  if (answers["l05"] === "regular" || answers["l05"] === "occasional") { risk += 4; factors.push("饮酒习惯——影响恢复和蛋白质合成"); }

  risk = Math.min(100, risk);
  const level = risk >= 50 ? "高" : risk >= 25 ? "中" : "低";
  return { level, score: risk, factors };
}

export function generatePlanInput(answers: AnswersMap): string {
  const isBasic = isBasicAnswers(answers);
  if (isBasic) {
    const d = answers["bb29"] || "3"; const m = answers["bb30"] || "60-90";
    const f = answers["bb31"] || "gym"; const g = answers["bb33"] || "max_jump";
    const w = 12; const exp = answers["bb21"] || "occasional";
    return `训练者画像（基础版）：训练习惯=${exp}，每周${d}天，每次${m}分钟，场地=${f}，目标=${g}，期望周期=${w}周`;
  }
  const d = answers["a01"] || "3"; const m = answers["a02"] || "60-90";
  const f = answers["a03"] || "gym"; const g = answers["a05"] || "max_jump";
  const w = answers["a06"] || 12; const exp = answers["ex01"] || "beginner";
  return `训练者画像：训练经验=${exp}，每周${d}天，每次${m}分钟，场地=${f}，目标=${g}，期望周期=${w}周`;
}
