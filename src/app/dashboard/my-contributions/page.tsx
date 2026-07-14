"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IContribution } from "@/lib/types";
import Pagination from "@/components/Pagination";
import { toast } from "react-hot-toast";

const statusColor: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-600",
};

export default function MyContributions() {
  const [items, setItems] = useState<IContribution[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doLoad = () => {
      api
        .get<{
          contributions: IContribution[];
          pagination: { page: number; totalPages: number };
        }>(`/contributions/my?page=${page}&limit=5`)
        .then((r) => {
          setItems(r.contributions);
          setTotalPages(r.pagination.totalPages);
        })
        .catch(() => toast.error("Failed to load contributions"))
        .finally(() => setLoading(false));
    };
    doLoad();
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">My Contributions</h1>
      <p className="mt-1 text-slate-500">All the campaigns you&apos;ve backed, with status.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-400">You haven&apos;t made any contributions yet.</p>
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
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[c.status]}`}>
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

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}