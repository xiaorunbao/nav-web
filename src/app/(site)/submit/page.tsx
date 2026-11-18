import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileCheck2, Send, Sparkles } from "lucide-react";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "投稿收录 · 一为导航",
  description:
    "推荐你收藏的好站点，提交后会经过人工筛选再收录到一为导航的对应分类中。",
};

const STEPS = [
  { icon: Send, title: "填写信息", desc: "站点名称、地址、建议分类与一句话介绍。" },
  { icon: FileCheck2, title: "人工筛选", desc: "核对站点可访问性、内容质量与分类是否合适。" },
  { icon: CheckCircle2, title: "收录上线", desc: "通过后进入对应分类区块，并同步到快捷面板。" },
];

const RULES = [
  "站点可公开访问，无强制登录或诱导下载",
  "内容与设计、素材、工具、灵感相关，或属于通用实用工具",
  "不接受纯广告页、镜像站与内容高度重复的站点",
  "同一站点请勿重复提交，变更信息可在联系方式中说明",
];

export default function SubmitPage() {
  return (
    <div className="pt-4">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-7">
        <div className="brand-hairline absolute inset-x-0 top-0 h-[3px] opacity-90" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(134,24,219,0.22),transparent_65%)]" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl gradient-brand-violet text-white shadow-[0_10px_22px_-12px_rgba(134,24,219,0.7)] ring-1 ring-white/20">
              <Sparkles className="size-4" />
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Submit
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            投稿收录
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            推荐你收藏的好站点。我们会人工筛选后收录到对应分类，
            你也可以在「关于」页查看收录原则与更新进度。
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-border/70 bg-card p-4 card-shadow sm:p-5"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl gradient-brand-soft text-brand ring-1 ring-brand/10">
                <step.icon className="size-4" />
              </span>
              <span className="text-[10px] tabular-nums text-muted-foreground">
                STEP {index + 1}
              </span>
            </div>
            <h2 className="mt-3 text-sm font-semibold text-foreground">
              {step.title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {step.desc}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SubmitForm />

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border/70 bg-card p-4 card-shadow">
            <h2 className="text-sm font-semibold text-foreground">收录标准</h2>
            <ul className="mt-3 space-y-2">
              {RULES.map((rule) => (
                <li
                  key={rule}
                  className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-brand" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-4 card-shadow">
            <h2 className="text-sm font-semibold text-foreground">更多入口</h2>
            <div className="mt-3 space-y-1">
              {[
                { label: "查看全部分类", href: "/#blocks" },
                { label: "次级导航快捷面板", href: "/secondary" },
                { label: "关于我们与更新日志", href: "/about" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-2 py-2 text-xs text-muted-foreground transition hover:bg-muted hover:text-brand"
                >
                  {item.label}
                  <span className="text-[10px]">→</span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}