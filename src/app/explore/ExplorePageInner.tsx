"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ICampaign } from "@/lib/types";
import CampaignCard from "@/components/CampaignCard";
import CampaignCardSkeleton from "@/components/CampaignCardSkeleton";
import Pagination from "@/components/Pagination";
import { CAMPAIGN_CATEGORIES } from "@/lib/constants";

export default function ExplorePageInner() {
  const params = useSearchParams();
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [sort, setSort] = useState("funded");
  const [maxGoal, setMaxGoal] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const q = new URLSearchParams({ sort, page: String(page), limit: "8" });
    if (category !== "All") q.set("category", category);
    if (search.trim()) q.set("search", search.trim());
    if (maxGoal) q.set("maxGoal", maxGoal);
    if (deadlineDays) q.set("deadlineDays", deadlineDays);

    setLoading(true);
    api
      .get<{
        campaigns: ICampaign[];
        pagination: { totalPages: number };
      }>(`/campaigns/explore?${q.toString()}`, false)
      .then((response) => {
        setCampaigns(response.campaigns);
        setTotalPages(Math.max(1, response.pagination.totalPages));
      })
      .catch(() => {
        setCampaigns([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [category, deadlineDays, maxGoal, page, search, sort]);

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("funded");
    setMaxGoal("");
    setDeadlineDays("");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Explore Campaigns</h1>
          <p className="mt-1 text-slate-500">Search and filter approved campaigns that are accepting support.</p>
        </div>
        <button type="button" onClick={clearFilters} className="btn-ghost self-start px-4 py-2 text-sm">
          Clear filters
        </button>
      </div>

      <section className="card-surface mt-6 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Campaign filters">
        <input
          className="input sm:col-span-2 lg:col-span-1"
          placeholder="Search title or story"
          value={search}
          onChange={(event) => updateFilter(setSearch, event.target.value)}
        />
        <select className="input" value={category} onChange={(event) => updateFilter(setCategory, event.target.value)}>
          <option value="All">All categories</option>
          {CAMPAIGN_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="input" value={maxGoal} onChange={(event) => updateFilter(setMaxGoal, event.target.value)}>
          <option value="">Any funding goal</option>
          <option value="500">Up to 500 credits</option>
          <option value="1000">Up to 1,000 credits</option>
          <option value="5000">Up to 5,000 credits</option>
          <option value="10000">Up to 10,000 credits</option>
        </select>
        <select className="input" value={deadlineDays} onChange={(event) => updateFilter(setDeadlineDays, event.target.value)}>
          <option value="">Any deadline</option>
          <option value="7">Ending within 7 days</option>
          <option value="30">Ending within 30 days</option>
          <option value="90">Ending within 90 days</option>
        </select>
        <select className="input" value={sort} onChange={(event) => updateFilter(setSort, event.target.value)}>
          <option value="funded">Most funded</option>
          <option value="newest">Newest</option>
          <option value="deadline">Ending soon</option>
        </select>
      </section>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <CampaignCardSkeleton key={index} />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card-surface mt-8 px-6 py-14 text-center">
          <h2 className="font-semibold text-slate-700">No campaigns match these filters</h2>
          <p className="mt-1 text-sm text-slate-500">Clear the filters or try a broader search.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {campaigns.map((campaign) => <CampaignCard key={campaign._id} campaign={campaign} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </main>
  );
}
