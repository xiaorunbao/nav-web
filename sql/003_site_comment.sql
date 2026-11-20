-- 站点评论表：支持楼层回复、登录用户与游客评论
-- 字段风格与 nav_user / nav_site_event 保持一致（camelCase + 审计字段）

CREATE TABLE IF NOT EXISTS `nav_site_comment` (
  `id` varchar(32) NOT NULL,
  `siteId` varchar(32) NOT NULL,
  `parentId` varchar(32) DEFAULT NULL,
  `userId` varchar(32) DEFAULT NULL,
  `nickname` varchar(64) NOT NULL DEFAULT '',
  `email` varchar(255) DEFAULT NULL,
  `avatar` varchar(1024) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `badge` varchar(32) DEFAULT NULL,
  `content` varchar(2000) NOT NULL,
  `likeCount` int NOT NULL DEFAULT 0,
  `status` int NOT NULL DEFAULT 1,
  `createTime` datetime DEFAULT NULL,
  `createBy` varchar(64) DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `updateBy` varchar(64) DEFAULT NULL,
  `yn` int NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_nav_comment_site_time` (`siteId`, `createTime`),
  KEY `idx_nav_comment_parent` (`parentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
