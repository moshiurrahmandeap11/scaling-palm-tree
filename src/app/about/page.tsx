import Link from "next/link";

const values = [
  { title: "Transparent funding", text: "Every contribution, approval, refund, and withdrawal is recorded so participants can follow the movement of platform credits." },
  { title: "Responsible review", text: "Campaigns are reviewed before publication, and supporters can report activity that appears misleading or unsafe." },
  { title: "Creator ownership", text: "Creators control their stories and updates while receiving clear contribution and withdrawal information." },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">About FundHorizon</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Credible ideas deserve a clear path to support.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            FundHorizon connects supporters with creators raising credits for technology, art, health, education, environmental, and community projects.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/explore" className="btn-primary">Explore campaigns</Link>
            <Link href="/register" className="btn-ghost">Join the community</Link>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white shadow-xl sm:p-10">
          <h2 className="text-2xl font-bold">How the platform works</h2>
          <ol className="mt-6 space-y-5 text-sm leading-6 text-violet-50">
            <li><strong className="text-white">1. Creators submit.</strong> Campaigns include a goal, deadline, story, rewards, and minimum contribution.</li>
            <li><strong className="text-white">2. Admins review.</strong> Only approved campaigns appear in public discovery.</li>
            <li><strong className="text-white">3. Supporters contribute.</strong> Creators approve genuine contributions or reject and refund them.</li>
            <li><strong className="text-white">4. Funds are withdrawn.</strong> Eligible creators request payment while admins verify processing.</li>
          </ol>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-center text-3xl font-extrabold text-slate-900">What guides us</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="card-surface p-6">
              <h3 className="text-lg font-bold text-slate-800">{value.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{value.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
