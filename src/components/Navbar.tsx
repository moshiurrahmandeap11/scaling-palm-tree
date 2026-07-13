"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DEV_REPO_URL, SITE_NAME } from "@/lib/constants";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
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
              <Link href="/dashboard" className="btn-ghost hidden sm:inline-flex">
                Dashboard
              </Link>
              <div className="hidden items-center gap-2 sm:flex">
                <img
                  src={user?.photoURL || "https://i.ibb.co/0Q8c0cX/default.png"}
                  alt={user?.name}
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs capitalize text-slate-500">{user?.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}