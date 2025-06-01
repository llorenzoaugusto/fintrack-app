import React, { useState, useMemo } from 'react';
import { InvestmentTransaction, InvestmentTransactionType, AssetAllocation } from '../types'; // Using FundContribution and FinancialGoal for underlying data for now
import { useLocalStorage } from '../hooks/useLocalStorage';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { CURRENCY_SYMBOL, FINTRACK_TEXT_COLOR_PRIMARY, FINTRACK_TEXT_COLOR_SECONDARY, FINTRACK_TEXT_COLOR_MUTED, FINTRACK_BORDER_COLOR, CHART_COLORS } from '../constants';
import { formatDisplayDate } from '../utils/dateUtils';

interface StoredNetWorthData {
    targetAmount?: number; // Optional target
    transactions: InvestmentTransaction[];
}

// Dummy data for Asset Allocation
const initialAssetAllocation: AssetAllocation[] = [
    { name: 'Stocks', percentage: 30, color: CHART_COLORS.stocks },
    { name: 'Bonds', percentage: 30, color: CHART_COLORS.bonds },
    { name: 'Crypto', percentage: 20, color: CHART_COLORS.crypto },
    { name: 'Real Estate', percentage: 20, color: CHART_COLORS.realEstate },
];


const NetWorthPage: React.FC = () => {
  const [netWorthData, setNetWorthData] = useLocalStorage<StoredNetWorthData>('netWorth_v3_fintrack', {
    transactions: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [asset, setAsset] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<InvestmentTransactionType>(InvestmentTransactionType.BUY);

  // Calculate Total Value and other metrics from transactions
  const portfolioMetrics = useMemo(() => {
    let totalValue = 0;
    let totalInvested = 0;
    // More complex logic needed for actual returns (considering sales, dividends etc.)
    // This is a simplified version for display
    netWorthData.transactions.forEach(t => {
      if (t.type === InvestmentTransactionType.BUY) {
        totalValue += t.amount; // Assuming amount is current value if not sold
        totalInvested += t.amount;
      } else { // SELL
        totalValue -= t.amount; // Simplified: value removed
        // Actual return calculation is complex.
      }
    });
    const totalReturn = totalValue - totalInvested; // Very simplified return
    // Annualized return would need time periods and more complex formula
    return { totalValue, totalReturn, annualizedReturn: totalReturn > 0 ? 12.50 : 0.00 }; // Dummy annualized
  }, [netWorthData.transactions]);


  const handleAddInvestmentTransaction = () => {
    const q = parseFloat(quantity);
    const p = parseFloat(price);
    if (isNaN(q) || q <= 0 || isNaN(p) || p <= 0 || !asset.trim() || !date) {
      alert('Please fill all fields correctly.');
      return;
    }
    const newTransaction: InvestmentTransaction = {
      id: crypto.randomUUID(),
      date,
      type,
      asset,
      quantity: q,
      price: p,
      amount: q * p,
    };
    setNetWorthData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }));
    // Reset form
    setAsset(''); setQuantity(''); setPrice(''); setDate(new Date().toISOString().split('T')[0]); setType(InvestmentTransactionType.BUY);
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Delete this investment transaction?')) {
      setNetWorthData(prev => ({
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id),
      }));
    }
  };

  // Dummy data for performance chart
  const performanceData = useMemo(() => {
    if (netWorthData.transactions.length === 0) return [];
    let currentValue = 0;
    const sortedByDate = [...netWorthData.transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const chartData: {name: string, value: number}[] = [];

    // Create monthly snapshots
    const monthlySnapshots: {[key: string]: number} = {};
    sortedByDate.forEach(tx => {
        if (tx.type === InvestmentTransactionType.BUY) {
            currentValue += tx.amount;
        } else {
            currentValue -= tx.amount; // Simplified
        }
        const monthYear = formatDisplayDate(tx.date, 'monthYearOnly');
        monthlySnapshots[monthYear] = currentValue;
    });
    
    // Convert to chart format, ensuring we have some trend
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - 5); // Start 6 months ago
    for(let i = 0; i < 6; i++) {
        const dateKey = formatDisplayDate(baseDate.toISOString().split('T')[0], 'monthYearOnly');
        chartData.push({
            name: formatDisplayDate(baseDate.toISOString().split('T')[0], 'shortMonthOnly'),
            value: monthlySnapshots[dateKey] || (chartData[i-1]?.value || 0) // Carry forward if no data for month
        });
        baseDate.setMonth(baseDate.getMonth() + 1);
    }
    // Add current value as last point if more recent than last snapshot
    const lastSnapshotMonth = chartData[chartData.length-1]?.name;
    const currentFormattedDate = new Date().toISOString().split('T')[0];
    const currentMonth = formatDisplayDate(currentFormattedDate, 'shortMonthOnly');
    if(lastSnapshotMonth !== currentMonth && netWorthData.transactions.length > 0) { // Ensure there are transactions before adding current month
        chartData.push({name: currentMonth, value: currentValue});
    }
    
    return chartData.slice(-6); // Max 6 points for simplicity
  }, [netWorthData.transactions]);

  return (
    <div className="flex-1 px-10 py-8 bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className={`text-3xl font-bold leading-tight tracking-tight ${FINTRACK_TEXT_COLOR_PRIMARY}`}>Investments</h1>
                <p className={`${FINTRACK_TEXT_COLOR_MUTED} mt-1`}>Track your portfolio performance and monitor growth over time.</p>
            </div>
            <Button 
                variant="fintrack-primary" 
                leftIcon="add_circle_outline"
                onClick={() => setIsModalOpen(true)}
                className="min-w-0 px-4 py-2"
            >
              Add Investment
            </Button>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
                <p className={`text-sm font-medium ${FINTRACK_TEXT_COLOR_SECONDARY}`}>Total Value</p>
                <p className={`mt-1 text-2xl font-bold ${FINTRACK_TEXT_COLOR_PRIMARY}`}>{CURRENCY_SYMBOL}{portfolioMetrics.totalValue.toFixed(2)}</p>
                {/* <p className="text-xs text-green-500 mt-0.5">↑ 1.2%</p> */}
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
                <p className={`text-sm font-medium ${FINTRACK_TEXT_COLOR_SECONDARY}`}>Total Return (Simplified)</p>
                <p className={`mt-1 text-2xl font-bold ${portfolioMetrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>{CURRENCY_SYMBOL}{portfolioMetrics.totalReturn.toFixed(2)}</p>
                {/* <p className="text-xs text-green-500 mt-0.5">↑ 0.5%</p> */}
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
                <p className={`text-sm font-medium ${FINTRACK_TEXT_COLOR_SECONDARY}`}>Annualized Return (Dummy)</p>
                <p className={`mt-1 text-2xl font-bold ${FINTRACK_TEXT_COLOR_PRIMARY}`}>{portfolioMetrics.annualizedReturn.toFixed(2)}%</p>
                {/* <p className="text-xs text-green-500 mt-0.5">↑ 0.2%</p> */}
            </div>
        </div>
        
        {/* Asset Allocation & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
                <h2 className={`text-lg font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-3`}>Asset Allocation</h2>
                <div className="space-y-3">
                    {initialAssetAllocation.map(asset => (
                        <div key={asset.name}>
                            <div className="flex justify-between text-xs mb-0.5">
                                <span className={FINTRACK_TEXT_COLOR_SECONDARY}>{asset.name}</span>
                                <span className={FINTRACK_TEXT_COLOR_PRIMARY}>{asset.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className="h-2 rounded-full" style={{width: `${asset.percentage}%`, backgroundColor: asset.color}}></div>
                            </div>
                        </div>
                    ))}
                </div>
                 {/* Small chart placeholder */}
                <div className="mt-4 h-32 bg-slate-100 rounded flex items-center justify-center">
                    <span className="material-icons-sharp text-4xl text-slate-400">signal_cellular_alt</span> 
                    {/* Placeholder for small bar chart visual */}
                </div>
            </div>

            <div className={`lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
                <h2 className={`text-lg font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-1`}>Performance Over Time</h2>
                <div className="h-72"> {/* Approx height from design */}
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData.length > 0 ? performanceData : [{name: 'Start', value: 0}, {name: 'Now', value: 0}]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs><linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.projectedLine} stopOpacity={0.1}/><stop offset="95%" stopColor={CHART_COLORS.projectedLine} stopOpacity={0}/></linearGradient></defs>
                            <XAxis dataKey="name" tick={{fontSize: 10}} stroke={CHART_COLORS.FINTRACK_TEXT_MUTED_HEX} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(val) => `${CURRENCY_SYMBOL}${val/1000}k`} tick={{fontSize: 10}} stroke={CHART_COLORS.FINTRACK_TEXT_MUTED_HEX} axisLine={false} tickLine={false} width={40}/>
                            <Tooltip formatter={(value: number) => [`${CURRENCY_SYMBOL}${value.toFixed(2)}`, "Value"]} />
                            <Area type="monotone" dataKey="value" stroke={CHART_COLORS.projectedLine} fill="url(#perfFill)" strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Recent Transactions */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
          <h2 className={`text-xl font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-4`}>Recent Transactions</h2>
          {netWorthData.transactions.length === 0 ? (
            <p className={FINTRACK_TEXT_COLOR_MUTED}>No investment transactions recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className={`py-2 px-3 text-left text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Date</th>
                    <th className={`py-2 px-3 text-left text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Type</th>
                    <th className={`py-2 px-3 text-left text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Asset</th>
                    <th className={`py-2 px-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Quantity</th>
                    <th className={`py-2 px-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Price</th>
                    <th className={`py-2 px-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Amount</th>
                    <th className={`py-2 px-3 text-right text-xs font-medium ${FINTRACK_TEXT_COLOR_MUTED} uppercase`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {netWorthData.transactions.slice(0, 5).map(tx => ( // Show last 5
                    <tr key={tx.id} className={`border-b ${FINTRACK_BORDER_COLOR} last:border-b-0 hover:bg-slate-50`}>
                      <td className={`py-3 px-3 text-sm ${FINTRACK_TEXT_COLOR_SECONDARY}`}>{formatDisplayDate(tx.date, 'shortWithYear')}</td>
                      <td className={`py-3 px-3 text-sm ${tx.type === InvestmentTransactionType.BUY ? 'text-green-600' : 'text-red-600'}`}>{tx.type}</td>
                      <td className={`py-3 px-3 text-sm font-medium ${FINTRACK_TEXT_COLOR_PRIMARY}`}>{tx.asset}</td>
                      <td className={`py-3 px-3 text-sm text-right ${FINTRACK_TEXT_COLOR_SECONDARY}`}>{tx.quantity.toFixed(2)}</td>
                      <td className={`py-3 px-3 text-sm text-right ${FINTRACK_TEXT_COLOR_SECONDARY}`}>{CURRENCY_SYMBOL}{tx.price.toFixed(2)}</td>
                      <td className={`py-3 px-3 text-sm text-right font-medium ${FINTRACK_TEXT_COLOR_PRIMARY}`}>{CURRENCY_SYMBOL}{tx.amount.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTransaction(tx.id)} className="text-red-500 hover:text-red-700 p-1">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Investment Transaction" size="md">
        <div className="space-y-4">
          <Input label="Asset Name" value={asset} onChange={e => setAsset(e.target.value)} placeholder="e.g., Stock XYZ, Bitcoin" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g., 10" />
            <Input label="Price per Unit" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 150.75" />
          </div>
          <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <Select label="Transaction Type" value={type} onChange={e => setType(e.target.value as InvestmentTransactionType)}
            options={[ {value: InvestmentTransactionType.BUY, label: "Buy"}, {value: InvestmentTransactionType.SELL, label: "Sell"} ]}
          />
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="fintrack-secondary" onClick={() => setIsModalOpen(false)} className="min-w-0 px-4 py-2">Cancel</Button>
            <Button variant="fintrack-primary" onClick={handleAddInvestmentTransaction} className="min-w-0 px-4 py-2">Save Transaction</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NetWorthPage;