
import React from 'react';
import { expensesData } from '../../utils/seedData';
import { Plus, Search, SlidersHorizontal, Fuel, ShoppingCart, Wrench, Megaphone } from 'lucide-react';

const categoryIcons = {
  'Fuel': <Fuel size={20} />,
  'Supplies': <ShoppingCart size={20} />,
  'Equipment': <Wrench size={20} />,
  'Marketing': <Megaphone size={20} />,
  'Other': <Plus size={20} />,
};

const Expenses: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  return (
    <div>
      {/* Add Expense Button */}
      <button className="w-full bg-purple text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-6 shadow-purple-glow">
        <Plus size={20} />
        Add Expense
      </button>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Total Expenses</p>
          <p className="text-2xl font-extrabold text-red">{formatCurrency(expensesData.totalExpenses)}</p>
        </div>
        <div className="glass-card p-5 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Deductible</p>
          <p className="text-2xl font-extrabold text-green">{formatCurrency(expensesData.deductibleExpenses)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" placeholder="Search expenses..." className="w-full bg-[rgba(255,255,255,0.05)] border border-card-border rounded-md pl-10 pr-3 py-2 text-sm text-white focus:ring-purple focus:border-purple" />
        </div>
        <button className="p-2 bg-[rgba(255,255,255,0.05)] border border-card-border rounded-md">
          <SlidersHorizontal size={18} className="text-text-secondary" />
        </button>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {expensesData.items.map(item => (
          <div key={item.id} className="glass-card p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-text-secondary">
                {categoryIcons[item.category]}
              </div>
              <div>
                <p className="font-semibold text-white">{item.description}</p>
                <p className="text-xs text-text-secondary">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">{formatCurrency(item.amount)}</p>
              {item.isDeductible && <p className="text-xs text-green">Deductible</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expenses;
