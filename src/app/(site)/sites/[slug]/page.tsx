import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteDetailView } from "@/components/site-detail-view";
import { siteById, sites } from "@/data/nav";

export const instant = false;

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

  return {
    title: `${site.name} · 一为导航`,
    description: site.desc,
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
