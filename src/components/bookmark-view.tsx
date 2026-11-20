"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SiteIcon } from "@/components/site-icon";
import { blocks, siteById, type NavSite } from "@/data/nav";
import { useNavStore } from "@/lib/store";

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function formatClock(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatDate(date: Date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日 · ${WEEKDAYS[date.getDay()]}`;
}

export function BookmarkView() {
  const favorites = useNavStore((state) => state.favorites);
  const setQuery = useNavStore((state) => state.setQuery);
  const addRecent = useNavStore((state) => state.addRecent);
  const [now, setNow] = useState<Date>(() => new Date());
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const favoriteSites = useMemo(
    () => favorites.map((id) => siteById[id]).filter(Boolean) as NavSite[],
    [favorites]
  );

  const fallbackSites = useMemo(() => {
    const recommend = blocks.find((block) => block.id === "recommend");
    return (recommend?.siteIds ?? [])
      .map((id) => siteById[id])
      .filter(Boolean)
      .slice(0, 16) as NavSite[];
  }, []);

  const apps = favoriteSites.length > 0 ? favoriteSites.slice(0, 16) : fallbackSites;

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setQuery(keyword);
    router.push("/");
  };

  return (
    <div className="relative -mt-16 min-h-screen overflow-hidden bg-[linear-gradient(160deg,#2b3038_0%,#5a4a52_30%,#c9755f_55%,#7d8b86_78%,#33424a_100%)] text-white lg:-mt-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/30" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-4 pt-24 pb-10 sm:pt-28">
        {/* 时钟 */}
        <div className="text-center">
          <h1 className="text-5xl font-light tracking-widest tabular-nums sm:text-6xl">
            {formatClock(now)}
          </h1>
          <p className="mt-3 text-sm text-white/70">{formatDate(now)}</p>
        </div>

        {/* 磨砂搜索框 */}
        <form
          onSubmit={submitSearch}
          className="mt-8 flex h-12 w-full items-center gap-2.5 rounded-2xl border border-white/15 bg-white/20 px-4 backdrop-blur-md transition focus-within:bg-white/25"
        >
          <Search className="size-4 shrink-0 text-white/70" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
          />
        </form>

        {/* 应用图标网格 */}
        <div className="mt-10 grid w-full grid-cols-4 gap-x-4 gap-y-7">
          {apps.map((site) => (
            <button
              key={site.id}
              onClick={() => {
                addRecent(site.id);
                router.push(`/sites/${site.id}.html`);
              }}
              className="group flex flex-col items-center gap-2"
            >
              <SiteIcon
                site={site}
                size={60}
                className="rounded-2xl ring-1 ring-white/20 transition group-hover:scale-105"
              />
              <span className="max-w-full truncate text-xs text-white/90">
                {site.name}
              </span>
            </button>
          ))}
        </div>

        {/* 分页圆点 */}
        <div className="mt-auto flex items-center gap-2 pt-10">
          <span className="size-2 rounded-full bg-white" />
          <span className="size-2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
