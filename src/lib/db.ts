import mysql, { type Pool } from "mysql2/promise";

const globalForDb = globalThis as typeof globalThis & {
  __navDbPool?: Pool;
};

function createPool() {
  const uri = process.env.DATABASE_URL;
  if (uri) return mysql.createPool(uri);

  return mysql.createPool({
    host: process.env.MYSQL_HOST ?? "127.0.0.1",
    port: Number(process.env.MYSQL_PORT ?? 3307),
    user: process.env.MYSQL_USER ?? "nav_app",
    password: process.env.MYSQL_PASSWORD ?? "nav_app_pwd",
    database: process.env.MYSQL_DATABASE ?? "nav",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    queueLimit: 0,
    charset: "utf8mb4",
    timezone: "+08:00",
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}

/** 开发模式下 HMR 会重复执行模块，复用全局连接池，避免连接泄漏。 */
export function getDb() {
  if (!globalForDb.__navDbPool) {
    globalForDb.__navDbPool = createPool();
  }
  return globalForDb.__navDbPool;
}
