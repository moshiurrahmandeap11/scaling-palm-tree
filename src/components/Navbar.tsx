"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DEV_REPO_URL, SITE_NAME } from "@/lib/constants";
import NotificationBell from "./NotificationBell";
import { useState } from "react";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white">
            F
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gradient">
            {SITE_NAME}
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/explore" className="hidden text-sm font-medium text-slate-600 hover:text-violet-600 sm:block">
            Explore Campaigns
          </Link>
          <Link href="/about" className="hidden text-sm font-medium text-slate-600 hover:text-violet-600 lg:block">
            About
          </Link>
          <Link href="/contact" className="hidden text-sm font-medium text-slate-600 hover:text-violet-600 lg:block">
            Contact
          </Link>

          <a
            href={DEV_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline-flex"
          >
            Join as Developer
          </a>

          {!token ? (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link href="/dashboard" className="btn-ghost hidden sm:inline-flex">
                Dashboard
              </Link>
              <span className="hidden rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-bold text-violet-700 sm:inline-flex">
                {user?.credits ?? 0} credits
              </span>
              <div className="hidden items-center gap-2 sm:flex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user?.photoURL || "https://i.ibb.co/0Q8c0cX/default.png"}
                  alt={user?.name}
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs capitalize text-slate-500">
                    {user?.role} · {user?.credits ?? 0} credits
                  </p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-danger hidden px-3 sm:inline-flex sm:px-5">
                Logout
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-xl text-slate-700 sm:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg sm:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">Home</Link>
            <Link href="/explore" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">Explore Campaigns</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">About</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">Contact</Link>
            {token ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">Dashboard</Link>
                <p className="px-3 py-2 text-xs font-semibold text-violet-700">Available balance: {user?.credits ?? 0} credits</p>
                <button type="button" onClick={handleLogout} className="mt-2 rounded-xl bg-rose-600 px-3 py-2.5 text-left text-sm font-semibold text-white">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">Register</Link>
              </>
            )}
            <a href={DEV_REPO_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-100">Join as Developer</a>
          </div>
        </div>
      )}
    </header>
  );
}
