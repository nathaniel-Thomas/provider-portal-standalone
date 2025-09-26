
import React from 'react';
import { payoutsData } from '../../utils/seedData';
import { Landmark, Zap, CheckCircle } from 'lucide-react';

const Payouts: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  return (
    <div>
      {/* Quick Payout Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5 rounded-lg text-center border-2 border-purple">
          <Zap className="mx-auto text-purple mb-2" size={24} />
          <p className="font-bold text-white">Instant Payout</p>
          <p className="text-xs text-text-secondary">1.5% fee</p>
        </div>
        <div className="glass-card p-5 rounded-lg text-center">
          <Landmark className="mx-auto text-text-secondary mb-2" size={24} />
          <p className="font-bold text-white">Weekly Payout</p>
          <p className="text-xs text-text-secondary">No fee</p>
        </div>
      </div>

      {/* Bank Account */}
      <div className="glass-card p-4 rounded-lg mb-6">
        <p className="text-sm text-text-secondary mb-1">Payout Method</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
            <Landmark size={20} className="text-text-secondary" />
          </div>
          <div>
            <p className="font-semibold text-white">{payoutsData.bankAccount.bankName}</p>
            <p className="text-sm text-text-secondary">{payoutsData.bankAccount.accountNumber}</p>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div>
        <h3 className="font-bold text-white mb-4">History</h3>
        <div className="space-y-3">
          {payoutsData.history.map(payout => (
            <div key={payout.id} className="glass-card p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{formatCurrency(payout.amount)}</p>
                <p className="text-xs text-text-secondary">{payout.date}</p>
              </div>
              <div className={`flex items-center gap-2 text-xs font-semibold ${payout.status === 'Paid' ? 'text-green' : 'text-orange'}`}>
                <CheckCircle size={14} />
                <span>{payout.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payouts;
