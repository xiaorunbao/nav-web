"use client";

import { useMemo, useState } from "react";
import { Flame, TrendingUp } from "lucide-react";
import { SiteCard } from "@/components/site-card";
import { EmptyHint } from "@/components/empty-hint";
import { hotSiteIds, siteById, type NavSite } from "@/data/nav";
import { rankSites, type RankMetric } from "@/lib/site";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const METRICS: { id: RankMetric; label: string }[] = [
  { id: "published", label: "发布" },
  { id: "updated", label: "更新" },
  { id: "views", label: "浏览" },
  { id: "likes", label: "点赞" },
  { id: "favorites", label: "收藏" },
  { id: "comments", label: "评论" },
];

const METRIC_DESC: Record<RankMetric, string> = {
  published: "按收录时间最新排序",
  updated: "按最近更新时间排序",
  views: "按浏览量排序 · 今日实时热度",
  likes: "按点赞数排序",
  favorites: "按收藏数排序",
  comments: "按评论数排序",
};

export function HotSection() {
  const query = useNavStore((state) => state.query);
  const [metric, setMetric] = useState<RankMetric>("views");

  const pool = useMemo(
    () => hotSiteIds.map((id) => siteById[id]).filter(Boolean) as NavSite[],
    []
  );

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = pool.filter((site) =>
      q
        ? [site.name, site.desc, site.tags.join(" ")].join(" ").includes(q)
        : true
    );
    return rankSites(metric, filtered).slice(0, 8);
  }, [pool, metric, query]);

  return (
    <section id="hot" className="mt-5 scroll-mt-28">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-xl gradient-brand text-white shadow-[0_10px_20px_-10px_rgba(241,64,75,0.65)] ring-1 ring-white/20">
          <Flame className="size-4" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold leading-tight text-foreground">
            热门网址
          </h2>
          <p className="text-[11px] text-muted-foreground">{METRIC_DESC[metric]}</p>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          TOP {items.length}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
            <TrendingUp className="size-3.5 text-emerald-500" />
            较昨日 +12%
          </span>
          <div className="flex flex-wrap items-center gap-0.5 rounded-full bg-muted p-1">
            {METRICS.map((item) => (
              <button
                key={item.id}
                onClick={() => setMetric(item.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] transition",
                  metric === item.id
                    ? "gradient-brand text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              document.getElementById("blocks")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-xs text-brand hover:underline"
          >
            查看全部
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyHint text="没有匹配的热门站点" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((site, index) => (
            <SiteCard
              key={site.id}
              site={site}
              rank={index + 1}
              className={cn(index === 0 && "sm:col-span-1")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
