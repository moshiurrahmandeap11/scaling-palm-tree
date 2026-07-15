"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IContribution } from "@/lib/types";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import DashboardStatsChart from "@/components/DashboardStatsChart";

interface Stats {
  total: number;
  active: number;
  totalRaised: number;
}

export default function CreatorHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<IContribution[]>([]);
  const [detail, setDetail] = useState<IContribution | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    api.get<{ stats: Stats }>("/campaigns/creator/stats").then((r) => setStats(r.stats));
    api
      .get<{ contributions: IContribution[] }>("/contributions/pending")
      .then((r) => setPending(r.contributions))
      .catch(() => toast.error("Failed to load dashboard"));
  };

  useEffect(load, []);

  const decide = async (id: string, action: "approve" | "reject") => {
    setBusy(id);
    try {
      await api.patch(`/contributions/${id}/${action}`);
      toast.success(`Contribution ${action}d.`);
      setDetail(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const cards = [
    { label: "Campaigns Launched", value: stats?.total ?? 0 },
    { label: "Active Campaigns", value: stats?.active ?? 0 },
    { label: "Total Raised (credits)", value: stats?.totalRaised ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Creator Dashboard</h1>
      <p className="mt-1 text-slate-500">Track your campaigns and review contributions.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-6">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-gradient">{c.value}</p>
          </div>
        ))}
      </div>

      <DashboardStatsChart title="Campaign Performance" data={cards.map((card) => ({ label: card.label, value: card.value }))} />

      <h2 className="mt-10 text-xl font-bold text-slate-800">Contributions To Review</h2>
      {pending.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No pending contributions right now. 🎉</p>
      ) : (
        <div className="mt-4 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Supporter</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pending.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.supporterName}</td>
                  <td className="px-4 py-3 text-slate-600">{c.campaignTitle}</td>
                  <td className="px-4 py-3">{c.contributionAmount} credits</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setDetail(c)} className="btn-ghost px-3 py-1.5 text-xs">
                        View
                      </button>
                      <button
                        disabled={busy === c._id}
                        onClick={() => decide(c._id, "approve")}
                        className="btn-primary px-3 py-1.5 text-xs"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busy === c._id}
                        onClick={() => decide(c._id, "reject")}
                        className="btn-danger px-3 py-1.5 text-xs"
                      >
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

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Contribution Detail">
        {detail && (
          <div className="space-y-3 text-sm">
            <p><span className="text-slate-500">Supporter:</span> {detail.supporterName}</p>
            <p><span className="text-slate-500">Campaign:</span> {detail.campaignTitle}</p>
            <p><span className="text-slate-500">Amount:</span> {detail.contributionAmount} credits</p>
            <p><span className="text-slate-500">Message:</span> {detail.message || "—"}</p>
            <div className="flex gap-2 pt-2">
              <button disabled={busy === detail._id} onClick={() => decide(detail._id, "approve")} className="btn-primary flex-1">
                Approve
              </button>
              <button disabled={busy === detail._id} onClick={() => decide(detail._id, "reject")} className="btn-danger flex-1">
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
