-- 005：为既有 nav_site_submission 表补齐付费 / 审核字段（可重复执行）
-- 旧库由 004 建表后补列；新库 004 已包含这些列，这里逐列判断后跳过。

SET @schema := DATABASE();

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'nav_site_submission' AND COLUMN_NAME = 'paymentStatus');
SET @sql := IF(@col = 0,
  'ALTER TABLE `nav_site_submission` ADD COLUMN `paymentStatus` varchar(16) NOT NULL DEFAULT ''not_required'' AFTER `status`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'nav_site_submission' AND COLUMN_NAME = 'paymentAmount');
SET @sql := IF(@col = 0,
  'ALTER TABLE `nav_site_submission` ADD COLUMN `paymentAmount` decimal(10,2) DEFAULT NULL AFTER `paymentStatus`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'nav_site_submission' AND COLUMN_NAME = 'paymentOrderNo');
SET @sql := IF(@col = 0,
  'ALTER TABLE `nav_site_submission` ADD COLUMN `paymentOrderNo` varchar(64) DEFAULT NULL AFTER `paymentAmount`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'nav_site_submission' AND COLUMN_NAME = 'paidTime');
SET @sql := IF(@col = 0,
  'ALTER TABLE `nav_site_submission` ADD COLUMN `paidTime` datetime DEFAULT NULL AFTER `paymentOrderNo`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'nav_site_submission' AND COLUMN_NAME = 'approveTime');
SET @sql := IF(@col = 0,
  'ALTER TABLE `nav_site_submission` ADD COLUMN `approveTime` datetime DEFAULT NULL AFTER `paidTime`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'nav_site_submission' AND COLUMN_NAME = 'approveBy');
SET @sql := IF(@col = 0,
  'ALTER TABLE `nav_site_submission` ADD COLUMN `approveBy` varchar(64) DEFAULT NULL AFTER `approveTime`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'nav_site_submission' AND COLUMN_NAME = 'rejectReason');
SET @sql := IF(@col = 0,
  'ALTER TABLE `nav_site_submission` ADD COLUMN `rejectReason` varchar(500) DEFAULT NULL AFTER `approveBy`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
