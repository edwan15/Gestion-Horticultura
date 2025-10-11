import React, { useState, useEffect } from 'react';
import './MonthlyCalendar.css';

const MonthlyCalendar = () => {
  // State to track the currently displayed date (used for month/year)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Array of day names for the header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Function to generate the days for the current month view
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 1. Get the first day of the month (e.g., a Wednesday)
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    
    // 2. Get the number of days in the month (e.g., 31 for October)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Array to hold the dates to display
    const days = [];
    
    // Fill in the leading empty spaces (previous month's days)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ number: '', isCurrentMonth: false });
    }

    // Fill in the current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = (
        i === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear()
      );
      days.push({ number: i, isCurrentMonth: true, isToday });
    }

    // You could also fill in trailing empty spaces here (next month's days)
    
    setCalendarDays(days);
  }, [currentDate]); // Recalculate days whenever currentDate changes

  // Handler to move to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  // Handler to move to the next month
  const goToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <div className="calendar-container">
      {/* Header with Month/Year and Navigation Buttons */}
      <div className="calendar-header">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>

      {/* Grid for Days of the Week and Dates */}
      <div className="calendar-grid">
        {/* Day Names Header */}
        {dayNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}

        {/* Calendar Dates */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${day.isToday ? 'today' : ''}`}
          >
            {day.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar;