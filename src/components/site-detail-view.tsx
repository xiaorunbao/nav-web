"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  Hash,
  Heart,
  MessageSquare,
  Smartphone,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteIcon } from "@/components/site-icon";
import { hostname } from "@/lib/search";
import { formatRelative, getSiteMeta, goHref } from "@/lib/site";
import { blocks, hotSiteIds, siteById, sites } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type DetailSite = (typeof sites)[number];

export function SiteDetailView({ site }: { site: DetailSite }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => window.scrollTo(0, 0), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const favorites = useNavStore((state) => state.favorites);
  const toggleFavorite = useNavStore((state) => state.toggleFavorite);
  const addRecent = useNavStore((state) => state.addRecent);
  const setSelectedSite = useNavStore((state) => state.setSelectedSite);

  const liked = favorites.includes(site.id);
  const meta = getSiteMeta(site);
  const block = blocks.find((item) => item.siteIds.includes(site.id));
  const blockTitle = block?.title ?? "全部站点";
  const domain = hostname(site.url);

  const related = sites
    .filter(
      (item) =>
        item.id !== site.id &&
        (item.subs.some((sub) => site.subs.includes(sub)) ||
          item.tags.some((tag) => site.tags.includes(tag)))
    )
    .slice(0, 6);

  const ranking = hotSiteIds.slice(0, 5).map((id) => siteById[id]).filter(Boolean);

  const tags = Array.from(new Set([...site.subs, ...site.tags]));

  return (
    <div className="pt-4">
      <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        <Link href="/" className="transition hover:text-brand">
          首页
        </Link>
        <span>/</span>
        {block ? (
          <Link
            href={`/#block-${block.id}`}
            className="transition hover:text-brand"
          >
            {blockTitle}
          </Link>
        ) : (
          <span>{blockTitle}</span>
        )}
        <span>/</span>
        <span className="text-foreground">{site.name}</span>
      </nav>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_318px]">
        <article className="min-w-0 space-y-4">
          <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-7">
            <div className="brand-hairline absolute inset-x-0 top-0 h-[3px] opacity-90" />
            <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-[radial-gradient(circle,rgba(134,24,219,0.12),transparent_65%)]" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
              <SiteIcon site={site} size={80} className="rounded-2xl" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full gradient-brand-soft border border-brand/15 px-2 py-0.5 text-[11px] text-brand">
                    {site.subs[0] ?? "精选站点"}
                  </span>
                  {site.tags.includes("常用推荐") && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600 dark:text-amber-400">
                      <Flame className="size-3" />
                      热门推荐
                    </span>
                  )}
                </div>

                <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
                  {site.name}
                </h1>
                <a
                  href={goHref(site.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-brand"
                >
                  {domain}
                  <ArrowUpRight className="size-3" />
                </a>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {formatRelative(meta.updatedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {site.views === "0" ? "新收录" : `${site.views} 浏览`}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="size-3.5" />
                    {meta.commentCount} 评论
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" />
                    {site.likes} 收藏
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    asChild
                    className="h-10 rounded-full gradient-brand px-5 text-white shadow-[0_12px_26px_-14px_rgba(241,64,75,0.7)]"
                  >
                    <a
                      href={goHref(site.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => addRecent(site.id)}
                    >
                      打开网站
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-10 rounded-full px-4"
                  >
                    <a
                      href={goHref(site.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => addRecent(site.id)}
                    >
                      <Smartphone className="size-4" />
                      手机查看
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toggleFavorite(site.id)}
                    className={cn(
                      "h-10 rounded-full px-4",
                      liked && "border-brand/40 text-brand"
                    )}
                  >
                    <Star className={cn("size-4", liked && "fill-current")} />
                    {liked ? "已收藏" : "收藏"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      addRecent(site.id);
                      setSelectedSite(site.id);
                    }}
                    className="h-10 rounded-full px-4 text-muted-foreground hover:text-brand"
                  >
                    <Eye className="size-4" />
                    快速预览
                  </Button>
                </div>
              </div>
            </div>

            <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground">
              {site.desc}
            </p>

            <div className="relative mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "网站地址", value: domain },
                { label: "所属分类", value: blockTitle },
                { label: "所在地", value: meta.country },
                { label: "收录时间", value: meta.publishedAt },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5"
                >
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {tags.length > 0 && (
              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-brand-soft hover:text-brand"
                  >
                    # {tag}
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-7">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg gradient-brand-soft text-brand ring-1 ring-brand/10">
                <Sparkles className="size-3.5" />
              </span>
              <h2 className="text-base font-semibold text-foreground">站点介绍</h2>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">{site.desc}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {site.name} 收录在「{blockTitle}」分类中，常用标签包括
              {tags.map((tag) => ` #${tag}`).join("")}。页面信息整理自公开导航目录，
              用于原型展示与交互演示。
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {[
                {
                  title: "访问地址",
                  value: domain,
                  desc: "点击右上角按钮直接打开站点",
                },
                {
                  title: "浏览热度",
                  value: site.views === "0" ? "新收录" : site.views,
                  desc: "按公开导航目录的浏览量展示",
                },
                {
                  title: "相关标签",
                  value: `${tags.length} 个`,
                  desc: tags.slice(0, 3).join(" · "),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/70 bg-muted/30 p-3"
                >
                  <p className="text-[10px] text-muted-foreground">{item.title}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-6 text-sm font-semibold text-foreground">核心信息</h3>
            <ul className="mt-2 space-y-2">
              {[
                `官方入口：${site.url}`,
                `所属分类：${blockTitle} / ${site.subs.join("、") || "精选"}`,
                `适用场景：${tags.slice(0, 4).join("、")}`,
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-brand" />
                  <span className="break-all">{line}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-xl bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              特别声明：站点信息与描述整理自公开导航目录，不保证外部链接的准确性和完整性，
              仅用于界面原型演示。
            </p>
          </section>

          {related.length > 0 && (
            <section className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-foreground">相关导航</h2>
                <span className="text-[11px] text-muted-foreground">
                  同分类 / 同标签
                </span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/sites/${item.id}.html`}
                    className="group flex min-w-0 items-center gap-2.5 overflow-hidden rounded-xl border border-border/70 bg-card p-2.5 transition hover:border-brand/30 hover:bg-muted/30"
                  >
                    <SiteIcon site={item} size={34} />
                    <span className="min-w-0 flex-1 overflow-hidden">
                      <span className="block truncate text-xs font-medium text-foreground group-hover:text-brand">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                        {item.desc}
                      </span>
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-brand" />
              <h2 className="text-base font-semibold text-foreground">评论</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                0
              </span>
            </div>
            <div className="mt-3 rounded-xl border border-border/70 bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">暂无评论，来抢沙发。</p>
              <textarea
                disabled
                placeholder="登录后参与评论（原型演示）"
                className="mt-2 h-16 w-full resize-none rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-muted-foreground outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">
                  评论功能为原型占位，暂未接入服务
                </span>
                <Button size="xs" disabled className="rounded-full">
                  发表评论
                </Button>
              </div>
            </div>
          </section>
        </article>

        <aside className="hidden space-y-4 self-start lg:sticky lg:top-24 lg:block">
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card p-4 card-shadow">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="flex h-8 items-center gap-1.5 border-b border-border/60 bg-muted/60 px-2.5">
                <span className="size-1.5 rounded-full bg-[#ff5f57]" />
                <span className="size-1.5 rounded-full bg-[#febc2e]" />
                <span className="size-1.5 rounded-full bg-[#28c840]" />
                <span className="ml-1 flex-1 truncate rounded-full bg-card px-2 py-0.5 text-[9px] text-muted-foreground ring-1 ring-border/60">
                  {domain}
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#7a0fd0_0%,#c511e8_48%,#420bd0_100%)] p-3.5 text-white">
                <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
                <div className="relative flex items-center gap-2">
                  <SiteIcon site={site} size={34} className="ring-0" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{site.name}</p>
                    <p className="mt-0.5 text-[9px] text-white/65">
                      原型预览 · 非实时截图
                    </p>
                  </div>
                </div>
                <div className="relative mt-4 space-y-1.5">
                  <div className="h-1.5 w-4/5 rounded-full bg-white/35" />
                  <div className="h-1.5 w-3/5 rounded-full bg-white/25" />
                  <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
                </div>
                <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between text-[9px] text-white/60">
                  <span className="truncate">{domain}</span>
                  <span>已收录</span>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="mt-3 h-10 w-full rounded-full gradient-brand text-white shadow-[0_12px_26px_-14px_rgba(241,64,75,0.7)]"
            >
              <a
                href={goHref(site.url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => addRecent(site.id)}
              >
                打开网站
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              品牌化浏览器示意 · 非实时截图
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-4 card-shadow">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg gradient-brand-soft text-brand ring-1 ring-brand/10">
                <Flame className="size-3.5" />
              </span>
              <h2 className="text-sm font-semibold text-foreground">热门榜</h2>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
                TODAY
              </span>
            </div>
            <div className="mt-3 space-y-0.5">
              {ranking.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/sites/${item.id}.html`}
                  className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition hover:bg-muted"
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
                      index === 0
                        ? "gradient-brand text-white"
                        : index === 1
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                  <SiteIcon site={item} size={22} />
                  <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                    {item.views}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-4 card-shadow">
            <div className="flex items-center gap-2">
              <Hash className="size-3.5 text-brand" />
              <h2 className="text-sm font-semibold text-foreground">标签云</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-md border border-border/60 bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground transition hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                >
                  # {tag}
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-brand"
            >
              <ArrowLeft className="size-3" />
              返回全部站点
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
