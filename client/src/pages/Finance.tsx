import React, { useState } from 'react';

import MainEarnings from './earnings/MainEarnings';

// Placeholder components for sub-screens
import Expenses from './earnings/Expenses';

// Placeholder components for sub-screens
import Payouts from './earnings/Payouts';

// Placeholder components for sub-screens
import Taxes from './earnings/Taxes';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Earnings');

  const renderContent = () => {
    switch (activeTab) {
      case 'Earnings':
        return <MainEarnings />;
      case 'Expenses':
        return <Expenses />;
      case 'Payouts':
        return <Payouts />;
      case 'Taxes':
        return <Taxes />;
      default:
        return <MainEarnings />;
    }
  };

  return (
    <div className="content-area">
      <div className="header-padding">
        <h1 className="text-xl font-bold text-white">Earnings</h1>
      </div>

      <div className="px-6">
        {/* Tab Container */}
        <div className="glass-card p-1 rounded-md mb-6 flex items-center">
          <button onClick={() => setActiveTab('Earnings')} className={`flex-1 py-2 px-2 rounded text-xs font-semibold transition-all duration-300 ${activeTab === 'Earnings' ? 'bg-purple text-white' : 'text-text-secondary'}`}>Earnings</button>
          <button onClick={() => setActiveTab('Expenses')} className={`flex-1 py-2 px-2 rounded text-xs font-semibold transition-all duration-300 ${activeTab === 'Expenses' ? 'bg-purple text-white' : 'text-text-secondary'}`}>Expenses</button>
          <button onClick={() => setActiveTab('Payouts')} className={`flex-1 py-2 px-2 rounded text-xs font-semibold transition-all duration-300 ${activeTab === 'Payouts' ? 'bg-purple text-white' : 'text-text-secondary'}`}>Payouts</button>
          <button onClick={() => setActiveTab('Taxes')} className={`flex-1 py-2 px-2 rounded text-xs font-semibold transition-all duration-300 ${activeTab === 'Taxes' ? 'bg-purple text-white' : 'text-text-secondary'}`}>Taxes</button>
        </div>

        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Finance;