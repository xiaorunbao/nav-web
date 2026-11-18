"use client";

import { LayoutGrid, SlidersHorizontal } from "lucide-react";
import { SecondaryHero } from "@/components/secondary-hero";
import { FeaturedRow } from "@/components/featured-row";
import { PanelCard } from "@/components/panel-card";
import { EmptyHint } from "@/components/empty-hint";
import { Switch } from "@/components/ui/switch";
import { panels, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";

export default function SecondaryPage() {
  const query = useNavStore((state) => state.query);
  const compact = useNavStore((state) => state.compact);
  const setCompact = useNavStore((state) => state.setCompact);

  const q = query.trim().toLowerCase();
  const total = panels.reduce((sum, panel) => sum + panel.siteIds.length, 0);
  const matched = panels.some((panel) =>
    panel.siteIds.some((id) => {
      const site = siteById[id];
      if (!site) return false;
      return q
        ? [site.name, site.desc, site.tags.join(" "), site.subs.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;
    })
  );

  return (
    <div>
      <SecondaryHero />

      {!q && <FeaturedRow />}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-xl bg-muted text-foreground">
          <LayoutGrid className="size-4" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold leading-tight text-foreground">
            快捷面板
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {panels.length} 个场景 · {total} 个入口
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3 rounded-full border border-border/60 bg-card px-3 py-1.5">
          <SlidersHorizontal className="size-3.5 text-muted-foreground" />
          <label
            htmlFor="compact-mode"
            className="cursor-pointer text-[11px] text-muted-foreground"
          >
            紧凑模式
          </label>
          <Switch
            id="compact-mode"
            checked={compact}
            onCheckedChange={setCompact}
            className="data-[state=checked]:bg-[#f1404b]"
          />
        </div>
      </div>

      {matched ? (
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          {panels.map((panel, index) => (
            <PanelCard key={panel.id} panel={panel} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <EmptyHint text={`没有找到与“${query}”相关的入口`} />
        </div>
      )}
    </div>
  );
}
