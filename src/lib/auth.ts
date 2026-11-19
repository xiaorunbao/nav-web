import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import type { SessionUser } from "@/lib/auth-shared";
import { isOAuthProvider } from "@/lib/oauth-shared";

export const SESSION_COOKIE = "nav_session";
export const OAUTH_STATE_COOKIE = "nav_oauth_state";
export const OAUTH_PROVIDER_COOKIE = "nav_oauth_provider";
export const OAUTH_REDIRECT_COOKIE = "nav_oauth_redirect";
export const DEMO_ACCOUNT = process.env.NAV_DEMO_ACCOUNT ?? "demo";
export const DEMO_PASSWORD = process.env.NAV_DEMO_PASSWORD ?? "demo1234";

const AUTH_SECRET = process.env.NAV_AUTH_SECRET ?? "nav-web-demo-secret-change-me";
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_MAX_AGE = 60 * 60 * 12;

type SessionPayload = SessionUser & { exp: number };

function sign(payload: string) {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(user: SessionUser, remember: boolean) {
  const payload = Buffer.from(
    JSON.stringify({
      ...user,
      exp: Date.now() + (remember ? REMEMBER_MAX_AGE : SESSION_MAX_AGE) * 1000,
    } satisfies SessionPayload)
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = sign(payload);

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as Partial<SessionPayload>;

    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (typeof data.account !== "string" || typeof data.name !== "string") {
      return null;
    }
    if (typeof data.id !== "string" || !data.id) return null;

    return {
      id: data.id,
      account: data.account,
      name: data.name,
      provider:
        data.provider === "password"
          ? "password"
          : typeof data.provider === "string" &&
              isOAuthProvider(data.provider)
            ? data.provider
            : "password",
      avatar: typeof data.avatar === "string" ? data.avatar : null,
    };
  } catch {
    return null;
  }
}

export async function getClientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return headerStore.get("x-real-ip") || null;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  return raw ? verifySessionToken(raw) : null;
}

/** Only allow same-origin relative paths, so login can't be used as an open redirect. */
export function safeRedirectPath(value: string | null | undefined) {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  if (value.startsWith("/login")) return "/";
  return value;
}

export function sessionCookieOptions(remember: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? REMEMBER_MAX_AGE : undefined,
  };
}

export function oauthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  };
}
