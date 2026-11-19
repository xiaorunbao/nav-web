"use client";

import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import { SiteCard } from "@/components/site-card";
import { EmptyHint } from "@/components/empty-hint";
import { blocks, siteById, sites, type NavSite } from "@/data/nav";
import { parseCount } from "@/lib/site";
import { cn } from "@/lib/utils";

type RankType = "sites" | "articles" | "software" | "books";
type RankPeriod = "day" | "week" | "month" | "total";

const TYPE_TABS: { id: RankType; label: string; blockId?: string }[] = [
  { id: "sites", label: "网址" },
  { id: "articles", label: "文章", blockId: "community" },
  { id: "software", label: "软件", blockId: "apps" },
  { id: "books", label: "书籍", blockId: "books" },
];

const PERIOD_TABS: { id: RankPeriod; label: string; desc: string }[] = [
  { id: "day", label: "日榜", desc: "根据今天浏览量降序排列" },
  { id: "week", label: "周榜", desc: "近一周浏览热度排行" },
  { id: "month", label: "月榜", desc: "近一月收藏热度排行" },
  { id: "total", label: "总榜", desc: "全站浏览与收藏综合排行" },
];

function weight(site: NavSite, period: RankPeriod): number {
  const views = parseCount(site.views);
  const likes = parseCount(site.likes);
  switch (period) {
    case "week":
      return views;
    case "month":
      return likes;
    case "total":
      return views + likes * 10;
    case "day":
    default:
      return views;
  }
}

export default function RankingsPage() {
  const [type, setType] = useState<RankType>("sites");
  const [period, setPeriod] = useState<RankPeriod>("day");

  const list = useMemo(() => {
    const tab = TYPE_TABS.find((item) => item.id === type);
    const pool = tab?.blockId
      ? (blocks
          .find((block) => block.id === tab.blockId)
          ?.siteIds.map((id) => siteById[id])
          .filter(Boolean) as NavSite[])
      : sites;
    return [...pool].sort((a, b) => weight(b, period) - weight(a, period));
  }, [type, period]);

  const activePeriod = PERIOD_TABS.find((item) => item.id === period);

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f1404b_0%,#d92d3a_52%,#ff7a45_100%)] p-5 text-white shadow-[0_30px_70px_-30px_rgba(217,45,58,0.6)] ring-1 ring-white/10 sm:p-8">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
        <div className="pointer-events-none absolute -right-16 -top-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <Trophy className="size-4" />
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] uppercase tracking-wider">
              Rankings
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-[28px]">
            网址热度榜
          </h1>
          <p className="mt-2 text-xs text-white/75 sm:text-sm">
            {activePeriod?.desc}
          </p>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1 rounded-full bg-muted p-1">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setType(tab.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition",
                type === tab.id
                  ? "gradient-brand text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-1">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] transition",
                period === tab.id
                  ? "border border-brand/15 bg-brand-soft font-semibold text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-4">
          <EmptyHint text="该分类下暂无上榜站点" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {list.map((site, index) => (
            <SiteCard key={site.id} site={site} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
