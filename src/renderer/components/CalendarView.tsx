import React from 'react';
import { CalendarViewType, CalendarEvent } from '../types';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

interface CalendarViewProps {
  viewType: CalendarViewType;
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  viewType,
  currentDate,
  events,
  onEventClick,
}) => {
  switch (viewType) {
    case 'month':
      return (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
        />
      );
    case 'week':
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
        />
      );
    case 'day':
      return (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
        />
      );
    default:
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
        />
      );
  }
};

export default CalendarView;
