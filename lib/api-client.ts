// API 基础 URL — CloudBase SCF 云函数
const SCF_API_BASE = "";

/**
 * 调用 BounceLab API 云函数
 * @param endpoint - API 端点（如 "diagnose", "plan", "qa", "rehab"）
 * @param body - 请求体
 * @returns Promise<Response>
 */
export async function callApi(endpoint: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(`${SCF_API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
