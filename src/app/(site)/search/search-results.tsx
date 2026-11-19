"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Flame } from "lucide-react";
import { SiteCard } from "@/components/site-card";
import { EmptyHint } from "@/components/empty-hint";
import { blocks, siteById, sites, type NavSite } from "@/data/nav";
import { searchSites } from "@/lib/search";
import { cn } from "@/lib/utils";

type ResultType = "sites" | "articles" | "software" | "books";

const TYPE_TABS: { id: ResultType; label: string; blockId?: string }[] = [
  { id: "sites", label: "网址" },
  { id: "articles", label: "文章", blockId: "community" },
  { id: "software", label: "软件", blockId: "apps" },
  { id: "books", label: "书籍", blockId: "books" },
];

const HOT_WORDS = ["在线配色", "AI 工具", "素材", "网盘", "设计团队"];

function poolFor(type: ResultType): NavSite[] {
  const tab = TYPE_TABS.find((item) => item.id === type);
  if (!tab?.blockId) return sites;
  return (
    blocks
      .find((block) => block.id === tab.blockId)
      ?.siteIds.map((id) => siteById[id])
      .filter(Boolean) as NavSite[]
  );
}

export function SearchResults({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<ResultType>("sites");

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const pool = poolFor(type);
    const scored = searchSites(q, sites.length);
    return scored.filter((site) => pool.some((item) => item.id === site.id));
  }, [query, type]);

  const submit = (value: string) => {
    setQuery(value);
    router.push(`/search?s=${encodeURIComponent(value)}`);
  };

  return (
    <div>
      <section className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Search className="size-4 text-brand" />
          <p className="text-sm">
            {query.trim() ? (
              <>
                搜索 <b className="text-foreground">“{query.trim()}”</b>
                <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] text-brand">
                  {results.length} 个结果
                </span>
              </>
            ) : (
              "输入关键词检索收录站点"
            )}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Flame className="size-3.5 text-amber-500" />
          <span className="text-[11px] text-muted-foreground">热门搜索</span>
          {HOT_WORDS.map((word) => (
            <button
              key={word}
              onClick={() => submit(word)}
              className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              {word}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-1">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setType(tab.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs transition",
              type === tab.id
                ? "gradient-brand text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyHint
            text={
              query.trim()
                ? `没有找到与“${query.trim()}”相关的站点，换个关键词试试`
                : "输入关键词开始检索"
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {results.map((site, index) => (
            <SiteCard key={site.id} site={site} rank={index < 3 ? index + 1 : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
