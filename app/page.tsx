// 首页 — 深色运动风，集成全部功能入口
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f23] via-[#1a1040] to-[#0a0a14]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <p className="text-amber-500 font-semibold tracking-widest text-sm mb-4 animate-fade-in-up">BOUNCELAB · 弹跳训练诊断平台</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-none mb-6 animate-fade-in-up">
            <span className="text-white">解锁你的</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">垂直弹跳潜力</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mb-10 animate-fade-in-up">
            基于运动科学的专业评估 × AI 智能分析 × 个性化训练方案。
            从诊断到执行，一站式科学提升你的弹跳能力。
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up">
            <Link href="/assessment" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0a0a14] font-extrabold rounded-xl text-lg transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5">
              开始免费评估 →
            </Link>
            <Link href="/program-builder" className="inline-flex items-center px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-lg transition-all backdrop-blur-sm">
              组装训练计划
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 全部功能 ============ */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-center text-white mb-4">核心功能</h2>
        <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">六大模块覆盖弹跳训练的完整闭环</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { href: "/assessment", icon: "🔬", title: "弹跳短板测评", desc: "基础版34题或专业版80题系统问卷，基于NSCA/FMS/YBT国际标准，精准定位你的弹跳弱项与受伤风险。", color: "from-amber-500/20 to-amber-600/5 border-amber-500/20 hover:border-amber-500/40", btn: "开始评估 →" },
            { href: "/program-builder", icon: "🧩", title: "训练组装器", desc: "从65个专业动作中自由选择，自定义组次与休息时间，5套预设模板一键生成完整训练日计划。", color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40", btn: "组装计划 →" },
            { href: "/training-log", icon: "📝", title: "训练日志", desc: "记录每次训练的动作、负荷与感受，统计面板追踪训练量趋势，过度训练智能预警。", color: "from-blue-500/20 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40", btn: "查看日志 →" },
            { href: "/jump-tracker", icon: "📊", title: "弹跳追踪", desc: "记录CMJ、SJ、助跑摸高等测试数据，可视化进步曲线与历史最佳记录。", color: "from-violet-500/20 to-violet-600/5 border-violet-500/20 hover:border-violet-500/40", btn: "追踪弹跳 →" },
            { href: "/exercises", icon: "🏋️", title: "专业动作库", desc: "65个训练动作 × 8大分类，含奥林匹克举、增强式训练等。每个动作配有教练提示、组次建议和安全警告。", color: "from-rose-500/20 to-rose-600/5 border-rose-500/20 hover:border-rose-500/40", btn: "浏览动作 →" },
            { href: "/faq", icon: "🔍", title: "疑难杂症", desc: "54个高频问题 × 11大分类，覆盖训练、伤病、营养、心理等。含学术参考文献与循证建议。", color: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/40", btn: "寻找答案 →" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className={`group relative bg-[#1e293b] border rounded-2xl p-7 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${item.color}`}>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-4">{item.desc}</p>
              <span className="inline-flex items-center text-amber-500 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                {item.btn}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 工作流 ============ */}
      <section className="bg-[#0d0d1a] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-white mb-4">三步进阶</h2>
          <p className="text-gray-500 text-center mb-12">科学的训练流程，让每一步都有据可依</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "📋", title: "评估诊断", desc: "10-15分钟完成专业问卷，AI + 规则引擎双引擎分析你的弹跳短板", href: "/assessment" },
              { step: "02", icon: "🧩", title: "组装计划", desc: "从动作库挑选练习，或使用预设模板快速生成专属训练日方案", href: "/program-builder" },
              { step: "03", icon: "📈", title: "追踪进步", desc: "记录训练日志与弹跳数据，观察进步曲线，持续优化训练方向", href: "/jump-tracker" },
            ].map((item) => (
              <Link key={item.step} href={item.href} className="text-center group block">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 group-hover:border-amber-500/40 group-hover:scale-105 transition-all">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <div className="text-xs text-amber-500 font-bold tracking-widest mb-1">STEP {item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 数据亮点 ============ */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "65+", label: "专业训练动作", icon: "🏋️" },
            { value: "54", label: "疑难问题解答", icon: "🔍" },
            { value: "11", label: "评估维度", icon: "📐" },
            { value: "100%", label: "免费使用", icon: "🎁" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/20 transition-colors">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700/50 rounded-3xl p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">准备好发现你的弹跳潜力了吗？</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">免费评估，无需注册。数据保存在你的浏览器本地，随时可以开始。</p>
          <Link href="/assessment" className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0a0a14] font-extrabold rounded-xl text-lg transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40">
            开始免费评估 →
          </Link>
        </div>
      </section>
    </div>
  );
}
