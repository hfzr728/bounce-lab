// 首页 — 霓虹运动风 v2
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-[#00F5FF] mb-6 animate-fade-in-up">
            EXPLOSIVE TRAINING PLATFORM
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 animate-fade-in-up">
            <span className="text-white">PRECISE</span>
            <br />
            <span className="text-[#00F5FF]">ASSESSMENT,</span>
            <br />
            <span className="text-white">EXPLOSIVE</span>
            <br />
            <span className="bg-gradient-to-r from-[#00F5FF] to-[#FFD700] bg-clip-text text-transparent">
              TRAINING
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-10 animate-fade-in-up animate-delay-1">
            专业运动评估精准定位你的弹跳短板 → AI 驱动个性化 12 周训练方案。
            测准、练对、跳更高。
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animate-delay-2">
            <Link href="/assessment"
              className="btn-skew bg-[#00F5FF] text-[#0A0A0A] text-sm"
            >
              START ASSESSMENT →
            </Link>
            <Link href="/plan"
              className="btn-skew bg-transparent border border-white/20 text-white hover:border-[#00F5FF]/50 text-sm"
            >
              AI PLAN GENERATOR
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 数据亮点 ============ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "65+", label: "专业动作", icon: "🏋️" },
            { value: "12", label: "周训练周期", icon: "🧠" },
            { value: "11", label: "评估维度", icon: "📐" },
            { value: "9", label: "功能模块", icon: "🎯" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className="font-data text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-slate-500 tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 功能模块 ============ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-14 text-center">
          <p className="font-display text-xs tracking-[0.25em] text-[#00F5FF] mb-3">FEATURES</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">ALL SYSTEMS</h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">从评估诊断到训练执行，覆盖弹跳训练全流程</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/assessment", icon: "🔬", title: "短板测评", desc: "三套专业问卷", tag: "核心", accent: "cyan" },
            { href: "/plan", icon: "🧠", title: "AI 计划", desc: "12周个性化方案", tag: "智能", accent: "gold" },
            { href: "/program-builder", icon: "🧩", title: "训练日历", desc: "自由组装训练日", tag: "灵活", accent: "cyan" },
            { href: "/jump-tracker", icon: "📊", title: "弹跳追踪", desc: "四合一进步曲线", tag: "数据", accent: "gold" },
            { href: "/exercises", icon: "🏋️", title: "动作库", desc: "65个专业动作", tag: "专业", accent: "cyan" },
            { href: "/qa", icon: "💡", title: "百科问答", desc: "运动科学知识库", tag: "知识", accent: "gold" },
            { href: "/rehab", icon: "🏥", title: "康复方案", desc: "10种伤病×5阶段", tag: "安全", accent: "red" },
            { href: "/body-comp", icon: "🍎", title: "体成分", desc: "三公式交叉验证", tag: "营养", accent: "cyan" },
          ].map((item) => {
            const glowClass = item.accent === "red" ? "hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(255,59,59,0.15)]" :
              item.accent === "gold" ? "hover:border-[#FFD700]/40 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]" :
              "hover:border-[#00F5FF]/40 hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]";
            const tagClass = item.accent === "red" ? "bg-red-500/15 text-red-400 border-red-500/20" :
              item.accent === "gold" ? "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20" :
              "bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/20";
            return (
              <Link key={item.title} href={item.href}
                className={`glass-card p-5 group ${glowClass}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium tracking-wider ${tagClass}`}>{item.tag}</span>
                </div>
                <h3 className="font-display text-xl text-white mb-1 tracking-wide">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-[#00F5FF] transition-all duration-500 rounded-full" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ 工作流 ============ */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/3 via-transparent to-[#FF3B3B]/3 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="font-display text-xs tracking-[0.25em] text-[#00F5FF] mb-3">PROCESS</p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">4 STEPS TO VERT</h2>
            <p className="text-slate-500 text-sm">科学的训练流程，让每一步都有据可依</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: "📋", title: "评估诊断", desc: "完成专业问卷，AI + 规则引擎分析短板", href: "/assessment" },
              { step: "02", icon: "🧠", title: "AI 生成计划", desc: "基于评估结果，生成 12 周训练方案", href: "/plan" },
              { step: "03", icon: "🧩", title: "计划与日历", desc: "组装训练日，安排到日历追踪进度", href: "/program-builder" },
              { step: "04", icon: "📈", title: "追踪进步", desc: "记录弹跳数据，四合一进步曲线", href: "/jump-tracker" },
            ].map((item) => (
              <Link key={item.step} href={item.href} className="group block text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-[#00F5FF]/40 group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="font-data text-lg font-bold text-[#00F5FF] mb-1 tracking-widest">STEP {item.step}</div>
                <h3 className="font-display text-lg text-white mb-1.5 tracking-wide">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-12 md:p-16 glow-border">
          <h2 className="font-display text-3xl md:text-5xl text-white mb-4 tracking-wide">
            READY TO <span className="text-[#00F5FF]">EXPLODE</span>?
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto text-sm">
            注册即可免费使用全部功能。评估数据与训练计划仅保存在你的浏览器本地。
          </p>
          <Link href="/assessment"
            className="btn-skew bg-[#00F5FF] text-[#0A0A0A] text-sm inline-flex"
          >
            START NOW →
          </Link>
        </div>
      </section>
    </div>
  );
}
