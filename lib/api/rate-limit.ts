// ============================================================
// IP 请求频率限制 — 防 API 滥用
// ============================================================

import { NextRequest, NextResponse } from "next/server";

/** 限流配置 */
export interface RateLimitConfig {
  /** 时间窗口（秒） */
  windowSeconds: number;
  /** 窗口内最大请求数 */
  maxRequests: number;
  /** 限流标识（用于错误提示） */
  label: string;
}

/** 每条 IP 的记录 */
interface RateRecord {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

// 预设限流策略
export const RATE_LIMITS = {
  /** AI 生成类接口：5次/分钟 */
  AI_GENERATE: { windowSeconds: 60, maxRequests: 5, label: "AI 生成" } as RateLimitConfig,
  /** 诊断接口：10次/分钟 */
  DIAGNOSIS: { windowSeconds: 60, maxRequests: 10, label: "诊断" } as RateLimitConfig,
  /** 一般查询：20次/分钟 */
  GENERAL: { windowSeconds: 60, maxRequests: 20, label: "查询" } as RateLimitConfig,
};

// 内存存储（单实例适用）
const store = new Map<string, RateRecord>();

// 定期清理过期记录（每 5 分钟）
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store) {
      if (now > record.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

/** 从请求中获取客户端 IP */
function getClientIP(request: NextRequest): string {
  // 优先取代理头（nginx 等反向代理设置）
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  // 回退到直接连接 IP（Next.js 内置）
  const ip = request.headers.get("x-real-ip") ||
    request.headers.get("x-client-ip") ||
    "127.0.0.1";
  return ip;
}

export interface RateLimitResult {
  /** 是否通过 */
  allowed: boolean;
  /** 剩余请求次数 */
  remaining: number;
  /** 重置时间（Unix秒） */
  reset: number;
  /** 总限制 */
  limit: number;
}

/**
 * 检查并记录一次请求
 * 如果超出限制，返回 NextResponse (429)；否则返回 null（放行）
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
): RateLimitResult {
  const ip = getClientIP(request);
  const now = Date.now();
  const key = `rl:${ip}`;

  let record = store.get(key);

  // 窗口过期或首次访问 → 重置
  if (!record || now > record.resetAt) {
    record = {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    };
    store.set(key, record);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      reset: Math.ceil(record.resetAt / 1000),
      limit: config.maxRequests,
    };
  }

  // 窗口内
  record.count++;

  if (record.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      reset: Math.ceil(record.resetAt / 1000),
      limit: config.maxRequests,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    reset: Math.ceil(record.resetAt / 1000),
    limit: config.maxRequests,
  };
}

/**
 * 为 API Route 添加限流保护
 * 超限时直接返回 429 响应
 *
 * 用法：
 *   const rateLimitResult = applyRateLimit(request, RATE_LIMITS.AI_GENERATE);
 *   if (rateLimitResult) return rateLimitResult;
 */
export function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
): NextResponse | null {
  const result = checkRateLimit(request, config);

  const headers = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: `请求过于频繁（${config.label}接口 ${config.windowSeconds}秒内最多 ${config.maxRequests} 次），请 ${Math.ceil((result.reset * 1000 - Date.now()) / 1000)} 秒后重试`,
      },
      {
        status: 429,
        headers: {
          ...headers,
          "Retry-After": String(Math.ceil((result.reset * 1000 - Date.now()) / 1000)),
        },
      },
    );
  }

  // 放行，附带限流头
  return NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });
}

/**
 * 轻量版：仅返回限流结果，不生成 Response
 * 用于自定义响应处理
 */
export function checkRateLimitOnly(
  request: NextRequest,
  config: RateLimitConfig,
): RateLimitResult {
  return checkRateLimit(request, config);
}

/**
 * 构建限流响应头（用于已放行的请求）
 */
export function rateLimitHeaders(
  request: NextRequest,
  config: RateLimitConfig,
): Record<string, string> {
  const result = checkRateLimit(request, config);
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };
}
