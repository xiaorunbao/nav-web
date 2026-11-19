import type { Metadata } from "next";
import { SearchResults } from "./search-results";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}): Promise<Metadata> {
  const { s } = await searchParams;
  const query = (s ?? "").trim();
  return {
    title: query ? `“${query}”的搜索结果 · 一为导航` : "搜索 · 一为导航",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  return <SearchResults initialQuery={s ?? ""} />;
}
