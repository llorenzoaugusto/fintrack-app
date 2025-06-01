import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, AppView } from '../types';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
// Button, Input, Select might be used in modal or future filters
import { CURRENCY_SYMBOL } from '../constants';
import PageSpecificSidebar from '../components/PageSpecificSidebar'; // Import the new sidebar

interface TransactionsPageProps {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  currentView: AppView; // For sidebar highlighting
  navigateToView: (view: AppView) => void; // For sidebar navigation
}

const ITEMS_PER_PAGE = 10; 

const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  currentView,
  navigateToView,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'recurring'>('all');

  const openModalForNew = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (transaction: Transaction) => {
    if (editingTransaction) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      deleteTransaction(id);
    }
  };
  
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    if (activeTab === 'recurring') {
      filtered = []; 
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(lowerSearchTerm) ||
        (t.category && t.category.toLowerCase().includes(lowerSearchTerm)) ||
        (t.account && t.account.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted;

  }, [transactions, searchTerm, activeTab]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const totalResults = filteredAndSortedTransactions.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); 
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };
  
  const getCategoryColorClasses = (category?: string, type?: TransactionType): string => {
    if (type === TransactionType.INCOME && (!category || category.toLowerCase() === 'income')) {
        return 'bg-green-100 text-green-800';
    }
    switch (category?.toLowerCase()) {
        case 'food': return 'bg-red-100 text-red-800';
        case 'salary': case 'income': return 'bg-green-100 text-green-800';
        case 'housing': return 'bg-yellow-100 text-yellow-800';
        case 'shopping': return 'bg-purple-100 text-purple-800';
        case 'utilities': return 'bg-blue-100 text-blue-800';
        case 'transportation': return 'bg-indigo-100 text-indigo-800';
        case 'health': return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-700';
    }
  };


  return (
    <div className="flex flex-1 bg-gray-50"> {/* This page will manage its own flex layout */}
      <PageSpecificSidebar 
        currentView={currentView} 
        navigateToView={navigateToView} 
      />
      <main className="flex-1 p-6 overflow-y-auto"> {/* Main content area for transactions */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Transactions</h2>
          <button 
            onClick={openModalForNew}
            className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span className="material-icons-outlined text-lg">add</span>
            <span className="truncate">New Transaction</span>
          </button>
        </header>

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex flex-col items-center justify-center pb-3 pt-4 px-4 text-sm transition-colors ${
                activeTab === 'all' 
                  ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' 
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setActiveTab('recurring')}
              className={`flex flex-col items-center justify-center pb-3 pt-4 px-4 text-sm transition-colors ${
                activeTab === 'recurring' 
                  ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' 
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
              }`}
            >
              Recurring
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center w-full bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <div className="pl-4 pr-2 text-gray-400">
              <span className="material-icons-outlined">search</span>
            </div>
            <input 
              className="form-input flex-1 w-full min-w-0 resize-none overflow-hidden text-gray-900 border-none focus:outline-none focus:ring-0 h-11 placeholder:text-gray-400 text-base font-normal" 
              placeholder="Search transactions by description, category..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </label>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-16 px-6">
              <span className="material-icons-outlined text-6xl text-gray-300 mb-3">search_off</span>
              <p className="text-gray-600 text-lg">
                {transactions.length === 0 ? "No transactions recorded yet." : "No transactions match your current filters."}
              </p>
              {transactions.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">Click "New Transaction" to add your first one!</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-[15%]">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-[30%]">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-[15%]">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-[15%]">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-[15%]">Account</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(transaction.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">{transaction.description}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {transaction.category ? (
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClasses(transaction.category, transaction.type)}`}>
                                {transaction.category}
                           </span>
                        ) : (
                            <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right whitespace-nowrap font-medium ${transaction.type === TransactionType.EXPENSE ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.type === TransactionType.EXPENSE ? '-' : '+'}{CURRENCY_SYMBOL}{transaction.amount.toFixed(2)}
                      </td>
                       <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{transaction.account || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right whitespace-nowrap">
                        <button onClick={() => openModalForEdit(transaction)} className="text-blue-600 hover:text-blue-800 mr-2 p-1" aria-label="Edit Transaction">
                          <span className="material-icons-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(transaction.id)} className="text-red-600 hover:text-red-800 p-1" aria-label="Delete Transaction">
                           <span className="material-icons-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
           {totalPages > 0 && (
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-sm text-gray-600">
                      Showing {Math.min(1 + (currentPage - 1) * ITEMS_PER_PAGE, totalResults)} to {Math.min(currentPage * ITEMS_PER_PAGE, totalResults)} of {totalResults} results
                  </p>
                  <div className="flex gap-2">
                      <button 
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                      >
                          Previous
                      </button>
                      <button 
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                      >
                          Next
                      </button>
                  </div>
              </div>
          )}
        </div>


        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
          title={editingTransaction ? 'Edit Transaction' : 'New Transaction'}
          size="lg"
        >
          <TransactionForm
            onSubmit={handleFormSubmit}
            onCancel={() => { setIsModalOpen(false); setEditingTransaction(null); }}
            initialData={editingTransaction}
          />
        </Modal>
      </main>
    </div>
  );
};

export default TransactionsPage;