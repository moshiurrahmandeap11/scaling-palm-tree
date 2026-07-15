"use client";

import Link from "next/link";
import { DEV_REPO_URL, SITE_NAME } from "@/lib/constants";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@crowdfund.com";
const socials = [
  { label: "GitHub profile", short: "GH", href: "https://github.com/moshiurrahmandeap11" },
  { label: "Client source", short: "FE", href: DEV_REPO_URL },
  { label: "Server source", short: "API", href: "https://github.com/moshiurrahmandeap11/special-octo-potato" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white">F</span>
            <span className="text-lg font-extrabold text-white">{SITE_NAME}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            A transparent crowdfunding community connecting credible creators with supporters who want to fund meaningful work.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-white">Explore</h2>
          <nav className="mt-4 grid gap-2 text-sm">
            <Link href="/explore" className="hover:text-violet-300">Campaigns</Link>
            <Link href="/about" className="hover:text-violet-300">About FundHorizon</Link>
            <Link href="/contact" className="hover:text-violet-300">Contact & Support</Link>
            <Link href="/privacy" className="hover:text-violet-300">Privacy & Terms</Link>
          </nav>
        </div>

        <div>
          <h2 className="font-semibold text-white">Contact</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <p>Dhaka, Bangladesh</p>
            <a href={`mailto:${contactEmail}`} className="block break-all hover:text-violet-300">{contactEmail}</a>
            <p>Support hours: Sun–Thu, 9:00–18:00</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-white">Connect</h2>
          <div className="mt-4 flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-10 min-w-10 place-items-center rounded-full border border-slate-700 px-2 text-xs font-bold transition hover:border-violet-400 hover:text-violet-300"
              >
                {social.short}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE_NAME}. Empowering ideas, one credit at a time.
      </div>
    </footer>
  );
}
