"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CreditPackage } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function PurchaseCredit() {
  const { refreshUser } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<{ packages: CreditPackage[] }>("/payments/packages", false)
      .then((r) => setPackages(r.packages))
      .catch(() => toast.error("Failed to load packages"));
  }, []);

  const buy = async (pkg: CreditPackage) => {
    setBusy(pkg.credits);
    try {
      const res = await api.post<{ url?: string }>("/payments/create-intent", {
        credits: pkg.credits,
      });
      if (res.url) {
        // Navigate via router for SPA transition; fallback to assign for external URLs
        window.location.assign(res.url);
      } else {
        toast.success(`Added ${pkg.credits} credits!`);
        refreshUser();
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Purchase Credits</h1>
      <p className="mt-1 text-slate-500">10 credits = $1. Choose a package to top up your balance.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((p) => (
          <div key={p.credits} className="card-surface flex flex-col p-6 text-center">
            <p className="text-3xl font-extrabold text-gradient">{p.credits}</p>
            <p className="mt-1 text-sm text-slate-500">credits</p>
            <p className="mt-4 text-xl font-bold text-slate-800">${p.amount}</p>
            <button
              onClick={() => buy(p)}
              disabled={busy === p.credits}
              className="btn-primary mt-5 w-full"
            >
              {busy === p.credits ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
