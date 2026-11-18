import { sites, type NavSite } from "@/data/nav";

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function scoreSite(site: NavSite, query: string) {
  const q = normalize(query);
  if (!q) return 0;
  const name = normalize(site.name);
  const desc = normalize(site.desc);
  const tags = normalize(site.tags.join(" "));
  const subs = normalize(site.subs.join(" "));

  let score = 0;
  if (name === q) score += 100;
  if (name.startsWith(q)) score += 50;
  if (name.includes(q)) score += 30;
  if (tags.includes(q)) score += 18;
  if (subs.includes(q)) score += 14;
  if (desc.includes(q)) score += 8;
  return score;
}

export function searchSites(query: string, limit = 8) {
  return sites
    .map((site) => ({ site, score: scoreSite(site, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.site);
}

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatHost(url: string) {
  return hostname(url).toUpperCase();
}
