import { NextResponse } from "next/server";
import { trackEvent, detectChannel } from "@/lib/analytics";
import { hostname } from "@/lib/search";
import { sites } from "@/data/nav";

/** 归一化地址用于宽松匹配：统一 host 大小写、去 www.、去尾部斜杠与 query/hash。 */
function normalizeUrlKey(raw: string): string {
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const path = u.pathname.replace(/\/+$/, "") || "/";
    return `${host}${path}`;
  } catch {
    return raw.trim().toLowerCase();
  }
}

/** 按完整地址（原始 / 归一化）或域名反查本地站点 id，命中才记录点击。 */
function siteIdByUrl(target: string): string | null {
  const exact = sites.find((site) => site.url === target);
  if (exact) return exact.id;

  const normalized = normalizeUrlKey(target);
  const byNormalized = sites.find(
    (site) => normalizeUrlKey(site.url) === normalized
  );
  if (byNormalized) return byNormalized.id;

  const targetHost = hostname(target);
  const byHost = sites.find((site) => hostname(site.url) === targetHost);
  return byHost?.id ?? null;
}

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip") || null;
}

/**
 * 出站链接中转：校验协议后 302 到目标站，并旁路记录 visit 埋点（落库持久化）。
 * - 仅允许 http/https 协议，避免被用作开放重定向；
 * - 埋点写入失败不阻断跳转；本地开发与原型演示阶段不做 referrer/风控拦截。
 */
export function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "缺少跳转地址" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "跳转地址不合法" }, { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "仅支持 http/https 链接" }, { status: 400 });
  }

  const siteId = siteIdByUrl(target);
  if (siteId) {
    const referer = request.headers.get("referer");
    const userAgent = request.headers.get("user-agent");
    void trackEvent({
      siteId,
      eventType: "visit",
      channel: detectChannel(userAgent),
      referer,
      ip: clientIp(request),
      userAgent,
    });
  }

  return NextResponse.redirect(parsed.toString(), { status: 302 });
}
