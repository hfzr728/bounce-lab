// POST /api/diagnose/stream — SSE 流式诊断：先返回规则引擎结果，再流式推送 AI 分析
// ============================================================

import { NextRequest } from "next/server";
import { runDiagnosis, assessInjuryRisk } from "@/lib/diagnosis/rule-engine";
import { callDeepSeekStream } from "@/lib/ai/deepseek";
import { DIAGNOSIS_SYSTEM_PROMPT, buildDiagnosisUserPrompt } from "@/lib/ai/prompts";
import { allQuestions } from "@/lib/questionnaire/questions";
import { basicQuestions } from "@/lib/questionnaire/basic-questions";
import { standardQuestions } from "@/lib/questionnaire/standard-questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const body = await request.json();
        const answers = body.answers || {};

        if (!answers || Object.keys(answers).length === 0) {
          send("error", { message: "未收到任何问卷数据" });
          controller.close();
          return;
        }

        // 1. 规则引擎诊断
        const { dimensionScores, overallScore, strengths, weaknesses } =
          runDiagnosis(answers);
        const injuryRisk = assessInjuryRisk(answers);

        // 2. 立即发送规则引擎结果
        send("engine", {
          dimensionScores,
          overallScore,
          strengths,
          weaknesses,
          injuryRisk,
        });

        // 3. 构建 prompt
        const isBasic = Object.keys(answers).some(k => k.startsWith("bb"));
        const isStandard = Object.keys(answers).some(k => k.startsWith("st"));
        const questionSet = isBasic ? basicQuestions : isStandard ? standardQuestions : allQuestions;
        const keyAnswers = questionSet
          .filter((q) => answers[q.id] !== undefined && answers[q.id] !== "")
          .map((q) => `- ${q.text}：${answers[q.id]}${q.unit || ""}`)
          .join("\n");

        const dimScoresText = dimensionScores
          .map((d) => `- ${d.label}: ${d.score}/100（权重 ${Math.round(d.weight * 100)}%）`)
          .join("\n");

        const userPrompt = buildDiagnosisUserPrompt(
          keyAnswers,
          dimScoresText,
          strengths.join("、"),
          weaknesses.join("、"),
          `风险等级：${injuryRisk.level}（${injuryRisk.score}/100），风险因素：${injuryRisk.factors.join("、") || "无显著风险因素"}`
        );

        // 4. 流式推送 AI 分析
        for await (const chunk of callDeepSeekStream(DIAGNOSIS_SYSTEM_PROMPT, userPrompt)) {
          send("ai", { text: chunk });
        }

        // 5. 完成
        send("done", {});
        controller.close();
      } catch (error: unknown) {
        const err = error as Error;
        console.error("流式诊断错误:", err);
        send("error", { message: err.message });
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
