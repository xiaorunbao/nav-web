import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Database,
  Home,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blocks, panels, sites, sidebarItems } from "@/data/nav";

export const metadata: Metadata = {
  title: "关于我们 · 一为导航",
  description:
    "一为导航是面向设计师的网址导航原型，站点数据整理自公开网络，仅用于界面与交互演示。",
};

const TECH = ["Next.js 16", "React 19", "Tailwind CSS 4", "shadcn/ui", "Zustand"];

const CHANGELOG = [
  {
    date: "2026-11",
    title: "补齐「关于」「投稿收录」页面",
    desc: "清理头部导航中的伪入口，页脚相关链接全部指向真实页面。",
  },
  {
    date: "2026-11",
    title: "站点详情页与快速预览",
    desc: "新增站点详情页、详情抽屉、相似站点推荐与热门榜侧栏。",
  },
  {
    date: "2026-10",
    title: "次级导航快捷面板",
    desc: "上线 /secondary 页面，提供场景化面板、标签筛选与紧凑模式。",
  },
  {
    date: "2026-10",
    title: "首页导航原型",
    desc: "完成分类区块、热门榜单、全局搜索弹窗与收藏/最近访问持久化。",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-4">
      <section className="relative overflow-hidden rounded-2xl hero-gradient p-5 text-white shadow-[0_30px_70px_-30px_rgba(70,15,221,0.6)] ring-1 ring-white/10 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-[820px]">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/85 backdrop-blur">
            <Sparkles className="size-3" />
            About · 关于我们
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">
            关于一为导航
          </h1>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/75 sm:text-sm">
            一为导航收集国内外优秀设计网站、UI 设计资源、灵感创意与素材资源，
            为设计师打造一个干净、好用的灵感入口。当前版本是前端界面原型，
            所有站点信息整理自公开导航目录，仅用于界面与交互演示。
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[11px] text-white/65">
            <span>
              <b className="mr-1 text-base font-semibold text-white">
                {sites.length}
              </b>
              收录站点
            </span>
            <span>
              <b className="mr-1 text-base font-semibold text-white">
                {blocks.length}
              </b>
              首页分类
            </span>
            <span>
              <b className="mr-1 text-base font-semibold text-white">
                {panels.length}
              </b>
              快捷面板
            </span>
            <span>
              <b className="mr-1 text-base font-semibold text-white">
                {sidebarItems.length}
              </b>
              侧栏分类
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          {
            icon: Database,
            title: "数据来源",
            desc: "站点名称、描述、标签与浏览量整理自公开导航目录，仅作演示，不保证外部链接的有效性。",
          },
          {
            icon: ShieldCheck,
            title: "内容原则",
            desc: "只收录可公开访问的站点入口，不含登录墙内容与付费资源；发现失效链接欢迎反馈。",
          },
          {
            icon: Layers,
            title: "页面结构",
            desc: "首页分类导航、次级导航快捷面板、站点详情页三层结构，支持搜索、收藏与最近访问。",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border/70 bg-card p-4 card-shadow sm:p-5"
          >
            <span className="flex size-8 items-center justify-center rounded-xl gradient-brand-soft text-brand ring-1 ring-brand/10">
              <item.icon className="size-4" />
            </span>
            <h2 className="mt-3 text-sm font-semibold text-foreground">
              {item.title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      <section
        id="changelog"
        className="mt-4 scroll-mt-28 rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6"
      >
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg gradient-brand-soft text-brand ring-1 ring-brand/10">
            <Clock className="size-3.5" />
          </span>
          <h2 className="text-base font-semibold text-foreground">更新日志</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            原型阶段
          </span>
        </div>

        <ol className="mt-4 space-y-3">
          {CHANGELOG.map((item) => (
            <li
              key={item.title}
              className="relative border-l border-border/70 pl-4"
            >
              <span className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-brand" />
              <p className="text-[11px] tabular-nums text-muted-foreground">
                {item.date}
              </p>
              <h3 className="mt-0.5 text-sm font-medium text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">
              <Layers className="size-3.5" />
            </span>
            <h2 className="text-base font-semibold text-foreground">技术栈</h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {TECH.map((item) => (
              <span
                key={item}
                className="rounded-md border border-border/60 bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            主题、收藏、最近访问、侧栏折叠与紧凑模式通过 Zustand 持久化到本地存储，
            深浅色主题在首屏渲染前完成恢复。
          </p>
        </div>

        <div
          id="feedback"
          className="scroll-mt-28 rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg gradient-brand-soft text-brand ring-1 ring-brand/10">
              <MessageSquare className="size-3.5" />
            </span>
            <h2 className="text-base font-semibold text-foreground">意见反馈</h2>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            原型阶段暂未接入在线反馈与账号体系。发现失效链接、错误分类或想推荐新站点，
            可以通过投稿收录页提交，我们会在后续版本统一处理。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              asChild
              size="sm"
              className="rounded-full gradient-brand px-4 text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.7)]"
            >
              <Link href="/submit">
                投稿收录
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-full px-4">
              <Link href="/">
                <Home className="size-3.5" />
                返回首页
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}