import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreHydrator } from "@/components/store-hydrator";

export const metadata: Metadata = {
  title: "一为导航 · 设计师网址导航（原型）",
  description:
    "收集国内外优秀设计网站、UI 设计资源、灵感创意与素材资源，一款基于 Next.js + shadcn/ui + Zustand 的导航站原型。",
};

const themeScript = `(function(){try{var raw=localStorage.getItem("nav-ui");var s=raw?JSON.parse(raw):{};var t=s&&s.state&&s.state.theme;if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <TooltipProvider delayDuration={200}>
          <StoreHydrator />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
