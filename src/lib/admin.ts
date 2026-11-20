import type { SessionUser } from "./auth-shared";

/**
 * 后台管理员判定：按环境变量 NAV_ADMIN_ACCOUNTS 白名单匹配登录账号或昵称。
 * 默认仅演示账号 demo；生产环境务必收敛为真实管理员账号。
 */
export function isAdminUser(user: SessionUser | null): boolean {
  if (!user) return false;
  const whitelist = (process.env.NAV_ADMIN_ACCOUNTS ?? "demo")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!whitelist.length) return false;
  return (
    whitelist.includes(user.account.toLowerCase()) ||
    whitelist.includes(user.name.toLowerCase())
  );
}
