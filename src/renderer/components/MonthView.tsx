import React from "react";
import { CalendarEvent } from "../types";
import { getMonthDays, isSameDay } from "../utils/date";
import "../styles/MonthView.css";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onEventClick,
}) => {
  const monthDays = getMonthDays(currentDate);
  const dayNames = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土",
  ];

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
  };

  const isCurrentMonth = (day: Date): boolean => {
    return day.getMonth() === currentDate.getMonth();
  };

  const isToday = (day: Date): boolean => {
    const today = new Date();
    return isSameDay(day, today);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // 週ごとにグループ化
  const weeks: Date[][] = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  return (
    <div className="month-view">
      <div className="month-view-header">
        {dayNames.map((name, index) => (
          <div key={index} className="day-name">
            {name}
          </div>
        ))}
      </div>
      <div className="month-view-body">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week-row">
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const isOtherMonth = !isCurrentMonth(day);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={dayIndex}
                  className={`day-cell ${isOtherMonth ? "other-month" : ""} ${
                    isTodayDate ? "today" : ""
                  }`}
                >
                  <div className="day-number">
                    {day.getDate()}
                  </div>
                  <div className="day-events">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="event-badge"
                        onClick={() => onEventClick(event)}
                        title={`${event.summary}\n${formatTime(event.start)} - ${formatTime(event.end)}`}
                      >
                        <span className="event-time">
                          {formatTime(event.start)}
                        </span>
                        <span className="event-title">
                          {event.summary}
                        </span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="more-events">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
