// src/pages/GuardProfile.tsx
import React, { useState } from 'react';
import AdvanceList from '../components/AdvanceList';
import AddAdvanceForm from '../components/AddAdvanceForm';
import AdvanceRecoveryProcessor from '../components/AdvanceRecoveryProcessor';

interface Props {
  guardId: string;
}

const GuardProfile: React.FC<Props> = ({ guardId }) => {
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <div className="space-y-6">
      <AdvanceList guardId={guardId} key={String(refresh)} />
      <AddAdvanceForm guardId={guardId} onAdvanceAdded={triggerRefresh} />
      <AdvanceRecoveryProcessor guardId={guardId} onProcessed={triggerRefresh} />
    </div>
  );
};

export default GuardProfile;
