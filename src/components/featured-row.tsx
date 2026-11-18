"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Flame, TrendingUp } from "lucide-react";
import { SiteIcon } from "@/components/site-icon";
import { hotSiteIds, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TONES = [
  "from-[#7a0fd0] via-[#c511e8] to-[#3c0bc4]",
  "from-[#f1404b] via-[#ff6a3d] to-[#f2a33a]",
  "from-[#1f6fe5] via-[#38bdf8] to-[#0e7490]",
];

export function FeaturedRow() {
  const router = useRouter();
  const addRecent = useNavStore((state) => state.addRecent);

  const featured = hotSiteIds.slice(0, 3).map((id) => siteById[id]).filter(Boolean);
  const ranking = hotSiteIds.slice(0, 5).map((id) => siteById[id]).filter(Boolean);

  return (
    <section className="mt-4 grid gap-3 xl:grid-cols-[1fr_1fr_1fr_1.1fr]">
      {featured.map((site, index) => (
        <button
          key={site.id}
          onClick={() => {
            addRecent(site.id);
            router.push(`/sites/${site.id}.html`);
          }}
          className={cn(
            "group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-left text-white shadow-[0_24px_50px_-26px_rgba(70,15,180,0.6)] ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-26px_rgba(70,15,180,0.75)]",
            TONES[index % TONES.length]
          )}
        >
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
          <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/15 blur-2xl" />

          <div className="relative flex items-center gap-2">
            <SiteIcon site={site} size={38} className="bg-white/95 ring-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{site.name}</p>
              <p className="mt-0.5 text-[10px] text-white/70">
                今日精选 · {site.subs[0] ?? "推荐"}
              </p>
            </div>
          </div>

          <p className="relative mt-3 line-clamp-2 text-[11px] leading-relaxed text-white/85">
            {site.desc}
          </p>

          <div className="relative mt-3 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-white/70">
              <Flame className="size-3" />
              {site.views} 浏览
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-white backdrop-blur-sm transition group-hover:bg-white/30">
              查看详情
              <ArrowUpRight className="size-3" />
            </span>
          </div>
        </button>
      ))}

      <div className="rounded-2xl border border-border/70 bg-card p-4 card-shadow">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg gradient-brand-soft text-brand ring-1 ring-brand/10">
            <TrendingUp className="size-3.5" />
          </span>
          <h2 className="text-sm font-semibold text-foreground">热门榜</h2>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
            Today
          </span>
        </div>

        <div className="mt-3 space-y-1">
          {ranking.map((site, index) => (
            <button
              key={site.id}
              onClick={() => {
                addRecent(site.id);
                router.push(`/sites/${site.id}.html`);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition hover:bg-muted"
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
                  index === 0
                    ? "gradient-brand text-white shadow-[0_6px_14px_-8px_rgba(241,64,75,0.7)]"
                    : index === 1
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <SiteIcon site={site} size={22} />
              <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                {site.name}
              </span>
              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                {site.views}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
