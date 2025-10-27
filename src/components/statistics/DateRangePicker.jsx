// components/statistics/DateRangePicker.jsx
import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const DateRangePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'اليوم', days: 0 },
    { label: 'أسبوع', days: 7 },
    { label: 'شهر', days: 30 },
    { label: '3 أشهر', days: 90 },
    { label: 'سنة', days: 365 }
  ];

  const handlePresetSelect = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  const handleCustomDateChange = (type, date) => {
    onChange({
      ...value,
      [type]: new Date(date)
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FaCalendarAlt className="text-gray-400" />
        <span>
          {value.startDate.toLocaleDateString('ar-EG')} - {value.endDate.toLocaleDateString('ar-EG')}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {presets.map(preset => (
                <button
                  key={preset.days}
                  onClick={() => handlePresetSelect(preset.days)}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg text-right"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={value.startDate.toISOString().split('T')[0]}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={value.endDate.toISOString().split('T')[0]}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;