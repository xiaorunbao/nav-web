"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  getClientIp,
  safeRedirectPath,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { findPasswordUser, touchUserLogin } from "@/lib/users";

export type LoginState = {
  error?: string;
  account?: string;
  remember?: boolean;
};

export async function loginAction(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const account = String(formData.get("account") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";
  const redirectTo = safeRedirectPath(String(formData.get("redirect_to") ?? ""));

  if (!account || !password) {
    return { error: "请输入用户名或邮箱和密码", account, remember };
  }

  let dbUser;
  try {
    dbUser = await findPasswordUser(account);
  } catch (error) {
    console.error("[auth] 查询登录用户失败", error);
    return { error: "登录服务暂时不可用，请稍后重试", account, remember };
  }

  if (
    !dbUser?.passwordHash ||
    !verifyPassword(password, dbUser.passwordHash)
  ) {
    return {
      error: "账号或密码不正确，请使用页面下方的演示账号",
      account,
      remember,
    };
  }

  try {
    await touchUserLogin(dbUser.id, await getClientIp());
  } catch (error) {
    // 登录时间更新失败不影响本次登录
    console.error("[auth] 更新登录时间失败", error);
  }

  const token = createSessionToken(
    {
      id: dbUser.id,
      account: dbUser.username ?? account,
      name: dbUser.nickname || dbUser.username || account,
      provider: "password",
      avatar: dbUser.avatar,
    },
    remember
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions(remember));

  redirect(redirectTo);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}
