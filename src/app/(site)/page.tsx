"use client";

import { Search, X } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { HotSection } from "@/components/hot-section";
import { BlockSection } from "@/components/block-section";
import { EmptyHint } from "@/components/empty-hint";
import { blocks, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";

function QueryBar() {
  const query = useNavStore((state) => state.query);
  const clearFilters = useNavStore((state) => state.clearFilters);
  if (!query.trim()) return null;

  const matched = Object.values(siteById).filter((site) =>
    [site.name, site.desc, site.tags.join(" "), site.subs.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  ).length;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-xs">
      <Search className="size-3.5 text-brand" />
      <span className="text-muted-foreground">
        搜索 <b className="text-foreground">“{query}”</b>
      </span>
      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] text-brand">
        {matched} 个结果
      </span>
      <button
        onClick={clearFilters}
        className="ml-auto flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground transition hover:text-foreground"
      >
        <X className="size-3" />
        清除筛选
      </button>
    </div>
  );
}

export default function HomePage() {
  const query = useNavStore((state) => state.query);
  const hasAny = blocks.some((block) =>
    block.siteIds.some((id) => {
      const site = siteById[id];
      if (!site) return false;
      return query.trim()
        ? [site.name, site.desc, site.tags.join(" "), site.subs.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        : true;
    })
  );

  return (
    <div>
      <HeroSearch />
      <QueryBar />
      <HotSection />

      <div id="blocks" className="mt-4 scroll-mt-28">
        {hasAny ? (
          blocks.map((block) => <BlockSection key={block.id} block={block} />)
        ) : (
          <EmptyHint text={`没有找到与“${query}”相关的站点，试试“配色”“素材”或“AI”`} />
        )}
      </div>
    </div>
  );
}
