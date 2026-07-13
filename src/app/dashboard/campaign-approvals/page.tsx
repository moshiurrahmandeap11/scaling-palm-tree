"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ICampaign } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function CampaignApprovals() {
  const [items, setItems] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    api
      .get<{ campaigns: ICampaign[] }>("/campaigns/admin/pending")
      .then((r) => setItems(r.campaigns))
      .catch(() => toast.error("Failed to load pending campaigns"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const decide = async (id: string, action: "approve" | "reject") => {
    setBusy(id);
    try {
      await api.patch(`/campaigns/${id}/${action}`);
      toast.success(`Campaign ${action}d.`);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Campaign Approvals</h1>
      <p className="mt-1 text-slate-500">Review and approve newly submitted campaigns.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-400">No pending campaigns. 🎉</p>
      ) : (
        <div className="mt-6 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                  <td className="px-4 py-3 text-slate-600">{c.creatorName}</td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3">{c.fundingGoal} credits</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button disabled={busy === c._id} onClick={() => decide(c._id, "approve")} className="btn-primary px-3 py-1.5 text-xs">
                        Approve
                      </button>
                      <button disabled={busy === c._id} onClick={() => decide(c._id, "reject")} className="btn-danger px-3 py-1.5 text-xs">
                        Reject
                      </button>
                    </div>
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