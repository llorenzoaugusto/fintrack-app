import React, { useState, useMemo } from 'react';
import { Transaction, ProjectedBalance, AppView, TransactionType } from '../types';
import { CURRENCY_SYMBOL, PROJECTION_DAYS, BALANCE_COLORS, FINTRACK_TEXT_COLOR_SECONDARY, FINTRACK_TEXT_COLOR_MUTED, FINTRACK_TEXT_COLOR_PRIMARY, FINTRACK_BACKGROUND_MUTED, FINTRACK_BORDER_COLOR } from '../constants';
import { calculateProjections, calculateCurrentActualBalance } from '../services/projectionService';
import ProjectionChart from '../components/ProjectionChart'; // Will be adapted for simpler chart
import Button from '../components/Button';
import Input from '../components/Input'; // For daily spending if needed directly
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';

interface DashboardPageProps {
  transactions: Transaction[];
  dailySpending: number;
  setDailySpending: (amount: number) => void;
  addTransaction: (transaction: Transaction) => void;
  setCurrentView: (view: AppView) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  transactions,
  dailySpending,
  // setDailySpending, // Daily spending config might move to settings or a modal
  addTransaction,
  setCurrentView
}) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  // const [localDailySpending, setLocalDailySpending] = useState(String(dailySpending)); // Example if editable here

  const currentActualBalance = useMemo(() => calculateCurrentActualBalance(transactions), [transactions]);
  
  const projections: ProjectedBalance[] = useMemo(() => {
    // The initialBalanceForProjection logic has been removed.
    // calculateProjections now determines the starting balance from transactions before startDate.
    return calculateProjections(transactions, dailySpending, new Date());
  }, [transactions, dailySpending]);

  const handleAddTransaction = (transaction: Transaction) => {
    addTransaction(transaction);
    setIsTransactionModalOpen(false);
  };
  
  const projectedBalanceNext3Months = useMemo(() => {
    if (projections.length > 0) {
        // Get the balance at the end of the projection period (or approx 90 days)
        return projections[projections.length -1].balance;
    }
    return currentActualBalance; // fallback
  }, [projections, currentActualBalance]);


  return (
    <div className="flex-1 px-10 py-8 bg-slate-50">
      <div className="mx-auto max-w-6xl"> {/* Increased max-width */}
        <h1 className={`text-3xl font-bold leading-tight tracking-tight ${FINTRACK_TEXT_COLOR_PRIMARY}`}>Dashboard</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Current Balance Card */}
          <div className={`rounded-xl ${FINTRACK_BACKGROUND_MUTED} p-6 shadow-sm md:col-span-1`}>
            <p className={`text-base font-medium leading-normal ${FINTRACK_TEXT_COLOR_SECONDARY}`}>Current Balance</p>
            <p className={`mt-1 text-3xl font-bold leading-tight tracking-tight ${FINTRACK_TEXT_COLOR_PRIMARY}`}>
              {CURRENCY_SYMBOL}{currentActualBalance.toFixed(2)}
            </p>
          </div>

          {/* Projected Balance Card */}
          <div className={`rounded-xl border ${FINTRACK_BORDER_COLOR} p-6 shadow-sm md:col-span-2 bg-white`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-base font-medium leading-normal ${FINTRACK_TEXT_COLOR_SECONDARY}`}>Projected Balance</p>
                <p className={`mt-1 text-3xl font-bold leading-tight tracking-tight ${FINTRACK_TEXT_COLOR_PRIMARY}`}>
                  {CURRENCY_SYMBOL}{projectedBalanceNext3Months.toFixed(2)}
                </p>
                <p className={`mt-1 text-sm font-normal leading-normal ${FINTRACK_TEXT_COLOR_MUTED}`}>Next {PROJECTION_DAYS} Days</p>
              </div>
              <Button 
                variant="fintrack-secondary" 
                size="sm" 
                leftIcon="settings"
                className="px-3 py-1.5 text-xs"
                onClick={() => setCurrentView(AppView.SETTINGS)} // Or open a projection config modal
              >
                Configure
              </Button>
            </div>
            <div className="mt-6 flex h-[180px] flex-1 flex-col gap-4"> {/* Adjusted height and gap */}
              {projections.length > 0 ? (
                 <ProjectionChart projections={projections.slice(0, PROJECTION_DAYS)} simpleMode={true} /> 
              ) : (
                <div className="flex items-center justify-center h-full">
                    <p className={FINTRACK_TEXT_COLOR_MUTED}>No projection data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className={`text-xl font-semibold leading-tight tracking-tight ${FINTRACK_TEXT_COLOR_PRIMARY}`}>Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <Button 
              variant="fintrack-primary" 
              leftIcon="add_circle_outline"
              onClick={() => setIsTransactionModalOpen(true)}
            >
              Add Transaction
            </Button>
            <Button 
              variant="fintrack-secondary" 
              leftIcon="create_new_folder"
              onClick={() => {
                // Potentially navigate to Budgets page if/when created
                // setCurrentView(AppView.BUDGETS); 
                alert("Create Budget - Coming soon!");
              }}
            >
              Create Budget
            </Button>
            <Button 
              variant="fintrack-secondary" 
              leftIcon="insights"
               onClick={() => {
                // Potentially navigate to Reports page if/when created
                // setCurrentView(AppView.REPORTS);
                alert("View Reports - Coming soon!");
              }}
            >
              View Reports
            </Button>
            <Button 
              variant="fintrack-secondary" 
              leftIcon="account_balance_wallet"
              onClick={() => alert("Manage Accounts - Coming soon!")}
            >
              Manage Accounts
            </Button>
          </div>
        </div>
        
        {/* Optional: Detailed Projections (can be a separate section or page) */}
        {/* <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Detailed Projections</h2>
          {projections.length > 0 ? (
            <ProjectionTable projections={projections} />
          ) : (
            <p className="text-slate-500">No projection data to display.</p>
          )}
        </div> */}

      </div>
      <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} title="Add New Transaction" size="lg">
        <TransactionForm 
          onSubmit={handleAddTransaction}
          onCancel={() => setIsTransactionModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
