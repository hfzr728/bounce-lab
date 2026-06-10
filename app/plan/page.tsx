"use client";

import { useEffect, useState } from "react";

/** 简易 Markdown → HTML（暗色主题，表格转清晰列表） */
function renderMarkdown(md: string): string {
  let html = md;

  // ---- 预处理：把所有 Markdown 表格转为清晰的文本列表 ----
  // 按行分割，识别表格块（连续以 | 开头的行）
  const lines = html.split("\n");
  const processed: string[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let tableLines: string[] = [];

  const flushTable = () => {
    if (tableHeaders.length === 0 || tableRows.length === 0) {
      // 没有有效表格，原样输出
      processed.push(...tableLines);
    } else {
      processed.push("");
      processed.push('<div class="my-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">');
      processed.push('<p class="text-xs text-slate-500 mb-2">📅 周计划</p>');
      for (const row of tableRows) {
        const parts = row.map((cell, i) => {
          const h = tableHeaders[i] || "";
          return h ? `<span class="text-amber-400 font-medium">${h}</span>: ${cell}` : cell;
        });
        processed.push(`<p class="text-sm text-slate-300 leading-relaxed mb-1">${parts.join(" &nbsp;|&nbsp; ")}</p>`);
      }
      processed.push("</div>");
      processed.push("");
    }
    tableHeaders = [];
    tableRows = [];
    tableLines = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 检测表格行（以 | 开头和结尾）
    const isTableLine = /^\|.+\|$/.test(trimmed) && trimmed.includes("|");
    // 检测对齐行（如 | :--- | :--- |）
    const isAlignLine = /^\|[\s:\-|]+\|$/.test(trimmed) && trimmed.includes("---");

    if (isAlignLine && inTable) {
      // 对齐行，跳过但标记为已处理
      tableLines.push(line);
      continue;
    }

    if (isTableLine && !isAlignLine) {
      if (!inTable) {
        // 可能是新表格开始
        flushTable();
        inTable = true;
      }
      tableLines.push(line);
      // 提取单元格
      const cells = trimmed
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (tableHeaders.length === 0 && cells.length > 0) {
        tableHeaders = cells;
      } else if (cells.length > 0) {
        // 补齐列数
        while (cells.length < tableHeaders.length) cells.push("");
        tableRows.push(cells.slice(0, tableHeaders.length));
      }
    } else {
      if (inTable) {
        flushTable();
      }
      processed.push(line);
    }
  }
  flushTable();
  html = processed.join("\n");

  // 粗体
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong class='text-slate-100'>$1</strong>");
  // ### 标题
  html = html.replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold text-amber-400 mt-6 mb-3 border-b border-slate-700/50 pb-2'>$1</h3>");
  // ## 标题
  html = html.replace(/^## (.+)$/gm, "<h2 class='text-xl font-extrabold text-slate-100 mt-8 mb-4'>$1</h2>");
  // 分割线
  html = html.replace(/^---$/gm, "<hr class='my-6 border-slate-700/50' />");
  // 列表项（支持 - 和 * 开头的）
  html = html.replace(/^[-*] (.+)$/gm, "<li class='ml-4 text-sm text-slate-300 leading-relaxed'>$1</li>");
  // 编号列表
  html = html.replace(/^\d+\.\s(.+)$/gm, "<li class='ml-4 text-sm text-slate-300 leading-relaxed'>$1</li>");
  // 换行分段
  html = html.replace(/\n\n/g, "</p><p class='text-sm text-slate-300 leading-relaxed mb-3'>");
  html = "<p class='text-sm text-slate-300 leading-relaxed mb-3'>" + html + "</p>";
  // 连续列表项包裹
  html = html.replace(/(<li[^>]*>.*?<\/li>)\s*(?=<li)/gs, "$1");
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, "<ul class='list-disc ml-5 my-2 text-slate-300'>$1</ul>");
  return html;
}

export default function PlanPage() {
  const [plan, setPlan] = useState<{ aiGenerated: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("bounce-plan");
    if (stored) {
      try {
        setPlan(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-green-900/30 rounded-full blur-sm" />
          </div>
          <p className="text-slate-300 text-lg font-medium mb-2">正在加载训练计划...</p>
          <div className="flex justify-center gap-1 mt-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "200ms" }} />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-6">📋</div>
          <h1 className="text-2xl font-bold text-slate-100 mb-4">未找到训练计划</h1>
          <p className="text-slate-400 mb-8">请先完成评估并生成诊断报告后再获取训练计划。</p>
          <a href="/assessment" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25">
            去评估 →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-[#0f172a] min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          📋 个性化训练计划
        </h1>
        <p className="text-slate-400">AI 根据您的诊断结果和可用条件制定</p>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-8">
        <div
          className="max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(plan.aiGenerated) }}
        />
      </div>

      {/* 反馈与重新生成 */}
      <div className="mt-8 bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 no-print">
        <h3 className="text-lg font-bold text-white mb-3">🔄 不满意？告诉 AI 你的需求</h3>
        <p className="text-sm text-slate-400 mb-4">
          输入你的不满之处、受限制的条件（如"我没有杠铃"、"每周只有2天"、"膝盖有伤不能深蹲"），AI 会据此重新生成训练计划。
        </p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="例如：我周一没法训练、家里只有哑铃、膝盖有旧伤不能做大重量深蹲、希望多加入一些自重训练..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50 resize-none mb-4"
          disabled={regenerating}
        />
        <button
          onClick={async () => {
            if (!feedback.trim()) return;
            setRegenerating(true);
            try {
              const answers = sessionStorage.getItem("bounce-answers");
              const diagnosis = sessionStorage.getItem("bounce-diagnosis");
              const res = await fetch("/api/plan/revise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  currentPlan: plan.aiGenerated,
                  feedback: feedback.trim(),
                  answers: answers ? JSON.parse(answers) : {},
                  diagnosisSummary: diagnosis ? (() => { const d = JSON.parse(diagnosis); return `综合评分 ${d.overallScore}/100，优势：${d.strengths?.join("、")}，短板：${d.weaknesses?.join("、")}`; })() : "",
                }),
              });
              if (!res.ok) throw new Error("请求失败");
              const newPlan = await res.json();
              setPlan(newPlan);
              sessionStorage.setItem("bounce-plan", JSON.stringify(newPlan));
              setFeedback("");
              const t = document.createElement("div");
              t.className = "fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-600 text-white";
              t.textContent = "✅ 训练计划已根据你的反馈重新生成！";
              document.body.appendChild(t); setTimeout(() => t.remove(), 3000);
            } catch {
              const t = document.createElement("div");
              t.className = "fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-sm font-medium bg-red-600 text-white";
              t.textContent = "❌ 生成失败，请稍后重试。";
              document.body.appendChild(t); setTimeout(() => t.remove(), 3000);
            } finally {
              setRegenerating(false);
            }
          }}
          disabled={!feedback.trim() || regenerating}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            !feedback.trim() || regenerating
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 text-white shadow-lg shadow-green-500/25"
          }`}
        >
          {regenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              AI 正在重新生成...
            </span>
          ) : "🔄 重新生成训练计划"}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mt-10 justify-center no-print">
        <a
          href="/report"
          className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all border border-slate-600/30"
        >
          ← 返回诊断报告
        </a>
        <button
          onClick={() => {
            const now = new Date().toLocaleString("zh-CN");
            const key = `bounce-saved-p-${Date.now()}`;
            localStorage.setItem(key, JSON.stringify({
              type: "plan", date: now, version: "",
              summary: (plan.aiGenerated || "").slice(0, 120) + "...",
              planText: plan.aiGenerated,
            }));
            // Toast via DOM since plan page is client component
            const toast = document.createElement("div");
            toast.className = "fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-600 text-white animate-fade-in-up";
            toast.textContent = "✅ 训练计划已保存到个人主页！";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
          }}
          className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25"
        >
          💾 保存到个人主页
        </button>
        <button
          onClick={() => window.print()}
          className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition-all border border-slate-600/30"
        >
          🖨️ 打印计划
        </button>
      </div>
    </div>
  );
}
