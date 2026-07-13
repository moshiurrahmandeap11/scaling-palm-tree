"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ICampaign } from "@/lib/types";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";

export default function MyCampaigns() {
  const router = useRouter();
  const [items, setItems] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<ICampaign | null>(null);
  const [editForm, setEditForm] = useState({ title: "", story: "", rewardInfo: "" });

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
    setEditForm({ title: c.title, story: c.story, rewardInfo: c.rewardInfo });
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
          <p className="mt-1 text-slate-500">Manage the campaigns you've launched.</p>
        </div>
        <Link href="/dashboard/add-campaign" className="btn-primary">
          + New Campaign
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-400">You haven't created any campaigns yet.</p>
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
            <label className="label">Reward Info</label>
            <textarea rows={3} className="input" value={editForm.rewardInfo} onChange={(e) => setEditForm((f) => ({ ...f, rewardInfo: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary w-full">Save Changes</button>
        </form>
      </Modal>
    </div>
  );
}