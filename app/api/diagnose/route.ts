// POST /api/diagnose — 接收问卷数据，运行规则引擎 + DeepSeek AI，返回诊断报告
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { runDiagnosis, assessInjuryRisk } from "@/lib/diagnosis/rule-engine";
import { callDeepSeek } from "@/lib/ai/deepseek";
import { DIAGNOSIS_SYSTEM_PROMPT, buildDiagnosisUserPrompt } from "@/lib/ai/prompts";
import { sanitizeAIResponse } from "@/lib/ai/sanitize";
import { RATE_LIMITS, checkRateLimitOnly } from "@/lib/api/rate-limit";
import { allQuestions } from "@/lib/questionnaire/questions";
import { basicQuestions } from "@/lib/questionnaire/basic-questions";
import { standardQuestions } from "@/lib/questionnaire/standard-questions";
import { DIMENSION_DESCRIPTIONS } from "@/lib/diagnosis/dimensions";

export async function POST(request: NextRequest) {
  // 限流检查
  const rl = checkRateLimitOnly(request, RATE_LIMITS.DIAGNOSIS);
  if (!rl.allowed) {
    return NextResponse.json({ error: `请求过于频繁，请 ${Math.ceil((rl.reset * 1000 - Date.now()) / 1000)} 秒后重试` }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset * 1000 - Date.now()) / 1000)) } });
  }

  try {
    const body = await request.json();
    const answers = body.answers || {};

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: "未收到任何问卷数据" },
        { status: 400 }
      );
    }

    // 1. 规则引擎诊断
    const { dimensionScores, overallScore, strengths, weaknesses } =
      runDiagnosis(answers);

    // 2. 受伤风险评估
    const injuryRisk = assessInjuryRisk(answers);

    // 3. 构建维度得分文本
    const dimScoresText = dimensionScores
      .map(
        (d) =>
          `- ${d.label}: ${d.score}/100（权重 ${Math.round(d.weight * 100)}%）`
      )
      .join("\n");

    // 4. 构建用户关键数据摘要（自动识别体测版/国际标准版/专业版）
    // 将选项的 value 翻译为中文 label，避免 AI 输出英文
    const isBasic = Object.keys(answers).some(k => k.startsWith("bb"));
    const isStandard = Object.keys(answers).some(k => k.startsWith("st"));
    const questionSet = isBasic ? basicQuestions : isStandard ? standardQuestions : allQuestions;
    const keyAnswers = questionSet
      .filter((q) => answers[q.id] !== undefined && answers[q.id] !== "")
      .map((q) => {
        let displayVal = answers[q.id];
        // Translate select options from value to Chinese label
        if (q.type === "select" && q.options) {
          const opt = q.options.find(o => o.value === String(answers[q.id]));
          if (opt) displayVal = opt.label;
        }
        return `- ${q.text}：${displayVal}${q.unit || ""}`;
      })
      .join("\n");

    // 5. 构建完整 user prompt
    const userPrompt = buildDiagnosisUserPrompt(
      keyAnswers,
      dimScoresText,
      strengths.join("、"),
      weaknesses.join("、"),
      `风险等级：${injuryRisk.level}（${injuryRisk.score}/100），风险因素：${injuryRisk.factors.join("、") || "无显著风险因素"}`
    );

    // 6. 调用 DeepSeek AI 生成分析报告
    const rawAnalysis = await callDeepSeek(
      DIAGNOSIS_SYSTEM_PROMPT,
      userPrompt
    );
    const aiAnalysis = sanitizeAIResponse(rawAnalysis);

    const result = {
      dimensionScores,
      overallScore,
      strengths,
      weaknesses,
      injuryRisk,
      aiAnalysis,
      answers,
      version: isBasic ? "basic" : isStandard ? "standard" : "advanced",
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("诊断 API 错误:", err);
    return NextResponse.json(
      { error: `诊断生成失败: ${err.message}` },
      { status: 500 }
    );
  }
}
