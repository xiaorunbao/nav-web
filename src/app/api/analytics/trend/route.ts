import { NextResponse } from "next/server";
import { getSiteChannelTrend, getSiteTrend } from "@/lib/analytics";
import { siteById } from "@/data/nav";

/** 详情页近 30 天访问趋势：点击/浏览逐日数据 + PC/移动端渠道拆分。 */
export async function GET(request: Request) {
  const siteId = new URL(request.url).searchParams.get("siteId");
  if (!siteId || !siteById[siteId]) {
    return NextResponse.json({ error: "站点不存在" }, { status: 400 });
  }

  try {
    const [points, channelPoints] = await Promise.all([
      getSiteTrend(siteId, 30),
      getSiteChannelTrend(siteId, 30),
    ]);
    return NextResponse.json(
      { ok: true, points, channelPoints },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[analytics] trend 查询失败：", error);
    return NextResponse.json(
      { ok: false, points: [], channelPoints: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
