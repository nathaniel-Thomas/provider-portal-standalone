import { Info } from 'lucide-react';

interface PerformanceCardProps {
  bookingsCompleted?: number;
  dailyEarnings?: number;
  docRate?: string;
  avgPhotos?: string;
  issues?: string;
}

export default function PerformanceCard({
  bookingsCompleted = 28,
  dailyEarnings = 1247,
  docRate = "100%",
  avgPhotos = "6.2",
  issues = "2 resolved"
}: PerformanceCardProps) {
  return (
    <section className="bg-card rounded-20px p-6 shadow-card" data-testid="card-performance">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Today's Performance</p>
        <Info className="h-5 w-5 text-muted-foreground hover-elevate cursor-pointer" data-testid="button-info" />
      </div>
      <div className="flex justify-between items-end mt-2">
        <div>
          <p className="text-5xl font-bold" data-testid="text-bookings">{bookingsCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">Bookings completed</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-medium" data-testid="text-earnings">${dailyEarnings.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Daily earnings</p>
        </div>
      </div>
      <div className="border-t border-border my-3"></div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Doc Rate: <span className="text-white font-medium" data-testid="text-docrate">{docRate}</span></span>
        <span>Avg Photos: <span className="text-white font-medium" data-testid="text-avgphotos">{avgPhotos}</span></span>
        <span>Issues: <span className="text-white font-medium" data-testid="text-issues">{issues}</span></span>
      </div>
    </section>
  );
}