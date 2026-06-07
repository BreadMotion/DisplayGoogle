import React, { useState } from 'react';
import {
  ViewMode,
  CalendarViewType,
  CalendarListItem,
  TaskList,
} from '../types';

interface ControlPanelProps {
  viewMode: ViewMode;
  calendarViewType: CalendarViewType;
  calendars: CalendarListItem[];
  selectedCalendars: string[];
  taskLists: TaskList[];
  selectedTaskList: string | null;
  currentDate: Date;
  lastSync: Date | null;
  onViewModeChange: (mode: ViewMode) => void;
  onCalendarViewTypeChange: (type: CalendarViewType) => void;
  onCalendarsChange: (calendarIds: string[]) => void;
  onTaskListChange: (taskListId: string) => void;
  onDateChange: (date: Date) => void;
  onSync: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  viewMode,
  calendarViewType,
  calendars,
  selectedCalendars,
  taskLists,
  selectedTaskList,
  currentDate,
  lastSync,
  onViewModeChange,
  onCalendarViewTypeChange,
  onCalendarsChange,
  onTaskListChange,
  onDateChange,
  onSync,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePreviousDate = () => {
    const newDate = new Date(currentDate);
    if (calendarViewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarViewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    if (calendarViewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarViewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleCalendarToggle = (calendarId: string) => {
    if (selectedCalendars.includes(calendarId)) {
      onCalendarsChange(selectedCalendars.filter((id) => id !== calendarId));
    } else {
      onCalendarsChange([...selectedCalendars, calendarId]);
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return '未同期';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSync.getTime()) / 1000);
    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
    return lastSync.toLocaleString('ja-JP');
  };

  return (
    <div
      className="control-panel"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        zIndex: 1000,
        transition: 'background-color 0.3s ease, opacity 0.3s ease',
        opacity: isHovered ? 1 : 0.3,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ビューモード切り替え */}
      <div className="view-mode-toggle" style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onViewModeChange('calendar')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'calendar' ? '#4285f4' : '#f1f3f4',
            color: viewMode === 'calendar' ? 'white' : '#202124',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: viewMode === 'calendar' ? 'bold' : 'normal',
          }}
        >
          📅 カレンダー
        </button>
        <button
          onClick={() => onViewModeChange('tasks')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'tasks' ? '#4285f4' : '#f1f3f4',
            color: viewMode === 'tasks' ? 'white' : '#202124',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: viewMode === 'tasks' ? 'bold' : 'normal',
          }}
        >
          ✅ タスク
        </button>
      </div>

      {/* カレンダービュータイプ切り替え（カレンダーモードのみ） */}
      {viewMode === 'calendar' && (
        <div className="calendar-view-type" style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onCalendarViewTypeChange('month')}
            style={{
              padding: '8px 12px',
              backgroundColor: calendarViewType === 'month' ? '#34a853' : '#f1f3f4',
              color: calendarViewType === 'month' ? 'white' : '#202124',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            月
          </button>
          <button
            onClick={() => onCalendarViewTypeChange('week')}
            style={{
              padding: '8px 12px',
              backgroundColor: calendarViewType === 'week' ? '#34a853' : '#f1f3f4',
              color: calendarViewType === 'week' ? 'white' : '#202124',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            週
          </button>
          <button
            onClick={() => onCalendarViewTypeChange('day')}
            style={{
              padding: '8px 12px',
              backgroundColor: calendarViewType === 'day' ? '#34a853' : '#f1f3f4',
              color: calendarViewType === 'day' ? 'white' : '#202124',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            日
          </button>
        </div>
      )}

      {/* カレンダー選択（カレンダーモードのみ） */}
      {viewMode === 'calendar' && (
        <div className="calendar-selector" style={{ position: 'relative' }}>
          <select
            multiple
            value={selectedCalendars}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions);
              onCalendarsChange(options.map((opt) => opt.value));
            }}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #dadce0',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '150px',
              maxHeight: '120px',
            }}
          >
            {calendars.map((calendar) => (
              <option key={calendar.id} value={calendar.id}>
                {selectedCalendars.includes(calendar.id) ? '✓ ' : ''}
                {calendar.summary}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* タスクリスト選択（タスクモードのみ） */}
      {viewMode === 'tasks' && (
        <div className="tasklist-selector">
          <select
            value={selectedTaskList || ''}
            onChange={(e) => onTaskListChange(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #dadce0',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '150px',
            }}
          >
            <option value="">タスクリストを選択</option>
            {taskLists.map((taskList) => (
              <option key={taskList.id} value={taskList.id}>
                {taskList.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 日付ナビゲーション（カレンダーモードのみ） */}
      {viewMode === 'calendar' && (
        <div className="date-navigation" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handlePreviousDate}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f1f3f4',
              color: '#202124',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ◀
          </button>
          <button
            onClick={handleToday}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fbbc04',
              color: '#202124',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            今日
          </button>
          <button
            onClick={handleNextDate}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f1f3f4',
              color: '#202124',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ▶
          </button>
          <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#202124' }}>
            {currentDate.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: calendarViewType !== 'month' ? 'numeric' : undefined,
            })}
          </span>
        </div>
      )}

      {/* 同期ボタンと最終同期時刻 */}
      <div className="sync-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
        <span style={{ fontSize: '12px', color: '#5f6368' }}>
          最終同期: {formatLastSync()}
        </span>
        <button
          onClick={onSync}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ea4335',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          🔄 同期
        </button>
      </div>
    </div>
  );
};
