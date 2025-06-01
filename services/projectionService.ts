
import { Transaction, ProjectedBalance, TransactionType } from '../types';
import { PROJECTION_DAYS } from '../constants';

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const calculateProjections = (
  transactions: Transaction[],
  dailySpending: number,
  initialBalance: number = 0, // If not based on past transactions
  startDate: Date = new Date()
): ProjectedBalance[] => {
  const projections: ProjectedBalance[] = [];
  let currentBalance = initialBalance;

  // Calculate actual current balance from past transactions if initialBalance is not explicitly set
  // For this version, we'll consider transactions on or before 'startDate' to establish the starting point.
  // A more robust way would be to have a dedicated "Initial Balance" entry.
  // For now, let's sum up all transactions BEFORE the projection start date to get a starting balance.
  const todayStr = formatDate(new Date());
  
  let effectiveInitialBalance = 0;
  transactions.filter(t => t.date < formatDate(startDate)).forEach(t => {
    effectiveInitialBalance += t.type === TransactionType.INCOME ? t.amount : -t.amount;
  });
  currentBalance = effectiveInitialBalance;


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
    // If it's the first day of projection (i.e., today), we use the calculated effectiveInitialBalance
    // and then apply today's transactions and daily spending.
    if (i === 0) {
         currentBalance = currentBalance + dailyIncomes - dailyExpenses - dailySpending;
    } else {
         currentBalance = currentBalance + dailyIncomes - dailyExpenses - dailySpending;
    }
    

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
