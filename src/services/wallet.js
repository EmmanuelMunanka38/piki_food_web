import { api } from "../lib/api";

export const walletService = {
  getWallet(restaurantId) {
    return api.get(`/wallets?restaurantId=${restaurantId}`).then((r) => r.data);
  },

  addAccount(payload) {
    return api.post("/wallets/accounts", payload).then((r) => r.data);
  },

  removeAccount(accountId, walletId) {
    return api.delete(`/wallets/accounts/${accountId}?walletId=${walletId}`);
  },

  getWithdrawals(walletId) {
    return api.get(`/wallets/withdrawals?walletId=${walletId}`).then((r) => r.data || []);
  },

  requestWithdrawal(payload) {
    return api.post("/wallets/withdrawals", payload).then((r) => r.data);
  },
};
