import { NextResponse } from "next/server";
import { getSiteTrend } from "@/lib/analytics";
import { siteById } from "@/data/nav";

/** 详情页近 30 天访问趋势（点击 visit / 浏览 view 逐日数据）。 */
export async function GET(request: Request) {
  const siteId = new URL(request.url).searchParams.get("siteId");
  if (!siteId || !siteById[siteId]) {
    return NextResponse.json({ error: "站点不存在" }, { status: 400 });
  }

  try {
    const points = await getSiteTrend(siteId, 30);
    return NextResponse.json(
      { ok: true, points },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[analytics] trend 查询失败：", error);
    return NextResponse.json(
      { ok: false, points: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
