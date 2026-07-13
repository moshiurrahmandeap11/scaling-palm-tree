"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ICampaign } from "@/lib/types";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuth();

  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    api
      .get<{ campaign: ICampaign }>(`/campaigns/${id}`, false)
      .then((r) => {
        setCampaign(r.campaign);
        setAmount(r.campaign.minimumContribution);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const contribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to contribute.");
      router.push("/login");
      return;
    }
    if (user?.role !== "supporter") {
      toast.error("Only supporters can contribute.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contributions/", {
        campaignId: id,
        contributionAmount: amount,
        message,
      });
      toast.success("Contribution submitted! Awaiting creator approval.");
      router.push("/dashboard/my-contributions");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to report.");
      router.push("/login");
      return;
    }
    try {
      await api.post("/reports/", { campaignId: id, reason: reportReason });
      toast.success("Report submitted. Thank you for keeping the platform safe.");
      setReportOpen(false);
      setReportReason("");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) return <main className="mx-auto max-w-4xl px-4 py-16 text-slate-400">Loading...</main>;
  if (!campaign)
    return <main className="mx-auto max-w-4xl px-4 py-16 text-slate-400">Campaign not found.</main>;

  const pct = Math.min(100, Math.round((campaign.amountRaised / campaign.fundingGoal) * 100));
  const ended = new Date(campaign.deadline).getTime() < Date.now();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/explore" className="text-sm font-medium text-violet-600 hover:underline">
        ← Back to Explore
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {campaign.imageURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.imageURL}
              alt={campaign.title}
              className="mb-6 max-h-80 w-full rounded-2xl object-cover"
            />
          )}
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {campaign.category}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-800">{campaign.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            by {campaign.creatorName} ·{" "}
            {new Date(campaign.deadline).toLocaleDateString()} deadline
          </p>

          <div className="prose mt-6 max-w-none whitespace-pre-line text-slate-600">
            {campaign.story}
          </div>

          {campaign.rewardInfo && (
            <div className="card-surface mt-6 p-5">
              <h3 className="font-semibold text-slate-800">Reward for backers</h3>
              <p className="mt-2 text-sm text-slate-600">{campaign.rewardInfo}</p>
            </div>
          )}

          <button onClick={() => setReportOpen(true)} className="mt-6 text-sm font-medium text-rose-600 hover:underline">
            Report this campaign
          </button>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="card-surface p-5">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">{campaign.amountRaised} credits</span>
              <span className="text-slate-500">of {campaign.fundingGoal}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{pct}% funded · min {campaign.minimumContribution} credits</p>

            {ended ? (
              <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-500">
                This campaign has ended.
              </p>
            ) : token && user?.role === "supporter" ? (
              <form onSubmit={contribute} className="mt-4 space-y-3">
                <div>
                  <label className="label">Contribution amount (credits)</label>
                  <input
                    type="number"
                    min={campaign.minimumContribution}
                    className="input"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label">Message (optional)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? "Submitting..." : "Contribute"}
                </button>
              </form>
            ) : (
              <Link href="/login" className="btn-primary mt-4 w-full">
                Login to Contribute
              </Link>
            )}
          </div>
        </aside>
      </div>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report Campaign">
        <form onSubmit={submitReport} className="space-y-3">
          <p className="text-sm text-slate-500">
            Tell us why this campaign is suspicious or fraudulent.
          </p>
          <textarea
            required
            className="input"
            rows={4}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Reason..."
          />
          <button type="submit" className="btn-danger w-full">
            Submit Report
          </button>
        </form>
      </Modal>
    </main>
  );
}