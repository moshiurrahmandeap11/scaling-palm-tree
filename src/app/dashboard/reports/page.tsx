"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IReport } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function Reports() {
  const [items, setItems] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    api
      .get<{ reports: IReport[] }>("/reports/")
      .then((r) => setItems(r.reports))
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const resolve = async (id: string, action: "suspend" | "delete") => {
    setBusy(id);
    try {
      await api.patch(`/reports/${id}/resolve`, { action });
      toast.success(`Report resolved (${action}).`);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Reports</h1>
      <p className="mt-1 text-slate-500">Campaigns reported by supporters as suspicious.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-400">No reports filed. 🎉</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((r) => (
            <div key={r._id} className="card-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{r.campaignTitle}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Reported by <span className="font-medium">{r.reporterName}</span> ({r.reporterEmail})
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-medium text-rose-600">Reason:</span> {r.reason}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                  r.status === "open" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                }`}>
                  {r.status}
                </span>
              </div>
              {r.status === "open" && (
                <div className="mt-4 flex gap-2">
                  <button disabled={busy === r._id} onClick={() => resolve(r._id, "suspend")} className="btn-ghost text-xs">
                    Suspend Campaign
                  </button>
                  <button disabled={busy === r._id} onClick={() => resolve(r._id, "delete")} className="btn-danger text-xs">
                    Delete Campaign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}