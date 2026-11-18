"use client";

import { Flame, TrendingUp } from "lucide-react";
import { SiteCard } from "@/components/site-card";
import { EmptyHint } from "@/components/empty-hint";
import { hotSiteIds, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function HotSection() {
  const query = useNavStore((state) => state.query);

  const items = hotSiteIds
    .map((id) => siteById[id])
    .filter(Boolean)
    .filter((site) =>
      query.trim()
        ? [site.name, site.desc, site.tags.join(" ")].join(" ").includes(query.trim())
        : true
    )
    .slice(0, 8);

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
          <p className="text-[11px] text-muted-foreground">
            按浏览量排序 · 今日实时热度
          </p>
        </div>
        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          TOP {items.length}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
            <TrendingUp className="size-3.5 text-emerald-500" />
            较昨日 +12%
          </span>
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
