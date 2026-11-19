import { NextResponse } from "next/server";

/**
 * 出站链接中转：统一记录点击量后 302 到目标站。
 * - 仅允许 http/https 协议，避免被用作开放重定向；
 * - 点击量当前记录在进程内存（重启清零），接入数据库后可落库持久化；
 * - 本地开发与原型演示阶段不做 referrer/风控拦截。
 */

const clickStats = new Map<string, number>();

export function getClickStats(): ReadonlyMap<string, number> {
  return clickStats;
}

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

  const host = parsed.hostname;
  clickStats.set(host, (clickStats.get(host) ?? 0) + 1);

  return NextResponse.redirect(parsed.toString(), { status: 302 });
}
