"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

interface Stats {
  total: number;
  pending: number;
  totalAmount: number;
}

export default function SupporterHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .get<{ stats: Stats }>("/contributions/supporter/stats")
      .then((r) => setStats(r.stats))
      .catch(() => toast.error("Failed to load stats"));
  }, []);

  const cards = [
    { label: "Total Contributions", value: stats?.total ?? 0 },
    { label: "Pending Contributions", value: stats?.pending ?? 0 },
    { label: "Total Contributed (credits)", value: stats?.totalAmount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Welcome, {user?.name || "Guest"}!</h1>
      <p className="mt-1 text-slate-500">Here&apos;s a snapshot of your support activity.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-6">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-gradient">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link href="/dashboard/approved-contributions" className="card-surface p-6 transition hover:shadow-md">
          <h3 className="font-semibold text-slate-800">Approved Contributions</h3>
          <p className="mt-1 text-sm text-slate-500">See the campaigns you&apos;ve successfully backed.</p>
        </Link>
        <Link href="/dashboard/purchase-credit" className="card-surface p-6 transition hover:shadow-md">
          <h3 className="font-semibold text-slate-800">Purchase Credits</h3>
          <p className="mt-1 text-sm text-slate-500">Top up your balance to support more projects.</p>
        </Link>
      </div>
    </div>
  );
}