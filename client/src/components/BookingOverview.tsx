interface BookingOverviewProps {
  activeBookings?: number;
  completedToday?: number;
}

export default function BookingOverview({
  activeBookings = 6,
  completedToday = 22
}: BookingOverviewProps) {
  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Booking Overview</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="gradient-purple rounded-16px p-4 hover-elevate cursor-pointer" data-testid="card-active">
          <p className="text-xs text-white/80">Active Bookings</p>
          <p className="text-4xl font-bold mt-1" data-testid="text-active-count">{activeBookings}</p>
          <p className="text-[10px] text-white/70">In progress</p>
        </div>
        <div className="bg-card rounded-16px p-4 hover-elevate cursor-pointer" data-testid="card-completed">
          <p className="text-xs">Completed <span className="text-muted-foreground text-[10px]">Today</span></p>
          <p className="text-3xl font-bold mt-1" data-testid="text-completed-count">{completedToday}</p>
          <p className="text-xs text-success-green font-semibold">Ready for next</p>
        </div>
      </div>
    </section>
  );
}