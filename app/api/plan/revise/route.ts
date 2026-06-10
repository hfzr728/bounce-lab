// POST /api/plan/revise — 根据用户反馈重新生成训练计划
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai/deepseek";

const REVISE_SYSTEM_PROMPT = `你是一名持有认证的力量与体能专家（CSCS），专精于提升垂直弹跳与爆发力。

用户已经收到一份训练计划，但对其中某些部分不满意或有特殊限制条件。你的任务是根据用户的反馈意见，修改并重新生成一份完全符合用户要求的训练计划。

## 原则

1. **安全第一**：绝不推荐用户明确表示有禁忌/伤病的动作。
2. **完全尊重用户反馈**：用户提出的每一个不满点、每一个限制条件都必须认真对待并修改。
3. **保持计划完整性**：修改局部的同时，确保12周计划的其他部分依然协调一致。**必须输出完整的12周计划，一周都不能少。**
4. **绝对禁止使用 Markdown 表格**。
4. **绝对禁止使用 Markdown 表格**。
5. **全程使用中文**。
6. **输出完整的12周计划**（不要只输出修改的部分），使用与原始计划相同的章节结构。
7. 每个训练日严格按「热身/主项/辅项/冷身」分行用 - 列出。`;

export async function POST(request: NextRequest) {
  try {
    const { currentPlan, feedback, answers, diagnosisSummary } = await request.json();

    if (!currentPlan || !feedback) {
      return NextResponse.json({ error: "缺少计划内容或反馈" }, { status: 400 });
    }

    const userPrompt = `以下是我当前的训练计划：

${currentPlan.slice(0, 8000)}

【我的反馈与限制条件】
${feedback}

【我的诊断摘要】
${diagnosisSummary || "综合诊断已完成"}

请根据我的反馈重新生成一份完整的12周训练计划。必须：
- 特别关注我提出的每一个限制条件
- 如果我说某个动作做不了，务必替换为等效的替代动作
- 如果我说训练天数/时间有限，务必据此调整
- 保持其他未提及部分与原计划一致
- 输出完整的12周计划（不要偷懒省略后几周）`;

    const aiGenerated = await callDeepSeek(REVISE_SYSTEM_PROMPT, userPrompt, {
      temperature: 0.7,
      maxTokens: 8192,
    });

    return NextResponse.json({ aiGenerated });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("计划修订 API 错误:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
