# FundHorizon

FundHorizon is a responsive MERN crowdfunding platform where supporters fund approved campaigns with platform credits, creators manage fundraising and withdrawals, and administrators oversee users, campaigns, reports, and payments.

## Submission information

- **Admin username:** configured with `ADMIN_EMAIL` on the API server
- **Admin password:** configured with `ADMIN_PASSWORD` on the API server
- **Live site URL:** add the Vercel production URL here after deployment
- **Client repository:** https://github.com/moshiurrahmandeap11/scaling-palm-tree
- **Server repository:** https://github.com/moshiurrahmandeap11/special-octo-potato

> Keep the real admin password in the deployment environment. If reviewers need a demo password, add a dedicated non-production credential before submission.

## Features

- Role-based dashboards and API authorization for supporters, creators, and admins.
- Email/password registration with validation and one-time starter credits (50 supporter / 20 creator).
- Google Identity Services sign-in with server-side ID-token verification.
- Persistent JWT authentication that survives private-route reloads.
- Animated hero slider, top-funded campaigns, testimonials, categories, impact stats, and how-it-works content.
- Responsive navbar, footer, dashboard sidebar, mobile menu, tables, cards, and forms.
- Campaign creation with imgBB upload, admin approval, creator editing, deletion, and supporter refunds.
- Campaign discovery with category filtering, text search, sorting, details, contributions, and fraud reporting.
- Atomic contribution credit deduction, creator approval/rejection, campaign totals, and rejection refunds.
- Paginated supporter contribution history with highlighted statuses.
- Stripe Checkout credit purchases with secure server-defined packages and a dummy fallback when Stripe is not configured.
- Creator earnings, pending-balance protection, withdrawals, and payment history.
- Admin user/role management, campaign moderation, withdrawal processing, reports, and platform statistics.
- Database-backed notifications for campaign, contribution, and withdrawal lifecycle events.

## Local setup

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example`, run the API server, and open http://localhost:3000.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API base URL, including `/api` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Identity Services web client ID |
| `NEXT_PUBLIC_IMGBB_API_KEY` | imgBB upload key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key for deployment configuration |
| `NEXT_PUBLIC_DEV_REPO_URL` | Client repository used by “Join as Developer” |

## Checks

```bash
npm run lint
npm run build
```
