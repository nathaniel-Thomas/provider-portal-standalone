
import React from 'react';
import { taxData } from '../../utils/seedData';
import { FileText, Download } from 'lucide-react';

const Taxes: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  return (
    <div>
      {/* Tax Summary Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Gross Income</p>
          <p className="text-xl font-extrabold text-white">{formatCurrency(taxData.summary.grossIncome)}</p>
        </div>
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Expenses</p>
          <p className="text-xl font-extrabold text-red">{formatCurrency(taxData.summary.expenses)}</p>
        </div>
        <div className="glass-card p-5 rounded-lg col-span-2">
          <p className="text-sm text-text-secondary mb-2">Taxable Income</p>
          <p className="text-2xl font-extrabold text-green">{formatCurrency(taxData.summary.taxableIncome)}</p>
        </div>
        <div className="glass-card p-5 rounded-lg col-span-2 bg-orange/20 border-orange">
          <p className="text-sm text-orange mb-2">Estimated Taxes Owed</p>
          <p className="text-2xl font-extrabold text-white">{formatCurrency(taxData.summary.estimatedTaxesOwed)}</p>
        </div>
      </div>

      {/* Document Management */}
      <div className="mb-6">
        <h3 className="font-bold text-white mb-4">Documents</h3>
        <div className="space-y-3">
          {taxData.documents.map(doc => (
            <div key={doc.id} className="glass-card p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-text-secondary" />
                <p className="font-semibold text-white">{doc.name}</p>
              </div>
              <button>
                <Download size={20} className="text-purple" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly Payments */}
      <div>
        <h3 className="font-bold text-white mb-4">Quarterly Payment Reminders</h3>
        <div className="glass-card p-4 rounded-lg text-sm">
            <p className="text-text-secondary">Next estimated quarterly tax payment is due <span className="font-bold text-orange">January 15, 2026</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Taxes;
