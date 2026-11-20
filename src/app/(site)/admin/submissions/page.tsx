import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { AdminSubmissionsView } from "@/components/admin-submissions-view";

export const metadata: Metadata = {
  title: "投稿审核 · 管理后台",
  robots: { index: false, follow: false },
};

export default async function AdminSubmissionsPage() {
  const user = await getSessionUser();

  if (!user || !isAdminUser(user)) {
    return (
      <div className="pt-10">
        <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-card p-8 text-center card-shadow">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShieldAlert className="size-6" />
          </span>
          <h1 className="mt-4 text-base font-semibold text-foreground">无访问权限</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            投稿审核后台仅管理员账号可访问，请使用白名单内的账号登录后再试。
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-1 rounded-full gradient-brand px-4 py-2 text-xs text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.7)]"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return <AdminSubmissionsView adminName={user.name} />;
}
