// Shared TypeScript types mirroring the server's Mongoose models & API responses.

export type UserRole = "supporter" | "creator" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: UserRole;
  credits: number;
  createdAt: string;
}

export type CampaignStatus = "pending" | "approved" | "rejected";
export type CampaignCategory =
  | "Technology"
  | "Art"
  | "Community"
  | "Health"
  | "Education"
  | "Environment"
  | "Other";

export interface ICampaign {
  _id: string;
  title: string;
  shortDescription: string;
  story: string;
  category: CampaignCategory;
  fundingGoal: number;
  minimumContribution: number;
  deadline: string;
  rewardInfo: string;
  imageURL: string;
  creatorName: string;
  creatorEmail: string;
  amountRaised: number;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContributionStatus = "pending" | "approved" | "rejected";

export interface IContribution {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  contributionAmount: number;
  supporterEmail: string;
  supporterName: string;
  creatorName: string;
  creatorEmail: string;
  message?: string;
  status: ContributionStatus;
  date: string;
}

export interface INotification {
  _id: string;
  message: string;
  toEmail: string;
  actionRoute: string;
  isRead: boolean;
  time: string;
}

export interface IPayment {
  _id: string;
  userEmail: string;
  userName: string;
  credits: number;
  amount: number;
  paymentSystem: string;
  transactionId: string;
  status: string;
  date: string;
}

export type WithdrawalStatus = "pending" | "approved" | "rejected";
export type PaymentSystem = "Stripe" | "Bkash" | "Rocket" | "Nagad" | "Other";

export interface IWithdrawal {
  _id: string;
  creatorEmail: string;
  creatorName: string;
  withdrawalCredit: number;
  withdrawalAmount: number;
  paymentSystem: PaymentSystem;
  accountNumber: string;
  status: WithdrawalStatus;
  withdrawDate: string;
}

export interface IReport {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface CreditPackage {
  credits: number;
  amount: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---- API response envelopes ----
export interface ApiSuccess<T> {
  success: true;
  [key: string]: unknown;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
}
