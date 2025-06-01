
import { Transaction, ProjectedBalance, TransactionType } from '@/types';
import { PROJECTION_DAYS } from '@/constants';

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const calculateProjections = (
  transactions: Transaction[],
  dailySpending: number,
  // initialBalance parameter removed
  startDate: Date = new Date()
): ProjectedBalance[] => {
  const projections: ProjectedBalance[] = [];
  // let currentBalance = initialBalance; // Old line

  // Calculate balance from transactions strictly before the projection startDate
  let balanceAtStartOfProjection = 0;
  transactions.filter(t => t.date < formatDate(startDate)).forEach(t => {
    balanceAtStartOfProjection += t.type === TransactionType.INCOME ? t.amount : -t.amount;
  });
  let currentBalance = balanceAtStartOfProjection; // Initialize currentBalance correctly

  for (let i = 0; i < PROJECTION_DAYS; i++) {
    const projectionDate = new Date(startDate);
    projectionDate.setDate(startDate.getDate() + i);
    const dateStr = formatDate(projectionDate);

    let dailyIncomes = 0;
    let dailyExpenses = 0;

    transactions.forEach(transaction => {
      if (transaction.date === dateStr) {
        if (transaction.type === TransactionType.INCOME) {
          dailyIncomes += transaction.amount;
        } else {
          dailyExpenses += transaction.amount;
        }
      }
    });
    
    // Apply transactions for the current day to the balance *before* deducting daily spending
    // If it's the first day of projection (i.e., today), we use the calculated balanceAtStartOfProjection
    // and then apply today's transactions and daily spending.
    // The balance calculation is the same regardless of i === 0 due to pre-calculation of balanceAtStartOfProjection
    currentBalance = currentBalance + dailyIncomes - dailyExpenses - dailySpending;

    projections.push({
      date: dateStr,
      balance: parseFloat(currentBalance.toFixed(2)),
      dailySpending: dailySpending,
      incomes: dailyIncomes,
      expenses: dailyExpenses,
    });
  }
  return projections;
};

export const calculateCurrentActualBalance = (transactions: Transaction[]): number => {
  const today = new Date();
  const todayStr = formatDate(today);
  let balance = 0;
  transactions.forEach(t => {
    // Sum all transactions up to and including today
    if (t.date <= todayStr) {
       balance += t.type === TransactionType.INCOME ? t.amount : -t.amount;
    }
  });
  return parseFloat(balance.toFixed(2));
};
