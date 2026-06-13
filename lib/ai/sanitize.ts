// ============================================================
// AI 响应安全清洗 — 防止 Prompt 注入导致 XSS
// ============================================================

/**
 * 服务端安全清洗：移除 AI 返回内容中可能存在的恶意 HTML/脚本
 *
 * 由于 AI 返回的是纯文本训练计划（非 HTML），
 * 主要防护目标是：
 * 1. 移除 <script> 标签及其内容
 * 2. 移除事件处理器属性（onerror=, onload= 等）
 * 3. 转义 HTML 实体，防止浏览器解析
 *
 * 此函数可在 Node.js（API Route）和浏览器中运行，
 * 无需 JSDOM 等重型依赖。
 */

/** 正则：匹配所有 HTML 标签 */
const TAG_RE = /<[^>]*>/g;

/** 正则：匹配 <script>...</script>（含跨行） */
const SCRIPT_RE = /<script[\s\S]*?<\/script>/gi;

/** 正则：匹配内联事件处理器 */
const EVENT_ATTR_RE = /\s+on\w+\s*=\s*["'][^"']*["']/gi;
const EVENT_ATTR_UNQUOTED_RE = /\s+on\w+\s*=\s*[^\s>]*/gi;

/** 正则：匹配 javascript: 协议 */
const JS_PROTO_RE = /javascript\s*:/gi;

/** HTML 实体转义映射 */
const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

/**
 * 基础 HTML 转义（保留纯文本，不保留任何 HTML 结构）
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ENTITIES[ch] || ch);
}

/**
 * AI 响应安全清洗 —— 服务端版本（轻量，无 DOM 依赖）
 *
 * 策略：
 * 1. 先移除 <script> 块
 * 2. 移除内联事件处理器
 * 3. 移除 javascript: 协议
 * 4. 移除所有剩余 HTML 标签
 *
 * 注意：AI 计划内容是纯文本，不应包含任何 HTML。
 * 如果清洗后内容明显变短，说明原始内容含有异常标记。
 */
export function sanitizeAIResponse(text: string): string {
  if (!text || typeof text !== "string") return "";

  let cleaned = text;

  // 1. 移除完整的 <script>...</script> 块
  cleaned = cleaned.replace(SCRIPT_RE, "");

  // 2. 移除内联事件处理器（onclick=, onerror= 等）
  cleaned = cleaned.replace(EVENT_ATTR_RE, "");
  cleaned = cleaned.replace(EVENT_ATTR_UNQUOTED_RE, "");

  // 3. 移除 javascript: 伪协议
  cleaned = cleaned.replace(JS_PROTO_RE, "");

  // 4. 移除所有剩余的 HTML 标签（<任意>）
  cleaned = cleaned.replace(TAG_RE, "");

  return cleaned;
}

/**
 * AI 响应安全清洗 —— 浏览器版本（使用 DOMPurify）
 *
 * 用于需要渲染 HTML 片段（如 Markdown 转换后）的场景。
 * 仅在浏览器环境中可用。
 */
export async function sanitizeAIResponseBrowser(text: string): Promise<string> {
  if (typeof window === "undefined") {
    // 服务端回退到基础清洗
    return sanitizeAIResponse(text);
  }

  try {
    const DOMPurify = (await import("dompurify")).default;
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // 不允许任何 HTML 标签
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true, // 保留标签内的文本内容
    });
  } catch {
    return sanitizeAIResponse(text);
  }
}

/**
 * 对 API 返回的 AI 内容对象进行递归清洗
 */
export function sanitizeAIPayload<T>(data: T): T {
  if (typeof data === "string") {
    return sanitizeAIResponse(data) as T;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeAIPayload) as T;
  }
  if (data && typeof data === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      // 跳过安全警告等系统生成字段
      if (key === "safetyWarnings") {
        cleaned[key] = value;
      } else {
        cleaned[key] = sanitizeAIPayload(value);
      }
    }
    return cleaned as T;
  }
  return data;
}
