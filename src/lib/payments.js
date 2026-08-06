export function normalizePhone(phone) {
  let p = String(phone || "").replace(/[^\d]/g, "");
  if (p.startsWith("255")) return p;
  if (p.startsWith("0")) return `255${p.slice(1)}`;
  return p;
}

export const PAYMENT_METHODS = {
  mpesa: { label: "M-Pesa", available: false, ussd: true, logo: "/Mpesa.png" },
  airtel_money: { label: "Airtel Money", available: true, ussd: true, logo: "/airtelmoney.png" },
  mixx_by_yas: { label: "Mixx by Yas", available: true, ussd: true, logo: "/mixxby%20yas.png" },
  halopesa: { label: "HaloPesa", available: true, ussd: true, logo: "/halopesa.png" },
  card: { label: "Credit / Debit Card", available: false, ussd: false },
  cash: { label: "Cash on Delivery", available: true, ussd: false },
};
