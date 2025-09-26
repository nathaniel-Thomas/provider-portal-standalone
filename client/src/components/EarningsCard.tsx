import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EarningsCardProps {
  availableBalance?: number;
  pendingAmount?: number;
  onAddFunds?: () => void;
}

export default function EarningsCard({
  availableBalance = 1247.50,
  pendingAmount = 156.25,
  onAddFunds
}: EarningsCardProps) {
  return (
    <section className="mt-6 relative">
      <div className="gradient-purple rounded-20px p-6 h-[140px] shadow-purple-glow flex flex-col justify-center" data-testid="card-earnings">
        <p className="text-sm text-white/80">Available Balance</p>
        <p className="text-4xl font-bold text-white mt-1" data-testid="text-balance">
          ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-white/70 mt-1" data-testid="text-pending">
          +${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} pending
        </p>
      </div>
      <Button
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white hover:bg-gray-100 text-primary shadow-lg"
        onClick={() => {
          onAddFunds?.();
          console.log('Add funds clicked');
        }}
        data-testid="button-add-funds"
      >
        <Plus className="h-5 w-5" strokeWidth={3} />
      </Button>
    </section>
  );
}