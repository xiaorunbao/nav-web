-- 站点投稿表：站长/用户提交收录申请，付费（可选）后人工审核收录
-- 字段风格与 nav_user / nav_site_event 保持一致（camelCase + 审计字段）

CREATE TABLE IF NOT EXISTS `nav_site_submission` (
  `id` varchar(32) NOT NULL,
  `name` varchar(128) NOT NULL,
  `url` varchar(1024) NOT NULL,
  `category` varchar(64) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `status` varchar(16) NOT NULL DEFAULT 'pending',
  `paymentStatus` varchar(16) NOT NULL DEFAULT 'not_required',
  `paymentAmount` decimal(10,2) DEFAULT NULL,
  `paymentOrderNo` varchar(64) DEFAULT NULL,
  `paidTime` datetime DEFAULT NULL,
  `approveTime` datetime DEFAULT NULL,
  `approveBy` varchar(64) DEFAULT NULL,
  `rejectReason` varchar(500) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `createBy` varchar(64) DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `updateBy` varchar(64) DEFAULT NULL,
  `yn` int NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_nav_submission_status` (`status`, `yn`),
  KEY `idx_nav_submission_payment` (`paymentStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
