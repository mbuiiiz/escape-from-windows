import React, { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
interface DateTimeSettingsProps {
  windowId: string;
  props?: Record<string, unknown>;
}
export function DateTimeSettings({ windowId, props }: DateTimeSettingsProps) {
  const { systemTime, setSystemTime } = useSystem();
  const [selectedDate, setSelectedDate] = useState(systemTime);
  const [selectedHour, setSelectedHour] = useState(systemTime.getHours());
  const [selectedMinute, setSelectedMinute] = useState(systemTime.getMinutes());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 20 }, (_, i) => 2000 + i);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  const handleApply = () => {
    const newDate = new Date(selectedDate);
    newDate.setHours(selectedHour);
    newDate.setMinutes(selectedMinute);
    setSystemTime(newDate);
  };
  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-6 h-6" />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day;
      const isToday = 
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;
      days.push(
        <div
          key={day}
          className={`w-6 h-6 flex items-center justify-center text-xs cursor-pointer
            ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}
            ${isToday ? 'border border-red-500' : ''}
          `}
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(day);
            setSelectedDate(newDate);
          }}
        >
          {day}
        </div>
      );
    }
    return days;
  };
  return (
    <div className="flex flex-col h-full bg-[hsl(210_20%_93%)]">
      {/* Tabs */}
      <div className="xp-properties-tabs">
        <div className="xp-properties-tab active">Date & Time</div>
        <div className="xp-properties-tab">Time Zone</div>
        <div className="xp-properties-tab">Internet Time</div>
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        <div className="flex gap-6">
          {/* Date Section */}
          <div>
            <div className="font-bold text-xs mb-2">Date</div>
            <div className="border border-gray-400 p-2 bg-white">
              {/* Month/Year Selector */}
              <div className="flex justify-between items-center mb-2 bg-blue-600 text-white px-2 py-1">
                <button
                  className="text-white hover:bg-blue-700 px-1"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}
                >
                  ◀
                </button>
                <select
                  className="bg-transparent text-white text-xs outline-none cursor-pointer"
                  value={selectedDate.getMonth()}
                  onChange={(e) => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(parseInt(e.target.value));
                    setSelectedDate(newDate);
                  }}
                >
                  {months.map((m, i) => (
                    <option key={m} value={i} className="text-black">{m}</option>
                  ))}
                </select>
                <select
                  className="bg-transparent text-white text-xs outline-none cursor-pointer"
                  value={selectedDate.getFullYear()}
                  onChange={(e) => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(parseInt(e.target.value));
                    setSelectedDate(newDate);
                  }}
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="text-black">{y}</option>
                  ))}
                </select>
                <button
                  className="text-white hover:bg-blue-700 px-1"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}
                >
                  ▶
                </button>
              </div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0 text-xs text-center mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="w-6 h-5 font-bold text-red-600">
                    {d}
                  </div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0">
                {renderCalendar()}
              </div>
            </div>
          </div>
          {/* Time Section */}
          <div>
            <div className="font-bold text-xs mb-2">Time</div>
            <div className="border border-gray-400 p-4 bg-white flex flex-col items-center">
              {/* Clock Display */}
              <div className="text-3xl font-mono mb-4">
                {String(selectedHour).padStart(2, '0')}:
                {String(selectedMinute).padStart(2, '0')}:00
              </div>
              {/* Time Inputs */}
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value) || 0)}
                  className="xp-input w-12 text-center"
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(parseInt(e.target.value) || 0)}
                  className="xp-input w-12 text-center"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Hint */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>🔍 Investigation Tip:</strong> Set the date to March 15, 2005 
          to run the decrypt.sh script. The incident occurred on March 12, 2005.
        </div>
      </div>
      {/* Buttons */}
      <div className="p-4 border-t flex justify-end gap-2">
        <button className="xp-button" onClick={handleApply}>
          Apply
        </button>
        <button className="xp-button">
          OK
        </button>
        <button className="xp-button">
          Cancel
        </button>
      </div>
    </div>
  );
}