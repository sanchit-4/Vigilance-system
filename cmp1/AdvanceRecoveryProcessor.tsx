// src/components/AdvanceRecoveryProcessor.tsx
import React from 'react';
import axios from 'axios';

interface Props {
  guardId: string;
  onProcessed: () => void;
}

const AdvanceRecoveryProcessor: React.FC<Props> = ({ guardId, onProcessed }) => {
  const handleRecovery = async () => {
    await axios.put(`/api/guards/${guardId}/salary-advances/recover`);
    onProcessed();
  };

  return (
    <button
      onClick={handleRecovery}
      className="bg-green-600 text-white px-4 py-2 rounded mt-4"
    >
      Process Recovery
    </button>
  );
};

export default AdvanceRecoveryProcessor;