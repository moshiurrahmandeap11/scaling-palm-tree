"use client";

import { Suspense } from "react";
import ExplorePageInner from "./ExplorePageInner";

export default function ExplorePage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-10"><p className="text-slate-400">Loading...</p></main>}>
      <ExplorePageInner />
    </Suspense>
  );
}
