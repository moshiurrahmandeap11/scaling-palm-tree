"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IUser } from "@/lib/types";
import { toast } from "react-hot-toast";
import DashboardStatsChart from "@/components/DashboardStatsChart";

interface Stats {
  totalSupporters: number;
  totalCreators: number;
  totalCredits: number;
  totalPayments: number;
}

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    api
      .get<{ stats: Stats }>("/users/stats")
      .then((r) => setStats(r.stats))
      .catch(() => toast.error("Failed to load stats"));
    api
      .get<{ users: IUser[] }>("/users/")
      .then((r) => setUsers(r.users.slice(0, 5)))
      .catch(() => toast.error("Failed to load users"));
  }, []);

  const cards = [
    { label: "Supporters", value: stats?.totalSupporters ?? 0 },
    { label: "Creators", value: stats?.totalCreators ?? 0 },
    { label: "Total Credits", value: stats?.totalCredits ?? 0 },
    { label: "Payments Processed", value: stats?.totalPayments ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Admin Dashboard</h1>
      <p className="mt-1 text-slate-500">Platform overview and quick stats.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-6">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-gradient">{c.value}</p>
          </div>
        ))}
      </div>

      <DashboardStatsChart title="Platform Overview" data={cards.map((card) => ({ label: card.label, value: card.value }))} />

      <h2 className="mt-10 text-xl font-bold text-slate-800">Recent Users</h2>
      {users.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No users found.</p>
      ) : (
        <div className="mt-4 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{u.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
