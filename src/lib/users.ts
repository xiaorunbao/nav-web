import { randomBytes } from "node:crypto";
import { getDb } from "./db";
import {
  OAUTH_PROVIDER_LABELS,
  type OAuthProvider,
} from "./oauth-shared";

export type DbUser = {
  id: string;
  provider: string;
  openId: string | null;
  unionId: string | null;
  username: string | null;
  passwordHash: string | null;
  nickname: string;
  avatar: string | null;
  email: string | null;
  status: number;
};

type UserRow = DbUser;

const USER_COLUMNS = [
  "`id`",
  "`provider`",
  "`openId`",
  "`unionId`",
  "`username`",
  "`passwordHash`",
  "`nickname`",
  "`avatar`",
  "`email`",
  "`status`",
].join(", ");

function firstRow(rows: unknown) {
  return (rows as UserRow[])[0] ?? null;
}

export async function findUserById(id: string) {
  const [rows] = await getDb().execute(
    `SELECT ${USER_COLUMNS} FROM \`nav_user\` WHERE \`id\` = ? AND \`yn\` = 1 LIMIT 1`,
    [id]
  );
  return firstRow(rows);
}

export async function findPasswordUser(account: string) {
  const [rows] = await getDb().execute(
    `SELECT ${USER_COLUMNS} FROM \`nav_user\`
     WHERE \`provider\` = 'password'
       AND \`yn\` = 1
       AND \`status\` = 1
       AND (\`username\` = ? OR \`email\` = ?)
     LIMIT 1`,
    [account, account]
  );
  return firstRow(rows);
}

async function findOAuthUser(provider: OAuthProvider, openId: string) {
  const [rows] = await getDb().execute(
    `SELECT ${USER_COLUMNS} FROM \`nav_user\`
     WHERE \`provider\` = ? AND \`openId\` = ? AND \`yn\` = 1
     LIMIT 1`,
    [provider, openId]
  );
  return firstRow(rows);
}

/**
 * 社交账号落库：同一 provider 下 openid 唯一，重复登录只更新昵称/头像/登录时间。
 * 并发首次登录由 (provider, openId) 唯一索引兜底。
 */
export async function upsertOAuthUser(input: {
  provider: OAuthProvider;
  openId: string;
  unionId?: string | null;
  nickname: string;
  avatar?: string | null;
  ip?: string | null;
}) {
  const now = new Date();
  const nickname = (
    input.nickname.trim() ||
    `${OAUTH_PROVIDER_LABELS[input.provider]} 用户`
  ).slice(0, 255);
  const avatar = input.avatar ? input.avatar.slice(0, 1024) : null;
  const unionId = input.unionId ? input.unionId.slice(0, 128) : null;
  const actor = `${input.provider}-oauth`;
  const id = `usr_${randomBytes(12).toString("hex")}`;

  await getDb().execute(
    `INSERT INTO \`nav_user\` (
       \`id\`, \`provider\`, \`openId\`, \`unionId\`, \`nickname\`, \`avatar\`, \`status\`,
       \`lastLoginTime\`, \`lastLoginIp\`, \`createTime\`, \`createBy\`,
       \`updateTime\`, \`updateBy\`, \`yn\`
     ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
       \`unionId\` = COALESCE(VALUES(\`unionId\`), \`unionId\`),
       \`nickname\` = VALUES(\`nickname\`),
       \`avatar\` = VALUES(\`avatar\`),
       \`status\` = 1,
       \`yn\` = 1,
       \`lastLoginTime\` = VALUES(\`lastLoginTime\`),
       \`lastLoginIp\` = VALUES(\`lastLoginIp\`),
       \`updateTime\` = VALUES(\`updateTime\`),
       \`updateBy\` = VALUES(\`updateBy\`)`,
    [
      id,
      input.provider,
      input.openId,
      unionId,
      nickname,
      avatar,
      now,
      input.ip ?? null,
      now,
      actor,
      now,
      actor,
    ]
  );

  const user = await findOAuthUser(input.provider, input.openId);
  if (!user) throw new Error("社交账号写入后读取失败");
  return user;
}

export async function touchUserLogin(id: string, ip?: string | null) {
  await getDb().execute(
    `UPDATE \`nav_user\`
     SET \`lastLoginTime\` = NOW(), \`lastLoginIp\` = ?, \`updateTime\` = NOW(), \`updateBy\` = 'login'
     WHERE \`id\` = ? AND \`yn\` = 1`,
    [ip ?? null, id]
  );
}
