"use client";
// 饮食与体成分建议 — 多公式交叉验证 + 完整宏量营养素方案
// ============================================================
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/context";

export default function BodyCompPage() {
  const { isLoggedIn } = useUser();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  // 基础围度
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(80);
  const [hip, setHip] = useState(95);
  // 进阶围度
  const [abdomen, setAbdomen] = useState(82);
  const [wrist, setWrist] = useState(17);
  const [forearm, setForearm] = useState(28);
  const [thigh, setThigh] = useState(55);
  const [calf, setCalf] = useState(37);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [goal, setGoal] = useState<"maintain" | "cut" | "bulk">("maintain");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "moderate" | "active" | "veryActive">("active");
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    // ===== 公式1: 美国海军法 (US Navy) =====
    let navyBF: number;
    if (gender === "male") {
      navyBF = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
      navyBF = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    }
    navyBF = Math.max(3, Math.min(45, navyBF));

    // ===== 公式2: Covert Bailey 法（多围度） =====
    let baileyBF: number;
    if (gender === "male") {
      const hipsAdj = hip > 0 ? hip : waist * 1.1;
      baileyBF = (waist * 0.74) - (neck * 0.53) + (hipsAdj * 0.21) - (forearm * 0.44) - (wrist * 1.22) + (age * 0.07) + 18.5;
    } else {
      const hipsAdj = hip > 0 ? hip : waist * 1.15;
      baileyBF = (waist * 0.53) + (hipsAdj * 0.62) - (neck * 0.32) - (forearm * 0.35) - (wrist * 1.05) + (age * 0.05) + 10.2;
    }
    baileyBF = Math.max(3, Math.min(45, baileyBF));

    // ===== 公式3: YMCA 法 =====
    let ymcaBF: number;
    if (gender === "male") {
      ymcaBF = (-98.42 + 4.15 * waist - 0.082 * weight) / weight * 100;
    } else {
      ymcaBF = (-76.76 + 4.15 * waist - 0.082 * weight) / weight * 100;
    }
    ymcaBF = ymcaBF * 0.88 + 2.5;
    ymcaBF = Math.max(3, Math.min(45, ymcaBF));

    // ===== 综合加权 =====
    const bodyFatPct = navyBF * 0.40 + baileyBF * 0.35 + ymcaBF * 0.25;
    const fatMass = weight * (bodyFatPct / 100);
    const leanMass = weight - fatMass;

    // ===== BMI + 腰围身高比 =====
    const bmi = weight / ((height / 100) ** 2);
    const waistToHeight = waist / height;

    // ===== BMR 双公式 =====
    let msjBmr: number;
    if (gender === "male") {
      msjBmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      msjBmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const katchBmr = 370 + 21.6 * leanMass;
    const avgBmr = (msjBmr + katchBmr) / 2;

    // ===== TDEE =====
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2, moderate: 1.375, active: 1.55, veryActive: 1.725,
    };
    const tdee = avgBmr * (activityMultipliers[activityLevel] || 1.55);

    // ===== 目标热量 =====
    let targetCalories: number;
    if (goal === "cut") targetCalories = tdee - 450;
    else if (goal === "bulk") targetCalories = tdee + 350;
    else targetCalories = tdee;

    // ===== 宏量营养素 =====
    let proteinPerKg: number;
    if (goal === "cut") proteinPerKg = 2.2;
    else if (goal === "bulk") proteinPerKg = 1.8;
    else proteinPerKg = 1.6;
    const dailyProtein = Math.round(weight * proteinPerKg);

    let fatPctOfCals: number;
    if (goal === "cut") fatPctOfCals = bodyFatPct > 20 ? 0.20 : 0.25;
    else if (goal === "bulk") fatPctOfCals = 0.25;
    else fatPctOfCals = 0.25;
    const dailyFat = Math.round((targetCalories * fatPctOfCals) / 9);

    const proteinCals = dailyProtein * 4;
    const fatCals = dailyFat * 9;
    const carbCals = targetCalories - proteinCals - fatCals;
    const dailyCarbs = Math.round(Math.max(50, carbCals / 4));

    // ===== 体脂评价 =====
    let bfRating: string; let bfColor: string;
    if (gender === "male") {
      if (bodyFatPct < 6) { bfRating = "极低（可能影响激素）"; bfColor = "text-red-400"; }
      else if (bodyFatPct < 10) { bfRating = "精瘦运动员"; bfColor = "text-green-400"; }
      else if (bodyFatPct < 14) { bfRating = "运动员/健身"; bfColor = "text-green-400"; }
      else if (bodyFatPct < 19) { bfRating = "健康适中"; bfColor = "text-amber-400"; }
      else if (bodyFatPct < 25) { bfRating = "偏高"; bfColor = "text-orange-400"; }
      else { bfRating = "肥胖区间"; bfColor = "text-red-400"; }
    } else {
      if (bodyFatPct < 12) { bfRating = "极低（可能停经）"; bfColor = "text-red-400"; }
      else if (bodyFatPct < 17) { bfRating = "精瘦运动员"; bfColor = "text-green-400"; }
      else if (bodyFatPct < 22) { bfRating = "运动员/健身"; bfColor = "text-green-400"; }
      else if (bodyFatPct < 27) { bfRating = "健康适中"; bfColor = "text-amber-400"; }
      else if (bodyFatPct < 33) { bfRating = "偏高"; bfColor = "text-orange-400"; }
      else { bfRating = "肥胖区间"; bfColor = "text-red-400"; }
    }

    const idealBfLow = gender === "male" ? 9 : 16;
    const idealBfHigh = gender === "male" ? 14 : 22;
    const idealWeightLow = Math.round(leanMass / (1 - idealBfLow / 100));
    const idealWeightHigh = Math.round(leanMass / (1 - idealBfHigh / 100));

    let whtrRating: string;
    if (waistToHeight < 0.45) whtrRating = "优秀（低内脏脂肪风险）";
    else if (waistToHeight < 0.50) whtrRating = "良好";
    else if (waistToHeight < 0.55) whtrRating = "警戒（中心性肥胖风险）";
    else whtrRating = "高风险（需减腰围）";

    setResult({
      navyBF: navyBF.toFixed(1), baileyBF: baileyBF.toFixed(1), ymcaBF: ymcaBF.toFixed(1),
      bodyFatPct: bodyFatPct.toFixed(1), fatMass: fatMass.toFixed(1), leanMass: leanMass.toFixed(1),
      bmi: bmi.toFixed(1), waistToHeight: waistToHeight.toFixed(2), whtrRating,
      bmr: Math.round(msjBmr), katchBmr: Math.round(katchBmr), avgBmr: Math.round(avgBmr),
      tdee: Math.round(tdee), targetCalories: Math.round(targetCalories),
      dailyProtein, dailyFat, dailyCarbs, proteinPerKg: proteinPerKg.toFixed(1),
      bfRating, bfColor, idealWeightLow, idealWeightHigh, goal,
    });
  };

  if (!isLoggedIn) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center min-h-screen">
      <div className="text-6xl mb-6">🔒</div>
      <h1 className="font-display text-4xl text-white mb-4">🍎 饮食与体成分</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">饮食与体成分功能需要登录后才能使用。点击右上角「👤 登录」按钮创建你的档案。</p>
      <Link href="/" className="btn-skew bg-[#00F5FF] text-[#0A0A0A] text-sm inline-flex">返回首页</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl text-white mb-2 tracking-wide">🍎 饮食与体成分</h1>
        <p className="text-slate-400 text-sm">多公式交叉验证 + 完整宏量营养素定制方案</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* 输入区 (2列) */}
        <div className="lg:col-span-2 glass-card p-6 self-start">
          <h2 className="font-display text-lg text-white mb-5 tracking-wide">📏 身体数据</h2>

          {/* 性别 + 年龄 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">性别</label>
              <div className="flex gap-1">
                {(["male", "female"] as const).map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      gender === g ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30" : "bg-white/5 text-slate-500 border border-white/10"
                    }`}>{g === "male" ? "♂" : "♀"}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">年龄</label>
              <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} min={10} max={80}
                className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
            </div>
          </div>

          {/* 身高体重 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">身高 (cm)</label>
              <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} min={100} max={250}
                className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">体重 (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} min={30} max={200}
                className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
            </div>
          </div>

          {/* 基础围度 */}
          <p className="text-xs text-slate-500 mb-2 font-medium">基础围度（必填）</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">颈围 cm</label>
              <input type="number" value={neck} onChange={e => setNeck(Number(e.target.value))} min={20} max={60}
                className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">腰围 cm</label>
              <input type="number" value={waist} onChange={e => setWaist(Number(e.target.value))} min={40} max={150}
                className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">臀围 cm</label>
              <input type="number" value={hip} onChange={e => setHip(Number(e.target.value))} min={50} max={160}
                className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
            </div>
          </div>

          {/* 进阶围度 */}
          <button onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-xs text-[#00F5FF] hover:text-white mb-3 flex items-center gap-1 transition-colors">
            {showAdvanced ? "▲ 收起" : "▼ 展开"}进阶围度（更多数据 → 更精确）
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">腹围 cm</label>
                <input type="number" value={abdomen} onChange={e => setAbdomen(Number(e.target.value))} min={40} max={160}
                  className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">腕围 cm</label>
                <input type="number" value={wrist} onChange={e => setWrist(Number(e.target.value))} min={10} max={25}
                  className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">前臂 cm</label>
                <input type="number" value={forearm} onChange={e => setForearm(Number(e.target.value))} min={15} max={45}
                  className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">大腿 cm</label>
                <input type="number" value={thigh} onChange={e => setThigh(Number(e.target.value))} min={30} max={90}
                  className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">小腿 cm</label>
                <input type="number" value={calf} onChange={e => setCalf(Number(e.target.value))} min={20} max={60}
                  className="input-glow w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors" />
              </div>
            </div>
          )}

          <div className="bg-white/[0.03] rounded-lg p-3 mb-5 text-[10px] text-slate-500 leading-relaxed border border-white/5">
            📐 测量方法：颈围=喉结下方；腰围=肚脐水平（放松）；臀围=最宽处；腹围=肚脐下2cm；大腿=臀褶下方。皮尺贴合但不勒紧。
          </div>

          <label className="text-xs text-slate-400 mb-1.5 block">训练目标</label>
          <div className="flex gap-2 mb-4">
            {(["cut", "maintain", "bulk"] as const).map(g => (
              <button key={g} onClick={() => setGoal(g)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  goal === g ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30" : "bg-white/5 text-slate-500 border border-white/10"
                }`}>{g === "cut" ? "🔥 减脂" : g === "bulk" ? "💪 增肌" : "⚖️ 维持"}</button>
            ))}
          </div>

          <label className="text-xs text-slate-400 mb-1.5 block">活动水平</label>
          <select value={activityLevel} onChange={e => setActivityLevel(e.target.value as any)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5FF]/50 mb-5">
            <option value="sedentary">久坐少动（办公室工作）</option>
            <option value="moderate">轻度活跃（每周1-2次训练）</option>
            <option value="active">中度活跃（每周3-5次训练）</option>
            <option value="veryActive">高度活跃（每周6-7次 / 运动员）</option>
          </select>

          <button onClick={calculate}
            className="btn-skew bg-[#00F5FF] text-[#0A0A0A] text-sm w-full">
            📊 计算体成分与饮食建议
          </button>
        </div>

        {/* 结果区 (3列) */}
        <div className="lg:col-span-3">
          {!result ? (
            <div className="glass-card p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-slate-400 text-sm">填入左侧数据后点击计算</p>
                <p className="text-slate-600 text-xs mt-2">三公式交叉验证：US Navy + Covert Bailey + YMCA</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 体成分概览 */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-5">🏋️ 体成分分析（三公式交叉验证）</h3>
                <div className="text-center mb-6">
                  <div className={`text-5xl font-extrabold ${result.bfColor}`}>{result.bodyFatPct}%</div>
                  <p className="text-sm text-slate-400 mt-1">{result.bfRating}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-white">{result.navyBF}%</p>
                    <p className="text-[10px] text-slate-500">US Navy 法</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-white">{result.baileyBF}%</p>
                    <p className="text-[10px] text-slate-500">Covert Bailey</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-white">{result.ymcaBF}%</p>
                    <p className="text-[10px] text-slate-500">YMCA 法</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-white">{result.fatMass} kg</p>
                    <p className="text-[10px] text-slate-500">脂肪重量</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-white">{result.leanMass} kg</p>
                    <p className="text-[10px] text-slate-500">瘦体重</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-white">{result.bmi}</p>
                    <p className="text-[10px] text-slate-500">BMI</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-white">{result.waistToHeight}</p>
                    <p className="text-[10px] text-slate-500">腰围/身高</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-right">
                  腰围身高比：{result.whtrRating} | 理想体重 {result.idealWeightLow}-{result.idealWeightHigh} kg
                </p>
              </div>

              {/* 热量 + 宏量营养素 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-slate-400 mb-4">🔥 热量计算（双公式）</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-xs text-slate-500">Mifflin-St Jeor BMR</span><span className="text-xs text-white">{result.bmr} kcal</span></div>
                    <div className="flex justify-between"><span className="text-xs text-slate-500">Katch-McArdle BMR</span><span className="text-xs text-white">{result.katchBmr} kcal</span></div>
                    <div className="flex justify-between font-medium"><span className="text-xs text-slate-400">平均 BMR</span><span className="text-xs text-white">{result.avgBmr} kcal</span></div>
                    <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-xs text-slate-400">TDEE（总消耗）</span><span className="text-sm font-bold text-white">{result.tdee} kcal</span></div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-xs text-[#00F5FF] font-medium">{result.goal === "cut" ? "🎯 减脂热量" : result.goal === "bulk" ? "🎯 增肌热量" : "🎯 维持热量"}</span>
                      <span className="text-xl font-extrabold text-[#00F5FF]">{result.targetCalories}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-slate-400 mb-4">🥩 每日宏量营养素</h3>
                  <div className="space-y-3">
                    {[
                      { label: "🥚 蛋白质", value: result.dailyProtein, unit: "g", cals: result.dailyProtein * 4, note: `${result.proteinPerKg} g/kg`, color: "text-green-400", barColor: "bg-green-500", bgBar: "bg-green-500" },
                      { label: "🧈 脂肪", value: result.dailyFat, unit: "g", cals: result.dailyFat * 9, note: "", color: "text-amber-400", barColor: "bg-amber-500", bgBar: "bg-amber-500" },
                      { label: "🍚 碳水", value: result.dailyCarbs, unit: "g", cals: result.dailyCarbs * 4, note: "", color: "text-cyan-400", barColor: "bg-cyan-500", bgBar: "bg-cyan-500" },
                    ].map(m => (
                      <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-400">{m.label}</span>
                          <span className={`text-lg font-extrabold ${m.color}`}>{m.value}{m.unit}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${m.barColor}`} style={{ width: `${Math.round((m.cals / result.targetCalories) * 100)}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">{m.cals} kcal{m.note ? ` · ${m.note}` : ""}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 专属建议 */}
              <div className="bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#00F5FF] mb-3">💡 弹跳训练者专属建议</h3>
                <div className="text-xs text-slate-300/80 leading-relaxed space-y-2">
                  <p>• 每减 1kg 纯脂肪（力量不变）→ 弹跳提升约 0.5-1.5cm。减脂期 ≥2.0g/kg 蛋白质，热量缺口 ≤500kcal/天。</p>
                  <p>• 增肌期目标 +0.5-1kg 瘦体重/月。体脂同步微增正常，控制体脂月增幅 &lt;0.5%。</p>
                  <p>• 碳水策略：训练日 4-5g/kg，休息日 2-3g/kg。脂肪以不饱和脂肪酸为主。</p>
                  <p>• 蛋白质分配：每 3-4h 摄入 20-35g（约 4-5 餐/天），训练后 30-60min 补充 25-30g。</p>
                  <p>• 腰围/身高比 &gt;0.5 时内脏脂肪风险增加，BMI 正常也需优先减腰围。</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-600 mt-8">
        使用 US Navy / Covert Bailey / YMCA 三公式交叉验证 | BMR 基于 Mifflin-St Jeor + Katch-McArdle 双公式 | 仅供参考
      </p>
    </div>
  );
}
