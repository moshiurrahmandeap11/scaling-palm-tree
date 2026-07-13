"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const map: Record<string, string> = {
      supporter: "/dashboard/supporter-home",
      creator: "/dashboard/creator-home",
      admin: "/dashboard/admin-home",
    };
    router.replace(map[user.role] ?? "/dashboard/supporter-home");
  }, [user, router]);

  return <div className="grid min-h-[60vh] place-items-center text-slate-400">Redirecting...</div>;
}