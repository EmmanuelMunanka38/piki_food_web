export function normalizePhone(phone) {
  let p = String(phone || "").replace(/[^\d]/g, "");
  if (p.startsWith("255")) return p;
  if (p.startsWith("0")) return `255${p.slice(1)}`;
  return p;
}

export const PAYMENT_METHODS = {
  mpesa: { label: "M-Pesa", available: true, ussd: true },
  tigo_pesa: { label: "Tigo Pesa", available: true, ussd: true },
  airtel_money: { label: "Airtel Money", available: true, ussd: true },
  mixx_by_yas: { label: "Mixx by Yas", available: true, ussd: true },
  halopesa: { label: "HaloPesa", available: true, ussd: true },
  card: { label: "Credit / Debit Card", available: false, ussd: false },
  cash: { label: "Cash on Delivery", available: true, ussd: false },
};
