"use client";

// ============================================================
// useAsyncLock — 防止异步操作重复提交
// ============================================================

import { useRef, useState, useCallback } from "react";

interface UseAsyncLockReturn<T> {
  /** 是否正在执行 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 包裹异步函数，自动管理 loading/error/abort */
  run: (fn: (signal: AbortSignal) => Promise<T>) => Promise<T | undefined>;
  /** 取消当前请求 */
  cancel: () => void;
  /** 清除错误 */
  clearError: () => void;
}

/**
 * 异步操作锁 — 确保同一时间只有一个请求在执行
 *
 * - 自动防止重复点击
 * - 新请求自动取消旧请求（AbortController）
 * - 统一管理 loading / error 状态
 */
export function useAsyncLock<T = unknown>(): UseAsyncLockReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const run = useCallback(async (fn: (signal: AbortSignal) => Promise<T>): Promise<T | undefined> => {
    // 取消前一次请求
    cancel();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fn(controller.signal);
      return result;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return undefined; // 被取消不算错误
      }
      const message = err instanceof Error ? err.message : "操作失败";
      setError(message);
      return undefined;
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  }, [cancel]);

  return { loading, error, run, cancel, clearError };
}
