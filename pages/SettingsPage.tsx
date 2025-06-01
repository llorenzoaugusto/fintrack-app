import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select'; // For currency, date format etc.
import { CURRENCY_SYMBOL, FINTRACK_TEXT_COLOR_PRIMARY, FINTRACK_TEXT_COLOR_SECONDARY, FINTRACK_TEXT_COLOR_MUTED, FINTRACK_BORDER_COLOR } from '../constants';

interface SettingsPageProps {
  dailySpending: number;
  setDailySpending: (amount: number) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ dailySpending, setDailySpending }) => {
  const [tempDailySpending, setTempDailySpending] = useState(String(dailySpending));
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Dummy state for profile fields
  const [profileName, setProfileName] = useState("Sophia");
  const [profileEmail, setProfileEmail] = useState("sophia@example.com");
  const [profilePhone, setProfilePhone] = useState("");

  // Dummy state for preferences
  const [prefCurrency, setPrefCurrency] = useState("USD");
  const [prefDateFormat, setPrefDateFormat] = useState("MM/DD/YYYY");
  const [prefNotifications, setPrefNotifications] = useState("Email");


  const handleDailySpendingSave = () => {
    const newAmount = parseFloat(tempDailySpending);
    if (!isNaN(newAmount) && newAmount >= 0) {
      setDailySpending(newAmount);
      setFeedbackMessage({type: 'success', text: 'Default daily spending updated successfully!'});
    } else {
      setTempDailySpending(String(dailySpending)); 
      setFeedbackMessage({type: 'error', text: 'Invalid value for daily spending.'});
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };
  
  const handleSaveChanges = () => {
    // Here you would save profileName, profileEmail, etc.
    // And prefCurrency, prefDateFormat, etc.
    // For now, just show a success message.
    handleDailySpendingSave(); // Save daily spending if it's part of "Save Changes"
    setFeedbackMessage({type: 'success', text: 'Settings saved successfully!'});
    setTimeout(() => setFeedbackMessage(null), 3000);
  }


  return (
    <div className="flex-1 px-10 py-8 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className={`text-3xl font-bold leading-tight tracking-tight ${FINTRACK_TEXT_COLOR_PRIMARY}`}>Settings</h1>

        {feedbackMessage && (
            <div className={`p-4 rounded-md text-sm mb-6 ${feedbackMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                {feedbackMessage.text}
            </div>
        )}
        
        {/* Profile Section */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
            <h2 className={`text-xl font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-6`}>Profile</h2>
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Name" id="profileName" value={profileName} onChange={e => setProfileName(e.target.value)} />
                    <Input label="Email" id="profileEmail" type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                </div>
                <Input label="Phone" id="profilePhone" type="tel" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} placeholder="Enter your phone number" />
            </div>
        </div>

        {/* Preferences Section */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
            <h2 className={`text-xl font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-6`}>Preferences</h2>
            <div className="space-y-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Select label="Currency" id="prefCurrency" value={prefCurrency} onChange={e => setPrefCurrency(e.target.value)}
                        options={[{value: "USD", label: "USD - US Dollar"}, {value: "EUR", label: "EUR - Euro"}, {value: "BRL", label: "BRL - Brazilian Real"}]} 
                    />
                    <Select label="Date Format" id="prefDateFormat" value={prefDateFormat} onChange={e => setPrefDateFormat(e.target.value)}
                        options={[{value: "MM/DD/YYYY", label: "MM/DD/YYYY"}, {value: "DD/MM/YYYY", label: "DD/MM/YYYY"}, {value: "YYYY-MM-DD", label: "YYYY-MM-DD"}]}
                    />
                </div>
                 <Select label="Notifications" id="prefNotifications" value={prefNotifications} onChange={e => setPrefNotifications(e.target.value)}
                    options={[{value: "Email", label: "Email"}, {value: "Push", label: "Push Notifications (App Only)"}, {value: "None", label: "None"}]}
                />
                 <div>
                    <label htmlFor="dailySpending" className={`block text-sm font-medium ${FINTRACK_TEXT_COLOR_SECONDARY} mb-1`}>Default Daily Spending ({CURRENCY_SYMBOL})</label>
                    <Input
                        id="dailySpending"
                        type="number"
                        value={tempDailySpending}
                        onChange={(e) => setTempDailySpending(e.target.value)}
                        onBlur={handleDailySpendingSave} // Save on blur for this specific field
                        placeholder="e.g., 50"
                        containerClassName="max-w-xs"
                    />
                    <p className={`text-xs ${FINTRACK_TEXT_COLOR_MUTED} mt-1`}>Used for daily balance projections.</p>
                </div>
            </div>
        </div>
        
        {/* Data Management (Example from old settings page, can be styled) */}
        {/* <div className={`bg-white p-6 rounded-xl shadow-sm border ${FINTRACK_BORDER_COLOR}`}>
             <h2 className={`text-xl font-semibold ${FINTRACK_TEXT_COLOR_PRIMARY} mb-6`}>Data Management</h2>
             ... Export/Import buttons here ...
        </div> */}


        <div className="flex justify-end pt-4">
            <Button 
              variant="fintrack-primary" 
              onClick={handleSaveChanges}
              className="min-w-0 px-6 py-2.5"
            >
              Save Changes
            </Button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
