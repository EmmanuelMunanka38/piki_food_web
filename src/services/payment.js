import { api } from "../lib/api";

export const paymentService = {
  async initiateUSSDPush({ orderId, amount, phoneNumber, currency = "TZS" }) {
    const res = await api.post("/payments/checkout", {
      orderId,
      amount,
      phoneNumber,
      currency,
    });
    return res.data;
  },

  async getTransactionStatus(orderReference) {
    const res = await api.get(`/payments/transaction/${orderReference}`);
    return res.data;
  },
};
