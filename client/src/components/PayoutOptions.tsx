import { Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayoutOptionsProps {
  weeklyAmount?: number;
  instantAmount?: number;
  instantFee?: string;
  onWeeklyPayout?: () => void;
  onInstantPayout?: () => void;
}

export default function PayoutOptions({
  weeklyAmount = 1247.50,
  instantAmount = 1247.50,
  instantFee = "1.5%",
  onWeeklyPayout,
  onInstantPayout
}: PayoutOptionsProps) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Quick Payout</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* Weekly Payout */}
        <div className="bg-card rounded-16px p-4 border-2 border-border space-y-2 hover-elevate" data-testid="card-weekly">
          <Calendar className="h-8 w-8 text-primary" />
          <p className="text-sm font-semibold pt-1">Weekly Payout</p>
          <p className="text-xs text-muted-foreground">Every Friday</p>
          <p className="text-base font-bold" data-testid="text-weekly-amount">
            ${weeklyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-success-green">Free</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-primary font-medium pt-1 h-auto p-0"
            onClick={() => {
              onWeeklyPayout?.();
              console.log('Set as default weekly payout');
            }}
            data-testid="button-set-default"
          >
            Set as Default
          </Button>
        </div>
        
        {/* Instant Payout */}
        <div className="bg-card rounded-16px p-4 border-2 border-primary space-y-2 hover-elevate" data-testid="card-instant">
          <Zap className="h-8 w-8 text-primary" />
          <p className="text-sm font-semibold pt-1">Instant Payout</p>
          <p className="text-xs text-muted-foreground">Within 30 min</p>
          <p className="text-base font-bold" data-testid="text-instant-amount">
            ${instantAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-warning-orange">{instantFee} fee</p>
          <Button 
            size="sm"
            className="text-xs bg-primary hover:bg-primary/90 text-white rounded-md px-3 py-1 font-medium"
            onClick={() => {
              onInstantPayout?.();
              console.log('Instant payout initiated');
            }}
            data-testid="button-payout-now"
          >
            Pay Out Now
          </Button>
        </div>
      </div>
    </section>
  );
}