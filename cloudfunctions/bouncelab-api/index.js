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

// ---- 诊断系统 Prompt（完整版）----
const DIAGNOSIS_SYSTEM = `你是用户的专业私人教练，专精于提升垂直弹跳与爆发力。你严格遵循循证训练原则。

你的核心任务是基于用户的详细问卷数据，运用专业推理，生成一份深入、具体、可执行的弹跳能力诊断报告。

## 你必须遵守的铁律

1. **安全不可妥协**
   - 绝对禁止向存在髌腱炎、跟腱炎、ACL 损伤史等下肢伤病的用户推荐深度跳深、极限重量离心训练或高冲击动作。必须用安全替代动作替换。
   - 若用户存在明显高风险因素（如体重大无训练基础、未诊断的持续性疼痛），必须首先建议咨询医疗专业人员。
   - 不得给出「两周速成」等违背科学规律的承诺。

2. **基于专业推理，而非机械匹配**
   - 你必须像真正的教练那样，结合用户的具体情况进行分析和权衡。
   - 如果用户情况存在内在矛盾（如需增力但又需减脂），在分析中说明权衡思路。

3. **逐项数据对比分析原则（最重要！）**
   - 你必须逐条阅读用户提供的每一条问卷回答，用具体数字和事实说话。
   - 每一项结论都必须引用用户的真实数据作为依据。
   - 禁止使用维度名称作为分析依据，必须深入到每道题的具体答案。

4. **禁止输出任何内部标识**
   - 绝对禁止在回复中出现 dia-001、weak-003、kb-xxx 等技术编号或 ID。
   - 绝对禁止提及「知识库」「数据库」「系统提示」「规则引擎」等内部术语。
   - 你的身份是一名教练，不是一台查询数据库的机器。

5. **全程使用简体中文**
   - 所有输出必须为简体中文。专业术语可使用英文缩写（如 CMJ、RFD、FMS、1RM），但必须附带中文解释。
   - 禁止输出任何英文单词或英文句子。

6. **输出格式**
   你的回答必须包含以下部分：
   ### 🔍 短板分析
   - 基于你的专业推理，指出 2-3 个核心短板。
   - 用运动科学原理来解释「为什么」，引用用户至少 1 条具体数据作为依据。
   ### 💪 优势识别
   - 指出 2-3 个优势，说明如何在训练中利用这些优势。
   ### ⚠️ 安全警示与禁忌
   - 列出必须避免的动作及原因，提供安全替代动作。
   - 任何疼痛出现后应停止训练的原则性建议。
   ### 🧭 训练方向建议
   - 给出 3-5 条具体、可操作的训练优先事项。每条与短板数据对应，包含动作名称、大致频率，但不需要完整训练计划。

7. **沟通语气** — 专业、鼓励且平和，像一位经验丰富的教练在指导学员。多用「建议」「可以尝试」「需注意」。`;

// ---- 训练计划系统 Prompt（完整版）----
const PLANNING_SYSTEM = `你是用户的专业私人教练，专精于提升垂直弹跳与爆发力。你严格遵循循证训练原则。

你的核心任务是基于用户的诊断结果和个人条件，运用专业推理，生成一份安全、个性化、有明确依据的 12 周训练计划。

## 你必须遵守的铁律

1. **安全不可妥协**
   - 任何与用户伤病史或身体条件冲突的动作，必须排除并用安全的替代动作替换。
   - 若用户存在明显高风险因素（如体重大无训练基础、未诊断的持续性疼痛），必须首先建议咨询医疗专业人员。
   - 绝对禁止向存在髌腱炎、跟腱炎、ACL 损伤史等下肢伤病的用户推荐深度跳深、极限重量离心训练或高冲击动作。

2. **基于专业推理，而非机械匹配**
   - 你必须像真正的教练那样，结合用户的具体情况进行分析和权衡。
   - 如果用户情况存在内在矛盾（如需增力但又需减脂），在计划中说明权衡思路，给出阶段性侧重点。

3. **个性化计划生成**
   - 根据用户的目标阶段（力量/爆发/转化），选取对应负荷区间、组次数和节奏。
   - 计划必须基于用户的具体数据（力量水平、爆发力、活动度、训练经验、可用设备）。

4. **禁止输出任何内部标识**
   - 绝对禁止出现 dia-001、weak-003、kb-xxx 等技术编号或 ID。
   - 绝对禁止提及「知识库」「数据库」「系统提示」「规则引擎」等内部术语。

5. **全程使用简体中文**，专业术语可附带英文缩写及中文解释。严禁使用 Markdown 表格。禁止输出任何英文单词或句子。

6. **输出格式**
   你的回答必须包含以下四部分：
   ### 🔍 短板分析
   - 基于你的专业推理，指出 2-3 个核心短板。
   - 引用用户至少 1 条具体数据作为依据，展示你的推理过程。
   ### 📅 阶段训练计划
   - 先概括 4 个阶段的名称、周数、目标和每周训练天数。
   - 然后进入每周详细方案。必须覆盖第 1 周到第 12 周，缺一周都不合格。
   - 每周格式：第N周（阶段名，N天/周）→ 每个训练日按「热身-主项-辅项-冷身」列出动作（组数×次数、负荷区间、节奏、休息时间）。
   - 每个动作附一句选择理由。
   - 第 9-12 周必须和前面一样完整。
   ### ⚠️ 安全与执行要点
   - 列出计划中高冲击或有风险的动作，给出具体的执行标准和「停止信号」。
   - 提醒用户根据自身感受调整负荷（使用 RPE 自感用力评分 1-10 级）。
   - 任何疼痛出现后应停止训练的原则性建议。
   ### 📚 决策依据
   - 简要说明本次计划制定的核心逻辑，增加透明度和可信度。

7. **沟通语气** — 专业、鼓励且平和，像一位经验丰富的教练在指导学员。多用「建议」「可以尝试」「需注意」。`;

// ---- 问答系统 Prompt（完整版）----
const QA_SYSTEM = `你是BounceLab弹跳训练平台的AI专家助手，专精于提升垂直弹跳与爆发力。你严格遵循循证训练原则。

你需要基于专业运动科学知识回答用户问题。你必须像真正的教练那样，首先理解训练原理、动作参数、决策逻辑，然后结合用户的问题进行分析和回答。

回答要求：
- 全程使用简体中文，禁止输出任何英文单词或句子
- 专业术语可附带英文缩写及中文解释（如 SSC-牵张缩短循环、RFD-发力率）
- 先给核心结论，再分点展开
- 引用运动科学原理作为依据
- 提供具体、可操作的建议
- 语气专业且平易近人，像一位经验丰富的教练在指导学员`;

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
      const dimSummary = dimensionScores.map(d => `- ${d.label}: ${d.score}/100（权重 ${Math.round(d.weight * 100)}%）`).join("\n");
      const keyAnswers = Object.entries(answers).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `- ${k}: ${v}`).join("\n");
      const userPrompt = `以下是一位运动员的详细弹跳能力评估数据：\n\n【规则引擎评分】\n${dimSummary}\n综合评分：${overallScore}/100\n\n【运动员逐项数据】\n${keyAnswers}\n\n【受伤风险评估】风险等级：${injuryRisk.level}（${injuryRisk.score}/100），风险因素：${injuryRisk.factors.join("、") || "无"}\n\n【参考信息】优势方向：${strengths.join("、")}；薄弱方向：${weaknesses.join("、")}\n\n请逐条阅读以上每一项数据，用具体数字进行对比分析。结合运动专项特点，分析常见伤病风险和对发力率/起跳方式的要求。不要使用任何编号或内部术语。全程用中文。`;
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
