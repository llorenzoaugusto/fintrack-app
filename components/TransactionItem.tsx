import React from 'react';
import { Transaction, TransactionType } from '../types';
import { CURRENCY_SYMBOL, BALANCE_COLORS } from '../constants';
import Button from './Button';

// THIS COMPONENT IS DEPRECATED in favor of table rows in TransactionsPage.tsx

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit, onDelete }) => {
  const isExpense = transaction.type === TransactionType.EXPENSE;
  const amountColor = isExpense ? BALANCE_COLORS.negative : BALANCE_COLORS.positive;
  const formattedAmount = `${isExpense ? '-' : '+'} ${CURRENCY_SYMBOL} ${transaction.amount.toFixed(2)}`;
  
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white shadow rounded-lg mb-3 hover:shadow-md transition-shadow">
      <div className="flex-grow mb-2 sm:mb-0">
        <div className="flex items-center">
          <span className={`mr-3 text-xl ${isExpense ? 'text-red-500' : 'text-green-500'}`}>
            <i className={`fas ${isExpense ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
          </span>
          <p className="font-semibold text-slate-800 text-lg">{transaction.description}</p>
        </div>
        <div className="text-sm text-slate-500 mt-1 ml-9 sm:ml-0 sm:flex sm:items-center">
          <span>{formatDate(transaction.date)}</span>
          {transaction.category && <span className="mx-1 sm:mx-2 hidden sm:inline">•</span>}
          {transaction.category && <span className="block sm:inline mt-1 sm:mt-0"><i className="fas fa-tag mr-1"></i>{transaction.category}</span>}
        </div>
      </div>
      <div className="flex items-center w-full sm:w-auto">
        <p className={`text-lg font-semibold ${amountColor} mr-4 sm:mr-6 flex-grow sm:flex-grow-0 text-right sm:text-left`}>{formattedAmount}</p>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)} aria-label="Editar">
            <i className="fas fa-pencil-alt"></i>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(transaction.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50" aria-label="Deletar">
            <i className="fas fa-trash-alt"></i>
          </Button>
        </div>
      </div>
    </li>
  );
};

export default TransactionItem;
