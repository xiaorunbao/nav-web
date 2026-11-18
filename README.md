# 一为导航 · 设计师网址导航（前端原型）

以 [nav.iowen.cn](https://nav.iowen.cn/) 为参考复刻的可交互前端原型，包含首页分类导航与次级导航快捷面板两个页面。

## 技术栈

- Next.js 16（App Router / Turbopack）
- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui（Radix 基础组件）
- Zustand（主题、收藏、最近访问、侧栏折叠、紧凑模式持久化）

## 本地运行

包管理器统一使用 **pnpm**（版本由 `package.json` 的 `packageManager` 字段锁定，依赖全部为精确版本，请勿混用 npm/yarn）。

```bash
cd web
pnpm install
pnpm dev --port 3100
```

打开 <http://localhost:3100>。

生产构建与预览：

```bash
pnpm build
pnpm start --port 3100
```

> 依赖安装请使用 `pnpm install --frozen-lockfile`，以确保与 `pnpm-lock.yaml` 完全一致；升级依赖时显式指定版本（如 `pnpm add next@16.4.7`），不要使用 `^`/`~` 范围。

## 页面与功能

### `/` 首页

- 固定头部：Logo、导航、全局搜索、深浅色切换、登录 / 开通会员
- 左侧分类树：9 个分类，可展开子分类并定位到区块
- 紫渐变搜索 Banner：站内 / 百度 / Google / Bing / 知乎 / GitHub 引擎切换、热门词、收录统计
- 热门网址 TOP 8：按浏览量排序，带排名角标
- 9 个分类区块：子分类标签筛选、折叠 / 展开、卡片详情
- 页脚与悬浮工具（AI 入口、回到顶部）

### `/secondary` 次级导航

- 「次级导航 · 一屏直达」Hero 与收录统计
- 3 张精选渐变卡 + 右栏热门榜
- 六个快捷面板（共 81 个入口），每个面板支持标签页切换
- 紧凑模式开关
- 侧栏仅展示存在对应面板的分类，避免无效跳转

### 通用交互

- 全局搜索弹窗：热门搜索、大家都在看、实时过滤、Enter 打开详情
- 站点详情抽屉：图标、域名、访问 / 收藏、浏览量、分类、标签、相似站点
- 收藏 / 最近访问、深浅色主题、侧栏折叠，均通过 Zustand 持久化（`nav-ui`）
- 响应式布局，移动端折叠为汉堡菜单与单列卡片

## 目录结构

```
web/
├─ public/logo.png                 # 站点 Logo
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                # 根布局、主题预置、Tooltip / Store 水合
│  │  ├─ globals.css               # 主题变量与工具类
│  │  └─ (site)/
│  │     ├─ page.tsx               # 首页
│  │     └─ secondary/page.tsx      # 次级导航
│  ├─ components/                  # 头部、侧栏、Hero、卡片、抽屉、弹窗、面板等
│  ├─ data/nav.ts                  # 104 个站点、9 个区块、6 个面板
│  └─ lib/
│     ├─ store.ts                  # Zustand 状态与持久化
│     ├─ search.ts                 # 搜索评分
│     └─ utils.ts                  # cn 等工具
└─ next.config.ts
```

## 数据说明

- 站点数据整理自参考站公开页面（首页、次级页及 6 个分类页），另补充书籍期刊与软件游戏条目，共 **104 个唯一站点**。
- `src/data/nav.ts` 由抓取脚本生成，脚本位于项目上级目录：`../.tmp-ref/gen.mjs`。需要调整数据时请修改脚本后重新生成，不要直接手改数据文件。
- 图标来自 `https://favicon.im/<域名>`，部分站点无有效图标时会显示默认占位图。
- 所有内容仅用于界面与交互演示。

## 说明

- 开发模式下 Next.js 左下角的 Issues 浮标仅用于开发调试，生产构建不会出现。
- 页面样式在 OneNav 主题基础上强化品牌感：品牌红橙渐变 `#ff8a4c → #f1404b → #d92d3a`、紫渐变 Hero、冷灰底白卡、分类图标与深色模式统一色板。