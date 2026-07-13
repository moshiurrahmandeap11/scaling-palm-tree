"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ICampaign } from "@/lib/types";
import CampaignCard from "@/components/CampaignCard";
import { CAMPAIGN_CATEGORIES } from "@/lib/constants";

export default function ExplorePage() {
  const params = useSearchParams();
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [sort, setSort] = useState("funded");

  useEffect(() => {
    const q = new URLSearchParams();
    if (category !== "All") q.set("category", category);
    if (search) q.set("search", search);
    if (sort) q.set("sort", sort);

    setLoading(true);
    api
      .get<{ campaigns: ICampaign[] }>(`/campaigns/explore?${q.toString()}`, false)
      .then((r) => setCampaigns(r.campaigns))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-800">Explore Campaigns</h1>
      <p className="mt-1 text-slate-500">Discover approved, active campaigns to support.</p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          className="input md:flex-1"
          placeholder="Search campaigns by title or story..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input md:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {CAMPAIGN_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className="input md:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="funded">Most Funded</option>
          <option value="newest">Newest</option>
          <option value="deadline">Ending Soon</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-400">Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="mt-10 text-slate-400">No campaigns match your filters.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c._id} campaign={c} />
          ))}
        </div>
      )}
    </main>
  );
}