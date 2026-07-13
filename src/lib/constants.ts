import { CampaignCategory, UserRole } from "./types";

export const DEV_REPO_URL =
  process.env.NEXT_PUBLIC_DEV_REPO_URL || "https://github.com/your-username/crowdfunding-client";

export const SITE_NAME = "FundHorizon";

export const CAMPAIGN_CATEGORIES: CampaignCategory[] = [
  "Technology",
  "Art",
  "Community",
  "Health",
  "Education",
  "Environment",
  "Other",
];

export const CREDITS_PER_DOLLAR_WITHDRAWAL = 20;
export const CREDITS_PER_DOLLAR_PURCHASE = 10;
export const MIN_WITHDRAWAL_CREDITS = 200;

// Tailwind-friendly gradient/color theme tokens used across the app.
export const THEME = {
  primary: "from-violet-600 to-indigo-600",
  primarySolid: "bg-violet-600 hover:bg-violet-700",
  accent: "text-violet-600",
};

// Dashboard navigation, grouped by role. `href` is relative to /dashboard.
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const DASHBOARD_NAV: Record<UserRole, NavItem[]> = {
  supporter: [
    { label: "Home", href: "/dashboard/supporter-home", icon: "home" },
    { label: "Explore Campaigns", href: "/explore", icon: "compass" },
    { label: "My Contributions", href: "/dashboard/my-contributions", icon: "list" },
    { label: "Approved Contributions", href: "/dashboard/approved-contributions", icon: "check" },
    { label: "Purchase Credit", href: "/dashboard/purchase-credit", icon: "credit" },
    { label: "Payment History", href: "/dashboard/payment-history", icon: "history" },
  ],
  creator: [
    { label: "Home", href: "/dashboard/creator-home", icon: "home" },
    { label: "Add New Campaign", href: "/dashboard/add-campaign", icon: "plus" },
    { label: "My Campaigns", href: "/dashboard/my-campaigns", icon: "folder" },
    { label: "Withdrawals", href: "/dashboard/withdrawals", icon: "wallet" },
    { label: "Payment History", href: "/dashboard/payment-history", icon: "history" },
  ],
  admin: [
    { label: "Home", href: "/dashboard/admin-home", icon: "home" },
    { label: "Manage Users", href: "/dashboard/manage-users", icon: "users" },
    { label: "Manage Campaigns", href: "/dashboard/manage-campaigns", icon: "folder" },
    { label: "Campaign Approvals", href: "/dashboard/campaign-approvals", icon: "check" },
    { label: "Withdrawal Requests", href: "/dashboard/withdrawal-requests", icon: "wallet" },
    { label: "Reports", href: "/dashboard/reports", icon: "flag" },
  ],
};