import React from 'react';
import { CalendarEvent } from '../types';
import { getWeekStart, getWeekDays, isSameDay } from '../utils/date';
import '../styles/WeekView.css';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
}) => {
  const weekStart = getWeekStart(currentDate);
  const weekDays = getWeekDays(weekStart);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
  };

  const calculateEventPosition = (event: CalendarEvent) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    const top = (startHour + startMinute / 60) * 60; // 1時間 = 60px
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;

    return { top, height: Math.max(height, 20) };
  };

  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="week-view">
      <div className="week-view-header">
        <div className="time-gutter"></div>
        {weekDays.map((day, index) => (
          <div key={index} className="day-header">
            <div className="day-name">{dayNames[day.getDay()]}</div>
            <div className="day-number">{day.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="week-view-body">
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              <span className="time-label">{formatHour(hour)}</span>
            </div>
          ))}
        </div>
        <div className="days-grid">
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={dayIndex} className="day-column">
                {hours.map((hour) => (
                  <div key={hour} className="hour-cell"></div>
                ))}
                <div className="events-container">
                  {dayEvents.map((event) => {
                    const { top, height } = calculateEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className="event-item"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                        }}
                        onClick={() => onEventClick(event)}
                        title={event.summary}
                      >
                        <div className="event-summary">{event.summary}</div>
                        {event.location && (
                          <div className="event-location">{event.location}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
