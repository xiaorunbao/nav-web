import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "@/components/login-view";
import { DEMO_ACCOUNT, DEMO_PASSWORD, safeRedirectPath } from "@/lib/auth";

export const metadata: Metadata = {
  title: "登录 · 一为导航",
  description: "登录一为导航，收藏并同步你的设计师网址导航站点。",
};

type LoginSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

async function LoginContent({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  const params = await searchParams;
  const rawRedirect = params.redirect_to;
  const redirectTo = safeRedirectPath(
    typeof rawRedirect === "string" ? rawRedirect : null
  );

  return (
    <LoginView
      demoAccount={DEMO_ACCOUNT}
      demoPassword={DEMO_PASSWORD}
      redirectTo={redirectTo}
    />
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#2a0566]" />}
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
