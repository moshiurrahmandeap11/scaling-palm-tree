"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ICampaign } from "@/lib/types";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";

export default function ManageCampaigns() {
  const [items, setItems] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ICampaign | null>(null);

  const load = () => {
    api
      .get<{ campaigns: ICampaign[] }>("/campaigns/admin/all")
      .then((r) => setItems(r.campaigns))
      .catch(() => toast.error("Failed to load campaigns"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    try {
      await api.del(`/campaigns/${id}`);
      toast.success("Campaign deleted.");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Manage Campaigns</h1>
      <p className="mt-1 text-slate-500">All campaigns across the platform.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Raised</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                  <td className="px-4 py-3 text-slate-600">{c.creatorName}</td>
                  <td className="px-4 py-3">{c.amountRaised}/{c.fundingGoal}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-600">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setView(c)} className="btn-ghost px-3 py-1.5 text-xs">View</button>
                      <button onClick={() => remove(c._id)} className="btn-danger px-3 py-1.5 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!view} onClose={() => setView(null)} title="Campaign Overview">
        {view && (
          <div className="space-y-4 text-sm">
            {view.imageURL && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={view.imageURL} alt={view.title} className="h-44 w-full rounded-xl object-cover" />
            )}
            <div>
              <h3 className="text-lg font-bold text-slate-800">{view.title}</h3>
              <p className="mt-1 text-slate-600">{view.shortDescription || view.story.slice(0, 220)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-slate-600">
              <p><strong>Creator:</strong> {view.creatorName}</p>
              <p><strong>Status:</strong> {view.status}</p>
              <p><strong>Raised:</strong> {view.amountRaised}</p>
              <p><strong>Goal:</strong> {view.fundingGoal}</p>
            </div>
            <p className="whitespace-pre-line leading-6 text-slate-600">{view.story}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
