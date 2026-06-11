// POST /api/plan — 根据诊断结果 + 用户条件，通过 DeepSeek AI 生成训练计划
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai/deepseek";
import { PLANNING_SYSTEM_PROMPT, buildPlanUserPrompt } from "@/lib/ai/prompts";
import { generatePlanInput } from "@/lib/diagnosis/rule-engine";
import { searchKnowledgeBase } from "@/lib/knowledge-base";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, weaknesses, injuryRisk, diagnosisSummary } = body;

    if (!answers || !weaknesses) {
      return NextResponse.json(
        { error: "缺少必要的诊断数据" },
        { status: 400 }
      );
    }

    // 构建训练计划 Prompt 输入
    const planInput = generatePlanInput(answers);
    const weaknessesText = Array.isArray(weaknesses) ? weaknesses.join("、") : weaknesses;
    const riskText = injuryRisk
      ? `等级：${injuryRisk.level}，风险因素：${injuryRisk.factors?.join("、") || "无"}`
      : "未评估";

    // 分段生成：先 1-6 周，再 7-12 周（传入前段最后一周做上下文，确保衔接连贯）
    const basePrompt = buildPlanUserPrompt(planInput, weaknessesText, riskText, diagnosisSummary || "综合诊断已完成");

    // RAG 检索：根据弱点和风险搜索知识库
    const kbQuery = [weaknessesText, riskText].join(" ");
    const relevantArticles = searchKnowledgeBase(kbQuery, 3);
    const kbContext = relevantArticles.length > 0
      ? "\n\n## 参考知识库（基于运动科学文献，请融入训练逻辑）\n" + relevantArticles.map(a => `【${a.title}】\n${a.content.slice(0, 500)}`).join("\n\n---\n\n")
      : "";
    const systemPromptWithKB = PLANNING_SYSTEM_PROMPT + kbContext;

    const part1 = await callDeepSeek(systemPromptWithKB,
      basePrompt + "\n\n请生成第1周到第6周的详细训练计划。只输出前半部分。",
      { temperature: 0.8, maxTokens: 8192 });

    // 取 Part1 最后 500 字作为上下文传给 Part2
    const context = part1.slice(-500);
    const part2 = await callDeepSeek(systemPromptWithKB,
      basePrompt + "\n\n以下是前6周计划的结尾作为衔接上下文：\n" + context + "\n\n请接续生成第7周到第12周的详细训练计划。确保与上文自然衔接，阶段和递进逻辑连贯。只输出后半部分，不要重新输出短板分析。",
      { temperature: 0.8, maxTokens: 8192 });

    const aiGenerated = part1 + "\n\n" + part2;

    return NextResponse.json({
      aiGenerated,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("训练计划 API 错误:", err);
    return NextResponse.json(
      { error: `训练计划生成失败: ${err.message}` },
      { status: 500 }
    );
  }
}
