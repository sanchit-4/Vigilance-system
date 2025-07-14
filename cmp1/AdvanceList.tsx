// src/components/AdvanceList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Advance {
  id: string;
  amount: number;
  advance_date: string;
  recovery_amount_per_cycle: number;
  total_recovered: number;
  is_fully_recovered: boolean;
}

interface Props {
  guardId: string;
}

const AdvanceList: React.FC<Props> = ({ guardId }) => {
  const [advances, setAdvances] = useState<Advance[]>([]);

  useEffect(() => {
    axios.get(`/api/guards/${guardId}/salary-advances`)
      .then(res => setAdvances(res.data))
      .catch(err => console.error(err));
  }, [guardId]);

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Salary Advances</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th>Recovered</th>
            <th>Per Cycle</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {advances.map((a) => (
            <tr key={a.id}>
              <td>₹{a.amount}</td>
              <td>{a.advance_date}</td>
              <td>₹{a.total_recovered}</td>
              <td>₹{a.recovery_amount_per_cycle}</td>
              <td>{a.is_fully_recovered ? 'Recovered' : 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvanceList;