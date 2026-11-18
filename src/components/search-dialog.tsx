"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CornerDownLeft, Search, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SiteIcon } from "@/components/site-icon";
import { searchSites, hostname } from "@/lib/search";
import { useNavStore } from "@/lib/store";
import { hotSiteIds, siteById } from "@/data/nav";
import { cn } from "@/lib/utils";

const QUICK = ["在线配色", "AI 工具", "素材", "网盘", "设计团队"];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const router = useRouter();
  const addRecent = useNavStore((state) => state.addRecent);

  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const results = useMemo(() => {
    if (!value.trim()) {
      return hotSiteIds.slice(0, 5).map((id) => siteById[id]).filter(Boolean);
    }
    return searchSites(value, 9);
  }, [value]);

  const pick = (id: string) => {
    addRecent(id);
    onOpenChange(false);
    router.push(`/sites/${id}.html`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-[620px]"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>站内搜索</DialogTitle>
          <DialogDescription>搜索站点、分类与标签</DialogDescription>
        </DialogHeader>

        <div className="brand-hairline h-[3px] w-full shrink-0" />

        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 text-muted-foreground" />
          <Input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && results[0]) pick(results[0].id);
              if (event.key === "Escape") onOpenChange(false);
            }}
            placeholder="搜索站点、工具或标签，例如“配色”"
            className="h-12 w-full border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <kbd className="hidden rounded-md border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2">
          {!value.trim() && (
            <div className="flex flex-wrap items-center gap-1.5 px-2 py-2">
              <Sparkles className="size-3.5 text-brand" />
              <span className="mr-1 text-xs text-muted-foreground">热门搜索</span>
              {QUICK.map((item) => (
                <button
                  key={item}
                  onClick={() => setValue(item)}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <p className="px-2 pb-1 pt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {value.trim() ? `搜索结果 · ${results.length}` : "大家都在看"}
          </p>

          <div className="space-y-1">
            {results.map((site) => (
              <button
                key={site.id}
                onClick={() => pick(site.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-muted"
              >
                <SiteIcon site={site} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {site.name}
                    </span>
                    <span className="shrink-0 rounded-full border border-brand/15 bg-brand-soft px-1.5 py-0.5 text-[10px] text-brand">
                      {site.subs[0] ?? "站点"}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {site.desc}
                  </span>
                </span>
                <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:block">
                  {hostname(site.url)}
                </span>
                <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
              </button>
            ))}
            {results.length === 0 && (
              <div className="px-2 py-10 text-center text-sm text-muted-foreground">
                没有找到相关站点，换个关键词试试
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-brand" />
            共收录 {Object.keys(siteById).length} 个优质站点
          </span>
          <span className="flex items-center gap-1">
            Enter 查看详情
            <ArrowUpRight className="size-3" />
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
