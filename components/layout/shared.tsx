// ============================================================
// 共享布局组件 — 深色运动风
// ============================================================
import { UserButton } from "@/components/user/user-button";

export function Header() {
  return (
    <header className="border-b border-slate-700/50 bg-[#0f172a]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between flex-wrap gap-2">
        <a href="/" className="text-lg md:text-xl font-extrabold tracking-tight shrink-0">
          <span className="text-amber-500">BOUNCE</span>
          <span className="text-white/80">LAB</span>
        </a>
        <nav className="flex items-center gap-0.5 md:gap-5 text-xs md:text-sm font-medium flex-wrap">
          {[
            ["首页", "/"], ["评估", "/assessment"], ["组装", "/program-builder"],
            ["日志", "/training-log"], ["追踪", "/jump-tracker"],
            ["动作库", "/exercises"], ["问答", "/faq"], ["主页", "/profile"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="text-gray-400 hover:text-amber-400 transition-colors px-2 py-1">
              {label}
            </a>
          ))}
          <UserButton />
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>BOUNCELAB — 弹跳训练诊断平台 | 数据仅供参考，请结合专业教练指导</p>
      </div>
    </footer>
  );
}
