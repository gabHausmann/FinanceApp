// ============================================================
// TYPES — FinanceApp
// ============================================================

export type TransactionType = 'income' | 'expense';

export type SubscriptionPlan = 'free' | 'premium' | 'business';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  date: string; // ISO string
  account: string;
  note?: string;
  imageUri?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
}

export interface User {
  name: string;
  email: string;
  avatarUri?: string;
  plan: SubscriptionPlan;
}

export interface MonthSummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  category: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
  count: number;
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  TransactionForm: { type?: TransactionType } | undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Reports: undefined;
  Subscriptions: undefined;
  Profile: undefined;
};
