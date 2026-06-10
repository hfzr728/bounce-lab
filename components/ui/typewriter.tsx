"use client";

// 打字机效果组件 — 逐字显示文本，带闪烁光标
// ============================================================

import { useState, useEffect, useRef } from "react";

interface TypewriterProps {
  text: string;
  /** 每个字符显示间隔（ms） */
  speed?: number;
  /** 是否显示光标 */
  showCursor?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 开始打字前的延迟 */
  startDelay?: number;
}

export function Typewriter({
  text,
  speed = 30,
  showCursor = true,
  className = "",
  startDelay = 300,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset on text change
    indexRef.current = 0;
    setDisplayed("");
    setIsComplete(false);

    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        indexRef.current += 1;
        if (indexRef.current >= text.length) {
          setDisplayed(text);
          setIsComplete(true);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setDisplayed(text.slice(0, indexRef.current));
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && !isComplete && (
        <span className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

/**
 * 渐进式类型机 — 支持流式追加文本（从 SSE 接收时使用）
 */
export function StreamingTypewriter({
  chunks,
  className = "",
}: {
  chunks: string[];
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const chunksRef = useRef(chunks);

  useEffect(() => {
    const newChunks = chunks.slice(chunksRef.current.length);
    if (newChunks.length === 0) return;
    chunksRef.current = chunks;

    let i = 0;
    const interval = setInterval(() => {
      if (i < newChunks.join("").length) {
        // Show all previous + progressively show new content
        const previous = chunks.slice(0, chunksRef.current.length - newChunks.length).join("");
        setDisplayed(previous + newChunks.join("").slice(0, i));
        i += 2;
      } else {
        setDisplayed(chunks.join(""));
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [chunks.length]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 animate-pulse align-middle" />
    </span>
  );
}
