export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category?: string;
  account?: string; // New field from FinTrack design
}

export interface ProjectedBalance {
  date: string; // YYYY-MM-DD
  balance: number;
  dailySpending: number;
  incomes: number;
  expenses: number;
}

export interface FundContribution {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  description: string;
}

export interface FinancialGoal {
  targetAmount: number;
  contributions: FundContribution[];
}

export enum InvestmentTransactionType {
    BUY = 'Buy',
    SELL = 'Sell',
}

export interface InvestmentTransaction {
    id: string;
    date: string;
    type: InvestmentTransactionType;
    asset: string;
    quantity: number;
    price: number;
    amount: number; // quantity * price
}

export interface AssetAllocation {
    name: string; // e.g., Stocks, Bonds
    percentage: number;
    color: string;
}


export enum AppView {
  DASHBOARD = 'dashboard',
  TRANSACTIONS = 'transactions',
  EMERGENCY_FUND = 'emergency_fund',
  NET_WORTH = 'net_worth', // Will be displayed as "Investments"
  SETTINGS = 'settings',
  BUDGETS = 'budgets', // New potential view
  REPORTS = 'reports', // New potential view
}