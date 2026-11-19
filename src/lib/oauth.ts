import {
  OAUTH_PROVIDER_ENV,
  type OAuthProvider,
} from "@/lib/oauth-shared";

const AUTHORIZE_URLS: Record<OAuthProvider, string> = {
  qq: "https://graph.qq.com/oauth2.0/authorize",
  wechat: "https://open.weixin.qq.com/connect/qrconnect",
  weibo: "https://api.weibo.com/oauth2/authorize",
  baidu: "https://openapi.baidu.com/oauth/2.0/authorize",
  google: "https://accounts.google.com/o/oauth2/v2/auth",
  github: "https://github.com/login/oauth/authorize",
};

export type OAuthConfig = {
  provider: OAuthProvider;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type OAuthProfile = {
  openId: string;
  unionId?: string | null;
  nickname: string;
  avatar?: string | null;
};

export function getOAuthConfig(provider: OAuthProvider, origin: string) {
  const env = OAUTH_PROVIDER_ENV[provider];
  const baseUrl = (process.env.APP_URL?.trim() || origin).replace(/\/+$/, "");

  return {
    provider,
    clientId: process.env[env.id]?.trim() ?? "",
    clientSecret: process.env[env.secret]?.trim() ?? "",
    redirectUri:
      process.env[env.redirect]?.trim() ||
      `${baseUrl}/api/auth/${provider}/callback`,
  } satisfies OAuthConfig;
}

export function isOAuthConfigured(config: OAuthConfig) {
  return Boolean(config.clientId && config.clientSecret);
}

export function buildAuthorizeUrl(
  config: OAuthConfig,
  state: string
) {
  const url = new URL(AUTHORIZE_URLS[config.provider]);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);

  switch (config.provider) {
    case "qq":
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("scope", "get_user_info");
      url.searchParams.set("display", "pc");
      break;
    case "wechat":
      url.searchParams.set("appid", config.clientId);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "snsapi_login");
      url.hash = "wechat_redirect";
      break;
    case "weibo":
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("response_type", "code");
      break;
    case "baidu":
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("scope", "basic");
      break;
    case "google":
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("access_type", "online");
      url.searchParams.set("prompt", "select_account");
      break;
    case "github":
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("scope", "read:user user:email");
      url.searchParams.set("allow_signup", "true");
      break;
  }

  return url;
}

async function requestJson<T>(url: string, init?: RequestInit) {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...init,
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      console.warn("[oauth] HTTP", response.status, new URL(url).host);
      return null;
    }

    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  } catch (error) {
    console.warn("[oauth] request failed", new URL(url).host, error);
    return null;
  }
}

function postForm<T>(
  url: string,
  body: Record<string, string>,
  headers?: Record<string, string>
) {
  return requestJson<T>(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      ...headers,
    },
    body: new URLSearchParams(body).toString(),
  });
}

function httpsUrl(value?: string | null) {
  return value ? value.replace(/^http:\/\//i, "https://") : null;
}

function fallbackNickname(value: string | undefined, provider: string) {
  return value?.trim() || `${provider} 用户`;
}

async function fetchQqProfile(
  config: OAuthConfig,
  code: string
): Promise<OAuthProfile | null> {
  const token = await requestJson<{ access_token?: string }>(
    `https://graph.qq.com/oauth2.0/token?${new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      fmt: "json",
    })}`
  );
  if (!token?.access_token) return null;

  const me = await requestJson<{ openid?: string }>(
    `https://graph.qq.com/oauth2.0/me?${new URLSearchParams({
      access_token: token.access_token,
      fmt: "json",
    })}`
  );
  if (!me?.openid) return null;

  const profile = await requestJson<{
    ret?: number;
    nickname?: string;
    figureurl?: string;
    figureurl_qq_1?: string;
    figureurl_qq_2?: string;
  }>(
    `https://graph.qq.com/user/get_user_info?${new URLSearchParams({
      access_token: token.access_token,
      oauth_consumer_key: config.clientId,
      openid: me.openid,
      fmt: "json",
    })}`
  );
  if (!profile || profile.ret !== 0) return null;

  return {
    openId: me.openid,
    nickname: fallbackNickname(profile.nickname, "QQ"),
    avatar:
      profile.figureurl_qq_2 ||
      profile.figureurl_qq_1 ||
      profile.figureurl ||
      null,
  };
}

async function fetchWechatProfile(
  config: OAuthConfig,
  code: string
): Promise<OAuthProfile | null> {
  const token = await requestJson<{
    access_token?: string;
    openid?: string;
    unionid?: string;
  }>(
    `https://api.weixin.qq.com/sns/oauth2/access_token?${new URLSearchParams({
      appid: config.clientId,
      secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
    })}`
  );
  if (!token?.access_token || !token.openid) return null;

  const profile = await requestJson<{
    nickname?: string;
    headimgurl?: string;
    unionid?: string;
  }>(
    `https://api.weixin.qq.com/sns/userinfo?${new URLSearchParams({
      access_token: token.access_token,
      openid: token.openid,
      lang: "zh_CN",
    })}`
  );

  return {
    openId: token.openid,
    unionId: profile?.unionid || token.unionid || null,
    nickname: fallbackNickname(profile?.nickname, "微信"),
    avatar: httpsUrl(profile?.headimgurl),
  };
}

async function fetchWeiboProfile(
  config: OAuthConfig,
  code: string
): Promise<OAuthProfile | null> {
  const token = await postForm<{
    access_token?: string;
    uid?: string | number;
  }>("https://api.weibo.com/oauth2/access_token", {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUri,
    code,
  });
  if (!token?.access_token || token.uid === undefined) return null;

  const profile = await requestJson<{
    screen_name?: string;
    avatar_large?: string;
    profile_image_url?: string;
  }>(
    `https://api.weibo.com/2/users/show.json?${new URLSearchParams({
      access_token: token.access_token,
      uid: String(token.uid),
    })}`
  );

  return {
    openId: String(token.uid),
    nickname: fallbackNickname(profile?.screen_name, "微博"),
    avatar: httpsUrl(profile?.avatar_large || profile?.profile_image_url),
  };
}

async function fetchBaiduProfile(
  config: OAuthConfig,
  code: string
): Promise<OAuthProfile | null> {
  const token = await requestJson<{ access_token?: string }>(
    `https://openapi.baidu.com/oauth/2.0/token?${new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
    })}`
  );
  if (!token?.access_token) return null;

  const profile = await requestJson<{
    openid?: string;
    userid?: string | number;
    username?: string;
    nickname?: string;
    portrait?: string;
  }>(
    `https://openapi.baidu.com/rest/2.0/passport/users/getInfo?${new URLSearchParams({
      access_token: token.access_token,
    })}`
  );

  const openId = profile?.openid || profile?.userid;
  if (openId === undefined || openId === null || openId === "") return null;

  return {
    openId: String(openId),
    nickname: fallbackNickname(
      profile?.username || profile?.nickname,
      "百度"
    ),
    avatar: httpsUrl(profile?.portrait),
  };
}

async function fetchGoogleProfile(
  config: OAuthConfig,
  code: string
): Promise<OAuthProfile | null> {
  const token = await postForm<{ access_token?: string }>(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }
  );
  if (!token?.access_token) return null;

  const profile = await requestJson<{
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
  }>("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${token.access_token}` },
  });
  if (!profile?.sub) return null;

  return {
    openId: profile.sub,
    nickname: fallbackNickname(profile.name || profile.email, "Google"),
    avatar: profile.picture || null,
  };
}

async function fetchGithubProfile(
  config: OAuthConfig,
  code: string
): Promise<OAuthProfile | null> {
  const token = await requestJson<{ access_token?: string }>(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
      }).toString(),
    }
  );
  if (!token?.access_token) return null;

  const profile = await requestJson<{
    id?: number;
    login?: string;
    name?: string;
    avatar_url?: string;
  }>("https://api.github.com/user", {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token.access_token}`,
      "user-agent": "nav-web",
    },
  });
  if (!profile?.id) return null;

  return {
    openId: String(profile.id),
    nickname: fallbackNickname(
      profile.name || profile.login,
      "GitHub"
    ),
    avatar: profile.avatar_url || null,
  };
}

export async function fetchOAuthProfile(
  provider: OAuthProvider,
  config: OAuthConfig,
  code: string
) {
  switch (provider) {
    case "qq":
      return fetchQqProfile(config, code);
    case "wechat":
      return fetchWechatProfile(config, code);
    case "weibo":
      return fetchWeiboProfile(config, code);
    case "baidu":
      return fetchBaiduProfile(config, code);
    case "google":
      return fetchGoogleProfile(config, code);
    case "github":
      return fetchGithubProfile(config, code);
  }
}
