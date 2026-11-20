import { randomBytes } from "node:crypto";
import { getDb } from "./db";

export type CommentRecord = {
  id: string;
  siteId: string;
  parentId: string | null;
  userId: string | null;
  nickname: string;
  email: string | null;
  avatar: string | null;
  region: string | null;
  badge: string | null;
  content: string;
  likeCount: number;
  createTime: string | null;
  replies: CommentRecord[];
};

type CommentRow = Omit<CommentRecord, "replies">;

function normalizeTime(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function rowToRecord(row: CommentRow): CommentRecord {
  return { ...row, createTime: normalizeTime(row.createTime), replies: [] };
}

/** 按站点拉取已发布评论，组装为「根评论 + 楼层回复」的树结构。 */
export async function listComments(siteId: string): Promise<CommentRecord[]> {
  const [rows] = await getDb().execute(
    `SELECT \`id\`, \`siteId\`, \`parentId\`, \`userId\`, \`nickname\`, \`email\`,
            \`avatar\`, \`region\`, \`badge\`, \`content\`, \`likeCount\`, \`createTime\`
     FROM \`nav_site_comment\`
     WHERE \`siteId\` = ? AND \`status\` = 1 AND \`yn\` = 1
     ORDER BY \`createTime\` ASC, \`id\` ASC`,
    [siteId]
  );

  const list = (rows as CommentRow[]).map(rowToRecord);
  const byId = new Map(list.map((comment) => [comment.id, comment]));
  const roots: CommentRecord[] = [];

  for (const comment of list) {
    const parent = comment.parentId ? byId.get(comment.parentId) : null;
    if (parent) parent.replies.push(comment);
    else roots.push(comment);
  }
  return roots;
}

/** 站点已发布评论总数（含回复楼层）。 */
export async function countComments(siteId: string): Promise<number> {
  const [rows] = await getDb().execute(
    `SELECT COUNT(*) AS \`c\` FROM \`nav_site_comment\`
     WHERE \`siteId\` = ? AND \`status\` = 1 AND \`yn\` = 1`,
    [siteId]
  );
  const row = (rows as Array<{ c: number }>)[0];
  return Number(row?.c ?? 0);
}

export type CreateCommentInput = {
  siteId: string;
  parentId?: string | null;
  userId?: string | null;
  nickname: string;
  email?: string | null;
  avatar?: string | null;
  badge?: string | null;
  content: string;
  region?: string | null;
};

export async function createComment(input: CreateCommentInput): Promise<CommentRecord> {
  const id = `cmt_${randomBytes(12).toString("hex")}`;
  const now = new Date();
  const nickname = input.nickname.trim().slice(0, 64) || "访客";
  const content = input.content.trim().slice(0, 2000);
  const actor = input.userId ?? "guest";

  await getDb().execute(
    `INSERT INTO \`nav_site_comment\` (
       \`id\`, \`siteId\`, \`parentId\`, \`userId\`, \`nickname\`, \`email\`,
       \`avatar\`, \`region\`, \`badge\`, \`content\`, \`likeCount\`, \`status\`,
       \`createTime\`, \`createBy\`, \`updateTime\`, \`updateBy\`, \`yn\`
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?, ?, ?, 1)`,
    [
      id,
      input.siteId,
      input.parentId ?? null,
      input.userId ?? null,
      nickname,
      input.email ?? null,
      input.avatar ?? null,
      input.region ?? null,
      input.badge ?? null,
      content,
      now,
      actor,
      now,
      actor,
    ]
  );

  return {
    id,
    siteId: input.siteId,
    parentId: input.parentId ?? null,
    userId: input.userId ?? null,
    nickname,
    email: input.email ?? null,
    avatar: input.avatar ?? null,
    region: input.region ?? null,
    badge: input.badge ?? null,
    content,
    likeCount: 0,
    createTime: now.toISOString(),
    replies: [],
  };
}
