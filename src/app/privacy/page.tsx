const sections = [
  { title: "Information we store", text: "FundHorizon stores account profile data, role and credit balances, campaigns, contributions, payments, withdrawals, reports, and notifications needed to operate the platform." },
  { title: "How information is used", text: "Information is used to authenticate accounts, enforce role permissions, process platform activity, prevent abuse, and provide the dashboards and histories requested by users." },
  { title: "Payments and credentials", text: "Payment card details are handled by Stripe and are not stored by FundHorizon. Passwords are stored as secure hashes. Access tokens should never be shared." },
  { title: "Community responsibilities", text: "Creators must provide accurate campaign information. Supporters should review campaigns before contributing. Fraudulent, abusive, or misleading activity may be suspended or removed." },
  { title: "Account and campaign removal", text: "Administrators may remove accounts or campaigns when required for platform safety. Campaign deletion returns refundable contribution credits according to platform rules." },
  { title: "Contact", text: "Questions about privacy, terms, or stored account information can be sent to admin@crowdfund.com." },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">Privacy & Terms</span>
      <h1 className="mt-5 text-4xl font-extrabold text-slate-900">Clear rules for a trusted community.</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">This summary explains how FundHorizon handles platform information and the responsibilities accepted when using the service.</p>
      <div className="mt-10 space-y-5">
        {sections.map((section) => (
          <section key={section.title} className="card-surface p-6">
            <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{section.text}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-500">Last updated: July 2026</p>
    </main>
  );
}
