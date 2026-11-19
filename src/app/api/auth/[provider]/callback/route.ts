import { type NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getClientIp,
  OAUTH_PROVIDER_COOKIE,
  OAUTH_REDIRECT_COOKIE,
  OAUTH_STATE_COOKIE,
  safeRedirectPath,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import {
  fetchOAuthProfile,
  getOAuthConfig,
  isOAuthConfigured,
} from "@/lib/oauth";
import { isOAuthProvider } from "@/lib/oauth-shared";
import { upsertOAuthUser } from "@/lib/users";

const CLEAR_COOKIE = { path: "/", maxAge: 0 } as const;

function clearOAuthCookies(response: NextResponse) {
  response.cookies.set(OAUTH_STATE_COOKIE, "", CLEAR_COOKIE);
  response.cookies.set(OAUTH_PROVIDER_COOKIE, "", CLEAR_COOKIE);
  response.cookies.set(OAUTH_REDIRECT_COOKIE, "", CLEAR_COOKIE);
}

function fail(
  request: NextRequest,
  reason: string,
  provider?: string | null
) {
  const url = new URL("/login", request.url);
  url.searchParams.set("oauth_error", reason);
  if (provider) url.searchParams.set("provider", provider);

  const response = NextResponse.redirect(url);
  clearOAuthCookies(response);
  return response;
}

function readRedirectTarget(request: NextRequest) {
  return safeRedirectPath(request.cookies.get(OAUTH_REDIRECT_COOKIE)?.value);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  if (!isOAuthProvider(provider)) {
    return fail(request, "provider");
  }

  if (request.nextUrl.searchParams.get("error")) {
    return fail(request, "denied", provider);
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const expectedProvider = request.cookies.get(
    OAUTH_PROVIDER_COOKIE
  )?.value;

  if (
    !code ||
    !state ||
    !expectedState ||
    state !== expectedState ||
    expectedProvider !== provider
  ) {
    return fail(request, "state", provider);
  }

  const config = getOAuthConfig(provider, request.nextUrl.origin);
  if (!isOAuthConfigured(config)) {
    return fail(request, "unconfigured", provider);
  }

  let profile;
  try {
    profile = await fetchOAuthProfile(provider, config, code);
  } catch (error) {
    console.error(`[auth] ${provider} 获取资料失败`, error);
    return fail(request, "profile", provider);
  }

  if (!profile) {
    return fail(request, "profile", provider);
  }

  let dbUser;
  try {
    dbUser = await upsertOAuthUser({
      provider,
      openId: profile.openId,
      unionId: profile.unionId,
      nickname: profile.nickname,
      avatar: profile.avatar,
      ip: await getClientIp(),
    });
  } catch (error) {
    console.error(`[auth] ${provider} 用户写入数据库失败`, error);
    return fail(request, "db", provider);
  }

  const response = NextResponse.redirect(
    new URL(readRedirectTarget(request), request.url)
  );

  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(
      {
        id: dbUser.id,
        account: profile.openId,
        name: dbUser.nickname,
        provider,
        avatar: dbUser.avatar,
      },
      true
    ),
    sessionCookieOptions(true)
  );
  clearOAuthCookies(response);

  return response;
}
