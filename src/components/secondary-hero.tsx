"use client";

import { LayoutGrid, Search, Sparkles, X } from "lucide-react";
import { sites } from "@/data/nav";
import { useNavStore } from "@/lib/store";

export function SecondaryHero() {
  const query = useNavStore((state) => state.query);
  const setQuery = useNavStore((state) => state.setQuery);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-7">
      <div className="brand-hairline absolute inset-x-0 top-0 h-[3px] opacity-90" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(134,24,219,0.26),transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 size-80 rounded-full bg-[radial-gradient(circle,rgba(241,64,75,0.2),transparent_65%)]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl gradient-brand-violet text-white shadow-[0_10px_22px_-12px_rgba(134,24,219,0.7)] ring-1 ring-white/20">
              <LayoutGrid className="size-4" />
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Secondary Nav
            </span>
            <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] text-brand">
              <Sparkles className="size-3" />
              快捷面板
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            次级导航 · 一屏直达
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            按场景整理的极简入口：在线配色、效率工具、设计素材与灵感社区，
            不用翻分类，打开就能用。
          </p>

          <div className="mt-5 flex max-w-xl items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 transition focus-within:border-brand/35 focus-within:bg-card">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="在快捷面板中搜索，例如“渐变”“LOGO”"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                aria-label="清除搜索"
                className="text-muted-foreground transition hover:text-brand"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="hidden rounded border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
                /
              </kbd>
            )}
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-2 lg:w-[300px]">
          {[
            { value: sites.length, label: "收录站点" },
            { value: 6, label: "快捷面板" },
            { value: 9, label: "精选分类" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-card/70 px-2 py-3 text-center backdrop-blur"
            >
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
