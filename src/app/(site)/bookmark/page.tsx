import type { Metadata } from "next";
import { BookmarkView } from "@/components/bookmark-view";

export const metadata: Metadata = {
  title: "我的书签 · 一为导航",
  description: "收藏的站点与最近访问记录，本地保存的个人快捷书签页。",
};

export default function BookmarkPage() {
  return <BookmarkView />;
}
