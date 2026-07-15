"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ICampaign } from "@/lib/types";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";

export default function MyCampaigns() {
  const [items, setItems] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<ICampaign | null>(null);
  const [view, setView] = useState<ICampaign | null>(null);
  const [editForm, setEditForm] = useState({ title: "", shortDescription: "", story: "", rewardInfo: "" });

  const load = () => {
    api
      .get<{ campaigns: ICampaign[] }>("/campaigns/my/list")
      .then((r) => setItems(r.campaigns))
      .catch(() => toast.error("Failed to load campaigns"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openEdit = (c: ICampaign) => {
    setEdit(c);
    setEditForm({
      title: c.title,
      shortDescription: c.shortDescription || c.story.slice(0, 220),
      story: c.story,
      rewardInfo: c.rewardInfo,
    });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    try {
      await api.patch(`/campaigns/${edit._id}`, editForm);
      toast.success("Campaign updated.");
      setEdit(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this campaign? Approved backers will be refunded.")) return;
    try {
      await api.del(`/campaigns/${id}`);
      toast.success("Campaign deleted and contributors refunded.");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Campaigns</h1>
          <p className="mt-1 text-slate-500">Manage the campaigns you&apos;ve launched.</p>
        </div>
        <Link href="/dashboard/add-campaign" className="btn-primary">
          + New Campaign
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-400">You haven&apos;t created any campaigns yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Raised</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                  <td className="px-4 py-3 text-slate-600">{c.category}</td>
                  <td className="px-4 py-3">{c.amountRaised}/{c.fundingGoal}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-600">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(c.deadline).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setView(c)} className="btn-ghost px-3 py-1.5 text-xs">View</button>
                      <button onClick={() => openEdit(c)} className="btn-ghost px-3 py-1.5 text-xs">Update</button>
                      <button onClick={() => remove(c._id)} className="btn-danger px-3 py-1.5 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Update Campaign">
        <form onSubmit={saveEdit} className="space-y-3">
          <div>
            <label className="label">Title</label>
            <input className="input" value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Story</label>
            <textarea rows={4} className="input" value={editForm.story} onChange={(e) => setEditForm((f) => ({ ...f, story: e.target.value }))} />
          </div>
          <div>
            <label className="label">Short Description</label>
            <textarea
              required
              maxLength={220}
              rows={2}
              className="input"
              value={editForm.shortDescription}
              onChange={(e) => setEditForm((f) => ({ ...f, shortDescription: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Reward Info</label>
            <textarea rows={3} className="input" value={editForm.rewardInfo} onChange={(e) => setEditForm((f) => ({ ...f, rewardInfo: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary w-full">Save Changes</button>
        </form>
      </Modal>

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
              <p><strong>Status:</strong> {view.status}</p>
              <p><strong>Category:</strong> {view.category}</p>
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
