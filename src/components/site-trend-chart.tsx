"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import type { SiteChannelPoint } from "@/lib/analytics";

const W = 900;
const H = 260;
const PAD = { left: 44, right: 12, top: 10, bottom: 30 };

const PC_COLOR = "#4b5ce8";
const MOBILE_COLOR = "#67c04b";
const TOTAL_COLOR = "#f5b02d";

const TICKS = [0, 3, 6, 9, 12];

type SeriesKey = "desktop" | "mobile" | "total";

function innerSize() {
  return { innerW: W - PAD.left - PAD.right, innerH: H - PAD.top - PAD.bottom };
}

function yOf(value: number, max: number) {
  const { innerH } = innerSize();
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  return PAD.top + (1 - ratio) * innerH;
}

function xOf(index: number, count: number) {
  const { innerW } = innerSize();
  if (count <= 1) return PAD.left + innerW / 2;
  return PAD.left + (index * innerW) / (count - 1);
}

/** 平滑折线（与原型「合计」曲线一致，使用三次贝塞尔过渡）。 */
function smoothPath(values: number[], max: number) {
  const count = values.length;
  if (count === 0) return "";
  const pts = values.map((value, i) => ({ x: xOf(i, count), y: yOf(value, max) }));
  if (pts.length < 3) {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  }
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function LegendSquare({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
      <span className="h-3 w-4 rounded-[2px]" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export function SiteTrendChart({ siteId }: { siteId: string }) {
  const [points, setPoints] = useState<SiteChannelPoint[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/analytics/trend?siteId=${encodeURIComponent(siteId)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad"))))
      .then((data: { channelPoints?: SiteChannelPoint[] }) => {
        if (active) setPoints(data.channelPoints ?? []);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [siteId]);

  const summary = useMemo(() => {
    const empty = { desktop: 0, mobile: 0, total: 0, max: 12, empty: true };
    if (!points || points.length === 0) return empty;
    const totals = points.reduce(
      (acc, p) => ({
        desktop: acc.desktop + p.desktop,
        mobile: acc.mobile + p.mobile,
        total: acc.total + p.total,
      }),
      { desktop: 0, mobile: 0, total: 0 }
    );
    const peak = Math.max(
      1,
      ...points.map((p) => Math.max(p.desktop, p.mobile, p.total))
    );
    const max = Math.max(12, Math.ceil(peak / 3) * 3);
    return { ...totals, max, empty: totals.total === 0 };
  }, [points]);

  const n = points?.length ?? 0;
  const values = (key: SeriesKey) => points?.map((p) => p[key]) ?? [];
  const totalPath = useMemo(
    () => (points && n > 0 ? smoothPath(values("total"), summary.max) : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [points, summary.max, n]
  );

  const barWidth = n > 0 ? Math.min(7, Math.max(3, 520 / n / 3)) : 5;
  const labelStep = n > 0 ? Math.max(1, Math.ceil(n / 14)) : 1;

  return (
    <section className="mt-6">
      <div className="flex items-center gap-1.5">
        <BarChart3 className="size-4 text-muted-foreground" />
        <h2 className="text-[13px] font-medium text-foreground">数据统计</h2>
      </div>

      <div className="mt-2.5 rounded-[10px] bg-card px-4 pb-4 pt-3 shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <LegendSquare color={PC_COLOR} label="pc" />
          <LegendSquare color={MOBILE_COLOR} label="移动端" />
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span className="flex items-center">
              <span className="h-[2px] w-4" style={{ backgroundColor: TOTAL_COLOR }} />
              <span
                className="size-2 rounded-full border"
                style={{ borderColor: TOTAL_COLOR, backgroundColor: "#fff" }}
              />
            </span>
            合计
          </span>
        </div>

        {points === null && !failed ? (
          <div className="mt-3 flex h-[230px] items-center justify-center text-xs text-muted-foreground">
            趋势数据加载中…
          </div>
        ) : failed ? (
          <div className="mt-3 flex h-[230px] items-center justify-center text-xs text-muted-foreground">
            趋势数据暂时不可用，请稍后再试
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-2 h-[230px] w-full"
            role="img"
            aria-label="近 30 天 PC / 移动端访问量与会话合计趋势"
          >
            {TICKS.map((tick) => {
              const y = yOf(tick, summary.max);
              return (
                <g key={tick}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground"
                    fontSize="10"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {points?.map((point, index) => {
              const x = xOf(index, n);
              return (
                <g key={point.date ?? index}>
                  <rect
                    x={x - barWidth - 1.5}
                    y={yOf(point.desktop, summary.max)}
                    width={barWidth}
                    height={Math.max(1, yOf(0, summary.max) - yOf(point.desktop, summary.max))}
                    fill={PC_COLOR}
                    rx="1"
                  />
                  <rect
                    x={x + 1.5}
                    y={yOf(point.mobile, summary.max)}
                    width={barWidth}
                    height={Math.max(1, yOf(0, summary.max) - yOf(point.mobile, summary.max))}
                    fill={MOBILE_COLOR}
                    rx="1"
                  />
                </g>
              );
            })}

            {totalPath && (
              <path
                d={totalPath}
                fill="none"
                stroke={TOTAL_COLOR}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {points?.map((point, index) =>
              index % 2 === 0 || index === n - 1 ? (
                <circle
                  key={`dot-${index}`}
                  cx={xOf(index, n)}
                  cy={yOf(point.total, summary.max)}
                  r="2.5"
                  fill="#fff"
                  stroke={TOTAL_COLOR}
                  strokeWidth="1.5"
                />
              ) : null
            )}

            {points?.map((point, index) =>
              index % labelStep === 0 || index === n - 1 ? (
                <text
                  key={`label-${index}`}
                  x={xOf(index, n)}
                  y={H - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="10"
                >
                  {point.date.slice(5).replace("-", ".")}
                </text>
              ) : null
            )}

            {summary.empty && (
              <text
                x={PAD.left + (W - PAD.left - PAD.right) / 2}
                y={PAD.top + (H - PAD.top - PAD.bottom) / 2}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="12"
              >
                近 30 天暂无访问数据，产生点击后会自动生成 PC / 移动端趋势
              </text>
            )}
          </svg>
        )}
      </div>
    </section>
  );
}
