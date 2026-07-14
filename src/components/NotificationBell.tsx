"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { INotification } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function NotificationBell() {
  const { token } = useAuth();
  const [items, setItems] = useState<INotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await api.get<{ notifications: INotification[] }>("/notifications/");
        setItems(res.notifications);
      } catch {
        /* ignore */
      }
    };
    load();
  }, [token]);

  // Close popup when clicking outside (per spec: click anywhere hides it)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = items.filter((n) => !n.isRead).length;

  const markAll = async () => {
    try {
      await api.patch("/notifications/read-all");
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      toast.error("Could not mark notifications as read");
    }
  };

  if (!token) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-violet-600"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h4 className="font-semibold text-slate-800">Notifications</h4>
            <button onClick={markAll} className="text-xs font-medium text-violet-600 hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto scroll-thin">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">
                No notifications yet.
              </p>
            ) : (
              items.map((n) => (
                <Link
                  key={n._id}
                  href={n.actionRoute || "/dashboard"}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-slate-50 px-4 py-3 text-sm transition hover:bg-slate-50 ${
                    n.isRead ? "text-slate-500" : "text-slate-800"
                  }`}
                >
                  <p>{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(n.time).toLocaleString()}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}