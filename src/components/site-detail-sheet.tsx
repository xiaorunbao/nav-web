"use client";

import Link from "next/link";
import { ArrowUpRight, Eye, Heart, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SiteIcon } from "@/components/site-icon";
import { hostname } from "@/lib/search";
import { sites, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SiteDetailSheet() {
  const selectedSiteId = useNavStore((state) => state.selectedSiteId);
  const setSelectedSite = useNavStore((state) => state.setSelectedSite);
  const favorites = useNavStore((state) => state.favorites);
  const toggleFavorite = useNavStore((state) => state.toggleFavorite);
  const addRecent = useNavStore((state) => state.addRecent);

  const site = selectedSiteId ? siteById[selectedSiteId] : null;
  const liked = site ? favorites.includes(site.id) : false;

  const similar = site
    ? sites
        .filter(
          (item) =>
            item.id !== site.id &&
            item.subs.some((sub) => site.subs.includes(sub))
        )
        .slice(0, 4)
    : [];

  return (
    <Sheet
      open={Boolean(site)}
      onOpenChange={(open) => {
        if (!open) setSelectedSite(null);
      }}
    >
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-[440px]"
      >
        {site ? (
          <>
            <div className="relative overflow-hidden border-b border-border/70 px-6 pb-5 pt-10">
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_0%,rgba(134,24,219,0.16),transparent_55%),radial-gradient(90%_90%_at_90%_10%,rgba(241,64,75,0.14),transparent_60%)]" />
              <SheetHeader className="relative gap-3">
                <div className="flex items-start gap-3">
                  <SiteIcon site={site} size={64} className="rounded-2xl" />
                  <div className="min-w-0 flex-1 pt-1">
                    <SheetTitle className="truncate text-xl font-semibold">
                      {site.name}
                    </SheetTitle>
                    <SheetDescription className="mt-1 truncate text-xs">
                      {hostname(site.url)}
                    </SheetDescription>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(site.subs.length ? site.subs : ["精选"]).map((sub) => (
                        <span
                          key={sub}
                          className="rounded-full border border-brand/15 bg-brand-soft px-2 py-0.5 text-[11px] text-brand"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetHeader>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="flex gap-2">
                <Button
                  asChild
                  size="lg"
                  className="h-10 flex-1 rounded-full gradient-brand text-white shadow-[0_12px_26px_-14px_rgba(241,64,75,0.7)]"
                >
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => addRecent(site.id)}
                  >
                    访问站点
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => toggleFavorite(site.id)}
                  className={cn(
                    "h-10 rounded-full px-4",
                    liked && "border-brand/40 text-brand"
                  )}
                >
                  <Star className={cn("size-4", liked && "fill-current")} />
                  {liked ? "已收藏" : "收藏"}
                </Button>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {site.desc}
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "浏览量", value: site.views, icon: Eye },
                  { label: "收藏数", value: site.likes, icon: Heart },
                  {
                    label: "分类",
                    value: site.subs[0] ?? "精选",
                    icon: Star,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-center"
                  >
                    <item.icon className="mx-auto size-3.5 text-muted-foreground" />
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {item.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {site.tags.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {site.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {similar.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                    相似站点
                  </h3>
                  <div className="space-y-1">
                    {similar.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedSite(item.id)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-muted"
                      >
                        <SiteIcon site={item} size={28} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-foreground">
                            {item.name}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {item.desc}
                          </span>
                        </span>
                        <ArrowUpRight className="size-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/sites/${site.id}.html`}
                onClick={() => setSelectedSite(null)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-border/70 text-xs text-muted-foreground transition hover:border-brand/30 hover:text-brand"
              >
                查看完整详情页
                <ArrowUpRight className="size-3.5" />
              </Link>

              <p className="rounded-lg bg-muted/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                原型演示数据：站点信息整理自公开导航目录，仅用于界面与交互演示。
              </p>
            </div>
          </>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">未选择站点</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
