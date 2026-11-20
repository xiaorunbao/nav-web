import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createComment, listComments, type CommentRecord } from "@/lib/comments";
import { siteById } from "@/data/nav";

/** 评论列表：按站点拉取楼层结构；连库异常时返回空列表兜底。 */
export async function GET(request: Request) {
  const siteId = new URL(request.url).searchParams.get("siteId");
  if (!siteId || !siteById[siteId]) {
    return NextResponse.json({ error: "站点不存在" }, { status: 400 });
  }

  try {
    const comments = await listComments(siteId);
    return NextResponse.json(
      { ok: true, comments, total: countTree(comments) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[comments] 列表查询失败：", error);
    return NextResponse.json(
      { ok: false, comments: [], total: 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

/** 发表评论：登录用户自动带身份，游客允许填写昵称；邮箱选填。 */
export async function POST(request: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const siteId = typeof payload.siteId === "string" ? payload.siteId : "";
  if (!siteId || !siteById[siteId]) {
    return NextResponse.json({ error: "站点不存在" }, { status: 400 });
  }

  const content = typeof payload.content === "string" ? payload.content.trim() : "";
  if (!content) {
    return NextResponse.json({ error: "评论内容不能为空" }, { status: 400 });
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: "评论内容过长" }, { status: 400 });
  }

  const user = await getSessionUser();
  const rawNickname =
    typeof payload.nickname === "string" ? payload.nickname.trim() : "";
  if (!user && !rawNickname) {
    return NextResponse.json({ error: "请填写昵称" }, { status: 400 });
  }
  const nickname = rawNickname || user?.name || "访客";

  const email =
    (typeof payload.email === "string" ? payload.email.trim() : "") ||
    user?.account ||
    null;
  const parentId =
    typeof payload.parentId === "string" && payload.parentId ? payload.parentId : null;
  const avatar = user?.avatar ?? null;

  try {
    const comment = await createComment({
      siteId,
      parentId,
      userId: user?.id ?? null,
      nickname,
      email,
      avatar,
      badge: user ? "体验官" : "访客",
      content,
    });
    return NextResponse.json(
      { ok: true, comment },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[comments] 发表失败：", error);
    return NextResponse.json(
      { error: "评论提交失败，请稍后重试" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

function countTree(comments: CommentRecord[]): number {
  return comments.reduce(
    (sum, comment) => sum + 1 + countTree(comment.replies),
    0
  );
}
