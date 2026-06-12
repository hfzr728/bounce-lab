// ============================================================
// 客户端密码哈希 — 纯 JavaScript 实现，HTTP/HTTPS 均可用
// 比明文存储安全，避免 XSS 直接泄露原始密码
// ============================================================

/**
 * 简单但可靠的字符串哈希函数 (djb2 变体)
 * 纯 JS 实现，不依赖 Web Crypto API，HTTP 环境也可用
 */
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0; // 保持 32 位
  }
  // 转为 hex，并补齐到 8 位
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * 生成随机盐值 (hex 格式)
 */
function generateSalt(): string {
  const array = new Uint8Array(16);
  // crypto.getRandomValues 在 HTTP 下也可用（仅 SubtleCrypto 受限）
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // 极端回退：使用 Math.random
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 对密码进行哈希 + 盐值
 * 返回格式: "salt:hash"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  // 多次迭代增强安全性
  let hash = salt + password;
  for (let i = 0; i < 1000; i++) {
    hash = simpleHash(hash + salt);
  }
  return `${salt}:${hash}`;
}

/**
 * 验证密码是否匹配已存储的哈希
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, originalHash] = stored.split(":");
  if (!salt || !originalHash) return false;

  let hash = salt + password;
  for (let i = 0; i < 1000; i++) {
    hash = simpleHash(hash + salt);
  }

  return hash === originalHash;
}
