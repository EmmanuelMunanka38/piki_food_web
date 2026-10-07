import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Loader2,
  Plus,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Smartphone,
  Check,
  X,
  AlertCircle,
  Store,
  CreditCard,
  Landmark,
} from "lucide-react";
import { useMyRestaurant } from "../../hooks/restaurantQueries";
import { walletService } from "../../services/wallet";
import { formatTZS, formatDate } from "../../lib/format";
import { PAYMENT_METHODS, normalizePhone } from "../../lib/payments";

const PROVIDERS = [
  { key: "mpesa", label: "M-Pesa", logo: PAYMENT_METHODS.mpesa?.logo },
  { key: "tigo_pesa", label: "Tigo Pesa", logo: null },
  { key: "airtel_money", label: "Airtel Money", logo: PAYMENT_METHODS.airtel_money?.logo },
  { key: "mixx_by_yas", label: "Mixx by Yas", logo: PAYMENT_METHODS.mixx_by_yas?.logo },
  { key: "halopesa", label: "HaloPesa", logo: PAYMENT_METHODS.halopesa?.logo },
];

const TX_LABELS = {
  ORDER_PAYMENT: "Order payment",
  DELIVERY_EARNING: "Delivery earning",
  WITHDRAWAL: "Withdrawal",
  PLATFORM_FEE: "Platform fee",
  REFUND: "Refund",
  TOP_UP: "Top-up",
};

const WITHDRAWAL_STATUS = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  PROCESSING: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  FAILED: { label: "Failed", className: "bg-red-100 text-red-700" },
};

function providerMeta(key) {
  return PROVIDERS.find((p) => p.key === key) || { key, label: key, logo: null };
}

function withdrawalMeta(status) {
  return WITHDRAWAL_STATUS[status] || { label: status || "Unknown", className: "bg-gray-100 text-gray-700" };
}

export default function WalletPage() {
  const qc = useQueryClient();
  const { data: restaurant, isLoading: rLoading } = useMyRestaurant();

  const [accountOpen, setAccountOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [accountForm, setAccountForm] = useState({ provider: "mpesa", accountName: "", phoneNumber: "" });
  const [payoutForm, setPayoutForm] = useState({ accountId: "", amount: "" });
  const [error, setError] = useState("");
  const [payoutError, setPayoutError] = useState("");

  const { data: wallet, isLoading: wLoading } = useQuery({
    queryKey: ["wallet", restaurant?.id],
    queryFn: () => walletService.getWallet(restaurant.id),
    enabled: Boolean(restaurant?.id),
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ["wallet", wallet?.id, "withdrawals"],
    queryFn: () => walletService.getWithdrawals(wallet.id),
    enabled: Boolean(wallet?.id),
  });

  const addAccount = useMutation({
    mutationFn: (payload) => walletService.addAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet", restaurant?.id] });
      setAccountOpen(false);
      setAccountForm({ provider: "mpesa", accountName: "", phoneNumber: "" });
      setError("");
    },
    onError: (err) => setError(err?.message || "Failed to add payout account"),
  });

  const removeAccount = useMutation({
    mutationFn: ({ accountId, walletId }) => walletService.removeAccount(accountId, walletId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wallet", restaurant?.id] }),
  });

  const requestPayout = useMutation({
    mutationFn: (payload) => walletService.requestWithdrawal(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet", restaurant?.id] });
      qc.invalidateQueries({ queryKey: ["wallet", wallet?.id, "withdrawals"] });
      setPayoutOpen(false);
      setPayoutForm({ accountId: "", amount: "" });
      setPayoutError("");
    },
    onError: (err) => setPayoutError(err?.message || "Failed to request payout"),
  });

  if (rLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="py-16">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 text-center px-8 py-14">
          <div className="w-16 h-16 bg-primary-light flex items-center justify-center mx-auto mb-5">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
            Set up your restaurant
          </h2>
          <p className="text-gray-500">
            You need a restaurant before you can receive and withdraw earnings.
          </p>
        </div>
      </div>
    );
  }

  const accounts = wallet?.mobileMoneyAccounts || [];
  const ledger = wallet?.ledgerEntries || [];
  const balanceCents = Number(wallet?.balance) || 0;
  const pendingCents = withdrawals
    .filter((w) => w.status === "PENDING" || w.status === "PROCESSING")
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
  const withdrawnCents = withdrawals
    .filter((w) => w.status === "COMPLETED")
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

  const openPayout = () => {
    setPayoutError("");
    setPayoutForm({
      accountId: accounts.find((a) => a.isPrimary)?.id || accounts[0]?.id || "",
      amount: "",
    });
    setPayoutOpen(true);
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    setError("");
    if (!accountForm.accountName.trim()) {
      setError("Please enter the account holder's name.");
      return;
    }
    if (!accountForm.phoneNumber.trim()) {
      setError("Please enter the mobile money phone number.");
      return;
    }
    addAccount.mutate({
      walletId: wallet.id,
      provider: accountForm.provider,
      accountName: accountForm.accountName.trim(),
      phoneNumber: normalizePhone(accountForm.phoneNumber),
      isPrimary: accounts.length === 0,
    });
  };

  const handlePayout = (e) => {
    e.preventDefault();
    setPayoutError("");
    const tzs = Number(payoutForm.amount);
    if (!tzs || tzs <= 0) {
      setPayoutError("Please enter a valid amount.");
      return;
    }
    const amountInCents = Math.round(tzs * 100);
    if (!payoutForm.accountId) {
      setPayoutError("Please add and select a payout account.");
      return;
    }
    if (amountInCents > balanceCents) {
      setPayoutError("Amount exceeds your available balance.");
      return;
    }
    requestPayout.mutate({
      walletId: wallet.id,
      mobileMoneyAccountId: payoutForm.accountId,
      amountInCents,
    });
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
          Wallet
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Your earnings live here. Withdraw to your mobile money account anytime.
        </p>
      </div>

      <div className="bg-white border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Wallet className="w-4 h-4 text-primary" />
            Available balance
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-dark font-[family-name:var(--font-heading)]">
            {wLoading ? "—" : formatTZS(balanceCents / 100)}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 text-xs text-gray-400">
            <span>
              Pending payout: <span className="font-semibold text-dark">{formatTZS(pendingCents / 100)}</span>
            </span>
            <span>
              Total withdrawn: <span className="font-semibold text-dark">{formatTZS(withdrawnCents / 100)}</span>
            </span>
          </div>
        </div>
        <button
          onClick={openPayout}
          disabled={wLoading || !wallet || accounts.length === 0}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Landmark className="w-4 h-4" />
          Request payout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-dark font-[family-name:var(--font-heading)]">Payout accounts</h3>
            <button
              onClick={() => {
                setError("");
                setAccountForm({ provider: "mpesa", accountName: "", phoneNumber: "" });
                setAccountOpen(true);
              }}
              disabled={!wallet}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer disabled:opacity-60"
            >
              <Plus className="w-4 h-4" /> Add account
            </button>
          </div>
          {accounts.length === 0 ? (
            <p className="px-5 py-10 text-center text-gray-400 text-sm">
              No payout account yet. Add a mobile money account to withdraw your earnings.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {accounts.map((a) => {
                const meta = providerMeta(a.provider);
                return (
                  <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                    {meta.logo ? (
                      <img src={meta.logo} alt={meta.label} className="w-9 h-9 object-contain shrink-0" />
                    ) : (
                      <div className="w-9 h-9 bg-gray-100 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-dark truncate">{meta.label}</p>
                        {a.isPrimary && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary-light px-1.5 py-0.5">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {a.phoneNumber} · {a.accountName}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAccount.mutate({ accountId: a.id, walletId: wallet.id })}
                      disabled={removeAccount.isPending}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
                      aria-label="Remove account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="bg-white border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-dark font-[family-name:var(--font-heading)]">Payout history</h3>
          </div>
          {withdrawals.length === 0 ? (
            <p className="px-5 py-10 text-center text-gray-400 text-sm">No payouts yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {withdrawals.map((w) => {
                const meta = withdrawalMeta(w.status);
                const accMeta = providerMeta(w.mobileMoneyAccount?.provider);
                return (
                  <li key={w.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark">{formatTZS((Number(w.amount) || 0) / 100)}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {accMeta.label} · {w.mobileMoneyAccount?.phoneNumber || ""}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(w.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 ${meta.className}`}>{meta.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="bg-white border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-dark font-[family-name:var(--font-heading)]">Recent transactions</h3>
        </div>
        {ledger.length === 0 ? (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {ledger.map((entry) => {
              const credit = entry.direction === "CREDIT";
              const type = entry.transaction?.type || "ORDER_PAYMENT";
              return (
                <li key={entry.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className={`w-9 h-9 flex items-center justify-center shrink-0 ${
                      credit ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {credit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark">{TX_LABELS[type] || type}</p>
                    <p className="text-xs text-gray-400">{formatDate(entry.createdAt)}</p>
                  </div>
                  <span className={`text-sm font-bold ${credit ? "text-green-700" : "text-dark"}`}>
                    {credit ? "+" : "-"}
                    {formatTZS((Number(entry.amount) || 0) / 100)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <AnimatePresence>
        {accountOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[80]"
              onClick={() => !addAccount.isPending && setAccountOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white z-[90] shadow-2xl"
            >
              <form onSubmit={handleAddAccount} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
                    Add payout account
                  </h2>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    disabled={addAccount.isPending}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PROVIDERS.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => setAccountForm((f) => ({ ...f, provider: p.key }))}
                          className={`flex items-center gap-2 px-3 py-2.5 border text-sm font-medium transition-colors duration-200 cursor-pointer ${
                            accountForm.provider === p.key
                              ? "border-primary bg-primary-light text-primary"
                              : "border-gray-200 text-dark/70 hover:border-primary"
                          }`}
                        >
                          {p.logo ? (
                            <img src={p.logo} alt={p.label} className="w-6 h-6 object-contain" />
                          ) : (
                            <Smartphone className="w-4 h-4" />
                          )}
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Account holder name</label>
                    <input
                      type="text"
                      value={accountForm.accountName}
                      onChange={(e) => setAccountForm((f) => ({ ...f, accountName: e.target.value }))}
                      placeholder="Name on the SIM card"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                    <input
                      type="tel"
                      value={accountForm.phoneNumber}
                      onChange={(e) => setAccountForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                      placeholder="+255 712 345 678"
                      className={inputClass}
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={addAccount.isPending}
                    className="w-full py-3 bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {addAccount.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Save account
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {payoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[80]"
              onClick={() => !requestPayout.isPending && setPayoutOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white z-[90] shadow-2xl"
            >
              <form onSubmit={handlePayout} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
                    Request payout
                  </h2>
                  <button
                    type="button"
                    onClick={() => setPayoutOpen(false)}
                    disabled={requestPayout.isPending}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 mb-5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Available balance</span>
                  <span className="text-lg font-extrabold text-dark font-[family-name:var(--font-heading)]">
                    {formatTZS(balanceCents / 100)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Payout account</label>
                    <select
                      value={payoutForm.accountId}
                      onChange={(e) => setPayoutForm((f) => ({ ...f, accountId: e.target.value }))}
                      className={inputClass}
                    >
                      {accounts.map((a) => {
                        const meta = providerMeta(a.provider);
                        return (
                          <option key={a.id} value={a.id}>
                            {meta.label} · {a.phoneNumber}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (TSh)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">TSh</span>
                      <input
                        type="number"
                        min="1"
                        value={payoutForm.amount}
                        onChange={(e) => setPayoutForm((f) => ({ ...f, amount: e.target.value }))}
                        placeholder="50000"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      You'll receive a prompt on the selected number to confirm the payout.
                    </p>
                  </div>

                  {payoutError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      {payoutError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={requestPayout.isPending}
                    className="w-full py-3 bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {requestPayout.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Requesting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> Request payout
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
