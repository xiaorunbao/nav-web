-- 用户表：密码登录与 QQ / 微信 / 百度 / 微博 / Google / GitHub 登录共用
-- 字段风格与 nav-crawler 导出的 nav_* 表保持一致（camelCase + 审计字段）

CREATE TABLE IF NOT EXISTS `nav_user` (
  `id` varchar(32) NOT NULL,
  `provider` varchar(16) NOT NULL DEFAULT 'password',
  `openId` varchar(128) DEFAULT NULL,
  `unionId` varchar(128) DEFAULT NULL,
  `username` varchar(64) DEFAULT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) NOT NULL DEFAULT '',
  `avatar` varchar(1024) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT 1,
  `lastLoginTime` datetime DEFAULT NULL,
  `lastLoginIp` varchar(64) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `createBy` varchar(64) DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `updateBy` varchar(64) DEFAULT NULL,
  `yn` int NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nav_user_provider_openid` (`provider`, `openId`),
  UNIQUE KEY `uk_nav_user_username` (`username`),
  UNIQUE KEY `uk_nav_user_email` (`email`),
  KEY `idx_nav_user_status` (`status`, `yn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
