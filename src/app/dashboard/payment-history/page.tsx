"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IPayment } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function PaymentHistory() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ payments: IPayment[] }>("/payments/my")
      .then((r) => setPayments(r.payments))
      .catch(() => toast.error("Failed to load payments"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Payment History</h1>
      <p className="mt-1 text-slate-500">Your credit purchases and transactions.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="mt-8 text-slate-400">No payments yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 text-slate-600">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.credits}</td>
                  <td className="px-4 py-3">${p.amount}</td>
                  <td className="px-4 py-3">{p.paymentSystem}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{p.transactionId}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                      {p.status}
                    </span>
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