-- 站点访问埋点：事件明细 + 按日聚合
-- 字段风格与 nav_user / nav-crawler 导出表保持一致（camelCase + 审计字段）

-- 事件明细表：每一次点击中转（visit）或详情页浏览（view）落一条记录
CREATE TABLE IF NOT EXISTS `nav_site_event` (
  `id` varchar(32) NOT NULL,
  `siteId` varchar(32) NOT NULL,
  `eventType` varchar(16) NOT NULL DEFAULT 'visit',
  `channel` varchar(16) DEFAULT NULL,
  `referer` varchar(1024) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `userAgent` varchar(512) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `createBy` varchar(64) DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `updateBy` varchar(64) DEFAULT NULL,
  `yn` int NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_nav_site_event_site_time` (`siteId`, `createTime`),
  KEY `idx_nav_site_event_type_time` (`eventType`, `createTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 日聚合表：按站点 × 日期累加，加速近 30 天趋势图与周期榜单查询
CREATE TABLE IF NOT EXISTS `nav_site_daily` (
  `id` varchar(32) NOT NULL,
  `siteId` varchar(32) NOT NULL,
  `statDate` date NOT NULL,
  `visitCount` int NOT NULL DEFAULT 0,
  `viewCount` int NOT NULL DEFAULT 0,
  `createTime` datetime DEFAULT NULL,
  `createBy` varchar(64) DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `updateBy` varchar(64) DEFAULT NULL,
  `yn` int NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nav_site_daily_site_date` (`siteId`, `statDate`),
  KEY `idx_nav_site_daily_date` (`statDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
