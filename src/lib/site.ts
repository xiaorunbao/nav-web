import { blocks, siteById, sites, type NavSite } from "@/data/nav";

/** 解析 "2.2K" / "646" / "1.2W" / "0" 这类展示计数为数值，便于排序比较。 */
export function parseCount(value?: string): number {
  if (!value) return 0;
  const v = value.trim().toUpperCase().replace(/[,，\s]/g, "");
  if (!v || v === "0") return 0;
  const num = parseFloat(v);
  if (Number.isNaN(num)) return 0;
  if (v.endsWith("K")) return num * 1_000;
  if (v.endsWith("W")) return num * 10_000;
  return num;
}

/** 稳定字符串哈希到 [0,1)，用于演示元信息的确定性派生（同一站点每次结果一致）。 */
function hash01(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return (h % 1000) / 1000;
}

const COUNTRIES = ["中国", "中国", "中国", "中国", "美国", "日本", "新加坡"];

export type SiteMeta = {
  country: string;
  /** 收录时间，YYYY-MM-DD */
  publishedAt: string;
  /** 最近更新时间，YYYY-MM-DD */
  updatedAt: string;
  commentCount: number;
};

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * 派生站点的演示元信息。
 * 原型详情页展示所在地、收录时间、更新时间、评论数；当前数据文件未逐条落库，
 * 这里按站点 id 做确定性派生，保证刷新后稳定一致；接入真实库后可直接替换为字段读取。
 */
export function getSiteMeta(site: NavSite): SiteMeta {
  const h = hash01(site.id);
  const h2 = hash01(`${site.id}#meta`);
  const start = new Date(2023, 0, 1).getTime();
  const end = new Date(2025, 5, 15).getTime();
  const published = new Date(start + h * (end - start));
  const updated = new Date(
    published.getTime() + h2 * (Date.now() - published.getTime())
  );
  return {
    country: COUNTRIES[Math.floor(h * COUNTRIES.length)],
    publishedAt: formatDate(published),
    updatedAt: formatDate(updated),
    commentCount: Math.floor(h2 * 12),
  };
}

/** 把日期格式化为「x 天前 / x 个月前更新」这类相对文案。 */
export function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const day = Math.floor(diff / 86_400_000);
  if (day < 1) return "今天更新";
  if (day < 30) return `${day} 天前更新`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} 个月前更新`;
  return `${Math.floor(month / 12)} 年前更新`;
}

/** 评论时间：刚刚 / x 分钟前 / x 小时前 / x 天前，超 30 天回退日期。 */
export function formatCommentTime(iso?: string | null): string {
  if (!iso) return "";
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  const diff = Date.now() - time;
  if (diff < 60_000) return "刚刚";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return new Date(iso).toLocaleDateString("zh-CN");
}

/** 出站链接统一走 /go 中转，便于后续统计点击量与统一风控出口。 */
export function goHref(url: string): string {
  return `/go?url=${encodeURIComponent(url)}`;
}

/** 全站标签聚合（合并关键词标签与子分类标签），按出现次数降序。 */
export function allTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const site of sites) {
    for (const tag of [...site.tags, ...site.subs]) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh"));
}

export type TagGroup = {
  title: string;
  icon: string;
  tags: { tag: string; count: number }[];
};

/** 按所属分类把标签分组，供标签云墙按主题渲染。 */
export function tagGroups(): TagGroup[] {
  return blocks
    .map((block) => {
      const map = new Map<string, number>();
      for (const id of block.siteIds) {
        const site = siteById[id];
        if (!site) continue;
        for (const tag of [...site.tags, ...site.subs]) {
          map.set(tag, (map.get(tag) ?? 0) + 1);
        }
      }
      return {
        title: block.title,
        icon: block.icon,
        tags: [...map.entries()]
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh")),
      };
    })
    .filter((group) => group.tags.length > 0);
}

export type RankMetric =
  | "published"
  | "updated"
  | "views"
  | "likes"
  | "favorites"
  | "comments";

function rankWeight(site: NavSite, metric: RankMetric): number {
  const meta = getSiteMeta(site);
  switch (metric) {
    case "published":
      return new Date(meta.publishedAt).getTime();
    case "updated":
      return new Date(meta.updatedAt).getTime();
    case "likes":
      return parseCount(site.likes);
    // 演示数据未单独落「被收藏总数」，暂与点赞同源；接入真实库后替换为收藏数字段。
    case "favorites":
      return parseCount(site.likes);
    case "comments":
      return meta.commentCount;
    case "views":
    default:
      return parseCount(site.views);
  }
}

/** 按指定指标对站点排序（降序）；日期类指标越新权重越高。 */
export function rankSites(metric: RankMetric, pool: NavSite[] = sites): NavSite[] {
  return [...pool].sort((a, b) => rankWeight(b, metric) - rankWeight(a, metric));
}
