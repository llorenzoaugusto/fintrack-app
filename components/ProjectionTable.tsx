import React from 'react';
import { ProjectedBalance } from '../types';
import { CURRENCY_SYMBOL, BALANCE_COLORS, FINTRACK_TEXT_COLOR_MUTED, FINTRACK_TEXT_COLOR_SECONDARY, FINTRACK_BORDER_COLOR } from '../constants';
import { formatDisplayDate } from '../../utils/dateUtils';

interface ProjectionTableProps {
  projections: ProjectedBalance[];
}

const ProjectionTable: React.FC<ProjectionTableProps> = ({ projections }) => {
  if (!projections.length) {
    return <p className={FINTRACK_TEXT_COLOR_MUTED}>No projection data to display.</p>;
  }

  const getBalanceColorClass = (balance: number) => {
    if (balance > 100) return BALANCE_COLORS.positive;
    if (balance >= 0) return BALANCE_COLORS.neutral; // Or a less prominent positive
    return BALANCE_COLORS.negative;
  };

  return (
    <div className={`overflow-x-auto bg-white shadow-sm rounded-xl border ${FINTRACK_BORDER_COLOR}`}>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase tracking-wider`}>Date</th>
            <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase tracking-wider`}>Income</th>
            <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase tracking-wider`}>Fixed Expenses</th>
            <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase tracking-wider`}>Daily Spending</th>
            <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase tracking-wider`}>Projected Balance</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {projections.map((item) => (
            <tr key={item.date} className="hover:bg-slate-50 transition-colors">
              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${FINTRACK_TEXT_COLOR_SECONDARY}`}>{formatDisplayDate(item.date, 'shortWithYear')}</td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${item.incomes > 0 ? BALANCE_COLORS.positive : FINTRACK_TEXT_COLOR_SECONDARY}`}>
                {CURRENCY_SYMBOL}{item.incomes.toFixed(2)}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${item.expenses > 0 ? BALANCE_COLORS.negative : FINTRACK_TEXT_COLOR_SECONDARY}`}>
                {CURRENCY_SYMBOL}{item.expenses.toFixed(2)}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${item.dailySpending > 0 ? BALANCE_COLORS.negative : FINTRACK_TEXT_COLOR_SECONDARY}`}>
                {CURRENCY_SYMBOL}{item.dailySpending.toFixed(2)}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold text-right ${getBalanceColorClass(item.balance)}`}>
                {CURRENCY_SYMBOL}{item.balance.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectionTable;
