"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IContribution } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function ApprovedContributions() {
  const [items, setItems] = useState<IContribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ contributions: IContribution[] }>("/contributions/approved")
      .then((r) => setItems(r.contributions))
      .catch(() => toast.error("Failed to load contributions"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Approved Contributions</h1>
      <p className="mt-1 text-slate-500">Contributions that creators have approved.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-400">No approved contributions yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.campaignTitle}</td>
                  <td className="px-4 py-3">{c.contributionAmount} credits</td>
                  <td className="px-4 py-3 text-slate-600">{c.creatorName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(c.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}