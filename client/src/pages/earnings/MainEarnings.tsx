
import React from 'react';
import { earningsSummary } from '../../utils/seedData';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const MainEarnings: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  return (
    <div>
      {/* Tax Banner */}
      <div className="bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-orange" size={24} />
          <div>
            <h3 className="font-bold text-orange text-sm">Tax season is coming!</h3>
            <p className="text-xs text-yellow-600">Prepare your documents early.</p>
          </div>
        </div>
        <button className="bg-orange text-black text-xs font-bold py-2 px-3 rounded-md flex items-center gap-1">
          Review <ArrowRight size={14} />
        </button>
      </div>

      {/* Earnings Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Total Earnings (YTD)</p>
          <p className="text-2xl font-extrabold text-green">{formatCurrency(earningsSummary.totalEarnings)}</p>
        </div>
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Jobs Completed</p>
          <p className="text-2xl font-extrabold text-purple">{earningsSummary.jobsCompleted}</p>
        </div>
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Avg. Per Job</p>
          <p className="text-2xl font-extrabold text-purple">{formatCurrency(earningsSummary.avgPerJob)}</p>
        </div>
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">This Month</p>
          <p className="text-2xl font-extrabold text-green">{formatCurrency(earningsSummary.monthlyEarnings)}</p>
        </div>
      </div>
    </div>
  );
};

export default MainEarnings;
