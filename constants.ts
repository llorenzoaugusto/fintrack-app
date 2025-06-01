import { AppView } from './types';

export const APP_NAME = "FinTrack";
export const PROJECTION_DAYS = 90; // Number of days to project into the future
export const CURRENCY_SYMBOL = "$"; // Default to USD for FinTrack design

export const NAV_ITEMS = [
  { id: AppView.DASHBOARD, label: 'Dashboard', icon: 'space_dashboard' },
  { id: AppView.TRANSACTIONS, label: 'Transactions', icon: 'receipt_long' },
  // { id: AppView.BUDGETS, label: 'Budgets', icon: 'inventory' }, // Placeholder if Budgets page is added
  { id: AppView.EMERGENCY_FUND, label: 'Emergency Fund', icon: 'savings' },
  { id: AppView.NET_WORTH, label: 'Investments', icon: 'trending_up' }, // NetWorth page will be styled as "Investments"
  // { id: AppView.REPORTS, label: 'Reports', icon: 'assessment' }, // Placeholder if Reports page is added
  { id: AppView.SETTINGS, label: 'Settings', icon: 'settings' },
];

export const BALANCE_COLORS = {
  positive: 'text-green-600', // Standard green for positive values
  neutral: 'text-yellow-600', // Standard yellow for neutral/near-zero
  negative: 'text-red-600',   // Standard red for negative values
  fintracPositive: 'text-green-600', // FinTrack might use different shades
  fintracNegative: 'text-red-600',
  fintracNeutralText: 'text-slate-700',
  fintracValueText: 'text-slate-900',
};

export const CHART_COLORS = {
  balance: '#4CAF50', 
  projectedLine: '#1978e5', // Blue from FinTrack chart
  projectedArea: '#e7edf3', // Light blue/gray area fill from FinTrack chart
  income: '#8BC34A', 
  expense: '#F44336',
  investmentBar: '#60a5fa', // Example: blue-400 for asset allocation
  stocks: '#818cf8', // indigo-400
  bonds: '#fbbf24', // amber-400
  crypto: '#34d399', // emerald-400
  realEstate: '#f87171', // red-400
  FINTRACK_TEXT_MUTED_HEX: '#64748b', // slate-500 hex value
};

export const FINTRACK_PRIMARY_COLOR = 'blue-600';
export const FINTRACK_TEXT_COLOR_PRIMARY = 'text-slate-900';
export const FINTRACK_TEXT_COLOR_SECONDARY = 'text-slate-700';
export const FINTRACK_TEXT_COLOR_MUTED = 'text-slate-500';
export const FINTRACK_BORDER_COLOR = 'border-slate-200';
export const FINTRACK_BACKGROUND_MUTED = 'bg-slate-100';