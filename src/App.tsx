import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Transaction, AppView } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { NAV_ITEMS } from '@/constants';

import Header from '@/components/Header';
// NavItem is no longer used directly by App.tsx for a sidebar
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import EmergencyFundPage from '@/pages/EmergencyFundPage';
import NetWorthPage from '@/pages/NetWorthPage';
import SettingsPage from '@/pages/SettingsPage';

// Placeholder Pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
    <p className="text-slate-600 mt-2">This page is under construction.</p>
     <span className="material-icons-sharp text-9xl text-slate-300 mt-10">construction</span>
  </div>
);


const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions_v3_fintrack', []);
  const [dailySpending, setDailySpending] = useLocalStorage<number>('dailySpending_v3_fintrack', 50);
  
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const isValidView = NAV_ITEMS.some(item => item.id === hash);
    return (isValidView ? hash : AppView.DASHBOARD) as AppView;
  });

  const navigateToView = (view: AppView) => {
    window.location.hash = view;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const targetView = NAV_ITEMS.find(item => item.id === hash);
      if (targetView) {
        setCurrentView(targetView.id as AppView);
      } else {
         setCurrentView(AppView.DASHBOARD); 
         window.location.hash = AppView.DASHBOARD;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check, also sets hash if it's invalid or empty
    const currentHash = window.location.hash.replace(/^#\/?/, '');
    if (!NAV_ITEMS.some(item => item.id === currentHash)) {
        window.location.hash = AppView.DASHBOARD;
    } else {
        // Ensure currentView is synced with the initial valid hash
        setCurrentView(currentHash as AppView);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Update document title based on current view
  useEffect(() => {
    const activeNavItem = NAV_ITEMS.find(item => item.id === currentView);
    document.title = activeNavItem ? `${activeNavItem.label} - FinTrack` : 'FinTrack';
  }, [currentView]);


  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <DashboardPage transactions={transactions} dailySpending={dailySpending} setDailySpending={setDailySpending} addTransaction={addTransaction} setCurrentView={navigateToView} />;
      case AppView.TRANSACTIONS:
        return <TransactionsPage 
                  transactions={transactions} 
                  addTransaction={addTransaction} 
                  updateTransaction={updateTransaction} 
                  deleteTransaction={deleteTransaction}
                  currentView={currentView} // Pass currentView for sidebar highlighting
                  navigateToView={navigateToView} // Pass navigation function
                />;
      case AppView.EMERGENCY_FUND:
        return <EmergencyFundPage />;
      case AppView.NET_WORTH: // This will be styled as "Investments"
        return <NetWorthPage />;
      case AppView.SETTINGS:
        return <SettingsPage dailySpending={dailySpending} setDailySpending={setDailySpending} />;
      case AppView.BUDGETS:
        return <PlaceholderPage title="Budgets" />;
      case AppView.REPORTS:
        return <PlaceholderPage title="Reports" />;
      default:
         return null; 
    }
  };

  return (
    <HashRouter> 
      <div className="layout-container flex h-full grow flex-col bg-gray-50">
        {/* Only render Header if not on TransactionsPage, or adjust Header based on page */}
        {/* For now, always render Header. TransactionsPage will have its own internal sidebar. */}
        <Header currentView={currentView} />
        <div className="flex-1 flex"> {/* Ensure this flex container allows TransactionsPage to manage its own layout */}
          {renderView()}
          <Routes>
            <Route path="*" element={null} /> 
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;