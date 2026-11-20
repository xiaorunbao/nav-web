"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import type { SiteTrendPoint } from "@/lib/analytics";

const W = 640;
const H = 200;
const PAD = { left: 10, right: 10, top: 14, bottom: 24 };

const VISIT_COLOR = "#f1404b";
const VIEW_COLOR = "#9aa1ad";

function toPath(values: number[], max: number, count: number) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  return values
    .map((value, i) => {
      const x = PAD.left + (i * innerW) / (count - 1);
      const ratio = max > 0 ? value / max : 0;
      const y = PAD.top + (1 - ratio) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function lastPoint(values: number[], max: number, count: number) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const i = count - 1;
  const value = values[i] ?? 0;
  const x = PAD.left + (i * innerW) / (count - 1);
  const y = PAD.top + (1 - (max > 0 ? value / max : 0)) * innerH;
  return { x, y };
}

export function SiteTrendChart({ siteId }: { siteId: string }) {
  const [points, setPoints] = useState<SiteTrendPoint[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/analytics/trend?siteId=${encodeURIComponent(siteId)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad"))))
      .then((data: { points?: SiteTrendPoint[] }) => {
        if (active) setPoints(data.points ?? []);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [siteId]);

  const summary = useMemo(() => {
    if (!points) return { visits: 0, views: 0, max: 1, empty: true };
    const visits = points.reduce((sum, p) => sum + p.visits, 0);
    const views = points.reduce((sum, p) => sum + p.views, 0);
    const max = Math.max(
      1,
      ...points.map((p) => Math.max(p.visits, p.views))
    );
    return { visits, views, max, empty: visits + views === 0 };
  }, [points]);

  const n = points?.length ?? 0;
  const visitsPath = useMemo(
    () => (points ? toPath(points.map((p) => p.visits), summary.max, n) : ""),
    [points, summary.max, n]
  );
  const viewsPath = useMemo(
    () => (points ? toPath(points.map((p) => p.views), summary.max, n) : ""),
    [points, summary.max, n]
  );
  const visitsLast = useMemo(
    () =>
      points
        ? lastPoint(points.map((p) => p.visits), summary.max, n)
        : { x: 0, y: 0 },
    [points, summary.max, n]
  );
  const viewsLast = useMemo(
    () =>
      points
        ? lastPoint(points.map((p) => p.views), summary.max, n)
        : { x: 0, y: 0 },
    [points, summary.max, n]
  );

  const labelIndexes = n > 1 ? [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1] : [];

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg gradient-brand-soft text-brand ring-1 ring-brand/10">
          <TrendingUp className="size-3.5" />
        </span>
        <h2 className="text-base font-semibold text-foreground">
          近 30 天访问趋势
        </h2>
        <div className="ml-auto flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: VISIT_COLOR }}
            />
            点击 {summary.visits}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: VIEW_COLOR }}
            />
            浏览 {summary.views}
          </span>
        </div>
      </div>

      {points === null && !failed ? (
        <div className="mt-4 flex h-[200px] items-center justify-center rounded-xl bg-muted/30 text-xs text-muted-foreground">
          趋势数据加载中…
        </div>
      ) : failed || summary.empty ? (
        <div className="mt-4 flex h-[200px] items-center justify-center rounded-xl bg-muted/30 text-xs text-muted-foreground">
          近 30 天暂无访问数据，产生点击与浏览后会自动生成趋势
        </div>
      ) : (
        <div className="mt-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-[200px] w-full"
            role="img"
            aria-label="近 30 天访问趋势折线图"
          >
            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1={PAD.left}
                x2={W - PAD.right}
                y1={PAD.top + (H - PAD.top - PAD.bottom) * ratio}
                y2={PAD.top + (H - PAD.top - PAD.bottom) * ratio}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="3 4"
              />
            ))}

            <path
              d={viewsPath}
              fill="none"
              stroke={VIEW_COLOR}
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d={visitsPath}
              fill="none"
              stroke={VISIT_COLOR}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <circle cx={viewsLast.x} cy={viewsLast.y} r="3" fill={VIEW_COLOR} />
            <circle cx={visitsLast.x} cy={visitsLast.y} r="3.5" fill={VISIT_COLOR} />

            {labelIndexes.map((index) => (
              <text
                key={index}
                x={PAD.left + (index * (W - PAD.left - PAD.right)) / (n - 1)}
                y={H - 8}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="10"
              >
                {points?.[index]?.date.slice(5)}
              </text>
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}
