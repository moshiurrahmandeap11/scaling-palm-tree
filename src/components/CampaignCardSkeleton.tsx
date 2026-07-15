export default function CampaignCardSkeleton() {
  return (
    <div className="card-surface animate-pulse overflow-hidden" aria-label="Loading campaign">
      <div className="h-44 bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-4/5 rounded bg-slate-200" />
        <div className="h-3 w-2/5 rounded bg-slate-100" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-11/12 rounded bg-slate-100" />
        </div>
        <div className="h-2 w-full rounded bg-slate-200" />
        <div className="h-9 w-full rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
