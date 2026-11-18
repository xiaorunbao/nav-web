"use client";

import Link from "next/link";
import { Mail, MessageCircle, Rss, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  ["名站导航", "https://mznav.com"],
  ["书签目录网", "https://www.6035.com.cn"],
  ["甲方导航", "https://jiafangbb.com"],
  ["轻工具导航", "https://qinggongju.com"],
  ["一为主题", "https://www.iotheme.cn"],
  ["自媒体 TOP 导航", "https://www.zt123.cn"],
];

export function Footer() {
  return (
    <footer id="footer" className="mt-8 px-0 pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-7">
        <div className="brand-hairline absolute inset-x-0 top-0 h-[3px] opacity-90" />
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[radial-gradient(circle,rgba(134,24,219,0.1),transparent_65%)]" />
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="一为导航"
                className="h-8 w-auto dark:rounded-md dark:bg-white/95 dark:px-1.5 dark:py-1"
              />
              <span className="rounded-full border border-brand/15 bg-brand-soft px-2 py-0.5 text-[10px] text-brand">
                PROTOTYPE
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
              收集国内外优秀设计网站、UI 设计资源、灵感创意与素材资源，
              为设计师打造一个干净、好用的灵感入口。原型基于 Next.js、shadcn/ui 与 Zustand 构建。
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[Rss, MessageCircle, Mail].map((Icon, index) => (
                <span
                  key={index}
                  className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition hover:bg-brand-soft hover:text-brand"
                >
                  <Icon className="size-3.5" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-foreground">站内导航</h3>
            <div className="mt-3 grid grid-cols-2 gap-y-2 text-[11px] text-muted-foreground">
              <Link href="/" className="hover:text-brand">
                首页
              </Link>
              <Link href="/secondary" className="hover:text-brand">
                次级导航
              </Link>
              <Link href="/#hot" className="hover:text-brand">
                热门榜单
              </Link>
              <Link href="/#block-recommend" className="hover:text-brand">
                常用推荐
              </Link>
              <Link href="/#block-tools" className="hover:text-brand">
                常用工具
              </Link>
              <Link href="/#block-assets" className="hover:text-brand">
                素材资源
              </Link>
            </div>

            <h3 className="mt-5 text-xs font-semibold text-foreground">关于</h3>
            <div className="mt-3 grid grid-cols-2 gap-y-2 text-[11px] text-muted-foreground">
              <Link href="/about" className="hover:text-brand">
                关于我们
              </Link>
              <Link href="/submit" className="hover:text-brand">
                投稿收录
              </Link>
              <Link href="/about#changelog" className="hover:text-brand">
                更新日志
              </Link>
              <Link href="/about#feedback" className="hover:text-brand">
                意见反馈
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-foreground">友情链接</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {LINKS.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-brand-soft hover:text-brand"
                >
                  {name}
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                <Sparkles className="size-3.5 text-brand" />
                想推荐好站点？
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                欢迎提交你的收藏，我们会人工筛选后收录。
              </p>
              <Button
                size="xs"
                variant="outline"
                asChild
                className="mt-2 rounded-full border-brand/30 text-brand hover:bg-brand-soft"
              >
                <Link href="/submit">提交收录</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-4 text-[11px] text-muted-foreground sm:flex-row">
          <p>© 2026 一为导航 · 界面原型演示，数据整理自公开网络。</p>
          <p className="flex items-center gap-3">
            <span>Next.js 16</span>
            <span className="size-1 rounded-full bg-border" />
            <span>shadcn/ui</span>
            <span className="size-1 rounded-full bg-border" />
            <span>Zustand</span>
          </p>
        </div>
      </div>
    </footer>
  );
}