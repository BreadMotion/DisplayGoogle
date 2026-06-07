import React from 'react';
import { CalendarEvent } from '../types';
import { isSameDay } from '../utils/date';
import '../styles/DayView.css';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onEventClick,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (): CalendarEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, currentDate);
    });
  };

  const calculateEventPosition = (event: CalendarEvent) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    const top = (startHour + startMinute / 60) * 80; // 1時間 = 80px (より詳細表示)
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 80;

    return { top, height: Math.max(height, 30) };
  };

  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const dayEvents = getEventsForDay();
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="day-view">
      <div className="day-view-header">
        <div className="current-day">
          <span className="day-name">{dayNames[currentDate.getDay()]}</span>
          <span className="day-date">{currentDate.getDate()}</span>
        </div>
      </div>
      <div className="day-view-body">
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              <span className="time-label">{formatHour(hour)}</span>
            </div>
          ))}
        </div>
        <div className="day-content">
          <div className="hour-grid">
            {hours.map((hour) => (
              <div key={hour} className="hour-cell">
                <div className="quarter-line"></div>
                <div className="half-line"></div>
                <div className="quarter-line"></div>
              </div>
            ))}
          </div>
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
                >
                  <div className="event-time-range">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                  <div className="event-summary">{event.summary}</div>
                  {event.location && (
                    <div className="event-location">📍 {event.location}</div>
                  )}
                  {event.description && (
                    <div className="event-description">{event.description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
