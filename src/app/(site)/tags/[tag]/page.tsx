import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { SiteCard } from "@/components/site-card";
import { EmptyHint } from "@/components/empty-hint";
import { sites } from "@/data/nav";
import { allTags } from "@/lib/site";

export function generateStaticParams() {
  return allTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

function resolveTag(slug: string) {
  return decodeURIComponent(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = resolveTag(tag);
  return {
    title: `# ${name} · 一为导航`,
    description: `收录与「${name}」相关的优质站点入口。`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const name = resolveTag(tag);
  const matched = sites.filter(
    (site) => site.tags.includes(name) || site.subs.includes(name)
  );

  if (matched.length === 0) notFound();

  return (
    <div>
      <Link
        href="/iotags"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-brand"
      >
        <ArrowLeft className="size-3.5" />
        返回标签云
      </Link>

      <section className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
        <span className="flex size-10 items-center justify-center rounded-xl gradient-brand-soft text-brand ring-1 ring-brand/10">
          <Tag className="size-4.5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            # {name}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            共收录 {matched.length} 个相关站点
          </p>
        </div>
      </section>

      {matched.length === 0 ? (
        <div className="mt-4">
          <EmptyHint text="该标签下暂无站点" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {matched.map((site, index) => (
            <SiteCard key={site.id} site={site} rank={index < 3 ? index + 1 : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
