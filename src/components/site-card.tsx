"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, Flame, Star } from "lucide-react";
import { SiteIcon } from "@/components/site-icon";
import { goHref } from "@/lib/site";
import type { NavSite } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SiteCard({
  site,
  rank,
  className,
}: {
  site: NavSite;
  rank?: number;
  className?: string;
}) {
  const favorites = useNavStore((state) => state.favorites);
  const toggleFavorite = useNavStore((state) => state.toggleFavorite);
  const setSelectedSite = useNavStore((state) => state.setSelectedSite);
  const addRecent = useNavStore((state) => state.addRecent);
  const router = useRouter();
  const liked = favorites.includes(site.id);

  const openDetail = () => {
    addRecent(site.id);
    router.push(`/sites/${site.id}.html`);
  };

  const openPreview = () => {
    addRecent(site.id);
    setSelectedSite(site.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter") openDetail();
      }}
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-card p-3 card-lift card-hover-brand",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-3 left-0 w-[3px] rounded-full gradient-brand-violet opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      {typeof rank === "number" && (
        <span
          className={cn(
            "absolute -left-1.5 -top-1.5 z-10 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow",
            rank === 1
              ? "bg-[#f1404b]"
              : rank === 2
                ? "bg-[#ff7a45]"
                : rank === 3
                  ? "bg-[#f2a33a]"
                  : "bg-muted-foreground/70"
          )}
        >
          {rank}
        </span>
      )}

      <SiteIcon site={site} size={44} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 pr-10">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {site.name}
          </h3>
          {site.tags.includes("常用推荐") && (
            <Flame className="size-3.5 shrink-0 text-[#ff7a45]" />
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
          {site.desc}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="shrink-0 whitespace-nowrap rounded-full border border-brand/15 bg-brand-soft px-1.5 py-0.5 text-brand">
            {site.subs[0] ?? "精选"}
          </span>
          {site.tags[0] && (
            <span className="min-w-0 truncate text-muted-foreground/80">
              # {site.tags[0]}
            </span>
          )}
          <span className="ml-auto flex shrink-0 items-center gap-0.5 tabular-nums">
            {site.views === "0" ? (
              <span className="text-[10px] text-muted-foreground/70">新收录</span>
            ) : (
              <>
                <Eye className="size-3" />
                {site.views}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          onClick={(event) => {
            event.stopPropagation();
            openPreview();
          }}
          aria-label="快速预览"
          className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-card/90 text-muted-foreground transition hover:text-brand"
        >
          <Eye className="size-3" />
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(site.id);
          }}
          aria-label={liked ? "取消收藏" : "收藏"}
          className={cn(
            "flex size-6 items-center justify-center rounded-md border border-border/60 bg-card/90 transition hover:text-brand",
            liked ? "text-brand" : "text-muted-foreground"
          )}
        >
          <Star className={cn("size-3", liked && "fill-current")} />
        </button>
        <a
          href={goHref(site.url)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            event.stopPropagation();
            addRecent(site.id);
          }}
          aria-label="直达站点"
          className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-card/90 text-muted-foreground transition hover:text-brand"
        >
          <ArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  );
}
