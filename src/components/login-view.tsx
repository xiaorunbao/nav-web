"use client";

import { Suspense, useActionState, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Loader2,
  LockKeyhole,
  Moon,
  Sparkles,
  Sun,
  UserRound,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { loginAction, type LoginState } from "@/app/login/actions";
import {
  OAUTH_PROVIDER_ENV,
  OAUTH_PROVIDER_LABELS,
  OAUTH_PROVIDERS,
  isOAuthProvider,
  type OAuthProvider,
} from "@/lib/oauth-shared";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SOCIAL_COLORS: Record<OAuthProvider, string> = {
  qq: "#12b7f5",
  wechat: "#07c160",
  weibo: "#e6162d",
  baidu: "#2932e1",
  google: "#4285f4",
  github: "#24292f",
};

const SOCIAL_LETTERS: Record<OAuthProvider, string> = {
  qq: "QQ",
  wechat: "微",
  weibo: "博",
  baidu: "百",
  google: "G",
  github: "GH",
};

function SocialMark({
  provider,
  className,
}: {
  provider: OAuthProvider;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full text-[9px] font-bold leading-none text-white",
        className
      )}
      style={{ backgroundColor: SOCIAL_COLORS[provider] }}
    >
      {SOCIAL_LETTERS[provider]}
    </span>
  );
}

function oauthErrorMessage(code: string, provider: OAuthProvider | null) {
  const label = provider ? OAUTH_PROVIDER_LABELS[provider] : "社交账号";
  const loginLabel = /^[A-Za-z]/.test(label)
    ? `${label} 登录`
    : `${label}登录`;

  switch (code) {
    case "unconfigured":
      return provider
        ? `${loginLabel}尚未配置，请设置 ${OAUTH_PROVIDER_ENV[provider].id} 和 ${OAUTH_PROVIDER_ENV[provider].secret} 后重试。`
        : "该登录方式尚未配置应用参数。";
    case "state":
      return `${loginLabel}状态校验失败，请重新发起登录。`;
    case "denied":
      return `你取消了${loginLabel}授权，未完成登录。`;
    case "profile":
      return `${loginLabel}授权失败或未获取到账号资料，请稍后重试。`;
    case "token":
      return `${loginLabel}授权凭证获取失败，请稍后重试。`;
    case "db":
      return `${loginLabel}成功，但用户信息写入数据库失败，请检查数据库服务。`;
    case "provider":
      return "不支持的登录方式。";
    default:
      return `${loginLabel}未完成，请重试。`;
  }
}

function OAuthErrorNotice() {
  const searchParams = useSearchParams();
  const legacyCode = searchParams.get("qq_error");
  const code = searchParams.get("oauth_error") ?? legacyCode;
  if (!code) return null;

  const rawProvider =
    searchParams.get("provider") ?? (legacyCode ? "qq" : null);
  const provider = rawProvider && isOAuthProvider(rawProvider) ? rawProvider : null;

  return (
    <div
      role="alert"
      className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-xs leading-relaxed text-destructive"
    >
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
      <span>{oauthErrorMessage(code, provider)}</span>
    </div>
  );
}

export function LoginView({
  demoAccount,
  demoPassword,
  redirectTo,
}: {
  demoAccount: string;
  demoPassword: string;
  redirectTo: string;
}) {
  const theme = useNavStore((state) => state.theme);
  const toggleTheme = useNavStore((state) => state.toggleTheme);
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );
  const [edited, setEdited] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [infoDialog, setInfoDialog] = useState<"register" | "reset" | null>(null);
  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const errorMessage = state.error && !edited ? state.error : null;

  const fillDemo = () => {
    if (accountRef.current) accountRef.current.value = demoAccount;
    if (passwordRef.current) passwordRef.current.value = demoPassword;
    setEdited(true);
    accountRef.current?.focus();
  };

  const socialHref = (provider: OAuthProvider) => {
    const base = `/api/auth/${provider}`;
    return redirectTo === "/"
      ? base
      : `${base}?redirect_to=${encodeURIComponent(redirectTo)}`;
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#2a0566]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_760px_at_6%_10%,#7b2cff_0%,transparent_60%),radial-gradient(900px_620px_at_96%_4%,#e040fb_0%,transparent_52%),linear-gradient(135deg,#22044f_0%,#43089c_45%,#7613c9_100%)]" />
      <div className="animate-float-slow absolute -left-32 top-1/3 -z-10 size-[460px] rounded-full bg-[#b026ff]/35 blur-[110px]" />
      <div className="animate-float-slow absolute -right-24 bottom-0 -z-10 size-[400px] rounded-full bg-[#ff3dd4]/25 blur-[120px] [animation-delay:-4s]" />
      <div className="dot-grid absolute inset-0 -z-10 opacity-[0.14]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 pb-8 sm:px-6">
        <header className="flex items-center justify-between py-5">
          <Link
            href="/"
            className="inline-flex items-center rounded-2xl bg-white/95 px-2.5 py-1.5 shadow-[0_12px_30px_-16px_rgba(20,0,60,0.7)] transition hover:bg-white"
            aria-label="返回一为导航首页"
          >
            <img src="/logo.png" alt="一为导航" className="h-6 w-auto" />
          </Link>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="text-white/75 hover:bg-white/10 hover:text-white"
              aria-label="切换深浅色"
            >
              {theme === "dark" ? (
                <Sun className="size-4.5" />
              ) : (
                <Moon className="size-4.5" />
              )}
            </Button>
            <Link
              href="/"
              className="hidden h-8 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 text-xs text-white/85 backdrop-blur transition hover:border-white/35 hover:bg-white/15 hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="size-3.5" />
              返回首页
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-4 md:py-8">
          <div className="grid w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-[26px] border border-white/15 bg-card text-foreground shadow-[0_44px_120px_-42px_rgba(10,0,40,0.9)] md:grid-cols-[1.02fr_0.98fr]">
            <section className="relative hidden min-w-0 flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#5a10d8_0%,#8d16dc_48%,#c11b8d_100%)] p-9 text-white md:flex xl:p-11">
              <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border border-white/15" />
              <div className="pointer-events-none absolute -right-6 top-6 size-40 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-white/10 blur-3xl" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] tracking-wide text-white/85 backdrop-blur">
                  <Sparkles className="size-3.5" />
                  ONE NAV · 设计师灵感入口
                </span>
              </div>

              <div className="relative z-10 mt-10">
                <h1 className="text-[34px] font-semibold leading-[1.22] tracking-tight">
                  发现值得收藏的
                  <br />
                  好网站
                </h1>
                <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-white/70">
                  为设计师准备的网址导航：灵感、素材、工具与社区，一处直达。
                </p>

                <ul className="mt-7 space-y-3 text-[13px] text-white/80">
                  {[
                    "104 个精选站点，覆盖 9 大分类",
                    "每日更新，人工筛选内容质量",
                    "收藏与最近访问，一屏快速回访",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/15">
                        <CheckCircle2 className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-10">
                <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-5">
                  {[
                    { value: "104", label: "收录站点" },
                    { value: "9", label: "精选分类" },
                    { value: "每日", label: "持续更新" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-xl font-semibold text-white">
                        {stat.value}
                      </div>
                      <div className="mt-0.5 text-[11px] text-white/60">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 flex items-center gap-1.5 text-[11px] text-white/50">
                  <Zap className="size-3" />
                  100% 人工筛选 · 拒绝失效与低质站点
                </p>
              </div>
            </section>

            <section className="flex min-w-0 flex-col justify-center bg-card px-6 py-8 sm:px-10 sm:py-10 xl:px-12">
              <div className="mx-auto w-full max-w-[368px]">
                <div className="mb-7 md:hidden">
                  <img src="/logo.png" alt="一为导航" className="h-7 w-auto" />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[26px] font-semibold tracking-tight">
                      欢迎回来
                    </h2>
                    <p className="mt-2 text-xs text-muted-foreground">
                      没有账号？
                      <button
                        type="button"
                        onClick={() => setInfoDialog("register")}
                        className="font-medium text-brand hover:underline"
                      >
                        注册
                      </button>
                      <span className="px-1.5 text-border">/</span>
                      <button
                        type="button"
                        onClick={() => setInfoDialog("reset")}
                        className="font-medium text-brand hover:underline"
                      >
                        找回密码
                      </button>
                    </p>
                  </div>
                  <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[10px] text-muted-foreground sm:inline-flex">
                    <LockKeyhole className="size-3" />
                    安全登录
                  </span>
                </div>

                <Suspense fallback={null}>
                  <OAuthErrorNotice />
                </Suspense>

                <form
                  action={formAction}
                  onSubmit={() => setEdited(false)}
                  className="mt-7 space-y-4"
                >
                  <input type="hidden" name="redirect_to" value={redirectTo} />
                  <div>
                    <label
                      htmlFor="account"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      用户名或邮箱
                    </label>
                    <div className="relative mt-1.5">
                      <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="account"
                        ref={accountRef}
                        name="account"
                        type="text"
                        placeholder="用户名或邮箱"
                        autoComplete="username"
                        defaultValue={state.account ?? ""}
                        onChange={() => setEdited(true)}
                        aria-invalid={Boolean(errorMessage)}
                        className="h-11 rounded-xl border-input bg-background pl-10 text-sm shadow-[inset_0_1px_1px_rgba(35,25,60,0.03)] focus-visible:ring-brand/25"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      密码
                    </label>
                    <div className="relative mt-1.5">
                      <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        ref={passwordRef}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="请输入密码"
                        autoComplete="current-password"
                        onChange={() => setEdited(true)}
                        aria-invalid={Boolean(errorMessage)}
                        className="h-11 rounded-xl border-input bg-background px-10 text-sm shadow-[inset_0_1px_1px_rgba(35,25,60,0.03)] focus-visible:ring-brand/25"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-xs leading-relaxed text-destructive"
                    >
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      name="remember"
                      defaultChecked
                      onChange={() => setEdited(true)}
                      className="size-3.5 rounded border-input accent-[var(--brand)]"
                    />
                    记住登录信息
                  </label>

                  <div className="flex items-center gap-2.5 pt-1">
                    <Button
                      type="submit"
                      disabled={pending}
                      className="h-11 flex-1 rounded-xl gradient-brand text-sm font-semibold text-white shadow-[0_14px_28px_-16px_rgba(241,64,75,0.85)] hover:brightness-105"
                    >
                      {pending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          登录中…
                        </>
                      ) : (
                        <>
                          登录
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 rounded-xl px-5 text-sm"
                    >
                      <Link href="/">
                        <Home className="size-4" />
                        首页
                      </Link>
                    </Button>
                  </div>
                </form>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-3 py-2.5 text-[11px] text-muted-foreground">
                  <span className="min-w-0">
                    演示账号{" "}
                    <strong className="font-semibold text-foreground">
                      {demoAccount}
                    </strong>
                    <span className="px-1">·</span>
                    密码{" "}
                    <strong className="font-semibold text-foreground">
                      {demoPassword}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={fillDemo}
                    className="shrink-0 font-medium text-brand hover:underline"
                  >
                    一键填入
                  </button>
                </div>

                <div className="my-6 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <span className="shrink-0 tracking-wide">社交帐号登录</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {OAUTH_PROVIDERS.map((provider) => {
                    const label = OAUTH_PROVIDER_LABELS[provider];
                    const actionLabel = /^[A-Za-z]/.test(label)
                      ? `使用 ${label} 登录`
                      : `使用${label}登录`;
                    return (
                      <a
                        key={provider}
                        href={socialHref(provider)}
                        title={actionLabel}
                        aria-label={actionLabel}
                        className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 text-[11px] font-medium transition hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/60 hover:shadow-sm"
                      >
                        <SocialMark
                          provider={provider}
                          className="size-6 text-[9px]"
                        />
                        <span className="truncate">{label}</span>
                      </a>
                    );
                  })}
                </div>

                <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">
                  当前为演示环境，登录用户会写入本地 nav_user 表。
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Dialog
        open={infoDialog !== null}
        onOpenChange={(open) => {
          if (!open) setInfoDialog(null);
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {infoDialog === "register" ? "注册账号" : "找回密码"}
            </DialogTitle>
            <DialogDescription>
              {infoDialog === "register"
                ? "当前为演示站点，账号体系仅提供演示账号登录，注册功能尚未开放。"
                : "演示账号不绑定邮箱，无法通过邮件找回密码，请直接使用下方演示账号登录。"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                知道了
              </Button>
            </DialogClose>
            <Button
              size="sm"
              onClick={() => {
                fillDemo();
                setInfoDialog(null);
              }}
              className="rounded-full gradient-brand text-white"
            >
              填入演示账号
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
