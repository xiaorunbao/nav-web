# 一为导航 · 设计师网址导航（前端原型）

以 [nav.iowen.cn](https://nav.iowen.cn/) 为参考复刻的可交互前端原型，包含首页分类导航、次级导航快捷面板、站点详情、排行榜、标签云、独立搜索结果页与外链中转等页面。

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

### `/login` 登录

- 参照参考站登录页复刻：紫色渐变背景、左侧品牌介绍、右侧登录表单
- 用户名或邮箱 + 密码 + 记住登录信息，支持密码显隐
- 用户统一存储在本地 Docker MySQL 的 `nav` 库 `nav_user` 表；演示账号 `demo` / `demo1234` 由 `npm run db:init` 写入
- 登录由 Server Action 在服务端校验：按用户名/邮箱查询 `provider='password'` 用户，用 scrypt 校验密码后再写入 HMAC 签名的 HttpOnly 会话 Cookie（`nav_session`）；勾选“记住登录信息”有效期 30 天，否则为会话 Cookie
- 社交账号登录：QQ、微信、百度、微博、Google、GitHub 六个入口，统一走 `/api/auth/{provider}` 的 OAuth 2.0 授权码流程；回调成功后按 `(provider, openId)` upsert 到 `nav_user`，重复登录只更新昵称、头像和登录时间

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
- 头部展示登录态：未登录显示“登录”，已登录显示用户名与账号菜单（含退出登录）
- 响应式布局，移动端折叠为汉堡菜单与单列卡片

### `/about` 关于

- 站点规模统计、数据来源与内容原则说明
- 技术栈与更新日志（`#changelog`）、意见反馈（`#feedback`）

### `/submit` 投稿收录

- 投稿流程三步说明与收录标准
- 投稿表单：必填校验、地址需 http(s)、分类下拉取自首页分类，提交后展示原型提示

### `/rankings` 排行榜

- 内容类型（网址 / 文章 / 软件 / 书籍）× 时间周期（日榜 / 周榜 / 月榜 / 总榜）双 Tab 切换
- 复用站点卡片并带 1 / 2 / 3 名红橙黄排名角标；红色渐变 Hero 与收录统计

### `/iotags` 标签云墙

- 顶部统计卡：收录标签数、收录站点数、精选分类数
- 标签按出现频次分档字号，点击进入对应标签聚合页

### `/tags/[tag]` 标签聚合

- 按标签聚合全部相关站点，标题与摘要按标签生成元信息
- 静态参数由全部标签生成，未命中标签走 404 兜底

### `/search` 独立搜索结果页

- 读取 `?s=` 参数，类型 Tab（网址 / 文章 / 软件 / 书籍）过滤，热门搜索词直达
- 复用站内搜索评分排序，无结果时展示空态提示

### `/go` 外链中转与点击统计

- 站点卡片、详情页、抽屉的出站链接统一走 `/go?url=<编码地址>`，仅放行 http / https，非法协议返回 400
- 进程内存内记录各目标地址点击量（重启清零，待接入数据库落库）

### 站点详情页 SEO / OG

- 三段式标题（站点名官网 - 站点名 - 简介）、description、keywords 与完整 openGraph（标题 / 描述 / 绝对地址 / 站点名 / 图标 / 类型）
- 信息网格展示网站地址、所属分类、所在地、收录时间；指标行含更新时间、浏览、评论、收藏

### 导航入口说明

- 头部导航落地入口：快速筛选（`/iotags`）、次级导航（`/secondary`）、排行榜（`/rankings`）、关于（`/about`）、投稿收录（`/submit`）
- 登录已接入数据库用户体系（`nav_user`），入口为 `/login`；开通会员仍为原型占位，点击弹出“尚未接入”说明
- 分类侧栏只在首页与次级导航渲染，避免在没有分类锚点的页面出现无效跳转

## 登录与数据库配置

账号密码登录与 QQ 登录的用户都落在 `nav-crawler` 已在用的本地 Docker MySQL：容器 `nav-mysql`（宿主端口 `3307`），数据库 `nav`，应用账号 `nav_app`。

首次使用先初始化用户表（可重复执行，会重置演示账号密码）：

```bash
cd nav-web
npm run db:init
```

该命令按文件名顺序执行 `sql/*.sql`，创建 `nav_user` 表，再用 scrypt 生成密码摘要并 upsert 演示账号。`nav_user` 与爬虫表保持同一套风格：`id varchar(32)` 主键、camelCase 字段、`createTime/createBy/updateTime/updateBy/yn` 审计字段。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `NAV_AUTH_SECRET` | 会话 Cookie 的 HMAC 签名密钥，生产环境务必修改 | `nav-web-demo-secret-change-me` |
| `NAV_DEMO_ACCOUNT` | 初始化时写入的演示账号 | `demo` |
| `NAV_DEMO_PASSWORD` | 演示密码（仅以 scrypt 摘要落库） | `demo1234` |
| `APP_URL` | 站点对外地址，用于生成 OAuth 回调；本地开发可留空 | 请求 origin |
| `MYSQL_HOST` | MySQL 主机 | `127.0.0.1` |
| `MYSQL_PORT` | MySQL 端口 | `3307` |
| `MYSQL_DATABASE` | 数据库名 | `nav` |
| `MYSQL_USER` | 应用账号 | `nav_app` |
| `MYSQL_PASSWORD` | 应用账号密码 | `nav_app_pwd` |
| `DATABASE_URL` | 可选，完整连接串，设置后覆盖上面的 `MYSQL_*` 分项 | 空 |
| `QQ_CLIENT_ID` / `QQ_CLIENT_SECRET` | QQ 互联应用 App ID / App Key | 空 |
| `WECHAT_CLIENT_ID` / `WECHAT_CLIENT_SECRET` | 微信开放平台网站应用 AppID / AppSecret | 空 |
| `BAIDU_CLIENT_ID` / `BAIDU_CLIENT_SECRET` | 百度开放平台 API Key / Secret Key | 空 |
| `WEIBO_CLIENT_ID` / `WEIBO_CLIENT_SECRET` | 微博开放平台 App Key / App Secret | 空 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client ID / Client Secret | 空 |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client ID / Client Secret | 空 |

每个平台还可以单独用 `<PROVIDER>_REDIRECT_URI` 覆盖回调地址，例如 `QQ_REDIRECT_URI`、`GITHUB_REDIRECT_URI`。不配置时默认使用：

```text
{APP_URL 或请求 origin}/api/auth/{provider}/callback
```

六个回调地址分别是 `/api/auth/qq/callback`、`/api/auth/wechat/callback`、`/api/auth/baidu/callback`、`/api/auth/weibo/callback`、`/api/auth/google/callback`、`/api/auth/github/callback`，必须与各平台后台登记的回调地址完全一致。

`nav_user` 关键字段：

| 字段 | 说明 |
| --- | --- |
| `provider` | `password`、`qq`、`wechat`、`baidu`、`weibo`、`google`、`github` |
| `openId` / `unionId` | QQ openid / unionid，`(provider, openId)` 唯一 |
| `username` / `passwordHash` | 密码登录账号与 scrypt 摘要，`username` 唯一 |
| `nickname` / `avatar` / `email` | 昵称、QQ 头像、邮箱 |
| `status` / `yn` | 1 为正常；登录查询同时校验 `status=1 AND yn=1` |
| `lastLoginTime` / `lastLoginIp` | 每次密码登录或 QQ 回调都会更新 |

> 登录页展示六个社交入口，但只有在配置了对应平台的 ID/Secret 后才可用；未配置时点击会回到登录页并提示缺少的环境变量，不会发起无效授权。
>
> 各平台实现：QQ 走 `graph.qq.com` OAuth 2.0；微信走开放平台「网站应用」`qrconnect` 扫码登录（原型中的 `dyh.php` 是公众号扫码，需要额外的二维码轮询流程，不在本实现内）；百度、微博走各自开放平台 OAuth 2.0；Google 走 OpenID Connect；GitHub 走 OAuth App。
>
> 本地 `localhost` 回调通常只适用于 Google / GitHub 等允许 localhost 的平台；QQ、微信、百度、微博一般需要公网 HTTPS 域名，可先用 HTTPS 隧道联调。
>
> 发起授权时会写入 10 分钟有效的 HttpOnly `nav_oauth_state / nav_oauth_provider / nav_oauth_redirect` Cookie，回调同时校验 state 和 provider，防止 CSRF 与串号。
>
> 会话 Cookie 只保存签名后的 user id、昵称与账号标识，不保存密码；社交用户首次登录自动建号，之后按 `(provider, openId)` 复用同一条记录。

## 目录结构

```
web/
├─ public/logo.png                 # 站点 Logo
├─ sql/001_nav_user.sql            # 用户表 DDL
├─ scripts/init-db.mjs             # 建表 + 演示账号初始化
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                # 根布局、主题预置、Tooltip / Store 水合
│  │  ├─ globals.css               # 主题变量与工具类
│  │  ├─ login/
│  │  │  ├─ page.tsx               # 登录页
│  │  │  └─ actions.ts             # 登录 / 退出 Server Action
│  │  ├─ api/auth/                 # 会话查询、六个社交平台的授权与回调
│  │  └─ (site)/
│  │     ├─ page.tsx               # 首页
│  │     ├─ secondary/page.tsx      # 次级导航
│  │     ├─ sites/[slug]/page.tsx   # 站点详情（含 SEO / OG 元信息）
│  │     ├─ rankings/page.tsx       # 排行榜（类型 × 周期）
│  │     ├─ iotags/page.tsx         # 标签云墙
│  │     ├─ tags/[tag]/page.tsx     # 标签聚合
│  │     ├─ search/page.tsx        # 独立搜索结果页
│  │     ├─ go/route.ts            # 外链中转 + 内存点击统计
│  │     ├─ about/page.tsx          # 关于与更新日志
│  │     └─ submit/page.tsx         # 投稿收录
│  ├─ components/                  # 头部、侧栏、Hero、卡片、抽屉、弹窗、登录页等
│  ├─ data/nav.ts                  # 104 个站点、9 个区块、6 个面板
│  └─ lib/
│     ├─ auth.ts                   # 会话签名、Cookie 与客户端 IP
│     ├─ auth-shared.ts            # 登录用户类型
│     ├─ db.ts                     # MySQL 连接池
│     ├─ oauth.ts                  # 六个平台的授权地址与用户资料换取
│     ├─ oauth-shared.ts           # 社交平台 ID、名称与环境变量名
│     ├─ password.ts               # scrypt 哈希与校验
│     ├─ users.ts                  # nav_user 用户仓储
│     ├─ store.ts                  # Zustand 状态与持久化
│     ├─ search.ts                 # 搜索评分
│     ├─ site.ts                  # 站点元信息派生、中转链接、标签聚合与排序
│     └─ utils.ts                  # cn 等工具
└─ next.config.ts
```

## 数据说明

- 站点数据整理自参考站公开页面（首页、次级页及 6 个分类页），另补充书籍期刊与软件游戏条目，共 **104 个唯一站点**。
- `src/data/nav.ts` 由抓取脚本生成，脚本位于项目上级目录：`../.tmp-ref/gen.mjs`。需要调整数据时请修改脚本后重新生成，不要直接手改数据文件。
- 图标来自 `https://favicon.im/<域名>`，部分站点无有效图标时会显示默认占位图。
- 详情页展示的所在地、收录时间、更新时间、评论数等演示字段由 `src/lib/site.ts` 按站点 id 确定性派生，刷新后稳定一致；接入真实数据库后可直接替换为字段读取。
- 所有内容仅用于界面与交互演示。

## 说明

- 开发模式下 Next.js 左下角的 Issues 浮标仅用于开发调试，生产构建不会出现。
- 页面样式在 OneNav 主题基础上强化品牌感：品牌红橙渐变 `#ff8a4c → #f1404b → #d92d3a`、紫渐变 Hero、冷灰底白卡、分类图标与深色模式统一色板。