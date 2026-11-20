"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { NavIcon } from "@/components/nav-icons";
import { SiteIcon } from "@/components/site-icon";
import { EmptyHint } from "@/components/empty-hint";
import { panels, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TONES = [
  "from-[#a855f7] via-[#8618db] to-[#5b0fc4]",
  "from-[#f1404b] via-[#ff6a3d] to-[#f2a33a]",
  "from-[#2f80ed] via-[#38bdf8] to-[#0e7490]",
  "from-[#34d399] via-[#14b8a6] to-[#0e7490]",
  "from-[#f2a33a] via-[#f4772e] to-[#e0323d]",
  "from-[#22d3ee] via-[#2f80ed] to-[#4f46e5]",
];

const LIMIT = 6;

export function PanelCard({
  panel,
  index,
}: {
  panel: (typeof panels)[number];
  index: number;
}) {
  const query = useNavStore((state) => state.query);
  const compact = useNavStore((state) => state.compact);
  const expanded = useNavStore((state) => state.expanded[`panel-${panel.id}`] ?? false);
  const toggleExpanded = useNavStore((state) => state.toggleExpanded);
  const addRecent = useNavStore((state) => state.addRecent);
  const router = useRouter();
  const [tab, setTab] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const all = panel.siteIds.map((id) => siteById[id]).filter(Boolean);
  const filtered = all.filter((site) => {
    const matchTab = tab ? site.subs.includes(tab) : true;
    const matchQuery = q
      ? [site.name, site.desc, site.tags.join(" "), site.subs.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q)
      : true;
    return matchTab && matchQuery;
  });

  const visible = expanded ? filtered : filtered.slice(0, LIMIT);
  const tone = TONES[index % TONES.length];

  if (q && filtered.length === 0) return null;

  return (
    <section
      id={`panel-${panel.id}`}
      className="min-w-0 scroll-mt-28 rounded-2xl border border-border/70 bg-card p-4 card-shadow"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-[0_8px_18px_-10px_rgba(80,30,140,0.55)] ring-1 ring-white/20",
            tone
          )}
        >
          <NavIcon name={panel.icon} className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {panel.title}
          </h3>
          <p className="text-[10px] text-muted-foreground">{filtered.length} 个入口</p>
        </div>

        {panel.tabs.length > 0 && (
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setTab(null)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] transition",
                tab === null
                  ? "gradient-brand-soft border border-brand/15 font-semibold text-brand"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              全部
            </button>
            {panel.tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] transition",
                  tab === item.id
                    ? "gradient-brand-soft border border-brand/15 font-semibold text-brand"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 divide-y divide-border/40">
        {visible.map((site) => (
          <div
            key={`${panel.id}-${site.id}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              addRecent(site.id);
              router.push(`/sites/${site.id}.html`);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addRecent(site.id);
                router.push(`/sites/${site.id}.html`);
              }
            }}
            className="group -mx-2 flex w-[calc(100%+1rem)] min-w-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg px-2 py-2 text-left transition first:pt-1.5 hover:bg-muted/50"
          >
            <SiteIcon site={site} size={compact ? 24 : 30} />
            <span className="min-w-0 flex-1 overflow-hidden">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-xs font-medium text-foreground">
                  {site.name}
                </span>
                {site.tags.includes("常用推荐") && (
                  <span className="rounded bg-brand-soft px-1 py-0.5 text-[9px] text-brand">
                    推荐
                  </span>
                )}
              </span>
              {!compact && (
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {site.desc}
                </span>
              )}
            </span>
            <span className="shrink-0 rounded-md p-1 text-muted-foreground/60 transition group-hover:bg-muted group-hover:text-brand">
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-2">
          <EmptyHint text="没有匹配的入口" />
        </div>
      ) : filtered.length > LIMIT ? (
        <button
          onClick={() => toggleExpanded(`panel-${panel.id}`)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border py-1.5 text-[11px] text-muted-foreground transition hover:border-brand/40 hover:text-brand"
        >
          {expanded ? (
            <>
              收起
              <ChevronUp className="size-3" />
            </>
          ) : (
            <>
              展开全部 {filtered.length} 个
              <ChevronDown className="size-3" />
            </>
          )}
        </button>
      ) : null}
    </section>
  );
}
