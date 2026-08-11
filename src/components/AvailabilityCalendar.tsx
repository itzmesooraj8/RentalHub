import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { equipmentService } from '../services/equipmentService';

interface AvailabilityCalendarProps {
  equipmentId?: string;
  onSelectDates?: (startDate: string, endDate: string) => void;
  dailyRate: number;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ equipmentId, onSelectDates, dailyRate }) => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth() + 1);
  const [blockedDateStrings, setBlockedDateStrings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedStart, setSelectedStart] = useState<number | null>(15);
  const [selectedEnd, setSelectedEnd] = useState<number | null>(18);

  useEffect(() => {
    if (!equipmentId) return;
    setLoading(true);
    equipmentService
      .getAvailability(equipmentId, currentYear, currentMonth)
      .then((dates) => {
        setBlockedDateStrings(dates || []);
      })
      .catch(() => {
        setBlockedDateStrings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [equipmentId, currentYear, currentMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isDayBlocked = (day: number): boolean => {
    const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `${currentYear}-${monthStr}-${dayStr}`;
    return blockedDateStrings.includes(dateFormatted);
  };

  const handleDayClick = (day: number) => {
    if (isDayBlocked(day)) return;

    const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `${currentYear}-${monthStr}-${dayStr}`;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(day);
      setSelectedEnd(null);
    } else if (day > selectedStart) {
      setSelectedEnd(day);
      if (onSelectDates) {
        const startDayStr = selectedStart < 10 ? `0${selectedStart}` : `${selectedStart}`;
        const startFormatted = `${currentYear}-${monthStr}-${startDayStr}`;
        onSelectDates(startFormatted, dateFormatted);
      }
    } else {
      setSelectedStart(day);
      setSelectedEnd(null);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  const calculatedDays = selectedStart && selectedEnd ? selectedEnd - selectedStart + 1 : 0;
  const estimatedSubtotal = calculatedDays * dailyRate;

  return (
    <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 text-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2 font-serif italic text-lg text-white">
          <CalendarIcon className="w-5 h-5 text-[#F27D26]" />
          <span>{monthNames[currentMonth - 1]} {currentYear} Availability</span>
          {loading && <span className="text-[10px] font-mono text-amber-400 animate-pulse">(Updating...)</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Legend */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-[#666666] font-bold uppercase tracking-wider">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 font-mono text-xs">
        {daysArray.map((day) => {
          const isBlocked = isDayBlocked(day);
          const isStart = selectedStart === day;
          const isEnd = selectedEnd === day;
          const isInRange = selectedStart && selectedEnd && day > selectedStart && day < selectedEnd;

          let btnClass = 'bg-[#1A1A1A] text-white hover:bg-[#222222] hover:border-[#333333] border border-[#222222]';

          if (isBlocked) {
            btnClass = 'bg-[#141414] text-[#444444] border border-[#1A1A1A] cursor-not-allowed line-through';
          } else if (isStart || isEnd) {
            btnClass = 'bg-[#F27D26] text-black font-bold border border-white shadow-md scale-105';
          } else if (isInRange) {
            btnClass = 'bg-[#1A1A1A] text-[#F27D26] border border-[#F27D26]/40 font-bold';
          }

          return (
            <button
              key={day}
              disabled={isBlocked}
              onClick={() => handleDayClick(day)}
              className={`h-9 rounded-xl flex items-center justify-center transition cursor-pointer relative ${btnClass}`}
            >
              <span>{day}</span>
              {isBlocked && <Lock className="w-2.5 h-2.5 text-[#555555] absolute top-1 right-1" />}
            </button>
          );
        })}
      </div>

      {/* Legend & Summary */}
      <div className="pt-3 border-t border-[#1F1F1F] flex flex-wrap items-center justify-between text-[10px] font-mono text-[#888888] gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#F27D26]"></span> Selected</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#141414] border border-[#333333]"></span> MongoDB Reserved</span>
        </div>

        {calculatedDays > 0 ? (
          <div className="text-right text-xs font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{calculatedDays} Days Selected (${estimatedSubtotal} Subtotal)</span>
          </div>
        ) : (
          <span className="italic text-[#666666]">Click start and end date to select duration</span>
        )}
      </div>
    </div>
  );
};
