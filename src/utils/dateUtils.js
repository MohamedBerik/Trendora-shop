// utils/dateUtils.js
export const getDateRange = (period) => {
  const end = new Date();
  let start = new Date();

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(start.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    case 'last_week':
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() - 7);
      break;
    case 'last_month':
      start.setMonth(start.getMonth() - 2);
      end.setMonth(end.getMonth() - 1);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }

  return { start, end };
};

export const formatDateRange = (startDate, endDate, locale = 'ar-EG') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString(locale);
  }
  
  return `${start.toLocaleDateString(locale)} - ${end.toLocaleDateString(locale)}`;
};

export const getMonthName = (monthIndex, locale = 'ar-EG') => {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleDateString(locale, { month: 'long' });
};

export const getWeekDays = (locale = 'ar-EG') => {
  const baseDate = new Date();
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - baseDate.getDay() + i);
    weekDays.push(date.toLocaleDateString(locale, { weekday: 'short' }));
  }
  
  return weekDays;
};

export const generateDateArray = (startDate, endDate, interval = 'day') => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current));
    
    switch (interval) {
      case 'hour':
        current.setHours(current.getHours() + 1);
        break;
      case 'day':
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        current.setMonth(current.getMonth() + 1);
        break;
      default:
        current.setDate(current.getDate() + 1);
    }
  }

  return dates;
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const getEndOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export const calculateDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const difference = end.getTime() - start.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};

export const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

export const parseAPIDate = (dateString) => {
  return new Date(dateString + 'T00:00:00');
};