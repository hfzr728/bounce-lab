// POST /api/plan — 根据诊断结果 + 用户条件，通过 DeepSeek AI 生成训练计划
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai/deepseek";
import { PLANNING_SYSTEM_PROMPT, buildPlanUserPrompt } from "@/lib/ai/prompts";
import { generatePlanInput } from "@/lib/diagnosis/rule-engine";
import { searchKnowledgeBase } from "@/lib/knowledge-base";
import { extractInjuryInfo, scanAndWarnPlan } from "@/lib/ai/injury-restrictions";
import { sanitizeAIResponse } from "@/lib/ai/sanitize";
import { RATE_LIMITS, checkRateLimitOnly } from "@/lib/api/rate-limit";

/** 解析 "4-5" / "3" / "1-2" 等天数字符串，返回最小值 */
function parseTrainingDays(v: string): number {
  const n = Number(v); if (!isNaN(n)) return n;
  const m = v.match(/^(\d+)/); return m ? Number(m[1]) : 0;
}

export async function POST(request: NextRequest) {
  // 限流检查
  const rl = checkRateLimitOnly(request, RATE_LIMITS.AI_GENERATE);
  if (!rl.allowed) {
    return NextResponse.json({ error: `请求过于频繁，请 ${Math.ceil((rl.reset * 1000 - Date.now()) / 1000)} 秒后重试` }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset * 1000 - Date.now()) / 1000)) } });
  }

  try {
    const body = await request.json();
    const { answers, weaknesses, injuryRisk, diagnosisSummary } = body;

    if (!answers || !weaknesses) {
      return NextResponse.json(
        { error: "缺少必要的诊断数据" },
        { status: 400 }
      );
    }

    // 校验训练天数：必须 ≥ 1
    const trainingDaysRaw = answers["a01"] || answers["bb29"] || answers["st49"] || "";
    const trainingDays = parseTrainingDays(String(trainingDaysRaw));
    if (trainingDays < 1) {
      return NextResponse.json(
        { error: "每周训练天数至少为 1 天，请返回问卷重新设置" },
        { status: 400 }
      );
    }

    // 提取伤病信息
    const injury = extractInjuryInfo(answers);

    // 构建训练计划 Prompt 输入
    const planInput = generatePlanInput(answers);
    const weaknessesText = Array.isArray(weaknesses) ? weaknesses.join("、") : weaknesses;
    const riskText = injuryRisk
      ? `等级：${injuryRisk.level}，风险因素：${injuryRisk.factors?.join("、") || "无"}`
      : "未评估";

    // 分段生成：先 1-6 周，再 7-12 周（传入前段最后一周做上下文，确保衔接连贯）
    const basePrompt = buildPlanUserPrompt(planInput, weaknessesText, riskText, diagnosisSummary || "综合诊断已完成", injury);

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

    const rawPlan = part1 + "\n\n" + part2;

    // 后处理：扫描违禁动作并追加安全警告
    const { text: warnedPlan, hasViolations, violations } = scanAndWarnPlan(rawPlan, injury);

    // XSS 清洗：移除任何可能的 HTML/脚本注入
    const aiGenerated = sanitizeAIResponse(warnedPlan);

    return NextResponse.json({
      aiGenerated,
      safetyWarnings: hasViolations ? {
        violations,
        message: `系统检测到计划中可能包含 ${violations.length} 个不适宜你伤病史的动作，已在计划前追加安全警告。`,
      } : undefined,
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
