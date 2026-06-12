"use client";
// 弹跳百科问答 — 自由提问，RAG + AI 回答（须登录）
// ============================================================
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function QAPage() {
  const { isLoggedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "你好！我是 BounceLab 弹跳训练 AI 助手。你可以问我任何关于弹跳训练的问题，比如：\n\n• 怎样提高助跑起跳的转化率？\n• 深蹲时膝盖到底能不能过脚尖？\n• 增强式训练每周应该做几次？\n• 减脂期间怎么保住弹跳？\n\n我会基于运动科学知识库为你解答 👇" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isNearBottomRef = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // 监听用户手动滚动：判断是否在底部附近
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;
      isNearBottomRef.current = nearBottom;
      setShowScrollBtn(!nearBottom && loading);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [loading]);

  // 流式生成时：如果用户在底部，保持跟随（用 scrollTop 直接赋值，无动画不抖动）
  useEffect(() => {
    if (!loading) return;
    const container = chatContainerRef.current;
    if (!container) return;
    // 用 rAF 节流，避免每个 token 都触发 DOM 写入
    let rafId: number;
    const scrollToBottom = () => {
      if (isNearBottomRef.current) {
        container.scrollTop = container.scrollHeight;
      }
      rafId = requestAnimationFrame(scrollToBottom);
    };
    rafId = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(rafId);
  }, [loading]);

  // 新消息时强制滚到底
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      isNearBottomRef.current = true;
      setShowScrollBtn(false);
      const container = chatContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, loading]);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      isNearBottomRef.current = true;
      setShowScrollBtn(false);
    }
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    // 添加 AI 占位消息
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!response.ok) {
        const err = await response.json();
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: `❌ 出错了：${err.error || "请稍后重试"}` };
          return copy;
        });
        setLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取流");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + data.text };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `❌ 请求失败：${err.message}` };
        return copy;
      });
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const suggestQuestions = [
    "怎样提高助跑起跳的转化率？",
    "深蹲时膝盖能不能过脚尖？",
    "弹跳平台期怎么破？",
    "减脂期怎么保住弹跳？",
  ];

  if (!isLoggedIn) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center bg-[#0f172a] min-h-screen">
      <div className="text-6xl mb-6">🔒</div>
      <h1 className="text-3xl font-extrabold text-white mb-4">弹跳百科问答</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">百科问答功能需要登录后才能使用。点击右上角「👤 登录」按钮创建你的档案。</p>
      <Link href="/" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#0a0a14] font-bold rounded-xl text-lg transition-all shadow-lg">返回首页</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-[#0f172a] h-screen flex flex-col overflow-hidden">
      <div className="text-center mb-4 shrink-0">
        <h1 className="text-3xl font-extrabold text-white mb-1">🤖 弹跳百科问答</h1>
        <p className="text-slate-400 text-sm">基于运动科学知识库的 AI 问答 — 像 ChatGPT 一样自由提问</p>
      </div>

      {/* 聊天区 — 占据剩余空间，只有这里滚动 */}
      <div className="flex-1 bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col min-h-0 relative">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-amber-500/20 text-amber-100 border border-amber-500/30"
                  : "bg-slate-800/60 text-slate-200 border border-slate-700/30"
              }`}>
                {msg.role === "assistant" && msg.content === "" && loading ? (
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">思考中</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "200ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "400ms" }} />
                    </span>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {/* 滚动到底部按钮 */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              className="sticky bottom-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-amber-500 text-slate-900 rounded-full text-xs font-bold shadow-lg hover:bg-amber-400 transition-all animate-bounce"
            >
              ↓ 回到底部
            </button>
          )}
        </div>

        {/* 快捷提问 */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
            {suggestQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); inputRef.current?.focus(); }}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-700/50 text-slate-400 hover:bg-amber-500/20 hover:text-amber-400 border border-slate-600/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 输入区 */}
        <div className="border-t border-slate-700/50 p-4 flex gap-3 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="输入你的问题..."
            className="flex-1 bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-xl transition-all text-sm"
          >
            {loading ? "..." : "发送 →"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-600 mt-3 shrink-0">
        基于运动科学文献和循证实践 | AI 回答仅供参考，伤病诊断请咨询医生
      </p>
    </div>
  );
}
