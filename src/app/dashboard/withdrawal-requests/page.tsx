"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IWithdrawal } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function WithdrawalRequests() {
  const [items, setItems] = useState<IWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    api
      .get<{ withdrawals: IWithdrawal[] }>("/withdrawals/pending")
      .then((r) => setItems(r.withdrawals))
      .catch(() => toast.error("Failed to load requests"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const complete = async (id: string) => {
    setBusy(id);
    try {
      await api.patch(`/withdrawals/${id}/complete`);
      toast.success("Withdrawal marked as paid.");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Withdrawal Requests</h1>
      <p className="mt-1 text-slate-500">Process pending creator withdrawals.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-400">No pending withdrawal requests.</p>
      ) : (
        <div className="mt-6 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((w) => (
                <tr key={w._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{w.creatorName}</td>
                  <td className="px-4 py-3">{w.withdrawalCredit}</td>
                  <td className="px-4 py-3">${w.withdrawalAmount}</td>
                  <td className="px-4 py-3">{w.paymentSystem}</td>
                  <td className="px-4 py-3 text-slate-600">{w.accountNumber}</td>
                  <td className="px-4 py-3">
                    <button disabled={busy === w._id} onClick={() => complete(w._id)} className="btn-primary px-3 py-1.5 text-xs">
                      Payment Success
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}