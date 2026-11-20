import { NextResponse } from "next/server";
import { trackEvent, detectChannel } from "@/lib/analytics";
import { siteById } from "@/data/nav";

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip") || null;
}

/**
 * 详情页浏览（PV）上报：前端在详情视图挂载后轻量调用一次。
 * 埋点为旁路数据，写入失败不影响页面渲染。
 */
export async function POST(request: Request) {
  let payload: { siteId?: unknown } = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const siteId = typeof payload.siteId === "string" ? payload.siteId : "";
  if (!siteId || !siteById[siteId]) {
    return NextResponse.json({ error: "站点不存在" }, { status: 400 });
  }

  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  void trackEvent({
    siteId,
    eventType: "view",
    channel: detectChannel(userAgent),
    referer,
    ip: clientIp(request),
    userAgent,
  });

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
