"use client";
// 轻量 Toast 通知组件
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
          <div key={t.id} className={`pointer-events-auto px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in-up ${
            t.type === "success" ? "bg-green-600 text-white" :
            t.type === "error" ? "bg-red-600 text-white" :
            "bg-slate-700 text-slate-100 border border-slate-600"
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
