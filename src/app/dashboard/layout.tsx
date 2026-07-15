"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token && !loading) {
      router.replace("/login");
    } else if (token) {
      // Use a microtask to avoid synchronous setState in effect body
      Promise.resolve().then(() => setChecked(true));
    }
  }, [token, loading, router]);

  if (!token || !user || !checked) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <MobileDashHeader />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

function MobileDashHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 bg-white md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-extrabold text-gradient">FundHorizon</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200"
          aria-label="Menu"
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100">
          <DashboardSidebar onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
