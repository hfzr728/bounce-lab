// ============================================================
// 共享布局组件 — 霓虹运动风 v2
// ============================================================
import { UserButton } from "@/components/user/user-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
        <a href="/" className="font-display text-2xl md:text-3xl tracking-wider shrink-0">
          <span className="text-[#00F5FF]">BOUNCE</span>
          <span className="text-white/70">LAB</span>
        </a>
        <nav className="flex items-center gap-0 md:gap-5 text-xs md:text-sm font-medium flex-wrap">
          {[
            ["首页", "/"], ["评估", "/assessment"], ["生成计划", "/plan"],
            ["训练计划", "/program-builder"], ["追踪", "/jump-tracker"],
            ["动作库", "/exercises"], ["百科", "/qa"], ["康复", "/rehab"],
            ["饮食", "/body-comp"], ["主页", "/profile"],
          ].map(([label, href]) => (
            <a key={href} href={href}
              className="text-slate-400 hover:text-[#00F5FF] transition-colors px-2 py-1 text-[11px] md:text-sm tracking-wide">
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
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-10 text-center text-xs text-slate-600 tracking-wide">
        <p>BOUNCELAB — 弹跳评估诊断与训练计划平台 | 数据仅供参考，请结合专业教练指导</p>
      </div>
    </footer>
  );
}
