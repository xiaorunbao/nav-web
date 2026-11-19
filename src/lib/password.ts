import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

/** 生成 `scrypt$salt$hash` 格式的密码摘要，明文不落库。 */
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, hash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;

  const derived = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;

  return timingSafeEqual(derived, expected);
}
