import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // cacheComponents / partialPrefetching 为 Next 实验特性，与 `instant` 段配置绑定；
  // 当前原型站点采用标准 RSC 静态导出，关闭以避免详情页等 client 页面在静态预渲染时
  // 触发 "Render in Browser" bailout。后续接入服务端数据后可再评估开启。
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
