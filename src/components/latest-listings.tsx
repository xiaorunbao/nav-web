"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import type { SubmissionRecord } from "@/lib/submissions";

function formatDate(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("zh-CN");
}

export function LatestListings() {
  const [listings, setListings] = useState<SubmissionRecord[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/listings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { ok: boolean; listings: SubmissionRecord[] }) => {
        if (active) setListings(data.ok ? data.listings : []);
      })
      .catch(() => {
        if (active) setListings([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!listings || listings.length === 0) return null;

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-xl gradient-brand-soft text-brand ring-1 ring-brand/10">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">最新收录</h2>
          <p className="text-[11px] text-muted-foreground">
            审核通过的投稿站点会展示在这里
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border/70 bg-card p-4 card-shadow transition hover:border-brand/30"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl gradient-brand-soft text-sm font-semibold text-brand ring-1 ring-brand/15">
                {(item.name.slice(0, 1) || "站").toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-brand">
                  {item.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {item.category ?? "实用工具"}
                </p>
              </div>
              <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {item.description || item.url}
            </p>
            {item.approveTime && (
              <p className="mt-2 text-[10px] text-muted-foreground/70">
                收录于 {formatDate(item.approveTime)}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
