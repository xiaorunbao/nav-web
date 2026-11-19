#!/usr/bin/env node
/**
 * 初始化 nav-web 的数据库表（可重复执行）。
 * 用法：npm run db:init
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import mysql from "mysql2/promise";

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const config = {
  host: process.env.MYSQL_HOST ?? "127.0.0.1",
  port: Number(process.env.MYSQL_PORT ?? 3307),
  user: process.env.MYSQL_USER ?? "nav_app",
  password: process.env.MYSQL_PASSWORD ?? "nav_app_pwd",
  database: process.env.MYSQL_DATABASE ?? "nav",
};

async function main() {
  const sqlDir = join(process.cwd(), "sql");
  const files = readdirSync(sqlDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (!files.length) {
    throw new Error(`未找到 SQL 文件：${sqlDir}`);
  }

  console.log(
    `连接 MySQL ${config.host}:${config.port}/${config.database}（用户 ${config.user}）`
  );

  const connection = await mysql.createConnection({
    ...config,
    charset: "utf8mb4",
    multipleStatements: true,
  });

  try {
    for (const file of files) {
      console.log(`执行 ${file}`);
      await connection.query(readFileSync(join(sqlDir, file), "utf8"));
    }

    const demoAccount = process.env.NAV_DEMO_ACCOUNT ?? "demo";
    const demoPassword = process.env.NAV_DEMO_PASSWORD ?? "demo1234";
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `scrypt$${salt}$${scryptSync(
      demoPassword,
      salt,
      64
    ).toString("hex")}`;

    await connection.execute(
      `INSERT INTO \`nav_user\` (
        \`id\`, \`provider\`, \`username\`, \`passwordHash\`, \`nickname\`,
        \`status\`, \`createTime\`, \`createBy\`, \`updateTime\`, \`updateBy\`, \`yn\`
      ) VALUES (?, 'password', ?, ?, ?, 1, NOW(), 'system', NOW(), 'system', 1)
      ON DUPLICATE KEY UPDATE
        \`username\` = VALUES(\`username\`),
        \`passwordHash\` = VALUES(\`passwordHash\`),
        \`nickname\` = VALUES(\`nickname\`),
        \`status\` = 1,
        \`yn\` = 1,
        \`updateTime\` = NOW(),
        \`updateBy\` = 'system'`,
      [
        "usr_demo_00000000000000000001",
        demoAccount,
        passwordHash,
        "一为体验官",
      ]
    );
    console.log(`演示账号已写入 nav_user：${demoAccount}`);

    const [rows] = await connection.query(
      "SELECT `id`, `provider`, `username`, `nickname`, `status`, `yn` FROM `nav_user` ORDER BY `createTime` LIMIT 10"
    );
    console.log(`nav_user 当前 ${rows.length} 条（最多展示 10 条）：`);
    for (const row of rows) {
      console.log(
        `  ${row.id}  ${row.provider}  ${row.username ?? "-"}  ${row.nickname}  status=${row.status} yn=${row.yn}`
      );
    }
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`初始化失败：${error.message}`);
  process.exitCode = 1;
});
