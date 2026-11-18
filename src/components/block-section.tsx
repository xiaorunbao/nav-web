"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { NavIcon } from "@/components/nav-icons";
import { SiteCard } from "@/components/site-card";
import { EmptyHint } from "@/components/empty-hint";
import { siteById, type NavBlock } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  recommend: "from-[#ff7a45] via-[#f1404b] to-[#d92d3a]",
  cloud: "from-[#38bdf8] via-[#4f7df3] to-[#7a0fd0]",
  community: "from-[#c218e6] via-[#8618db] to-[#5b0fc4]",
  books: "from-[#f2a33a] via-[#f4772e] to-[#e0323d]",
  apps: "from-[#34d399] via-[#14b8a6] to-[#0e7490]",
  demo: "from-[#22d3ee] via-[#2f80ed] to-[#4f46e5]",
  tools: "from-[#a855f7] via-[#8618db] to-[#5b0fc4]",
  assets: "from-[#fb7185] via-[#f1404b] to-[#c218e6]",
  ued: "from-[#60a5fa] via-[#2f80ed] to-[#4338ca]",
};

const LIMIT = 8;

export function BlockSection({ block }: { block: NavBlock }) {
  const query = useNavStore((state) => state.query);
  const activeCategory = useNavStore((state) => state.activeCategory);
  const activeSub = useNavStore((state) => state.activeSub);
  const selectCategory = useNavStore((state) => state.selectCategory);
  const expanded = useNavStore((state) => state.expanded[block.id] ?? false);
  const toggleExpanded = useNavStore((state) => state.toggleExpanded);

  const sub = activeCategory === block.id ? activeSub : null;

  const all = block.siteIds.map((id) => siteById[id]).filter(Boolean);
  const q = query.trim().toLowerCase();

  const filtered = all.filter((site) => {
    const matchSub = sub
      ? site.subs.includes(sub) || site.tags.includes(sub)
      : true;
    const matchQuery = q
      ? [site.name, site.desc, site.tags.join(" "), site.subs.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q)
      : true;
    return matchSub && matchQuery;
  });

  const visible = expanded ? filtered : filtered.slice(0, LIMIT);
  const tone = TONES[block.id] ?? "from-rose-500 to-orange-400";

  if (q && filtered.length === 0) return null;

  return (
    <section
      id={`block-${block.id}`}
      className="scroll-mt-28 pt-6 first:pt-0"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-[0_8px_18px_-10px_rgba(80,30,140,0.55)] ring-1 ring-white/20",
            tone
          )}
        >
          <NavIcon name={block.icon} className="size-4" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold leading-tight text-foreground">
            {block.title}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {filtered.length} 个站点
            {sub ? ` · ${sub}` : ""}
          </p>
        </div>

        {block.subs.length > 0 && (
          <div className="ml-1 flex flex-wrap items-center gap-1">
            <button
              onClick={() => selectCategory(block.id, null)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] transition",
                !sub
                  ? "gradient-brand-soft border border-brand/15 font-semibold text-brand"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              全部
            </button>
            {block.subs.map((item) => (
              <button
                key={item.id}
                onClick={() => selectCategory(block.id, item.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] transition",
                  sub === item.id
                    ? "gradient-brand-soft border border-brand/15 font-semibold text-brand"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => toggleExpanded(block.id)}
          className="ml-auto hidden text-xs text-muted-foreground transition hover:text-brand sm:block"
        >
          more+
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyHint text="该分类下没有匹配的站点" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visible.map((site) => (
              <SiteCard key={`${block.id}-${site.id}`} site={site} />
            ))}
          </div>

          {filtered.length > LIMIT && (
            <button
              onClick={() => toggleExpanded(block.id)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card/50 py-2.5 text-xs text-muted-foreground transition hover:border-brand/40 hover:text-brand"
            >
              {expanded ? (
                <>
                  收起
                  <ChevronUp className="size-3.5" />
                </>
              ) : (
                <>
                  展开全部 {filtered.length} 个站点
                  <ChevronDown className="size-3.5" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
}
