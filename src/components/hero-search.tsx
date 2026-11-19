"use client";

import { useRouter } from "next/navigation";
import { Flame, Search, Sparkles } from "lucide-react";
import { sites, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ENGINES = [
  { label: "站内", url: "" },
  { label: "百度", url: "https://www.baidu.com/s?wd=" },
  { label: "Google", url: "https://www.google.com/search?q=" },
  { label: "Bing", url: "https://www.bing.com/search?q=" },
  { label: "知乎", url: "https://www.zhihu.com/search?type=content&q=" },
  { label: "GitHub", url: "https://github.com/search?q=" },
];

const HOT_WORDS = ["在线配色", "AI 工具", "图标素材", "网盘", "设计团队"];

export function HeroSearch() {
  const query = useNavStore((state) => state.query);
  const setQuery = useNavStore((state) => state.setQuery);
  const engine = useNavStore((state) => state.engine);
  const setEngine = useNavStore((state) => state.setEngine);
  const router = useRouter();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    const current = ENGINES.find((item) => item.label === engine) ?? ENGINES[0];
    if (current.url && value) {
      window.open(current.url + encodeURIComponent(value), "_blank", "noopener");
      return;
    }
    if (value) {
      router.push(`/search?s=${encodeURIComponent(value)}`);
      return;
    }
    document.getElementById("blocks")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl hero-gradient p-5 shadow-[0_30px_70px_-30px_rgba(70,15,221,0.6)] ring-1 ring-white/10 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-white/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-fuchsia-300/20 blur-3xl animate-float-slow" />

      <div className="relative mx-auto max-w-[780px]">
        <div className="mb-5 flex justify-start overflow-x-auto no-scrollbar sm:justify-center">
          <div className="flex items-center gap-0.5 rounded-full bg-white/12 p-1 backdrop-blur-sm">
            {ENGINES.map((item) => (
              <button
                key={item.label}
                onClick={() => setEngine(item.label)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-xs transition sm:px-4",
                  engine === item.label
                    ? "bg-white font-medium text-[#6a12cf] shadow-sm"
                    : "text-white/75 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-white">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/85 backdrop-blur">
            <Sparkles className="size-3" />
            设计师的灵感与效率入口
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">
            发现值得收藏的好网站
          </h1>
          <p className="mt-2 text-xs text-white/70 sm:text-sm">
            已收录 {sites.length} 个优质站点 · 覆盖设计、素材、工具与灵感
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.5)]"
        >
          <Search className="ml-3 size-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索站点、工具或灵感，例如“在线配色”"
            className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl gradient-brand px-5 text-sm font-medium text-white shadow-[0_10px_24px_-10px_rgba(241,64,75,0.75)] transition hover:brightness-105 sm:px-7"
          >
            搜索
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/75">
          <Flame className="size-3.5 text-amber-200" />
          <span className="text-white/60">热门</span>
          {HOT_WORDS.map((word) => (
            <button
              key={word}
              onClick={() => {
                setQuery(word);
                router.push(`/search?s=${encodeURIComponent(word)}`);
              }}
              className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 transition hover:bg-white/20 hover:text-white"
            >
              {word}
            </button>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] text-white/65">
          <span>
            <b className="mr-1 text-base font-semibold text-white">{sites.length}</b>
            收录站点
          </span>
          <span>
            <b className="mr-1 text-base font-semibold text-white">9</b>
            精选分类
          </span>
          <span>
            <b className="mr-1 text-base font-semibold text-white">
              {siteById["coolors"] ? "每日" : "每日"}
            </b>
            持续更新
          </span>
          <span className="hidden sm:inline">
            <b className="mr-1 text-base font-semibold text-white">100%</b>
            人工筛选
          </span>
        </div>
      </div>
    </section>
  );
}
