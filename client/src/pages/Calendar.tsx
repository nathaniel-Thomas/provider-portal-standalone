
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useJobs } from '../contexts/JobContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { state } = useJobs();
  const { jobs } = state;

  const scheduledDates = jobs
    .filter(job => job.status === 'scheduled' && job.dateTime)
    .map(job => new Date(job.dateTime)); // This is a simplification; real parsing is needed

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  return (
    <div className="content-area">
      <div className="header-padding">
        <h1 className="text-xl font-bold text-white">Calendar</h1>
      </div>

      <div className="px-6">
        <div className="glass-card rounded-xl p-6">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-text-secondary hover:bg-[rgba(255,255,255,0.15)] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-text-secondary hover:bg-[rgba(255,255,255,0.15)] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekdays Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekdays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-text-tertiary py-2">{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const hasBooking = scheduledDates.some(d => isSameDay(d, day));
              let cellClass = "aspect-square rounded-md flex items-center justify-center text-sm font-semibold transition-colors duration-300 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer ";
              
              if (!isSameMonth(day, currentMonth)) {
                cellClass += "text-text-tertiary/50";
              } else if (isToday(day)) {
                cellClass += "bg-orange text-black";
              } else if (hasBooking) {
                cellClass += "bg-teal text-white";
              } else {
                cellClass += "text-white";
              }
              
              return (
                <div key={index} className={cellClass}>
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
