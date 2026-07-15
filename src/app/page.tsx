"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { api } from "@/lib/api";
import { ICampaign } from "@/lib/types";
import CampaignCard from "@/components/CampaignCard";
import CampaignCardSkeleton from "@/components/CampaignCardSkeleton";
import { SITE_NAME } from "@/lib/constants";

const slides = [
  {
    title: "Fund the ideas that matter",
    subtitle: "Support creators building technology, art, and community projects worldwide.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Launch your campaign in minutes",
    subtitle: "Creators earn real support from a global community of backers.",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Transparent, secure, rewarding",
    subtitle: "Track every contribution and withdrawal with built-in notifications.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  },
];

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "Creator",
    quote:
      "FundHorizon helped me raise credits for my community solar project faster than I imagined.",
    photo: "https://i.ibb.co/0Q8c0cX/default.png",
  },
  {
    name: "Liam Carter",
    role: "Supporter",
    quote:
      "I love how easy it is to browse and back meaningful campaigns. The dashboard is beautiful.",
    photo: "https://i.ibb.co/0Q8c0cX/default.png",
  },
  {
    name: "Mei Tanaka",
    role: "Creator",
    quote:
      "Clear withdrawal flow and great notifications. My backers always know what's happening.",
    photo: "https://i.ibb.co/0Q8c0cX/default.png",
  },
];

const steps = [
  { n: "01", title: "Discover", text: "Browse approved campaigns across categories that inspire you." },
  { n: "02", title: "Contribute", text: "Pledge platform credits to the projects you believe in." },
  { n: "03", title: "Track & Withdraw", text: "Creators review contributions and withdraw earned funds." },
];

export default function HomePage() {
  const [top, setTop] = useState<ICampaign[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [stats, setStats] = useState({
    supporters: 0,
    creators: 0,
    approvedCampaigns: 0,
    creditsPledged: 0,
    fundedCampaigns: 0,
  });

  useEffect(() => {
    api
      .get<{ campaigns: ICampaign[] }>("/campaigns/top-funded", false)
      .then((r) => setTop(r.campaigns))
      .catch(() => setTop([]))
      .finally(() => setLoadingTop(false));
    api
      .get<{ stats: typeof stats }>("/campaigns/platform/stats", false)
      .then((response) => setStats(response.stats))
      .catch(() => undefined);
    // Stats are intentionally loaded from MongoDB instead of using promotional placeholders.
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500 }}
          pagination={{ clickable: true }}
          loop
          className="h-[70vh] min-h-[420px] w-full"
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative flex h-full items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                  <h1 className="animate-fade-up text-4xl font-extrabold leading-tight sm:text-6xl">
                    {s.title}
                  </h1>
                  <p className="animate-fade-up mt-4 text-lg text-slate-200">{s.subtitle}</p>
                  <div className="animate-fade-up mt-8 flex justify-center gap-3">
                    <Link href="/explore" className="btn-primary">
                      Explore Campaigns
                    </Link>
                    <Link
                      href="/register"
                      className="btn bg-white/90 text-slate-800 hover:bg-white"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Top funded */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800">Top Funded Campaigns</h2>
            <p className="mt-1 text-slate-500">The projects raising the most credits right now.</p>
          </div>
          <Link href="/explore" className="text-sm font-semibold text-violet-600 hover:underline">
            View all →
          </Link>
        </div>

        {loadingTop ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <CampaignCardSkeleton key={index} />)}
          </div>
        ) : top.length === 0 ? (
          <p className="text-slate-400">No campaigns available yet. Be the first to launch one!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {top.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-extrabold text-slate-800">How It Works</h2>
          <p className="mt-2 text-center text-slate-500">
            Three simple steps to start funding or launching campaigns.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="card-surface p-6 text-center animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xl font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-6 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-10 text-white md:grid-cols-4">
          {[
            { v: stats.supporters.toLocaleString(), l: "Supporters" },
            { v: stats.creditsPledged.toLocaleString(), l: "Credits raised" },
            { v: stats.approvedCampaigns.toLocaleString(), l: "Live campaigns" },
            {
              v: stats.approvedCampaigns
                ? `${Math.round((stats.fundedCampaigns / stats.approvedCampaigns) * 100)}%`
                : "0%",
              l: "Goals reached",
            },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-3xl font-extrabold">{s.v}</p>
              <p className="mt-1 text-sm text-white/80">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-extrabold text-slate-800">Explore by Category</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Technology", "Art", "Community", "Health", "Education", "Environment"].map((c) => (
              <Link
                key={c}
                href={`/explore?category=${c}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-600"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold text-slate-800">
          What Our Community Says
        </h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="mt-10 pb-12"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="card-surface h-full p-6">
                <p className="text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold">Ready to make an impact?</h2>
          <p className="mt-2 text-slate-300">
            Join {SITE_NAME} today as a supporter or creator — it&apos;s free to start.
          </p>
          <Link href="/register" className="btn-primary mt-6">
            Create Your Account
          </Link>
        </div>
      </section>
    </main>
  );
}
