"use client";

import { useEffect, useState } from "react";

const CITIES = [
  { label: "北京", tz: "Asia/Shanghai" },
  { label: "马尼拉", tz: "Asia/Manila" },
  { label: "吉隆坡", tz: "Asia/Kuala_Lumpur" },
  { label: "新加坡", tz: "Asia/Singapore" },
  { label: "东京", tz: "Asia/Tokyo" },
  { label: "伦敦", tz: "Europe/London" },
  { label: "中欧", tz: "Europe/Berlin" },
  { label: "美东", tz: "America/New_York" },
  { label: "美西", tz: "America/Los_Angeles" },
];

function formatTime(tz: string, now: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
}

/** 多时区实时时钟条：纯前端按浏览器本地时间换算各城市时区。 */
export function TimezoneBar() {
  const [now, setNow] = useState<Date | null>(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl border border-border/70 bg-card px-4 py-2.5 card-shadow">
      {CITIES.map((city) => (
        <span
          key={city.tz}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-brand/70" />
          <span>{city.label}</span>
          <span className="tabular-nums text-foreground/80">
            {now ? formatTime(city.tz, now) : "--:--:--"}
          </span>
        </span>
      ))}
    </div>
  );
}
