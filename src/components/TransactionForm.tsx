import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
  initialData?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState(''); // New field
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setAmount(String(initialData.amount));
      setDate(initialData.date);
      setType(initialData.type);
      setCategory(initialData.category || '');
      setAccount(initialData.account || '');
    } else {
      // Reset form for new transaction
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setType(TransactionType.EXPENSE);
      setCategory('');
      setAccount('');
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required.';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number.';
    }
    if (!date) newErrors.date = 'Date is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const transactionData: Transaction = {
      id: initialData?.id || crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      date,
      type,
      category: category.trim() || undefined,
      account: account.trim() || undefined,
    };
    onSubmit(transactionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space */}
      <Input
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        required
        placeholder="e.g., Groceries, Salary"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <Input
            label="Amount"
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            required
            placeholder="0.00"
        />
        <Input
            label="Date"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            required
        />
        <Select
            label="Type"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            options={[
            { value: TransactionType.EXPENSE, label: 'Expense' },
            { value: TransactionType.INCOME, label: 'Income' },
            ]}
            required
        />
        <Input
            label="Category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Food, Utilities (Optional)"
        />
         <Input
            label="Account"
            id="account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="e.g., Checking, Credit Card (Optional)"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4"> {/* Increased pt */}
        <Button type="button" variant="fintrack-secondary" onClick={onCancel} className="min-w-0 px-4 py-2">
          Cancel
        </Button>
        <Button type="submit" variant="fintrack-primary" className="min-w-0 px-4 py-2">
          {initialData ? 'Save Changes' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
