// POST /api/diagnose — 接收问卷数据，运行规则引擎 + DeepSeek AI，返回诊断报告
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { runDiagnosis, assessInjuryRisk } from "@/lib/diagnosis/rule-engine";
import { callDeepSeek } from "@/lib/ai/deepseek";
import { DIAGNOSIS_SYSTEM_PROMPT, buildDiagnosisUserPrompt } from "@/lib/ai/prompts";
import { allQuestions } from "@/lib/questionnaire/questions";
import { basicQuestions } from "@/lib/questionnaire/basic-questions";
import { standardQuestions } from "@/lib/questionnaire/standard-questions";
import { DIMENSION_DESCRIPTIONS } from "@/lib/diagnosis/dimensions";

export async function POST(request: NextRequest) {
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
    const isBasic = Object.keys(answers).some(k => k.startsWith("bb"));
    const isStandard = Object.keys(answers).some(k => k.startsWith("st"));
    const questionSet = isBasic ? basicQuestions : isStandard ? standardQuestions : allQuestions;
    const keyAnswers = questionSet
      .filter((q) => answers[q.id] !== undefined && answers[q.id] !== "")
      .map((q) => `- ${q.text}：${answers[q.id]}${q.unit || ""}`)
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
    const aiAnalysis = await callDeepSeek(
      DIAGNOSIS_SYSTEM_PROMPT,
      userPrompt
    );

    const result = {
      dimensionScores,
      overallScore,
      strengths,
      weaknesses,
      injuryRisk,
      aiAnalysis,
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
