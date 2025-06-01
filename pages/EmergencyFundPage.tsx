import React, { useState, useMemo } from 'react';
import { FinancialGoal, FundContribution } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { CURRENCY_SYMBOL, FINTRACK_TEXT_COLOR_PRIMARY, FINTRACK_TEXT_COLOR_SECONDARY, FINTRACK_TEXT_COLOR_MUTED, FINTRACK_BORDER_COLOR, FINTRACK_BACKGROUND_MUTED } from '../constants';

const EmergencyFundPage: React.FC = () => {
  const [goal, setGoal] = useLocalStorage<FinancialGoal>('emergencyFundGoal_v3_fintrack', {
    targetAmount: 10000,
    contributions: [],
  });
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionDescription, setContributionDescription] = useState('');
  const [contributionDate, setContributionDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTargetAmount, setNewTargetAmount] = useState(String(goal.targetAmount));

  const totalContributed = useMemo(() => {
    return goal.contributions.reduce((sum, c) => sum + c.amount, 0);
  }, [goal.contributions]);

  const progressPercentage = useMemo(() => {
    if (goal.targetAmount <= 0) return 0;
    return Math.min((totalContributed / goal.targetAmount) * 100, 100);
  }, [totalContributed, goal.targetAmount]);

  const handleAddContribution = () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || !contributionDescription.trim() || !contributionDate) {
      alert('Please fill in all fields correctly.');
      return;
    }
    const newContribution: FundContribution = {
      id: crypto.randomUUID(),
      date: contributionDate,
      amount: amount,
      description: contributionDescription,
    };
    setGoal(prevGoal => ({
      ...prevGoal,
      contributions: [...prevGoal.contributions, newContribution].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }));
    setContributionAmount('');
    setContributionDescription('');
    setContributionDate(new Date().toISOString().split('T')[0]);
    setIsContributionModalOpen(false);
  };
  
  const handleDeleteContribution = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contribution record?')) {
        setGoal(prevGoal => ({
            ...prevGoal,
            contributions: prevGoal.contributions.filter(c => c.id !== id),
        }));
    }
  };

  const handleSaveSettings = () => {
    const target = parseFloat(newTargetAmount);
    if (!isNaN(target) && target >= 0) {
      setGoal(prevGoal => ({ ...prevGoal, targetAmount: target }));
      setIsSettingsModalOpen(false);
    } else {
      alert('Invalid target amount.');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Ensure local date
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 px-10 py-8 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-8"> {/* Centered and spaced content */}
        <div className="flex justify-between items-center">
            <h1 className={`text-3xl font-bold leading-tight tracking-tight ${FINTRACK_TEXT_COLOR_PRIMARY}`}>Emergency Fund Goal</h1>
            <Button 
                variant="fintrack-secondary" 
                size="sm" 
                leftIcon="settings"
                className="px-3 py-1.5 text-xs"
                onClick={() => setIsSettingsModalOpen(true)}
            >
                Edit Goal
            </Button>
        </div>
        
        {/* Progress Section */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
            <div className="flex justify-between items-baseline mb-1">
                <span className={`text-base font-medium ${FINTRACK_TEXT_COLOR_SECONDARY}`}>Progress</span>
                <span className={`text-sm font-semibold text-blue-600`}>
                    {CURRENCY_SYMBOL}{totalContributed.toFixed(2)} / {CURRENCY_SYMBOL}{goal.targetAmount.toFixed(2)}
                </span>
            </div>
            <div className={`w-full ${FINTRACK_BACKGROUND_MUTED} rounded-full h-3 my-2`}> {/* Adjusted height and margin */}
                <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <p className={`text-right text-xs ${FINTRACK_TEXT_COLOR_MUTED} mt-1`}>{progressPercentage.toFixed(1)}% complete</p>
        </div>

        {/* Make a Contribution Section */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
            <h2 className={`text-xl font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-4`}>Make a Contribution</h2>
             {/* Simplified: Button to open modal */}
            <Button 
                variant="fintrack-primary" 
                leftIcon="add_circle_outline"
                onClick={() => setIsContributionModalOpen(true)}
                className="w-full md:w-auto"
            >
              Add / Withdraw Funds
            </Button>
        </div>
        
        {/* Contribution History */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
          <h2 className={`text-xl font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-4`}>Contribution History</h2>
          {goal.contributions.length === 0 ? (
            <p className={FINTRACK_TEXT_COLOR_MUTED}>No contributions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className={`py-2 px-3 text-left text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Date</th>
                    <th className={`py-2 px-3 text-left text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Description</th>
                    <th className={`py-2 px-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Amount</th>
                    <th className={`py-2 px-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {goal.contributions.map(c => (
                    <tr key={c.id} className={`border-b ${FINTRACK_BORDER_COLOR} last:border-b-0 hover:bg-slate-50`}>
                      <td className={`py-3 px-3 text-sm ${FINTRACK_TEXT_COLOR_SECONDARY}`}>{formatDate(c.date)}</td>
                      <td className={`py-3 px-3 text-sm ${FINTRACK_TEXT_COLOR_PRIMARY}`}>{c.description}</td>
                      <td className={`py-3 px-3 text-sm text-right font-medium ${c.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {c.amount >= 0 ? '+' : '-'} {CURRENCY_SYMBOL}{Math.abs(c.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right">
                         <Button variant="ghost" size="sm" onClick={() => handleDeleteContribution(c.id)} className="text-red-500 hover:text-red-700 p-1">
                           <span className="material-icons-sharp text-lg">delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isContributionModalOpen} onClose={() => setIsContributionModalOpen(false)} title="Record Contribution / Withdrawal" size="md">
        <div className="space-y-4">
          <Input
            label="Description"
            value={contributionDescription}
            onChange={(e) => setContributionDescription(e.target.value)}
            placeholder="e.g., Monthly deposit, Emergency expense"
          />
          <Input
            label="Amount (use negative for withdrawals)"
            type="number"
            step="0.01"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            placeholder="e.g., 500 or -200"
          />
          <Input
            label="Date"
            type="date"
            value={contributionDate}
            onChange={(e) => setContributionDate(e.target.value)}
          />
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="fintrack-secondary" onClick={() => setIsContributionModalOpen(false)} className="min-w-0 px-4 py-2">Cancel</Button>
            <Button variant="fintrack-primary" onClick={handleAddContribution} className="min-w-0 px-4 py-2">Save</Button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Edit Emergency Fund Goal" size="sm">
        <div className="space-y-4">
            <Input 
                label="Target Amount"
                type="number"
                step="100"
                value={newTargetAmount}
                onChange={(e) => setNewTargetAmount(e.target.value)}
                placeholder="e.g., 15000"
            />
            <div className="flex justify-end space-x-3 pt-2">
                <Button variant="fintrack-secondary" onClick={() => setIsSettingsModalOpen(false)} className="min-w-0 px-4 py-2">Cancel</Button>
                <Button variant="fintrack-primary" onClick={handleSaveSettings} className="min-w-0 px-4 py-2">Save Goal</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmergencyFundPage;
