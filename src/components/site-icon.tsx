"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { NavSite } from "@/data/nav";

const PALETTES = [
  "from-violet-500 to-fuchsia-500",
  "from-rose-500 to-orange-400",
  "from-sky-500 to-indigo-500",
  "from-emerald-500 to-teal-400",
  "from-amber-400 to-rose-500",
  "from-cyan-500 to-blue-500",
  "from-purple-500 to-indigo-400",
  "from-pink-500 to-red-400",
];

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function SiteIcon({
  site,
  size = 40,
  className,
}: {
  site: Pick<NavSite, "name" | "icon" | "url">;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const palette = PALETTES[hash(site.name) % PALETTES.length];
  const initial = site.name.trim().slice(0, 1).toUpperCase() || "N";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white ring-1 ring-black/5 dark:ring-white/15",
        className
      )}
      style={{ width: size, height: size }}
    >
      {site.icon && !failed ? (
        <img
          src={site.icon}
          alt={site.name}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-[3px]"
        />
      ) : (
        <span
          className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br text-white",
            palette
          )}
          style={{ fontSize: Math.max(12, size * 0.42) }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
