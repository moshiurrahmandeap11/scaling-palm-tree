"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartStat {
  label: string;
  value: number;
}

export default function DashboardStatsChart({ title, data }: { title: string; data: ChartStat[] }) {
  return (
    <section className="card-surface mt-8 p-5 sm:p-6" aria-label={title}>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">A visual summary of the current dashboard totals.</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "#f5f3ff" }}
              contentStyle={{ borderRadius: 12, borderColor: "#ddd6fe" }}
            />
            <Bar dataKey="value" name="Total" fill="#7c3aed" radius={[8, 8, 0, 0]} maxBarSize={72} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
