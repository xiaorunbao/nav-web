export const OAUTH_PROVIDERS = [
  "qq",
  "wechat",
  "baidu",
  "weibo",
  "google",
  "github",
] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export const OAUTH_PROVIDER_LABELS: Record<OAuthProvider, string> = {
  qq: "QQ",
  wechat: "微信",
  weibo: "微博",
  baidu: "百度",
  google: "Google",
  github: "GitHub",
};

export const OAUTH_PROVIDER_ENV: Record<
  OAuthProvider,
  { id: string; secret: string; redirect: string }
> = {
  qq: {
    id: "QQ_CLIENT_ID",
    secret: "QQ_CLIENT_SECRET",
    redirect: "QQ_REDIRECT_URI",
  },
  wechat: {
    id: "WECHAT_CLIENT_ID",
    secret: "WECHAT_CLIENT_SECRET",
    redirect: "WECHAT_REDIRECT_URI",
  },
  weibo: {
    id: "WEIBO_CLIENT_ID",
    secret: "WEIBO_CLIENT_SECRET",
    redirect: "WEIBO_REDIRECT_URI",
  },
  baidu: {
    id: "BAIDU_CLIENT_ID",
    secret: "BAIDU_CLIENT_SECRET",
    redirect: "BAIDU_REDIRECT_URI",
  },
  google: {
    id: "GOOGLE_CLIENT_ID",
    secret: "GOOGLE_CLIENT_SECRET",
    redirect: "GOOGLE_REDIRECT_URI",
  },
  github: {
    id: "GITHUB_CLIENT_ID",
    secret: "GITHUB_CLIENT_SECRET",
    redirect: "GITHUB_REDIRECT_URI",
  },
};

export function isOAuthProvider(value: string): value is OAuthProvider {
  return (OAUTH_PROVIDERS as readonly string[]).includes(value);
}
