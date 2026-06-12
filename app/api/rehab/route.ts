// ============================================================
// 康复方案 API — 根据伤病情+阶段生成个性化康复计划
// ============================================================
import { NextRequest } from "next/server";
import { searchKnowledgeBase } from "@/lib/knowledge-base";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

const INJURY_INFO: Record<string, { name: string; keywords: string }> = {
  "patellar": { name: "髌腱炎（跳跃膝）", keywords: "髌腱炎 跳跃膝 patellar tendinopathy 康复 等长 离心" },
  "achilles": { name: "跟腱炎", keywords: "跟腱炎 achilles tendinopathy 提踵 离心训练 Alfredson 晨僵 康复" },
  "pfps": { name: "髌骨软化/髌股疼痛", keywords: "髌骨软化 PFPS 髌股疼痛 VMO 软骨 康复 膝关节" },
  "ankle": { name: "踝关节扭伤", keywords: "踝关节扭伤 韧带 本体感觉 康复 单腿稳定性 Y-balance" },
  "shin": { name: "胫骨骨膜炎", keywords: "胫骨骨膜炎 shin splints MTSS 应力 小腿 康复" },
  "acl": { name: "ACL术后/膝关节不稳", keywords: "ACL 前交叉韧带 术后 康复 膝关节稳定" },
  "meniscus": { name: "半月板损伤", keywords: "半月板 meniscus 术后 康复 膝关节 负重" },
  "hamstring": { name: "腘绳肌拉伤/撕裂", keywords: "腘绳肌 hamstring 拉伤 撕裂 康复 冲刺" },
  "lowerback": { name: "下背痛/腰椎问题", keywords: "下背痛 腰椎 椎间盘 腰痛 核心 康复" },
  "shoulder": { name: "肩袖损伤", keywords: "肩袖 肩关节 撞击 盂唇 康复 上肢" },
};

const STAGE_NAMES: Record<string, string> = {
  "acute": "急性期（疼痛明显，需控制炎症）",
  "early": "早期恢复（疼痛减轻，开始轻负荷训练）",
  "mid": "中期康复（逐步重建力量和功能）",
  "late": "后期回归（恢复运动专项能力）",
  "prehab": "预防性预康复（无伤痛，想预防）",
};

export async function POST(request: NextRequest) {
  const { injuries: injArr, stage, details } = await request.json();
  
  // Support both old single "injury" and new "injuries" array
  const injuryIds: string[] = injArr || [];
  if (injuryIds.length === 0) {
    // fallback: single injury prop (backward compat)
    const body = await request.clone().json().catch(() => ({}));
    if (body.injury) injuryIds.push(body.injury);
  }
  
  if (injuryIds.length === 0) {
    return Response.json({ error: "请选择至少一种伤病类型" }, { status: 400 });
  }
  const invalid = injuryIds.find(id => !INJURY_INFO[id]);
  if (invalid) {
    return Response.json({ error: `无效的伤病类型: ${invalid}` }, { status: 400 });
  }
  if (!stage || !STAGE_NAMES[stage]) {
    return Response.json({ error: "请选择有效的康复阶段" }, { status: 400 });
  }

  const injuryNames = injuryIds.map(id => INJURY_INFO[id].name);
  const allKeywords = injuryIds.map(id => INJURY_INFO[id].keywords).join(" ");
  const stageName = STAGE_NAMES[stage];

  // RAG 检索相关知识
  const articles = searchKnowledgeBase(allKeywords, 3);
  const knowledgeContext = articles.length > 0
    ? articles.map(a => a.content).join("\n\n---\n\n")
    : "";

  const injuryListText = injuryNames.join(" + ");
  const systemPrompt = `你是用户的专业私人教练，同时也是运动康复专家。你严格遵循循证训练原则。用户正在咨询康复训练方案。

伤病类型：${injuryListText}
当前阶段：${stageName}
用户补充信息：${details || "无"}

${knowledgeContext ? `参考知识（包含训练原理、动作参数、决策逻辑和案例）：\n${knowledgeContext}\n` : ""}

请基于以上信息，为该伤病在此阶段设计一份具体的康复训练方案。你必须：
- 像真正的教练那样，先理解康复原理和案例，再结合用户情况做专业推理，不要机械照搬
- 安全第一：排除不适合的动作并给出替代方案

方案要求：
- 全程使用简体中文，禁止输出任何英文单词或句子
- 专业术语可附带英文缩写及中文解释
- 先说明该阶段的目标和注意事项（2-3句话）
- 给出 4-6 个具体训练动作，每个包含：动作名称、组数×次数/时长、执行要点、选择理由
- 说明每天/每周的训练频率
- 列出该阶段应避免的动作及原因
- 给出进阶到下一阶段的功能标准
- 首先申明「本方案为 AI 辅助生成，不能替代医生/物理治疗师的诊断和指导」
- 保持在 600 字以内，不要使用 Markdown 表格`;

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `请为${injuryListText}的${stageName}生成康复训练方案。` },
        ],
        max_tokens: 2048,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `AI 请求失败: ${errText}` }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) { controller.close(); return; }
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") { controller.close(); return; }
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`));
                }
              } catch {}
            }
          }
        } catch {}
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    return Response.json({ error: `请求失败: ${err.message}` }, { status: 500 });
  }
}
