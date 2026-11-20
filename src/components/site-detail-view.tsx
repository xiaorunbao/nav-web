"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  Heart,
  Home,
  Link2,
  MessageSquare,
  Monitor,
  Newspaper,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import { SiteIcon } from "@/components/site-icon";
import { SiteTrendChart } from "@/components/site-trend-chart";
import { SiteComments } from "@/components/site-comments";
import { hostname } from "@/lib/search";
import { allTags, formatRelative, getSiteMeta, goHref, rankSites } from "@/lib/site";
import { blocks, hotSiteIds, siteById, sites, type NavSite } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function hash01(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** 五大收录角标：颜色与图标对齐原型（百度PC / 百度移动 / 360 / 神马 / 头条）。 */
const INDEX_BADGES = [
  { label: "百度PC", color: "#4b84f0", icon: Monitor },
  { label: "百度移动", color: "#f59b31", icon: Smartphone },
  { label: "360", color: "#35b56b", icon: ShieldCheck },
  { label: "神马", color: "#efb52e", icon: Sparkles },
  { label: "头条", color: "#ef4a44", icon: Newspaper },
] as const;

/** 标签配色：原型同一行标签会轮换不同色系。 */
const TAG_TONES = [
  "bg-[#f2ecfe] text-[#8b5cf6] ring-[#e6dcfd]",
  "bg-[#e7f1fd] text-[#3d7ee0] ring-[#d8e6fb]",
  "bg-[#e6f8f1] text-[#22a67c] ring-[#d2f0e4]",
  "bg-[#fdf1e4] text-[#e08a35] ring-[#fae3ce]",
  "bg-[#fdeeee] text-[#e8555f] ring-[#f7d2d4]",
] as const;

/** 标签云卡片配色（底色 + 文字色）。 */
const CLOUD_TONES = [
  { bg: "#fdeee3", fg: "#e8842f" },
  { bg: "#e4eefd", fg: "#4a86e8" },
  { bg: "#fdeaea", fg: "#e8555f" },
  { bg: "#efe9fe", fg: "#8b5cf6" },
  { bg: "#e6f7ea", fg: "#3aa96b" },
  { bg: "#e3f4f8", fg: "#2f9bb5" },
] as const;

/** 热门卡广告位总数：桌面 6×2 共 12 格，仅前几格为真实站点。 */
const HOT_SLOTS = 12;

const RANK_TABS = [
  { key: "week", label: "周榜", metric: "views" },
  { key: "day", label: "日榜", metric: "likes" },
  { key: "month", label: "月榜", metric: "comments" },
] as const;

/** 站点预览卡：无真实截图时按原型占位图风格渲染（渐变底 + 站名 + 模拟搜索条）。 */
function SitePreviewCard({ site, domain }: { site: NavSite; domain: string }) {
  return (
    <section className="rounded-[8px] bg-card p-3 shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
      <div className="flex items-center gap-1.5">
        <SiteIcon site={site} size={16} />
        <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
          {site.name}
        </span>
      </div>

      <div className="mt-2 overflow-hidden rounded-[6px]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#f8905f_0%,#ef5548_45%,#c265c9_100%)]">
          <div className="pointer-events-none absolute -bottom-14 -left-10 size-40 rounded-full bg-[#f6b044]/40 blur-2xl" />
          <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-[#a855f7]/45 blur-2xl" />

          <div className="relative flex h-full flex-col items-center justify-center gap-3 px-5">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-lg font-semibold text-[#d94b45] shadow-sm">
              {site.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/85">
              {domain.split(".")[0]}
            </span>
            <div className="flex h-9 w-full max-w-[240px] items-center gap-2 rounded-full bg-black/30 px-3 backdrop-blur-sm">
              <span className="min-w-0 flex-1 truncate text-[11px] text-white/85">{domain}</span>
              <Search className="size-3.5 shrink-0 text-white/80" />
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-1.5 w-6 rounded-full bg-white/35" />
              ))}
            </div>
            <span className="text-[10px] text-white/75">{domain}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 站点档案卡：紫色渐变头图 + 头像 + 站名 + 四项真实数据（评论/收藏/点赞/浏览）。 */
function SiteAuthorCard({ site, commentCount }: { site: NavSite; commentCount: number | null }) {
  const meta = getSiteMeta(site);
  const stats = [
    { icon: MessageSquare, value: String(commentCount ?? meta.commentCount), bg: "#e9f2fe", fg: "#4a86e8" },
    { icon: Star, value: String(site.subs.length), bg: "#f1ecfe", fg: "#8b5cf6" },
    { icon: ThumbsUp, value: site.likes, bg: "#fdf0e3", fg: "#ec9346" },
    { icon: Eye, value: site.views, bg: "#fdeaea", fg: "#e8555f" },
  ];

  return (
    <section className="overflow-hidden rounded-[10px] bg-card shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
      <div className="relative h-[124px] overflow-hidden bg-[linear-gradient(112deg,#2a0b5e_0%,#4c118f_38%,#8a1fca_72%,#b034d8_100%)]">
        <span className="pointer-events-none absolute -left-6 top-6 h-2.5 w-40 rotate-[18deg] rounded-full bg-[#c15ef0]/70" />
        <span className="pointer-events-none absolute right-6 top-10 h-1.5 w-28 rotate-[-28deg] rounded-full bg-[#e08cf4]/60" />
        <span className="pointer-events-none absolute -right-4 bottom-6 h-2 w-32 rotate-[-16deg] rounded-full bg-[#7d3fe0]/70" />
        <span className="pointer-events-none absolute left-14 bottom-4 h-1.5 w-24 rotate-[10deg] rounded-full bg-[#d58bf5]/45" />
      </div>

      <div className="relative -mt-11 px-4 pb-4 text-center">
        <div className="mx-auto size-[74px] overflow-hidden rounded-full border-[4px] border-card bg-muted">
          <SiteIcon site={site} size={66} className="rounded-full" />
        </div>
        <p className="mt-2 truncate text-[15px] text-foreground">{site.name}</p>
        <span className="mt-1 inline-flex h-[22px] items-center rounded-[4px] border border-[#d9c6fb] px-1.5 text-[10px] text-[#8b5cf6]">
          收录站点
        </span>

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.fg}
                style={{ backgroundColor: item.bg }}
                className="flex h-7 items-center justify-center gap-1 rounded-[4px] text-[11px]"
              >
                <Icon className="size-3" style={{ color: item.fg }} />
                <span style={{ color: item.fg }}>{item.value}</span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** 网址榜卡：粉色渐变头部 + 周/日/月榜切换 + 站点列表 + 查看完整榜单。 */
function SidebarRankCard({ siteId }: { siteId: string }) {
  const [tab, setTab] = useState<(typeof RANK_TABS)[number]["key"]>("week");
  const metric = RANK_TABS.find((item) => item.key === tab)?.metric ?? "views";
  const list = useMemo(
    () => rankSites(metric).filter((item) => item.id !== siteId).slice(0, 5),
    [metric, siteId]
  );

  return (
    <section className="overflow-hidden rounded-[10px] bg-card shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
      <div className="bg-[linear-gradient(180deg,#fce7e7_0%,#fdf1f0_100%)] px-4 pb-2.5 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-[14px] font-medium text-foreground">
            <Trophy className="size-3.5 text-[#e8555f]" />
            网址
          </h3>

          <div className="flex items-center gap-3 text-[12px]">
            {RANK_TABS.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={cn(
                  "relative pb-2 transition",
                  tab === item.key
                    ? "font-medium text-[#e8453c]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {tab === item.key && (
                  <span className="absolute inset-x-0 -bottom-[1px] mx-auto h-[2px] w-4 rounded-full bg-[#e8453c]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 px-3 pb-3">
        {list.map((item) => (
          <Link
            key={item.id}
            href={`/sites/${item.id}.html`}
            className="group flex min-w-0 items-center gap-2.5 rounded-[8px] bg-[#f5f3f3] px-2.5 py-2 transition hover:bg-[#efecec]"
          >
            <SiteIcon site={item} size={32} className="rounded-[6px]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-medium text-foreground group-hover:text-brand">
                {item.name}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                {item.desc}
              </span>
            </span>
          </Link>
        ))}

        <Link
          href="/rankings?type=sites&range=today"
          className="mt-1 flex h-9 items-center justify-center rounded-[6px] bg-[#fbe0e0] text-[12px] text-[#e8453c] transition hover:bg-[#f8d2d2]"
        >
          查看完整榜单
        </Link>
      </div>
    </section>
  );
}

/** 标签云卡：彩色窄标签 + 出现次数，按原型多色轮换。 */
function TagCloudCard() {
  const [seed, setSeed] = useState(0);
  const tags = useMemo(() => {
    const list = allTags().slice(0, 40);
    if (!seed) return list;
    return [...list.slice(seed % 8), ...list.slice(0, seed % 8)];
  }, [seed]);

  return (
    <section className="overflow-hidden rounded-[10px] bg-card shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
      <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
        <Sparkles className="size-4 text-[#e8555f]" />
        <h3 className="flex-1 text-[14px] font-medium text-foreground">标签云</h3>
        <button
          onClick={() => setSeed((prev) => prev + 3)}
          aria-label="换一批标签"
          className="text-muted-foreground transition hover:text-brand"
        >
          <RefreshCw className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 px-3.5 py-3">
        {tags.map((item, index) => {
          const tone = CLOUD_TONES[index % CLOUD_TONES.length];
          return (
            <Link
              key={item.tag}
              href={`/tags/${encodeURIComponent(item.tag)}`}
              style={{ backgroundColor: tone.bg, color: tone.fg }}
              className="inline-flex h-6 items-center rounded-[5px] px-2 text-[11px] transition hover:brightness-[0.97]"
            >
              {item.tag}
              <span className="ml-1 opacity-70">({item.count})</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function SiteDetailView({ site }: { site: NavSite }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => window.scrollTo(0, 0), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: site.id }),
    }).catch(() => {});
  }, [site.id]);

  const favorites = useNavStore((state) => state.favorites);
  const toggleFavorite = useNavStore((state) => state.toggleFavorite);
  const addRecent = useNavStore((state) => state.addRecent);

  const liked = favorites.includes(site.id);
  const meta = getSiteMeta(site);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const domain = hostname(site.url);

  /** 站点可归属多个分类，面包屑按原型用「·」串起来。 */
  const categories = useMemo(
    () => blocks.filter((block) => block.siteIds.includes(site.id)),
    [site.id]
  );

  const hotSites = useMemo(
    () => hotSiteIds.slice(0, 3).map((id) => siteById[id]).filter(Boolean),
    []
  );

  const related = useMemo(
    () =>
      sites
        .filter(
          (item) =>
            item.id !== site.id &&
            (item.subs.some((sub) => site.subs.includes(sub)) ||
              item.tags.some((tag) => site.tags.includes(tag)))
        )
        .slice(0, 8),
    [site]
  );

  const tags = useMemo(
    () => Array.from(new Set([...site.subs, ...site.tags])),
    [site.subs, site.tags]
  );

  /** 站点介绍按句号切段；首句已在上方简介展示，正文从第二句起写，避免重复。 */
  const paragraphs = useMemo(() => {
    const sentences = site.desc
      .split(/(?<=。)/)
      .map((item) => item.trim())
      .filter(Boolean);
    const detail = sentences.slice(1);
    const groups: string[] = [];
    for (let i = 0; i < detail.length; i += 2) {
      groups.push(detail.slice(i, i + 2).join(""));
    }
    groups.push(
      `${site.name}（${domain}）收录于一为导航的「${categories[0]?.title ?? "常用推荐"}」分类，域名直达入口在上方「打开网站」按钮处，出站链接统一经中转页跳转，便于统计点击量与做统一风控。`
    );
    groups.push(
      `本站最新更新时间与收录时间分别见上方信息区；同分类下的更多站点可在面包屑分类页查看，若站点已下线或内容变更，可通过「投稿收录」入口反馈，我们会重新核验后更新条目。`
    );
    return groups;
  }, [site.desc, site.name, domain, categories]);

  const badgeCounts = INDEX_BADGES.map(
    (_, index) => hash01(`${site.id}#idx${index}`) % 9
  );

  return (
    <div className="pt-4">
      {/* 热门广告卡 */}
      <section className="rounded-[10px] bg-card p-4 shadow-[0_1px_3px_rgba(20,20,30,0.05)] sm:px-[18px] sm:py-4">
        <div className="flex items-center gap-1.5">
          <Flame className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">热门</h2>
          <Link
            href="/submit"
            className="ml-auto inline-flex h-7 items-center gap-1 rounded border border-[#f0b072] bg-[#fdf6ec] px-2.5 text-[11px] text-[#d98526] transition hover:bg-[#fbeedc]"
          >
            <ArrowUpRight className="size-3" />
            立即入驻
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Array.from({ length: HOT_SLOTS }).map((_, index) => {
            const hot = hotSites[index];
            /** 桌面 6×2 共 12 格，移动端只保留前 6 格（与原型一致）。 */
            const mobileHidden = index >= 6;
            if (hot) {
              return (
                <Link
                  key={hot.id}
                  href={`/sites/${hot.id}.html`}
                  className={cn(
                    "group min-w-0 items-center gap-2 rounded-md bg-muted/60 px-2 py-1.5 transition hover:bg-muted",
                    mobileHidden ? "hidden sm:flex" : "flex"
                  )}
                >
                  <SiteIcon site={hot} size={22} className="rounded-full" />
                  <span className="min-w-0 flex-1 truncate text-[12px] text-foreground group-hover:text-brand">
                    {hot.name}
                  </span>
                </Link>
              );
            }
            return (
              <div
                key={`slot-${index}`}
                className={cn(
                  "min-w-0 items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5",
                  mobileHidden ? "hidden sm:flex" : "flex"
                )}
              >
                <span className="rounded-[2px] bg-muted px-1 text-[9px] text-muted-foreground/70">
                  Ad
                </span>
                <span className="h-2 min-w-0 flex-1 rounded-full bg-muted/40" />
              </div>
            );
          })}
        </div>
      </section>

      {/* 面包屑 */}
      <nav className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 transition hover:text-brand">
          <Home className="size-3.5" />
          首页
        </Link>
        {categories.map((block) => (
          <span key={block.id} className="inline-flex items-center gap-2">
            <span className="text-muted-foreground/80">·</span>
            <Link
              href={`/favorites/${encodeURIComponent(block.title)}`}
              className="transition hover:text-brand"
            >
              {block.title}
            </Link>
          </span>
        ))}
        <span className="text-muted-foreground/80">·</span>
        <span className="text-foreground">{site.name}</span>
      </nav>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-7 lg:grid-cols-[minmax(0,1fr)_414px]">
        {/* 主列 */}
        <article className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-[26px] font-medium leading-tight tracking-tight text-foreground">
              {site.name}
            </h1>
            <button
              onClick={() => toggleFavorite(site.id)}
              className={cn(
                "inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded border px-3 text-[12px] transition",
                liked
                  ? "border-[#f0a9a9] bg-[#fde3e3] text-[#e0392f]"
                  : "border-[#f6c9c9] bg-[#fdeded] text-[#e8453c] hover:bg-[#fbe0e0]"
              )}
            >
              <Star className={cn("size-3.5", liked && "fill-current")} />
              收藏 {site.subs.length}
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatRelative(meta.updatedAt).replace(/\s+/g, "")}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {site.views === "0" ? "0" : site.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {commentCount ?? meta.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="size-3.5" />
              {site.likes}
            </span>
          </div>

          <p className="mt-4 text-sm leading-[1.9] text-foreground/80">{site.desc}</p>

          <div className="mt-3 space-y-1 text-[12px]">
            {meta.country && (
              <p className="flex items-start gap-2">
                <span className="shrink-0 text-muted-foreground">所在地：</span>
                <span className="text-foreground">{meta.country}</span>
              </p>
            )}
            <p className="flex items-start gap-2">
              <span className="shrink-0 text-muted-foreground">收录时间：</span>
              <span className="text-foreground">{meta.publishedAt}</span>
            </p>
          </div>

          {/* 收录角标 */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {INDEX_BADGES.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <a
                  key={badge.label}
                  href={`https://seo.5118.com/${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={badge.label}
                  className="inline-flex h-5 items-center gap-1 rounded-[3px] px-1.5 text-[10px] text-white/95 transition hover:brightness-110"
                  style={{ backgroundColor: badge.color }}
                >
                  <Icon className="size-3" />
                  {badgeCounts[index]}
                </a>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <a
              href={goHref(site.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => addRecent(site.id)}
              className="inline-flex h-10 items-center gap-1 rounded-[4px] bg-[#e8453c] px-5 text-[13px] font-medium text-white shadow-[0_6px_14px_-8px_rgba(232,69,60,0.7)] transition hover:bg-[#d93b33]"
            >
              打开网站
              <ChevronRight className="size-4" />
            </a>
            <a
              href={goHref(site.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => addRecent(site.id)}
              className="inline-flex h-10 items-center gap-1.5 rounded-[4px] border border-[#f3b9b9] bg-card px-4 text-[13px] text-[#e8453c] transition hover:bg-[#fdf3f3]"
            >
              手机查看
              <Smartphone className="size-4" />
            </a>
            <button
              onClick={() => toggleFavorite(site.id)}
              aria-label="收藏本站"
              className={cn(
                "flex size-10 items-center justify-center rounded-[4px] text-white transition hover:brightness-105",
                liked ? "bg-[#c9302a]" : "bg-[#e8453c]"
              )}
            >
              <Heart className={cn("size-4", liked && "fill-current")} />
            </button>
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className={cn(
                    "inline-flex h-6 items-center gap-1 rounded-[3px] px-2 text-[11px] ring-1 transition hover:brightness-[0.98]",
                    TAG_TONES[index % TAG_TONES.length]
                  )}
                >
                  <Tag className="size-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* 预览卡：移动端排在标签之后，与原型一致 */}
          <div className="mt-5 space-y-4 lg:hidden">
            <SitePreviewCard site={site} domain={domain} />
            <SiteAuthorCard site={site} commentCount={commentCount} />
          </div>

          {/* 站点介绍卡：正文 + 关键词行 + 深入探索 */}
          <section className="mt-6 rounded-[10px] bg-card px-[22px] pb-[18px] pt-6 shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
            <div className="space-y-4 text-[14px] leading-[2] text-foreground/80">
              {paragraphs.map((text, index) => (
                <p key={`p-${index}`}>{text}</p>
              ))}
            </div>

            <div className="mt-5 border-t border-border/40 pt-4">
              <p className="flex flex-wrap items-center gap-1 text-[12px] text-muted-foreground">
                {[...tags, domain].slice(0, 5).join(",")}
                <ArrowUpRight className="size-3" />
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-medium text-foreground">深入探索</span>
                {Array.from(new Set([...tags, ...blocks.map((block) => block.title)]))
                  .slice(0, 11)
                  .map((tag) => (
                    <Link
                      key={`explore-${tag}`}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="inline-flex h-6 items-center gap-1 rounded-[3px] border border-[#cfe0f7] bg-[#f3f8fe] px-2 text-[11px] text-[#2f7de1] transition hover:bg-[#e8f2fd]"
                    >
                      <span className="flex size-3 items-center justify-center rounded-[2px] bg-[#dce9fb]">
                        <Link2 className="size-2 text-[#2f7de1]" />
                      </span>
                      {tag}
                    </Link>
                  ))}
              </div>
            </div>
          </section>

          {/* 数据统计 */}
          <SiteTrendChart siteId={site.id} />

          {/* 数据评估 + 特别声明 */}
          <section className="mt-6">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="size-4 text-muted-foreground" />
              <h2 className="text-[13px] font-medium text-foreground">数据评估</h2>
            </div>

            <div className="mt-2.5 rounded-[10px] bg-card p-5 shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
              <p className="text-[13px] leading-[2] text-muted-foreground">
                {site.name}浏览人数已经达到 {site.views === "0" ? "0" : site.views}，如你需要查询该站的相关权重信息，可以点击
                <a
                  href="https://www.5118.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 inline-flex items-center gap-0.5 text-[#2f7de1] hover:underline"
                >
                  5118数据
                  <ArrowUpRight className="size-3" />
                </a>
                <a
                  href="https://www.aizhan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 inline-flex items-center gap-0.5 text-[#2f7de1] hover:underline"
                >
                  爱站数据
                  <ArrowUpRight className="size-3" />
                </a>
                <a
                  href="https://www.chinaz.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 inline-flex items-center gap-0.5 text-[#2f7de1] hover:underline"
                >
                  Chinaz数据
                  <ArrowUpRight className="size-3" />
                </a>
                进入；以目前的网站数据参考，建议大家请以爱站数据为准，更多网站价值评估因素如：{site.name}
                的访问速度、搜索引擎收录以及索引量、用户体验等；当然要评估一个站的价值，最主要还是需要根据您自身的需求以及需要，一些确切的数据则需要找{site.name}
                的站长进行洽谈提供。如该站的IP、PV、跳出率等！
              </p>

              <h3 className="mt-4 text-center text-[14px] font-medium text-foreground">
                特别声明
              </h3>
              <p className="mt-2 text-justify text-[12px] leading-[1.9] text-muted-foreground">
                本站为一为导航提供的{site.name}
                都来源于网络，不保证外部链接的准确性和完整性，同时，对于该外部链接的指向，不由一为导航实际控制，在
                {meta.publishedAt} 收录时，该网页上的内容，都属于合规合法，后期网页的内容如出现违规，可以直接联系网站管理员进行删除，一为导航不承担任何责任。
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[4px] bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
                <span>一为导航致力于优质、实用的网络站点资源收集与分享！</span>
                <span className="flex items-center gap-1">
                  本文地址: {domain}
                  <Link href="/about" className="text-[#2f7de1] hover:underline">
                    版权声明
                  </Link>
                </span>
              </div>
            </div>
          </section>
        </article>

        {/* 右侧栏（桌面）：预览 + 档案 + 网址榜 + 标签云 */}
        <aside className="hidden min-w-0 space-y-4 self-start lg:block">
          <SitePreviewCard site={site} domain={domain} />
          <SiteAuthorCard site={site} commentCount={commentCount} />
          <SidebarRankCard siteId={site.id} />
          <TagCloudCard />
        </aside>
      </div>

      {/* 相关导航 */}
      {related.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center gap-1.5">
            <Link2 className="size-4 text-muted-foreground" />
            <h2 className="text-[13px] font-medium text-foreground">相关导航</h2>
          </div>

          <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/sites/${item.id}.html`}
                className="group flex min-w-0 items-center gap-2.5 rounded-[8px] bg-card px-3 py-2.5 shadow-[0_1px_2px_rgba(20,20,30,0.04)] transition hover:shadow-[0_6px_16px_-8px_rgba(20,20,30,0.25)]"
              >
                <SiteIcon site={item} size={36} className="rounded-lg" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-foreground group-hover:text-brand">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    {item.desc}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 评论（#respond） */}
      <SiteComments siteId={site.id} onCount={setCommentCount} />
    </div>
  );
}
