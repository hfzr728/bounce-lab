// ============================================================
// Q&A API — RAG 检索 + DeepSeek 流式回答
// ============================================================
import { NextRequest } from "next/server";
import { searchKnowledgeBase } from "@/lib/knowledge-base";
import { sanitizeAIResponse } from "@/lib/ai/sanitize";
import { RATE_LIMITS, checkRateLimitOnly } from "@/lib/api/rate-limit";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY 环境变量未设置，AI 功能不可用");
}
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export async function POST(request: NextRequest) {
  // 限流检查
  const rl = checkRateLimitOnly(request, RATE_LIMITS.GENERAL);
  if (!rl.allowed) {
    return Response.json({ error: `请求过于频繁，请 ${Math.ceil((rl.reset * 1000 - Date.now()) / 1000)} 秒后重试` }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset * 1000 - Date.now()) / 1000)) } });
  }

  const { question } = await request.json();
  if (!question || typeof question !== "string" || question.trim().length < 2) {
    return Response.json({ error: "请输入有效问题" }, { status: 400 });
  }

  // 1. RAG 检索
  const relevantArticles = searchKnowledgeBase(question, 4);
  const knowledgeContext = relevantArticles.length > 0
    ? relevantArticles.map(a => `【${a.title}】\n${a.content}`).join("\n\n---\n\n")
    : "（未找到相关知识库条目，请根据你的专业知识回答）";

  // 2. 构建系统提示
  const systemPrompt = `你是用户的专业私人教练，专精于提升垂直弹跳与爆发力。你也是 BounceLab 弹跳训练平台的 AI 专家助手。

你需要基于提供的教练知识库内容回答用户问题。你必须像真正的教练那样，首先理解知识库中的训练原理、动作参数、决策逻辑和案例，然后结合用户的问题进行分析和回答。不要逐字照搬知识库——用你自己的教练语言消化、整合后输出。

回答要求：
- 全程使用简体中文，禁止输出任何英文单词或句子
- 专业术语可附带英文缩写及中文解释
- 先给核心结论，再分点展开
- 引用具体数据和科学原理，给出可操作的建议
- 如果问题涉及伤病诊断，务必首先说明「AI 不能替代医生诊断，建议就医」
- 安全第一：涉及训练建议时，必须考虑动作禁忌和用户安全
- 不要使用 Markdown 表格
- 保持在 800 字以内

参考知识：
${knowledgeContext}`;

  // 3. 流式调用 DeepSeek
  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        max_tokens: 2048,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `AI 请求失败: ${errText}` }, { status: 502 });
    }

    // 流式转发
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) { controller.close(); return; }
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") { controller.close(); return; }
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: sanitizeAIResponse(delta) })}\n\n`));
                }
              } catch { /* skip malformed chunks */ }
            }
          }
        } catch { /* stream closed */ }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    return Response.json({ error: `请求失败: ${err.message}` }, { status: 500 });
  }
}
