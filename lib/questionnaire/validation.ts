// ============================================================
// 问卷输入校验 — 防止异常数据提交到 AI
// ============================================================

import { Question, AnswersMap } from "./types";

/** 单字段校验结果 */
export interface ValidationError {
  questionId: string;
  message: string;
}

/** 通用生理/物理合理范围（覆盖所有数字字段） */
const PHYSIOLOGICAL_RANGES: Record<string, { min: number; max: number; label: string; unit: string }> = {
  // 人体测量（新版专业问卷）
  b01:   { min: 0, max: 120, label: "年龄", unit: "岁" },
  bb01:  { min: 12, max: 80, label: "年龄", unit: "岁" },
  st01:  { min: 12, max: 80, label: "年龄", unit: "岁" },
  b03:   { min: 50, max: 250, label: "身高", unit: "cm" },
  bb03:  { min: 120, max: 250, label: "身高", unit: "cm" },
  st03:  { min: 120, max: 250, label: "身高", unit: "cm" },
  b04:   { min: 20, max: 200, label: "体重", unit: "kg" },
  bb04:  { min: 30, max: 250, label: "体重", unit: "kg" },
  st04:  { min: 30, max: 250, label: "体重", unit: "kg" },
  // b05 改为 select 类型，不需要数字校验
  // 训练年限 + 运动时长 + 垂直跳（新版）
  b06:   { min: 0, max: 30, label: "训练年限", unit: "年" },
  b08:   { min: 0.5, max: 40, label: "每周运动时长", unit: "小时/周" },
  b10:   { min: 0, max: 150, label: "站立垂直跳", unit: "cm" },
  // 基础版/标准版保留旧字段
  bb05:  { min: 3, max: 55, label: "体脂率", unit: "%" },
  st05:  { min: 3, max: 55, label: "体脂率", unit: "%" },
  bb08:  { min: 160, max: 310, label: "站立摸高", unit: "cm" },
  st06:  { min: 160, max: 310, label: "站立摸高", unit: "cm" },
  // 下肢长度
  p01:   { min: 50, max: 140, label: "下肢长度", unit: "cm" },
  bp01:  { min: 50, max: 140, label: "下肢长度", unit: "cm" },
  // 力量
  s01:   { min: 0, max: 400, label: "杠铃后蹲 1RM", unit: "kg" },
  s02:   { min: 0, max: 500, label: "传统硬拉 1RM", unit: "kg" },
  s03:   { min: 0, max: 300, label: "前蹲 1RM", unit: "kg" },
  s04:   { min: 0, max: 250, label: "六角杠硬拉 1RM", unit: "kg" },
  s05:   { min: 0, max: 150, label: "负重引体额外负重", unit: "kg" },
  s10:   { min: 0, max: 150, label: "负重引体最大额外负重", unit: "kg" },
  // 爆发力
  sp01:  { min: 10, max: 120, label: "CMJ 弹跳高度", unit: "cm" },
  sp02:  { min: 0, max: 100, label: "SJ 弹跳高度", unit: "cm" },
  sp03:  { min: 100, max: 450, label: "助跑摸高", unit: "cm" },
  sp04:  { min: 100, max: 380, label: "立定跳远", unit: "cm" },
  sp05:  { min: 1.0, max: 8.0, label: "30m 冲刺", unit: "s" },
  // 活动度
  m08:   { min: 0, max: 120, label: "单腿平衡", unit: "秒" },
  // 反应力量
  r04:   { min: 0, max: 30, label: "侧向连续跳", unit: "次" },
  r05:   { min: 0, max: 1200, label: "立定三级跳", unit: "cm" },
  r09:   { min: 0, max: 7, label: "增强式训练频率", unit: "次/周" },
  r10:   { min: 0, max: 300, label: "触地次数", unit: "次/训练" },
  // 进阶版 av
  av01:  { min: 12, max: 70, label: "年龄", unit: "岁" },
  av03:  { min: 140, max: 230, label: "身高", unit: "cm" },
  av04:  { min: 35, max: 180, label: "体重", unit: "kg" },
  av10:  { min: 0, max: 120, label: "垂直跳高度", unit: "cm" },
  av97:  { min: 1, max: 10, label: "技术自评分", unit: "" },
  // 训练年限
  ex01_min: { min: 0, max: 50, label: "训练经验", unit: "年" },
};

/**
 * 校验单个问题的答案是否在合理范围内
 */
export function validateAnswer(question: Question, value: unknown): ValidationError | null {
  if (value === undefined || value === null || value === "") {
    if (question.required) {
      return { questionId: question.id, message: `"${question.text.slice(0, 30)}" 为必填项` };
    }
    return null;
  }

  if (question.type === "number" && typeof value === "number") {
    // 基本合理性检查
    if (isNaN(value)) {
      return { questionId: question.id, message: `"${question.text.slice(0, 30)}" 请输入有效数字` };
    }
    if (!isFinite(value)) {
      return { questionId: question.id, message: `"${question.text.slice(0, 30)}" 数值无效` };
    }

    // 使用生理范围（优先于问卷定义的 numberRange）
    const phys = PHYSIOLOGICAL_RANGES[question.id];
    const rangeMin = phys?.min ?? question.numberRange?.min ?? -Infinity;
    const rangeMax = phys?.max ?? question.numberRange?.max ?? Infinity;
    const label = phys?.label ?? question.text.slice(0, 20);
    const unit = phys?.unit ?? question.unit ?? "";

    if (value < rangeMin) {
      return {
        questionId: question.id,
        message: `${label}不能低于 ${rangeMin}${unit}，当前输入为 ${value}${unit}`,
      };
    }
    if (value > rangeMax) {
      return {
        questionId: question.id,
        message: `${label}不能超过 ${rangeMax}${unit}，当前输入为 ${value}${unit}`,
      };
    }
  }

  // 选填项未作答不报错
  if (!question.required && (value === undefined || value === "" || (Array.isArray(value) && value.length === 0))) {
    return null;
  }

  if (question.type === "select" && question.required) {
    if (!value || value === "") {
      return { questionId: question.id, message: `请为"${question.text.slice(0, 30)}"选择一个选项` };
    }
    // 对数值型 select 选项做语义校验
    const semanticErr = validateSelectValue(question.id, value as string);
    if (semanticErr) return semanticErr;
  }

  if (question.type === "multiSelect" && question.required) {
    if (!Array.isArray(value) || value.length === 0) {
      return { questionId: question.id, message: `请为"${question.text.slice(0, 30)}"至少选择一个选项` };
    }
  }

  return null;
}

/**
 * 对数值型 select 选项做语义校验（如训练天数不能为 0）
 */
function validateSelectValue(questionId: string, value: string): ValidationError | null {
  // 训练天数：必须 ≥ 1
  if (questionId === "a01" || questionId === "bb29" || questionId === "st49") {
    const days = parseDaysRange(value);
    if (days < 1) {
      return { questionId, message: "每周训练天数至少为 1 天" };
    }
  }

  // 训练时长：至少 30 分钟
  if (questionId === "a02" || questionId === "bb30" || questionId === "st50") {
    const mins = parseMinutesRange(value);
    if (mins < 30) {
      return { questionId, message: "每次训练时长至少 30 分钟" };
    }
  }

  // 期望周期：至少 4 周
  if (questionId === "a06" || questionId === "bb34") {
    const weeks = Number(value);
    if (isNaN(weeks) || weeks < 4) {
      return { questionId, message: "训练周期至少 4 周" };
    }
    if (weeks > 52) {
      return { questionId, message: "训练周期不能超过 52 周" };
    }
  }

  return null;
}

/** 解析 "4-5"、"3"、"1-2" 等天数范围，返回最小值 */
function parseDaysRange(value: string): number {
  const num = Number(value);
  if (!isNaN(num)) return num;
  const match = value.match(/^(\d+)/);
  return match ? Number(match[1]) : 0;
}

/** 解析 "90-120"、"60-90"、"45-60"、"<45" 等时长，返回最小值 */
function parseMinutesRange(value: string): number {
  if (value === "<45") return 0;
  const num = Number(value);
  if (!isNaN(num)) return num;
  const match = value.match(/^(\d+)/);
  return match ? Number(match[1]) : 0;
}

/**
 * 批量校验当前步骤的所有问题
 */
export function validateStepAnswers(
  questionIds: string[],
  getQuestion: (id: string) => Question | undefined,
  answers: AnswersMap,
): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const id of questionIds) {
    const q = getQuestion(id);
    if (!q) continue;
    const err = validateAnswer(q, answers[id]);
    if (err) errors.push(err);
  }
  return errors;
}

/**
 * 校验所有问题的答案（提交前最终检查）
 */
export function validateAllAnswers(
  allQuestionIds: string[],
  getQuestion: (id: string) => Question | undefined,
  answers: AnswersMap,
): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const id of allQuestionIds) {
    const q = getQuestion(id);
    if (!q) continue;
    const err = validateAnswer(q, answers[id]);
    if (err) errors.push(err);
  }
  return errors;
}
