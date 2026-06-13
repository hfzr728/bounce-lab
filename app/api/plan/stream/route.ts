// POST /api/plan/stream — SSE 流式生成训练计划
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { callDeepSeekStream } from "@/lib/ai/deepseek";
import { PLANNING_SYSTEM_PROMPT, buildPlanUserPrompt } from "@/lib/ai/prompts";
import { generatePlanInput } from "@/lib/diagnosis/rule-engine";
import { searchKnowledgeBase } from "@/lib/knowledge-base";
import { extractInjuryInfo, scanAndWarnPlan } from "@/lib/ai/injury-restrictions";
import { sanitizeAIResponse } from "@/lib/ai/sanitize";
import { RATE_LIMITS, checkRateLimitOnly } from "@/lib/api/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 限流检查
  const rl = checkRateLimitOnly(request, RATE_LIMITS.AI_GENERATE);
  if (!rl.allowed) {
    return NextResponse.json({ error: `请求过于频繁，请 ${Math.ceil((rl.reset * 1000 - Date.now()) / 1000)} 秒后重试` }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset * 1000 - Date.now()) / 1000)) } });
  }

  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const body = await request.json();
        const { answers, weaknesses, injuryRisk, diagnosisSummary } = body;

        if (!answers || !weaknesses) {
          send("error", { message: "缺少必要的诊断数据" });
          controller.close();
          return;
        }

        // 校验训练天数
        const trainingDaysRaw = answers["a01"] || answers["bb29"] || answers["st49"] || "";
        const td = Number(trainingDaysRaw) || parseInt(String(trainingDaysRaw)) || 0;
        if (td < 1) {
          send("error", { message: "每周训练天数至少为 1 天" });
          controller.close();
          return;
        }

        const injury = extractInjuryInfo(answers);
        const planInput = generatePlanInput(answers);
        const weaknessesText = Array.isArray(weaknesses) ? weaknesses.join("、") : weaknesses;
        const riskText = injuryRisk
          ? `等级：${injuryRisk.level}，风险因素：${injuryRisk.factors?.join("、") || "无"}`
          : "未评估";

        const basePrompt = buildPlanUserPrompt(planInput, weaknessesText, riskText, diagnosisSummary || "综合诊断已完成", injury);

        // RAG 检索
        const kbQuery = [weaknessesText, riskText].join(" ");
        const relevantArticles = searchKnowledgeBase(kbQuery, 3);
        const kbContext = relevantArticles.length > 0
          ? "\n\n## 参考知识库\n" + relevantArticles.map(a => `【${a.title}】\n${a.content.slice(0, 500)}`).join("\n\n---\n\n")
          : "";
        const systemPromptWithKB = PLANNING_SYSTEM_PROMPT + kbContext;

        // 开始生成
        send("start", { message: "AI 正在分析数据..." });

        // Part 1: 第 1-6 周
        for await (const chunk of callDeepSeekStream(
          systemPromptWithKB,
          basePrompt + "\n\n请生成第1周到第6周的详细训练计划。只输出前半部分。",
          { temperature: 0.8, maxTokens: 8192 }
        )) {
          const cleaned = sanitizeAIResponse(chunk);
          fullText += cleaned;
          send("text", { text: cleaned });
        }

        // 分隔标记
        send("marker", { text: "\n\n" });

        // Part 2: 第 7-12 周
        const context = fullText.slice(-500);
        for await (const chunk of callDeepSeekStream(
          systemPromptWithKB,
          basePrompt + "\n\n以下是前6周计划的结尾作为衔接上下文：\n" + context + "\n\n请接续生成第7周到第12周的详细训练计划。只输出后半部分，不要重新输出短板分析。",
          { temperature: 0.8, maxTokens: 8192 }
        )) {
          const cleaned = sanitizeAIResponse(chunk);
          fullText += cleaned;
          send("text", { text: cleaned });
        }

        // 后处理：扫描违禁动作
        const { hasViolations, violations } = scanAndWarnPlan(fullText, injury);
        if (hasViolations) {
          send("warning", {
            violations,
            message: `检测到 ${violations.length} 个动作可能不适宜你的伤病史`,
          });
        }

        // 完成
        send("done", {
          fullText,
          safetyWarnings: hasViolations ? { violations } : undefined,
        });
        controller.close();
      } catch (error: unknown) {
        const err = error as Error;
        console.error("流式计划生成错误:", err);
        send("error", { message: err.message || "生成中断" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
