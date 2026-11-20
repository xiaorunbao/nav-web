/**
 * 投稿付费环节配置：由环境变量自由开关。
 * NAV_PAYMENT_ENABLED=true 时投稿先生成待支付订单，支付完成后才可被审核收录；
 * 关闭（默认）时投稿直接进入待审核，不产生费用记录。
 */

export function isPaymentEnabled(): boolean {
  const flag = process.env.NAV_PAYMENT_ENABLED;
  return flag === "true" || flag === "1" || flag === "yes" || flag === "on";
}

/** 付费金额（字符串，保留两位小数）；开关关闭或金额非法时返回 null。 */
export function getPaymentAmount(): string | null {
  if (!isPaymentEnabled()) return null;
  const amount = Number(process.env.NAV_PAYMENT_AMOUNT);
  return Number.isFinite(amount) && amount > 0 ? amount.toFixed(2) : null;
}

export function getPaymentConfig() {
  return {
    enabled: isPaymentEnabled(),
    amount: getPaymentAmount(),
    currency: "CNY",
  };
}
