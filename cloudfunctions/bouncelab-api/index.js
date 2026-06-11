// ============================================================
// BounceLab API Gateway — CloudBase SCF 云函数
// 处理所有 /api/* 路由
// ============================================================

const OpenAI = require("openai");

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-33702c2b309c4995bac973e825c43f18";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

// ---- DeepSeek 客户端 ----
let _client = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({ apiKey: DEEPSEEK_API_KEY, baseURL: DEEPSEEK_BASE_URL });
  }
  return _client;
}

async function callAI(systemPrompt, userPrompt) {
  const client = getClient();
  try {
    const resp = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    return resp.choices[0].message.content;
  } catch (e) {
    return "（AI 暂时不可用：" + e.message + "）";
  }
}

// ---- 简易规则引擎 ----
function simpleScore(id, answer, gender) {
  const s = String(answer); const n = Number(answer) || 0;
  // Body comp
  if (id === "b05") { const norms = gender === "female" ? [{ min:0,max:20,s:90},{ min:20,max:25,s:80},{ min:25,max:30,s:65},{ min:30,max:35,s:45},{ min:35,max:100,s:25}] : [{ min:0,max:12,s:90},{ min:12,max:18,s:80},{ min:18,max:24,s:65},{ min:24,max:30,s:40},{ min:30,max:100,s:20}]; for(const r of norms) if(n>=r.min&&n<r.max) return r.s; return 50; }
  // Strength
  if (id==="s01") { if(n>=180)return 95; if(n>=140)return 80; if(n>=100)return 60; if(n>=60)return 40; if(n>0)return 20; return 15; }
  if (id==="s02") { if(n>=200)return 95; if(n>=160)return 80; if(n>=120)return 60; if(n>=70)return 40; if(n>0)return 20; return 15; }
  if (id==="s03") { if(n>=140)return 95; if(n>=100)return 80; if(n>=70)return 60; if(n>=40)return 40; if(n>0)return 20; return 15; }
  if (id==="s05") { if(n>=50)return 90; if(n>=35)return 75; if(n>=20)return 55; if(n>0)return 30; return 20; }
  // Basic scoring: good answers
  const goodVals = ["excellent","good","strong","high","elite","advanced","long_legs","balanced","normal","none","small"];
  const badVals = ["concern","weak","low","flat","poor","large","pain","yes_injury"];
  if (goodVals.includes(s)) return 85;
  if (badVals.includes(s)) return 35;
  // Numeric scoring : higher is generally better
  if (!isNaN(n) && n > 0) return Math.min(95, Math.max(20, Math.round(n / 2)));
  return 60;
}

function runDiagnosis(answers) {
  const dimensions = {
    maxStrength: { ids: ["s01","s02","s03","s04","s05","s06","s07","st01","st02","st03","bb01"], weight: 0.25, label: "最大力量" },
    explosive: { ids: ["p01","p08","e01","e02","e03","e04","st04","st05","bb02"], weight: 0.20, label: "爆发力" },
    reactive: { ids: ["r01","r02","r03","r04","r05","st06","st07"], weight: 0.15, label: "反应力量" },
    mobility: { ids: ["m01","m02","m03","m04","m05","m06","bb03","bb04"], weight: 0.10, label: "活动度" },
    core: { ids: ["c01","c02","c03","c04","bb05"], weight: 0.10, label: "核心稳定" },
    bodymech: { ids: ["p02","p03","p04","p05","p06","p07","b05","b06","b07","bb06","bb07"], weight: 0.10, label: "身体构成" },
    trainExp: { ids: ["t01","t02","t03","t04","t05","bb08","bb09"], weight: 0.05, label: "训练经验" },
    injury: { ids: ["i01","i02","i03","i04","i05","bb10","bb11"], weight: 0.05, label: "伤病风险" },
  };

  const gender = answers["a01"] || answers["bb_gender"] || "male";
  const dimScores = [];
  let totalWeighted = 0, totalWeight = 0;

  for (const [key, dim] of Object.entries(dimensions)) {
    let sum = 0, count = 0;
    for (const id of dim.ids) {
      if (answers[id] !== undefined && answers[id] !== "") {
        sum += simpleScore(id, answers[id], gender);
        count++;
      }
    }
    const raw = count > 0 ? Math.round(sum / count) : 50;
    const weighted = Math.round(raw * dim.weight * 100);
    totalWeighted += weighted;
    totalWeight += dim.weight * 100;
    dimScores.push({ label: dim.label, score: raw, weight: dim.weight });
  }

  const overall = Math.round(totalWeighted / totalWeight);
  
  // Find strengths & weaknesses
  const sorted = [...dimScores].sort((a,b) => b.score - a.score);
  const strengths = sorted.slice(0,2).map(d => d.label);
  const weaknesses = sorted.slice(-2).map(d => d.label);

  return { dimensionScores: dimScores, overallScore: overall, strengths, weaknesses };
}

function assessInjuryRisk(answers) {
  let riskScore = 0;
  const factors = [];
  const injuryKeys = ["i01","i02","i03","i04","i05","bb10","bb11"];
  for (const k of injuryKeys) {
    const v = answers[k];
    if (v === "yes" || v === "yes_injury" || v === "pain" || v === "frequent") { riskScore += 20; factors.push(k); }
    else if (v === "sometimes" || v === "mild") { riskScore += 10; }
  }
  riskScore = Math.min(100, riskScore);
  const level = riskScore >= 60 ? "高风险" : riskScore >= 30 ? "中等风险" : "低风险";
  return { level, score: riskScore, factors: factors.length > 0 ? factors : ["无显著风险"] };
}

// ---- 诊断系统 Prompt ----
const DIAGNOSIS_SYSTEM = "你是用户的专业私人教练，专精于提升垂直弹跳与爆发力。你严格遵循循证训练原则。\n\n你的核心任务是基于用户的详细问卷数据，运用专业推理，生成一份深入、具体、可执行的弹跳能力诊断报告。\n\n## 你必须遵守的铁律\n1. **安全不可妥协** — 绝对禁止向存在髌腱炎、跟腱炎、ACL损伤史等下肢伤病的用户推荐深度跳深、极限重量离心训练。\n2. **基于专业推理** — 像真正的教练那样，结合用户的具体情况进行分析和权衡。\n3. **逐项数据对比分析** — 逐条阅读用户提供的每一条问卷回答，用具体数字和事实说话。\n4. **禁止输出任何内部标识** — 禁止出现编号或ID。\n5. **全程使用简体中文** — 禁止输出任何英文单词或英文句子。\n6. **输出格式**: 🔍短板分析 → 💪优势识别 → ⚠️安全警示与禁忌 → 🧭训练方向建议\n7. **沟通语气** — 专业、鼓励且平和。";

// ---- 训练计划系统 Prompt ----
const PLANNING_SYSTEM = "你是用户的专业私人教练，专精于提升垂直弹跳与爆发力。\n\n核心任务：基于用户的诊断结果和个人条件，生成一份安全、个性化、有明确依据的12周训练计划。\n\n铁律：\n1. 安全不可妥协\n2. 基于专业推理\n3. 个性化计划生成\n4. 禁止输出编号或ID\n5. 全程简体中文，禁止英文\n6. 输出格式: 🔍短板分析 → 📅阶段训练计划(第1周到第12周必须完整) → ⚠️安全与执行要点 → 📚决策依据\n7. 语气专业鼓励";

// ---- 问答系统 Prompt ----
const QA_SYSTEM = "你是BounceLab弹跳训练平台的AI专家助手，专精于提升垂直弹跳与爆发力。\n\n你需要基于专业运动科学知识回答用户问题。\n\n回答要求：全程简体中文，禁止英文单词或句子。专业术语可附带英文缩写及中文解释。先给核心结论，再分点展开。语气专业且平易近人。";

// ---- 康复系统 Prompt ----
const REHAB_SYSTEM = "你是用户的专业私人教练，专精于运动康复与弹跳训练。\n\n核心任务：根据用户的伤病情况和恢复阶段，生成个性化的康复方案。\n\n铁律：安全第一、循证导向、全程简体中文禁止英文。\n\n输出格式: 📋伤病评估 → 🏥康复方案（分阶段） → ⚠️禁忌动作与安全警示 → 📊恢复进程监控指标";

// ---- 事件函数 Handler ----
exports.main = async (event, context) => {
  const path = event.path || "/";
  const httpMethod = event.httpMethod || "POST";
  
  // 解析 body（可能是字符串）
  let body = {};
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : (event.body || {});
  } catch (e) {
    body = {};
  }

  // CORS preflight
  if (httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } };
  }

  const corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    let result;

    // 路由匹配（注意：HTTP 访问服务的 /api 前缀会被去掉）
    if (path.includes("/diagnose") && !path.includes("/stream")) {
      // /api/diagnose → /diagnose
      const answers = body.answers || {};
      if (Object.keys(answers).length === 0) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "未收到任何问卷数据" }) };
      }
      const { dimensionScores, overallScore, strengths, weaknesses } = runDiagnosis(answers);
      const injuryRisk = assessInjuryRisk(answers);
      const keyAnswers = Object.entries(answers).map(([k, v]) => `- ${k}: ${v}`).join("\n");
      const userPrompt = `以下是一位运动员的详细弹跳能力评估数据：\n\n【运动员逐项数据】\n${keyAnswers}\n\n【受伤风险评估】风险等级：${injuryRisk.level}（${injuryRisk.score}/100）\n\n【参考信息】优势方向：${strengths.join("、")}；薄弱方向：${weaknesses.join("、")}\n\n请逐条阅读以上每一项数据。全程中文。`;
      const aiAnalysis = await callAI(DIAGNOSIS_SYSTEM, userPrompt);
      result = { dimensionScores, overallScore, strengths, weaknesses, injuryRisk, aiAnalysis, answers, version: "scf-v1" };
    } else if (path.includes("/plan") && !path.includes("/revise")) {
      const { planInput, weaknesses, injuryRisk, diagnosisSummary } = body;
      if (!planInput) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "缺少训练条件数据" }) };
      }
      const userPrompt = `【训练条件】${planInput}\n【薄弱方向】${weaknesses || ""}\n【受伤风险】${injuryRisk || ""}\n【诊断摘要】${diagnosisSummary || ""}\n\n请生成完整的第1周到第12周个性化训练计划。全部中文。`;
      const plan = await callAI(PLANNING_SYSTEM, userPrompt);
      result = { plan, version: "scf-v1" };
    } else if (path.includes("/qa")) {
      const { question } = body;
      if (!question || question.trim().length < 2) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "请输入有效问题" }) };
      }
      const answer = await callAI(QA_SYSTEM, `用户提问：${question}\n\n请基于专业知识回答。全程简体中文。`);
      result = { answer, version: "scf-v1" };
    } else if (path.includes("/rehab")) {
      const { injuries, stage, description } = body;
      if (!injuries || injuries.length === 0) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "请选择至少一种伤病类型" }) };
      }
      const injuryNames = { patellar:"髌腱炎", achilles:"跟腱炎", pfps:"髌骨软化", ankle:"踝关节扭伤", shin:"胫骨骨膜炎", acl:"ACL术后", meniscus:"半月板损伤", hamstring:"腘绳肌拉伤", lowerback:"下背痛", shoulder:"肩袖损伤" };
      const stageNames = { acute:"急性期", early:"早期恢复", mid:"中期康复", late:"后期回归", prehab:"预防性" };
      const injuryText = injuries.map(i => injuryNames[i] || i).join("、");
      const stageText = stageNames[stage] || stage;
      const plan = await callAI(REHAB_SYSTEM, `伤病：${injuryText}\n阶段：${stageText}\n描述：${description || "无"}\n\n生成康复方案。全程中文。`);
      result = { plan, injury: injuryText, stage: stageText, version: "scf-v1" };
    } else {
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: "未找到端点: " + path }) };
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: e.message }) };
  }
};
