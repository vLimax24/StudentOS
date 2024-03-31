'use client'

import React, { useState } from 'react';
import dayjs from 'dayjs';
import CalendarGrid from './CalendarGrid';
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface CalendarProps {
  initialDate?: dayjs.Dayjs;
}

type Events = Record<string, string[]>;

const Calendar: React.FC<CalendarProps> = ({ initialDate = dayjs() }) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [events, setEvents] = useState<Events>({});

  const handleDate = (date: string) => {
    // This function could be used to handle clicking on a date cell in the calendar
    // For now, we're just logging the clicked date
    console.log('Clicked on date:', date);
  };

  const handleCreateEvent = (date: string, title: string, description: string, type: string) => {
    // Update the events state with the new event
    setEvents(prevEvents => ({
      ...prevEvents,
      [date]: [...(prevEvents[date] ?? []), `${title} (${type}) - ${description}`],
    }));
  };
  const goToCurrentDay = () => {
    setCurrentMonth(dayjs());
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => prevMonth.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => prevMonth.add(1, 'month'));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className='font-bold text-2xl'>{currentMonth.format('MMMM YYYY')}</h2>
        <div className='flex items-center justify-center mr-2'>
          <button onClick={goToPreviousMonth} className='hover:bg-gray-100 p-1.5 rounded-full'>
            <ChevronLeft size={20}/>
          </button>
          <button onClick={goToCurrentDay} className='pb-1 mx-2'>Today</button>
          <button onClick={goToNextMonth} className='hover:bg-gray-100 p-1.5 rounded-full'>
            <ChevronRight size={20}/>
          </button>
        </div>
      </div>
      <CalendarGrid
        currentMonth={currentMonth}
        events={events}
        onClick={handleDate}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Calendar;
