import { randomBytes } from "node:crypto";
import { getDb } from "./db";
import { isBotUserAgent } from "./bot";

export type AnalyticsEventType = "visit" | "view";
export type AnalyticsChannel = "desktop" | "mobile";

export type TrackEventInput = {
  siteId: string;
  eventType: AnalyticsEventType;
  channel?: AnalyticsChannel | null;
  referer?: string | null;
  ip?: string | null;
  userAgent?: string | null;
};

export type SiteTrendPoint = {
  date: string;
  visits: number;
  views: number;
};

export type PeriodRank = {
  siteId: string;
  count: number;
};

export type SiteTotals = {
  visits: number;
  views: number;
};

/** 按 User-Agent 粗判访问终端。 */
export function detectChannel(userAgent?: string | null): AnalyticsChannel {
  const ua = (userAgent ?? "").toLowerCase();
  return /mobile|android|iphone|ipad|ipod|phone/.test(ua) ? "mobile" : "desktop";
}

function localDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 记录一次站点访问事件：写明细表并累加当日聚合。
 * 埋点属于旁路数据，写入失败只记服务端日志，不阻断跳转 / 浏览主流程。
 */
export async function trackEvent(input: TrackEventInput): Promise<void> {
  if (!input.siteId) return;
  // 爬虫、采集脚本与空 UA 不计入统计，避免污染榜单与趋势。
  if (isBotUserAgent(input.userAgent)) return;
  try {
    const now = new Date();
    const eventId = `evt_${randomBytes(12).toString("hex")}`;
    await getDb().execute(
      `INSERT INTO \`nav_site_event\` (
         \`id\`, \`siteId\`, \`eventType\`, \`channel\`, \`referer\`, \`ip\`,
         \`userAgent\`, \`createTime\`, \`createBy\`, \`updateTime\`, \`updateBy\`, \`yn\`
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'analytics', ?, 'analytics', 1)`,
      [
        eventId,
        input.siteId,
        input.eventType,
        input.channel ?? null,
        input.referer ?? null,
        input.ip ?? null,
        input.userAgent ?? null,
        now,
        now,
      ]
    );

    const dailyColumn =
      input.eventType === "visit" ? "visitCount" : "viewCount";
    await getDb().execute(
      `INSERT INTO \`nav_site_daily\` (
         \`id\`, \`siteId\`, \`statDate\`, \`${dailyColumn}\`,
         \`createTime\`, \`createBy\`, \`updateTime\`, \`updateBy\`, \`yn\`
       ) VALUES (?, ?, CURDATE(), 1, NOW(), 'analytics', NOW(), 'analytics', 1)
       ON DUPLICATE KEY UPDATE
         \`${dailyColumn}\` = \`${dailyColumn}\` + 1,
         \`updateTime\` = NOW(),
         \`updateBy\` = 'analytics'`,
      [`day_${randomBytes(10).toString("hex")}`, input.siteId]
    );
  } catch (error) {
    console.error(
      "[analytics] trackEvent 写入失败：",
      error instanceof Error ? error.message : error
    );
  }
}

/** 取某站点近 N 天的逐日趋势（无数据的日期补 0）。 */
export async function getSiteTrend(
  siteId: string,
  days = 30
): Promise<SiteTrendPoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  const [rows] = await getDb().execute(
    `SELECT \`statDate\`, \`visitCount\`, \`viewCount\`
     FROM \`nav_site_daily\`
     WHERE \`siteId\` = ? AND \`statDate\` >= ?
     ORDER BY \`statDate\` ASC`,
    [siteId, localDate(since)]
  );

  const byDate = new Map<string, { visits: number; views: number }>();
  for (const row of rows as Array<{
    statDate: Date | string;
    visitCount: number;
    viewCount: number;
  }>) {
    const date =
      typeof row.statDate === "string"
        ? row.statDate.slice(0, 10)
        : localDate(new Date(row.statDate));
    byDate.set(date, {
      visits: Number(row.visitCount) || 0,
      views: Number(row.viewCount) || 0,
    });
  }

  const points: SiteTrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = localDate(d);
    const fallback = byDate.get(date) ?? { visits: 0, views: 0 };
    points.push({ date, ...fallback });
  }
  return points;
}

export type RankPeriod = "day" | "week" | "month" | "total";

/** 按周期统计站点点击（visit）量，降序返回。供排行榜榜单数据源使用。 */
export async function getPeriodRankings(
  period: RankPeriod
): Promise<PeriodRank[]> {
  let since: Date | null = null;
  if (period === "day") since = new Date();
  else if (period === "week") {
    since = new Date();
    since.setDate(since.getDate() - 7);
  } else if (period === "month") {
    since = new Date();
    since.setDate(since.getDate() - 30);
  }

  const params: (string | Date)[] = [];
  const where = "`eventType` = 'visit'";
  if (since) {
    params.push(localDate(since));
  }

  const [rows] = await getDb().execute(
    `SELECT \`siteId\`, COUNT(*) AS \`count\`
     FROM \`nav_site_event\`
     WHERE ${where}${since ? " AND `createTime` >= ?" : ""}
     GROUP BY \`siteId\`
     ORDER BY \`count\` DESC`,
    params
  );

  return (rows as Array<{ siteId: string; count: number }>).map((row) => ({
    siteId: row.siteId,
    count: Number(row.count) || 0,
  }));
}

/** 取某站点累计点击与浏览量。 */
export async function getSiteTotals(siteId: string): Promise<SiteTotals> {
  const [rows] = await getDb().execute(
    `SELECT COALESCE(SUM(\`visitCount\`), 0) AS \`visits\`,
            COALESCE(SUM(\`viewCount\`), 0) AS \`views\`
     FROM \`nav_site_daily\`
     WHERE \`siteId\` = ?`,
    [siteId]
  );
  const row = (rows as Array<{ visits: number; views: number }>)[0];
  return {
    visits: Number(row?.visits) || 0,
    views: Number(row?.views) || 0,
  };
}
