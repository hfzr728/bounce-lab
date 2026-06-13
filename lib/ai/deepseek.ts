// ============================================================
// DeepSeek API 封装 — OpenAI SDK 兼容调用（延迟初始化）
// ============================================================

import "server-only";
import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "sk-your-api-key-here") {
    console.warn("⚠️ DEEPSEEK_API_KEY 未设置。AI 功能将不可用。");
    return null;
  }
  if (!_client) {
    _client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com/v1",
    });
    console.log("✅ DeepSeek 客户端已初始化");
  }
  return _client;
}

export interface AICallOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 调用 DeepSeek Chat API（非流式）
 */
export async function callDeepSeek(
  systemPrompt: string,
  userPrompt: string,
  options: AICallOptions = {}
): Promise<string> {
  const client = getClient();
  if (!client) {
    return "（AI 分析暂不可用，请检查 DEEPSEEK_API_KEY 是否已正确配置）";
  }

  const {
    model = "deepseek-chat",
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
      stream: false,
    });

    return response.choices[0]?.message?.content || "（AI 未返回有效内容）";
  } catch (error: unknown) {
    const err = error as Error;
    console.error("DeepSeek API 调用失败:", err.message);
    return `（AI 分析生成失败: ${err.message}。请确认 API Key 有效且有可用余额。）`;
  }
}

/**
 * 调用 DeepSeek Chat API（流式）— 返回 ReadableStream<string>
 * 用法：
 *   const stream = callDeepSeekStream(system, user);
 *   for await (const chunk of stream) { ... }
 */
export async function* callDeepSeekStream(
  systemPrompt: string,
  userPrompt: string,
  options: AICallOptions = {}
): AsyncGenerator<string, void, undefined> {
  const client = getClient();
  if (!client) {
    yield "（AI 分析暂不可用，请检查 DEEPSEEK_API_KEY 是否已正确配置）";
    return;
  }

  const {
    model = "deepseek-chat",
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  try {
    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("DeepSeek 流式调用失败:", err.message);
    yield `\n（AI 流式分析中断: ${err.message}）`;
  }
}
