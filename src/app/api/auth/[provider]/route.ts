import { randomBytes } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import {
  OAUTH_PROVIDER_COOKIE,
  OAUTH_REDIRECT_COOKIE,
  OAUTH_STATE_COOKIE,
  oauthCookieOptions,
  safeRedirectPath,
} from "@/lib/auth";
import {
  buildAuthorizeUrl,
  getOAuthConfig,
  isOAuthConfigured,
} from "@/lib/oauth";
import { isOAuthProvider } from "@/lib/oauth-shared";

function fail(request: NextRequest, reason: string, provider?: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("oauth_error", reason);
  if (provider) url.searchParams.set("provider", provider);
  return NextResponse.redirect(url);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  if (!isOAuthProvider(provider)) {
    return fail(request, "provider");
  }

  const config = getOAuthConfig(provider, request.nextUrl.origin);
  if (!isOAuthConfigured(config)) {
    return fail(request, "unconfigured", provider);
  }

  const state = randomBytes(16).toString("hex");
  const redirectTo = safeRedirectPath(
    request.nextUrl.searchParams.get("redirect_to")
  );

  const response = NextResponse.redirect(buildAuthorizeUrl(config, state));
  const cookieOptions = oauthCookieOptions();

  response.cookies.set(OAUTH_STATE_COOKIE, state, cookieOptions);
  response.cookies.set(OAUTH_PROVIDER_COOKIE, provider, cookieOptions);
  response.cookies.set(OAUTH_REDIRECT_COOKIE, redirectTo, cookieOptions);

  return response;
}
