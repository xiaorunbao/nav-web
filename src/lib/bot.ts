/**
 * User-Agent 过滤：识别搜索引擎爬虫、采集脚本与命令行客户端，
 * 这类访问不计入站点点击 / 浏览统计，避免刷高榜单与趋势数据。
 */

const BOT_PATTERN =
  /bot|spider|crawl|slurp|baiduspider|googlebot|bingbot|duckduckbot|yandex|360spider|sogou|bytespider|petalbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|meta-externalagent|ahrefs|semrush|mj12|dotbot|rogerbot|headless|phantomjs|selenium|puppeteer|playwright|curl|wget|python-requests|python-urllib|urllib|node-fetch|axios|postman|httpx|go-http-client|scrapy|httpclient|okhttp|java\/|libwww|feedfetcher|rssreader/i;

/**
 * 判断 UA 是否属于爬虫 / 采集器 / 命令行工具。
 * 空 UA 视为可疑访问，同样不纳入统计。
 */
export function isBotUserAgent(userAgent?: string | null): boolean {
  const ua = (userAgent ?? "").trim();
  if (!ua) return true;
  return BOT_PATTERN.test(ua);
}

/** 是否为可纳入埋点统计的真实访问。 */
export function isTrackableUserAgent(userAgent?: string | null): boolean {
  return !isBotUserAgent(userAgent);
}
