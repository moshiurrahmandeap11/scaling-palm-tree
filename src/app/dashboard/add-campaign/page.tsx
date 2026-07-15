"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CAMPAIGN_CATEGORIES } from "@/lib/constants";
import { useImageUpload } from "@/components/ImgbbUpload";
import { toast } from "react-hot-toast";

export default function AddCampaign() {
  const router = useRouter();
  const { upload, uploading } = useImageUpload();

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    story: "",
    category: "Technology",
    fundingGoal: "",
    minimumContribution: "",
    deadline: "",
    rewardInfo: "",
    imageURL: "",
  });
  const [file, setFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageURL = form.imageURL;
      if (file) {
        const url = await upload(file);
        if (url) imageURL = url;
      }
      await api.post("/campaigns/", {
        ...form,
        imageURL,
        fundingGoal: Number(form.fundingGoal),
        minimumContribution: Number(form.minimumContribution),
      });
      toast.success("Campaign submitted! Awaiting admin approval.");
      router.push("/dashboard/my-campaigns");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Add New Campaign</h1>
      <p className="mt-1 text-slate-500">
        Your campaign will be reviewed by an admin before going live.
      </p>

      <form onSubmit={submit} className="mt-6 card-surface space-y-4 p-6">
        <div>
          <label className="label">Campaign Title</label>
          <input required className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className="label">Short Description</label>
          <textarea
            required
            maxLength={220}
            rows={2}
            className="input"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            placeholder="Summarize the campaign in one or two sentences."
          />
          <p className="mt-1 text-right text-xs text-slate-400">{form.shortDescription.length}/220</p>
        </div>
        <div>
          <label className="label">Campaign Story</label>
          <textarea required rows={5} className="input" value={form.story} onChange={(e) => set("story", e.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CAMPAIGN_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input required type="date" className="input" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
          </div>
          <div>
            <label className="label">Funding Goal (credits)</label>
            <input required type="number" min={1} className="input" value={form.fundingGoal} onChange={(e) => set("fundingGoal", e.target.value)} />
          </div>
          <div>
            <label className="label">Minimum Contribution (credits)</label>
            <input required type="number" min={1} className="input" value={form.minimumContribution} onChange={(e) => set("minimumContribution", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Reward Info</label>
          <textarea rows={3} className="input" value={form.rewardInfo} onChange={(e) => set("rewardInfo", e.target.value)} placeholder="What backers receive..." />
        </div>
        <div>
          <label className="label">Cover Image</label>
          <input type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files?.[0])} />
          <p className="mt-1 text-xs text-slate-400">Or paste an image URL:</p>
          <input className="input mt-1" placeholder="https://..." value={form.imageURL} onChange={(e) => set("imageURL", e.target.value)} />
          {uploading && <p className="mt-1 text-xs text-violet-600">Uploading...</p>}
        </div>
        <button type="submit" disabled={loading || uploading} className="btn-primary">
          {loading ? "Submitting..." : "Add Campaign"}
        </button>
      </form>
    </div>
  );
}
