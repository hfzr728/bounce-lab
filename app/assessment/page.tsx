"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/user/context";

type Version = "basic" | "standard" | "advanced";

export default function AssessmentLandingPage() {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [level, setLevel] = useState<Version | null>(null);
  const [savedProgress, setSavedProgress] = useState<{ version: Version; step: number; versionName: string } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (sessionStorage.getItem("bounce-diagnosis")) { setSavedProgress(null); return; }
    let hasSavedDiag = false;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("bounce-saved-d-")) { hasSavedDiag = true; break; }
    }
    if (hasSavedDiag) {
      localStorage.removeItem("bounce-questionnaire-basic");
      localStorage.removeItem("bounce-questionnaire-standard");
      localStorage.removeItem("bounce-questionnaire");
      setSavedProgress(null);
      return;
    }
    const check = (key: string, version: Version, name: string) => {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "{}");
        if (d.answers && Object.keys(d.answers).length > 3) return { version, step: d.currentStep || 1, versionName: name };
      } catch {}
      return null;
    };
    setSavedProgress(
      check("bounce-questionnaire-basic", "basic", "体测版") ||
      check("bounce-questionnaire-standard", "standard", "国际标准版") ||
      check("bounce-questionnaire", "advanced", "专业版")
    );
  }, [isLoggedIn]);

  if (!isLoggedIn) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center bg-[#0f172a] min-h-screen">
      <div className="text-6xl mb-6">🔒</div>
      <h1 className="text-3xl font-extrabold text-white mb-4">弹跳短板测评</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">评估功能需要登录后才能使用。点击右上角「👤 登录」按钮创建你的档案。</p>
      <Link href="/" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#0a0a14] font-bold rounded-xl text-lg transition-all shadow-lg">返回首页</Link>
    </div>
  );

  const start = () => {
    if (level === "basic") router.push("/assessment/basic/step/1");
    else if (level === "standard") router.push("/assessment/standard/step/1");
    else router.push("/assessment/step/1");
  };

  const resume = () => {
    if (!savedProgress) return;
    if (savedProgress.version === "basic") router.push(`/assessment/basic/step/${savedProgress.step}`);
    else if (savedProgress.version === "standard") router.push(`/assessment/standard/step/${savedProgress.step}`);
    else router.push(`/assessment/step/${savedProgress.step}`);
  };

  const versions: { key: Version; icon: string; title: string; desc: string; time: string; questions: string; features: string[]; tag: string; tagColor: string; level: string; levelDesc: string }[] = [
    {
      key: "basic", icon: "🏃", title: "体测版", desc: "用大学体测数据 + 简单自评", time: "约 5 分钟", questions: "34 题",
      features: ["50米跑 / 立定跳远 / 坐位体前屈", "引体向上 / 耐力跑等体测数据", "力量/柔韧/爆发力自评", "适合普通运动爱好者"],
      tag: "快速入门", tagColor: "bg-green-500/10 text-green-400 border-green-500/20",
      level: "初级", levelDesc: "适合刚开始接触训练或没有专业测试设备的用户，训练强度适中偏保守",
    },
    {
      key: "standard", icon: "📐", title: "国际标准版", desc: "基于 NSCA/FMS/YBT 国际标准", time: "约 10 分钟", questions: "53 题",
      features: ["FMS 7项功能性运动筛查（无需设备）", "CMJ弹跳（手机App即可测量）", "NSCA相对力量标准评估", "无需测力台，无需专业设备"],
      tag: "推荐", tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      level: "中级", levelDesc: "适合有1年以上训练基础、了解基本力量训练动作的用户，训练强度适中",
    },
    {
      key: "advanced", icon: "🔬", title: "专业版", desc: "最全面的运动科学评估", time: "约 15 分钟", questions: "85 题",
      features: ["含力-速曲线（F-V Profile）分析", "CMJ/SJ/深跳等完整爆发力指标", "12项伤病筛查 + 离心力量评估", "适合有训练基础的深度用户"],
      tag: "深度评估", tagColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      level: "高级", levelDesc: "适合有3年以上系统训练经验、熟悉杠铃和增强式训练的用户，训练强度较高",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">🔬 弹跳短板测评</h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">三种评估深度，从快速自测到专业诊断，选择最适合你的版本</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {versions.map((v) => (
          <button key={v.key} onClick={() => setLevel(v.key)}
            className={`text-left p-6 rounded-2xl border transition-all ${
              level === v.key
                ? "border-amber-500/60 bg-amber-500/10 shadow-lg ring-1 ring-amber-500/20"
                : "border-slate-700 bg-[#1e293b] hover:border-amber-500/30 hover:bg-[#1e293b]"
            }`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{v.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{v.title}</h3>
                <p className="text-xs text-gray-500">{v.desc}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">{v.time} · {v.questions}</p>
            <ul className="text-xs text-gray-500 space-y-1 mb-3">
              {v.features.map((f, i) => <li key={i}>✓ {f}</li>)}
            </ul>
            <div className="mb-3">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">
                🎯 {v.level}训练强度
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">{v.levelDesc}</p>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${v.tagColor}`}>{v.tag}</span>
          </button>
        ))}
      </div>

      <div className="text-center">
        {savedProgress && (
          <button onClick={resume}
            className="inline-flex items-center px-6 py-3 mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-medium hover:bg-amber-500/20 transition-all text-sm">
            📝 继续上次的{savedProgress.versionName}评估（第{savedProgress.step}步）
          </button>
        )}
        <button onClick={start} disabled={!level}
          className={`inline-flex items-center px-10 py-4 rounded-xl text-lg font-bold transition-all ${
            level ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-[#0a0a14] shadow-lg shadow-amber-500/25" : "bg-white/5 text-gray-500 cursor-not-allowed"
          }`}>
          {level ? `开始${versions.find(v => v.key === level)?.title}评估 →` : "请先选择评估版本"}
        </button>
        <p className="text-sm text-slate-500 mt-3">数据保存在你的浏览器本地 · 评估结果可用于 AI 训练计划生成</p>
        <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
          💡 提示：选择的问卷版本将影响训练计划的强度——专业版生成进阶方案，体测版生成入门方案。请根据你的训练基础选择。
        </p>
      </div>
    </div>
  );
}
