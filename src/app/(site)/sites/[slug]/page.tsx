import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteDetailView } from "@/components/site-detail-view";
import { siteById, sites } from "@/data/nav";

export function generateStaticParams() {
  return sites.map((site) => ({ slug: `${site.id}.html` }));
}

function resolveId(slug: string) {
  return decodeURIComponent(slug).replace(/\.html$/i, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = siteById[resolveId(slug)];

  if (!site) {
    return { title: "站点未找到 · 一为导航" };
  }

  const summary =
    site.desc.length > 30 ? `${site.desc.slice(0, 30)}…` : site.desc;
  const keywords = [...new Set([site.name, ...site.tags, ...site.subs])];

  return {
    title: `${site.name}官网 - ${site.name} - ${summary} - 一为导航`,
    description: site.desc,
    keywords: keywords.join(", "),
    openGraph: {
      type: "article",
      title: `${site.name} - ${site.desc}`,
      description: site.desc,
      url: `/sites/${site.id}.html`,
      images: [{ url: site.icon, alt: site.name }],
      siteName: "一为导航",
    },
  };
}

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = siteById[resolveId(slug)];

  if (!site) notFound();

  return <SiteDetailView site={site} />;
}
