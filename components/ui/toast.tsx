"use client";
// 轻量 Toast 通知组件 — 玻璃态霓虹风
import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";

interface ToastItem { id: number; message: string; type: "success" | "error" | "info"; }

const ToastContext = createContext<{ toast: (msg: string, type?: "success"|"error"|"info") => void }>({ toast: () => {} });

let _toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: "success"|"error"|"info" = "info") => {
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto px-5 py-3 rounded-xl text-sm font-medium animate-fade-in-up backdrop-blur-md border ${
            t.type === "success" ? "bg-[#00F5FF]/10 border-[#00F5FF]/30 text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.1)]" :
            t.type === "error" ? "bg-[#FF3B3B]/10 border-[#FF3B3B]/30 text-[#FF3B3B] shadow-[0_0_20px_rgba(255,59,59,0.1)]" :
            "bg-white/5 border-white/10 text-slate-200"
          }`}>
            {t.type === "success" ? "✅ " : t.type === "error" ? "❌ " : "ℹ️ "}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
