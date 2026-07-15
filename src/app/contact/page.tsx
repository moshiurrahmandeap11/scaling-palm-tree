import Link from "next/link";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@crowdfund.com";

const faqs = [
  { question: "How quickly are campaigns reviewed?", answer: "Administrators review pending campaigns from their dashboard. Review time depends on the information supplied and current queue." },
  { question: "What happens after a contribution is rejected?", answer: "The contribution status changes to rejected and the pledged credits return to the supporter automatically." },
  { question: "When can a creator withdraw?", answer: "A creator becomes eligible when at least 200 raised credits are available after pending withdrawal requests." },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <div className="max-w-3xl">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">Contact & Support</span>
        <h1 className="mt-5 text-4xl font-extrabold text-slate-900">We’re here to help.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">Get help with accounts, campaigns, contributions, reports, payments, or withdrawals.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="card-surface p-7">
          <h2 className="text-xl font-bold text-slate-800">Email support</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Include your account email and relevant campaign or transaction identifier. Never send your password.</p>
          <a href={`mailto:${contactEmail}?subject=FundHorizon support request`} className="btn-primary mt-6">Email {contactEmail}</a>
        </section>
        <section className="card-surface p-7">
          <h2 className="text-xl font-bold text-slate-800">Campaign safety</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Suspicious campaigns can be reported from their public details page. Administrators can investigate, suspend, or delete them.</p>
          <Link href="/explore" className="btn-ghost mt-6">Browse campaigns</Link>
        </section>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="card-surface group p-5">
              <summary className="cursor-pointer list-none font-semibold text-slate-800">{faq.question}</summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
