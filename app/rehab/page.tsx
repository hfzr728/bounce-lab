"use client";
// 康复与预康复方案 — 选择伤病 + 阶段 → AI 生成个性化康复计划
// ============================================================
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/context";

const INJURIES = [
  { id: "patellar", name: "髌腱炎（跳跃膝）", icon: "🦵", desc: "髌腱反复负荷导致的退行性病变，弹跳运动员第一高发病" },
  { id: "achilles", name: "跟腱炎", icon: "🦶", desc: "跟腱中段或腱止点的退行性病变，晨僵和负荷痛为主要特征" },
  { id: "pfps", name: "髌骨软化/髌股疼痛", icon: "🦿", desc: "髌骨下软骨软化磨损，膝前痛，上下楼梯和久坐加重" },
  { id: "ankle", name: "踝关节扭伤", icon: "🩼", desc: "踝外侧韧带损伤，需重建本体感觉和稳定性才能安全回归" },
  { id: "shin", name: "胫骨骨膜炎", icon: "🏃", desc: "胫骨内侧应力综合征，跑跳量增加过快时常见" },
  { id: "acl", name: "ACL术后/膝关节不稳", icon: "🏥", desc: "前交叉韧带重建术后或慢性不稳，需严格分期康复" },
  { id: "meniscus", name: "半月板损伤", icon: "🦴", desc: "半月板撕裂或术后，需注意负重进度和屈膝角度" },
  { id: "hamstring", name: "腘绳肌拉伤/撕裂", icon: "🏋️", desc: "股二头肌/半腱肌急慢性损伤，常见于冲刺和大力屈膝" },
  { id: "lowerback", name: "下背痛/腰椎问题", icon: "🧎", desc: "腰椎间盘突出或腰肌劳损，影响深蹲和爆发力训练" },
  { id: "shoulder", name: "肩袖损伤", icon: "💪", desc: "肩袖肌腱病或撞击综合征，影响上肢摆臂和杠铃架位置" },
];

const STAGES = [
  { id: "acute", name: "急性期", icon: "🔴", desc: "疼痛明显，需控制症状、减轻负荷" },
  { id: "early", name: "早期恢复", icon: "🟡", desc: "疼痛减轻，开始循序渐进的力量重建" },
  { id: "mid", name: "中期康复", icon: "🟢", desc: "恢复力量和基础功能，逐步增加训练多样性" },
  { id: "late", name: "后期回归", icon: "🔵", desc: "运动专项能力重建，准备回归训练" },
  { id: "prehab", name: "预防性预康复", icon: "🛡️", desc: "无伤病，想针对性强化薄弱环节" },
];

export default function RehabPage() {
  const { isLoggedIn } = useUser();
  const [injuries, setInjuries] = useState<string[]>([]);
  const [stage, setStage] = useState("");
  const [details, setDetails] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  // 从个人主页跳转过来时，恢复已保存的康复方案
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bounce-rehab");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.plan) setPlan(data.plan);
        sessionStorage.removeItem("bounce-rehab");
      }
    } catch {}
  }, []);

  if (!isLoggedIn) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center bg-[#0f172a] min-h-screen">
      <div className="text-6xl mb-6">🔒</div>
      <h1 className="text-3xl font-extrabold text-white mb-4">🏥 康复与预康复方案</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">康复功能需要登录后才能使用。点击右上角「👤 登录」按钮创建你的档案。</p>
      <Link href="/" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#0a0a14] font-bold rounded-xl text-lg transition-all shadow-lg">返回首页</Link>
    </div>
  );

  const handleSave = () => {
    if (!plan || saved) return;
    const injuryNames = injuries.map(id => INJURIES.find(i => i.id === id)?.name || id).join("、");
    const stageName = STAGES.find(s => s.id === stage)?.name || stage;
    const now = new Date().toLocaleString("zh-CN");
    const summary = plan.replace(/\n/g, " ").slice(0, 120);
    const dup = (() => {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith("bounce-saved-r-")) {
          try { if (JSON.parse(localStorage.getItem(k) || "").summary === summary) return true; } catch {}
        }
      }
      return false;
    })();
    if (!dup) {
      localStorage.setItem(`bounce-saved-r-${Date.now()}`, JSON.stringify({
        type: "rehab",
        date: now,
        injuries: injuryNames,
        stage: stageName,
        summary,
        rehabPlan: plan,
      }));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleInjury = (id: string) => {
    setInjuries(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setPlan("");
  };

  const handleGenerate = async () => {
    if (injuries.length === 0 || !stage || loading) return;
    setLoading(true);
    setPlan("");

    const controller = new AbortController();

    try {
      const response = await fetch("/api/rehab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ injuries, stage, details }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json();
        setPlan(`❌ 出错了：${err.error || "请稍后重试"}`);
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
            if (data.text) setPlan(prev => prev + data.text);
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setPlan(`❌ 请求失败：${err.message}`);
    }
    setLoading(false);
    setTimeout(() => planRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-[#0f172a] min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">🏥 康复与预康复方案</h1>
        <p className="text-slate-400">选择伤病类型和恢复阶段，AI 为你生成个性化康复计划</p>
      </div>

      {/* 伤病选择（多选） */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 mb-3">1. 选择伤病类型（可多选，{injuries.length > 0 ? `已选 ${injuries.length} 项` : "至少选一项"}）</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {INJURIES.map(inj => (
            <button
              key={inj.id}
              onClick={() => toggleInjury(inj.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                injuries.includes(inj.id)
                  ? "border-amber-500/60 bg-amber-500/10"
                  : "border-slate-700/50 bg-[#1e293b] hover:border-amber-500/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{inj.icon}</span>
                <span className="font-bold text-white text-sm">{inj.name}</span>
                {injuries.includes(inj.id) && <span className="ml-auto text-amber-400 text-xs">✓ 已选</span>}
              </div>
              <p className="text-xs text-slate-500">{inj.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 阶段选择 */}
      {injuries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">2. 选择当前阶段</h2>
          <div className="flex flex-wrap gap-2">
            {STAGES.map(s => (
              <button
                key={s.id}
                onClick={() => { setStage(s.id); setPlan(""); }}
                className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  stage === s.id
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-300"
                    : "border-slate-700/50 bg-[#1e293b] text-slate-400 hover:border-amber-500/30"
                }`}
              >
                <span className="mr-1.5">{s.icon}</span>
                {s.name}
                <span className="block text-xs text-slate-500 mt-0.5">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 补充信息 + 生成按钮 */}
      {injuries.length > 0 && stage && (
        <div className="mb-10 bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">3. 补充信息（可选）</h2>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="例如：受伤2周，现在走路不痛但跑跳时膝关节下方有刺痛感..."
            className="w-full bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none h-20 mb-4"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-[#0a0a14] font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 text-sm"
          >
            {loading ? "⏳ 正在生成康复方案..." : "📋 生成康复方案 →"}
          </button>
        </div>
      )}

      {/* 加载动画 */}
      {loading && (
        <div className="text-center py-8">
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
          <p className="text-amber-400 text-sm">AI 正在分析并生成康复方案...</p>
        </div>
      )}

      {/* 方案显示 */}
      {plan && (
        <div ref={planRef} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📋 你的康复方案</h3>
          <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{plan}</div>
          <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-3">
            <button
              onClick={() => { setPlan(""); }}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all"
            >
              重新生成
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                saved
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-900"
              }`}
            >
              {saved ? "✅ 已保存到主页" : "💾 保存到主页"}
            </button>
            <button
              onClick={() => { setInjuries([]); setStage(""); setPlan(""); setDetails(""); }}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all"
            >
              选择其他伤病
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-600 mt-8">
        ⚠️ 康复方案为 AI 辅助生成 | 不能替代医生/物理治疗师诊断 | 训练中如疼痛加剧请立即停止并就医
      </p>
    </div>
  );
}
