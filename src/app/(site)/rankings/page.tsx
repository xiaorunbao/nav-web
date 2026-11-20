"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { SiteIcon } from "@/components/site-icon";
import { EmptyHint } from "@/components/empty-hint";
import { blocks, siteById, sites, type NavSite } from "@/data/nav";
import { parseCount } from "@/lib/site";
import { cn } from "@/lib/utils";

type RankType = "sites" | "articles" | "software" | "books";
type RankPeriod = "day" | "week" | "month" | "total";

const TYPE_TABS: { id: RankType; label: string; short: string; blockId?: string }[] = [
  { id: "software", label: "软件排行榜", short: "软件", blockId: "apps" },
  { id: "sites", label: "网址排行榜", short: "网址" },
  { id: "articles", label: "文章排行榜", short: "文章", blockId: "community" },
  { id: "books", label: "书籍排行榜", short: "书籍", blockId: "books" },
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
  const [rankMap, setRankMap] = useState<Record<string, number>>({});
  const [liveLoaded, setLiveLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const reqRef = useRef(0);

  useEffect(() => {
    let active = true;
    const reqId = ++reqRef.current;
    fetch(`/api/analytics/rankings?period=${period}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad"))))
      .then((data: { rankings?: { siteId: string; count: number }[] }) => {
        if (!active || reqId !== reqRef.current) return;
        const map: Record<string, number> = {};
        for (const item of data.rankings ?? []) {
          map[item.siteId] = item.count;
        }
        setRankMap(map);
        setLiveLoaded(true);
        setLoading(false);
      })
      .catch(() => {
        if (!active || reqId !== reqRef.current) return;
        setRankMap({});
        setLiveLoaded(false);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [period]);

  const list = useMemo(() => {
    const tab = TYPE_TABS.find((item) => item.id === type);
    const pool = tab?.blockId
      ? (blocks
          .find((block) => block.id === tab.blockId)
          ?.siteIds.map((id) => siteById[id])
          .filter(Boolean) as NavSite[])
      : sites;
    const hasLive = liveLoaded && !loading && Object.keys(rankMap).length > 0;
    return [...pool].sort((a, b) => {
      const countA = rankMap[a.id] ?? 0;
      const countB = rankMap[b.id] ?? 0;
      if (hasLive && countB !== countA) return countB - countA;
      return weight(b, period) - weight(a, period);
    });
  }, [type, period, rankMap, liveLoaded, loading]);

  const activeType = TYPE_TABS.find((item) => item.id === type);
  const activePeriod = PERIOD_TABS.find((item) => item.id === period);

  return (
    <div>
      {/* 红色渐变通栏 Hero */}
      <section className="relative -mx-3 overflow-hidden bg-[linear-gradient(135deg,#f1404b_0%,#d92d3a_52%,#ff7a45_100%)] px-3 py-10 text-white sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6 sm:py-12">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
        <Trophy
          className="pointer-events-none absolute -right-10 -top-10 size-56 text-white/10"
          strokeWidth={1}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setType(tab.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs transition sm:text-[13px]",
                  type === tab.id
                    ? "bg-white font-semibold text-foreground shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            {activeType?.short}热度{activePeriod?.label}
          </h1>
          <p className="mt-2 text-xs text-white/75 sm:text-sm">
            {activePeriod?.desc}
          </p>
        </div>
      </section>

      {/* 白卡榜单 */}
      <section className="mt-5 rounded-2xl border border-border/70 bg-card p-4 card-shadow sm:p-5">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setPeriod(tab.id);
                setLoading(true);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs transition",
                period === tab.id
                  ? "gradient-brand text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-4">
            <EmptyHint text="该分类下暂无上榜站点" />
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {list.map((site) => (
              <Link
                key={site.id}
                href={`/sites/${site.id}.html`}
                className="group flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-3 transition hover:bg-muted/70"
              >
                <SiteIcon site={site} size={38} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground group-hover:text-brand">
                    {site.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    {site.desc}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
