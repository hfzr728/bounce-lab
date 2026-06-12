// ============================================================
// 客户端密码哈希 — 使用 Web Crypto API (SHA-256)
// 比明文存储安全，避免 XSS 直接泄露原始密码
// ============================================================

/**
 * 生成随机盐值 (hex 格式)
 */
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 对密码进行 SHA-256 哈希 + 盐值
 * 返回格式: "salt:hash"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${salt}:${hashHex}`;
}

/**
 * 验证密码是否匹配已存储的哈希
 * @param password 明文密码
 * @param stored   "salt:hash" 格式的已存储哈希
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, originalHash] = stored.split(":");
  if (!salt || !originalHash) return false;

  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex === originalHash;
}
