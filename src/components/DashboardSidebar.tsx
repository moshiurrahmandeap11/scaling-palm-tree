"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DASHBOARD_NAV, SITE_NAME, DEV_REPO_URL } from "@/lib/constants";
import type { ReactElement } from "react";

const ICONS: Record<string, ReactElement> = {
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  compass: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM16 12l-4-2-2 4 4 2 2-4z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  check: <path d="M20 6L9 17l-5-5" />,
  credit: <path d="M3 7h18v10H3zM3 11h18" />,
  history: <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  wallet: <path d="M3 7h18v12H3zM16 12h3M3 7V5a2 2 0 0 1 2-2h12" />,
  users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />,
  flag: <path d="M4 22V4s4-2 8 0 8 0 8 0v10s-4 2-8 0-8 0-8 0" />,
};

export default function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;
  const items = DASHBOARD_NAV[user.role] ?? [];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white">
          F
        </span>
        <span className="text-lg font-extrabold text-gradient">{SITE_NAME}</span>
      </div>

      <div className="flex items-center gap-3 border-y border-slate-100 px-5 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.photoURL || "https://i.ibb.co/0Q8c0cX/default.png"}
          alt={user.name}
          className="h-11 w-11 rounded-full border border-slate-200 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="text-xs capitalize text-slate-500">{user.role}</p>
          <p className="text-xs font-semibold text-violet-600">{user.credits} credits</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scroll-thin">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[item.icon]}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-100 px-3 py-4">
        <a
          href={DEV_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full"
        >
          Join as Developer
        </a>
        <button onClick={handleLogout} className="btn-danger w-full">
          Logout
        </button>
      </div>
    </aside>
  );
}
