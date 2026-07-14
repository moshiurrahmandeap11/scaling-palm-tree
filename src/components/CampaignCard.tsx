"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ICampaign } from "@/lib/types";

function timeLeft(deadline: string, now: number): string {
  const diff = new Date(deadline).getTime() - now;
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return `${Math.floor(days / 30)} mo left`;
  if (days > 0) return `${days} d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours} h left`;
}

export default function CampaignCard({ campaign }: { campaign: ICampaign }) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const pct = Math.min(
    100,
    Math.round((campaign.amountRaised / campaign.fundingGoal) * 100)
  );

  return (
    <Link
      href={`/campaign/${campaign._id}`}
      className="card-surface group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {campaign.imageURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.imageURL}
            alt={campaign.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate-400">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700">
          {campaign.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-800">{campaign.title}</h3>
        <p className="mt-1 text-xs text-slate-500">by {campaign.creatorName}</p>

        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{campaign.amountRaised} raised</span>
            <span>of {campaign.fundingGoal}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
            {pct}% funded
          </span>
          <span className="text-slate-500">{timeLeft(campaign.deadline, now)}</span>
        </div>
      </div>
    </Link>
  );
}
