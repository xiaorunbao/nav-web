"use client";

import { LayoutGrid, Search, X } from "lucide-react";
import { sites } from "@/data/nav";
import { useNavStore } from "@/lib/store";

export function SecondaryHero() {
  const query = useNavStore((state) => state.query);
  const setQuery = useNavStore((state) => state.setQuery);

  return (
    <section className="relative overflow-hidden rounded-2xl hero-gradient p-6 text-white shadow-[0_30px_70px_-30px_rgba(70,15,221,0.6)] ring-1 ring-white/10 sm:p-8">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
      <div className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] text-white/90 ring-1 ring-white/20">
          <LayoutGrid className="size-3.5" />
          次级导航 · 一屏直达
        </span>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-[28px]">
          按场景整理的极简入口
        </h1>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/75 sm:text-sm">
          在线配色、效率工具、设计素材与灵感社区，不用翻分类，打开就能用。
        </p>

        <div className="mt-5 flex w-full max-w-xl items-center gap-2 rounded-xl border border-white/15 bg-white/15 px-3 backdrop-blur transition focus-within:bg-white/20">
          <Search className="size-4 shrink-0 text-white/70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="在快捷面板中搜索，例如“渐变”“LOGO”"
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              aria-label="清除搜索"
              className="text-white/70 transition hover:text-white"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="hidden rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/70 sm:block">
              /
            </kbd>
          )}
        </div>

        <div className="mt-5 grid w-full max-w-md grid-cols-3 gap-2">
          {[
            { value: sites.length, label: "收录站点" },
            { value: 6, label: "快捷面板" },
            { value: 9, label: "精选分类" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur"
            >
              <p className="text-lg font-semibold text-white">{stat.value}</p>
              <p className="mt-0.5 text-[10px] text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
