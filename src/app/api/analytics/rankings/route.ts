import { NextResponse } from "next/server";
import { getPeriodRankings, type RankPeriod } from "@/lib/analytics";

const PERIODS: RankPeriod[] = ["day", "week", "month", "total"];

/** 周期榜单：按站点真实点击（visit）量降序，返回 siteId + 计数。 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("period") ?? "total";
  const period: RankPeriod = PERIODS.includes(raw as RankPeriod)
    ? (raw as RankPeriod)
    : "total";

  try {
    const rankings = await getPeriodRankings(period);
    return NextResponse.json(
      { ok: true, period, rankings },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[analytics] rankings 查询失败：", error);
    return NextResponse.json(
      { ok: false, period, rankings: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
