// src/components/AddAdvanceForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  guardId: string;
  onAdvanceAdded: () => void;
}

const AddAdvanceForm: React.FC<Props> = ({ guardId, onAdvanceAdded }) => {
  const [amount, setAmount] = useState('');
  const [perCycle, setPerCycle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/salary-advances', {
      guard_id: guardId,
      amount: parseFloat(amount),
      recovery_amount_per_cycle: parseFloat(perCycle),
      advance_date: new Date().toISOString().split('T')[0],
    });
    onAdvanceAdded();
    setAmount('');
    setPerCycle('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white mt-4 rounded-xl shadow">
      <h2 className="text-lg font-medium mb-2">Add Advance</h2>
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded w-1/2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Deduct Per Cycle"
          className="border p-2 rounded w-1/2"
          value={perCycle}
          onChange={(e) => setPerCycle(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
    </form>
  );
};

export default AddAdvanceForm;