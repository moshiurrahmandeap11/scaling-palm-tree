"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IWithdrawal, PaymentSystem } from "@/lib/types";
import { CREDITS_PER_DOLLAR_WITHDRAWAL, MIN_WITHDRAWAL_CREDITS } from "@/lib/constants";
import { toast } from "react-hot-toast";

const SYSTEMS: PaymentSystem[] = ["Stripe", "Bkash", "Rocket", "Nagad", "Other"];

export default function Withdrawals() {
  const [info, setInfo] = useState<{
    totalRaised: number;
    pendingCredits: number;
    availableRaised: number;
    withdrawalAmount: number;
    eligible: boolean;
  } | null>(null);
  const [history, setHistory] = useState<IWithdrawal[]>([]);
  const [form, setForm] = useState({
    withdrawalCredit: "",
    paymentSystem: "Stripe" as PaymentSystem,
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.get<{ info: {
      totalRaised: number;
      pendingCredits: number;
      availableRaised: number;
      withdrawalAmount: number;
      eligible: boolean;
    } }>("/withdrawals/info").then((r) => setInfo(r.info));
    api.get<{ withdrawals: IWithdrawal[] }>("/withdrawals/my").then((r) => setHistory(r.withdrawals));
  };
  useEffect(load, []);

  const credit = Number(form.withdrawalCredit) || 0;
  const amount = (credit / CREDITS_PER_DOLLAR_WITHDRAWAL).toFixed(2);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/withdrawals/request", {
        withdrawalCredit: credit,
        paymentSystem: form.paymentSystem,
        accountNumber: form.accountNumber,
      });
      toast.success("Withdrawal request submitted.");
      setForm({ withdrawalCredit: "", paymentSystem: "Stripe", accountNumber: "" });
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const eligible = info?.eligible ?? false;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Withdrawals</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="font-semibold text-slate-800">Creator Total Earnings</h2>
          <p className="mt-2 text-sm text-slate-500">
            Raised credits: <span className="font-bold text-slate-800">{info?.totalRaised ?? 0}</span>
          </p>
          <p className="text-sm text-slate-500">
            Available after pending requests: <span className="font-bold text-slate-800">{info?.availableRaised ?? 0}</span>
          </p>
          <p className="text-sm text-slate-500">
            Withdrawal amount: <span className="font-bold text-slate-800">${info?.withdrawalAmount?.toFixed(2) ?? "0.00"}</span>
          </p>
          <p className="mt-2 text-xs text-slate-400">20 credits = $1. Minimum withdrawal: {MIN_WITHDRAWAL_CREDITS} credits ($10).</p>
        </div>

        <div className="card-surface p-6">
          {!eligible ? (
            <div>
              <h2 className="font-semibold text-slate-800">Withdraw</h2>
              <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Insufficient credit. You need at least {MIN_WITHDRAWAL_CREDITS} raised credits to withdraw.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <h2 className="font-semibold text-slate-800">Withdrawal Form</h2>
              <div>
                <label className="label">Credits To Withdraw</label>
                <input
                  type="number"
                  max={info?.availableRaised}
                  min={1}
                  required
                  className="input"
                  value={form.withdrawalCredit}
                  onChange={(e) => setForm((f) => ({ ...f, withdrawalCredit: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Withdraw Amount ($)</label>
                <input className="input bg-slate-50" value={`$${amount}`} readOnly />
              </div>
              <div>
                <label className="label">Payment System</label>
                <select
                  className="input"
                  value={form.paymentSystem}
                  onChange={(e) => setForm((f) => ({ ...f, paymentSystem: e.target.value as PaymentSystem }))}
                >
                  {SYSTEMS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Account Number</label>
                <input required className="input" value={form.accountNumber} onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Submitting..." : "Withdraw"}
              </button>
            </form>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-800">Payment History</h2>
      {history.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No withdrawal requests yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((w) => (
                <tr key={w._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{w.withdrawalCredit}</td>
                  <td className="px-4 py-3">${w.withdrawalAmount}</td>
                  <td className="px-4 py-3">{w.paymentSystem}</td>
                  <td className="px-4 py-3 text-slate-600">{w.accountNumber}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold capitalize text-amber-600">
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(w.withdrawDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
