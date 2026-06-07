import React, { useState, useEffect } from "react";
import CalendarView from "./components/CalendarView";
import TasksView from "./components/TasksView";
import { ControlPanel } from "./components/ControlPanel";
import { EventModal } from "./components/EventModal";
import { LoadingScreen } from "./components/LoadingScreen";
import {
  CalendarEvent,
  Task,
  ViewMode,
  CalendarViewType,
  CalendarListItem,
  TaskList,
} from "./types";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] =
    useState<ViewMode>("calendar");
  const [calendarViewType, setCalendarViewType] =
    useState<CalendarViewType>("week");
  const [currentDate, setCurrentDate] = useState(
    new Date(),
  );
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null);
  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);
  const [calendars, setCalendars] = useState<
    CalendarListItem[]
  >([]);
  const [selectedCalendars, setSelectedCalendars] =
    useState<string[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>(
    [],
  );
  const [selectedTaskList, setSelectedTaskList] =
    useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastSync, setLastSync] = useState<Date>(
    new Date(),
  );

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCalendars();
      loadTaskLists();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      isAuthenticated &&
      selectedCalendars.length > 0 &&
      viewMode === "calendar"
    ) {
      loadEvents();
    }
  }, [
    isAuthenticated,
    selectedCalendars,
    currentDate,
    calendarViewType,
    viewMode,
  ]);

  useEffect(() => {
    if (
      isAuthenticated &&
      selectedTaskList &&
      viewMode === "tasks"
    ) {
      loadTasks();
    }
  }, [isAuthenticated, selectedTaskList, viewMode]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (isAuthenticated) {
          loadEvents();
          loadTasks();
          setLastSync(new Date());
        }
      },
      10 * 60 * 1000,
    ); // 10分ごとに同期

    return () => clearInterval(interval);
  }, [
    isAuthenticated,
    selectedCalendars,
    selectedTaskList,
  ]);

  const checkAuth = async () => {
    try {
      const authenticated =
        await window.electronAPI.checkAuth();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error("認証チェックエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const success = await window.electronAPI.login();
      if (success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  const loadCalendars = async () => {
    try {
      const calendarList =
        await window.electronAPI.getCalendarList();
      setCalendars(calendarList);
      if (calendarList.length > 0) {
        setSelectedCalendars([calendarList[0].id]);
      }
    } catch (error) {
      console.error("カレンダー一覧の取得エラー:", error);
    }
  };

  const loadEvents = async () => {
    try {
      const allEvents: CalendarEvent[] = [];

      for (const calendarId of selectedCalendars) {
        const { timeMin, timeMax } = getTimeRange();
        const calendarEvents =
          await window.electronAPI.getCalendarEvents(
            calendarId,
            timeMin,
            timeMax,
          );
        allEvents.push(...calendarEvents);
      }

      setEvents(allEvents);
    } catch (error) {
      console.error("イベントの取得エラー:", error);
    }
  };

  const loadTaskLists = async () => {
    try {
      const lists = await window.electronAPI.getTaskLists();
      setTaskLists(lists);
      if (lists.length > 0) {
        setSelectedTaskList(lists[0].id);
      }
    } catch (error) {
      console.error("タスクリストの取得エラー:", error);
    }
  };

  const loadTasks = async () => {
    if (!selectedTaskList) return;

    try {
      const taskItems = await window.electronAPI.getTasks(
        selectedTaskList,
      );
      setTasks(taskItems);
    } catch (error) {
      console.error("タスクの取得エラー:", error);
    }
  };

  const getTimeRange = () => {
    let timeMin: Date;
    let timeMax: Date;

    switch (calendarViewType) {
      case "day":
        timeMin = new Date(currentDate);
        timeMin.setHours(0, 0, 0, 0);
        timeMax = new Date(currentDate);
        timeMax.setHours(23, 59, 59, 999);
        break;
      case "week":
        timeMin = new Date(currentDate);
        const day = timeMin.getDay();
        timeMin.setDate(timeMin.getDate() - day);
        timeMin.setHours(0, 0, 0, 0);
        timeMax = new Date(timeMin);
        timeMax.setDate(timeMax.getDate() + 6);
        timeMax.setHours(23, 59, 59, 999);
        break;
      case "month":
        timeMin = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        timeMax = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        break;
    }

    return {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
    };
  };

  const handleSync = async () => {
    if (viewMode === "calendar") {
      await loadEvents();
    } else {
      await loadTasks();
    }
    setLastSync(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleOpenInBrowser = (url: string) => {
    window.electronAPI.openBrowser(url);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-container">
          <h1>Display Google</h1>
          <p>Googleカレンダーとタスクを壁紙に表示します</p>
          <button
            onClick={handleLogin}
            className="login-button"
          >
            Googleアカウントでログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <ControlPanel
        viewMode={viewMode}
        calendarViewType={calendarViewType}
        calendars={calendars}
        selectedCalendars={selectedCalendars}
        taskLists={taskLists}
        selectedTaskList={selectedTaskList}
        currentDate={currentDate}
        lastSync={lastSync}
        onViewModeChange={setViewMode}
        onCalendarViewTypeChange={setCalendarViewType}
        onCalendarsChange={setSelectedCalendars}
        onTaskListChange={setSelectedTaskList}
        onDateChange={setCurrentDate}
        onSync={handleSync}
      />

      {viewMode === "calendar" ? (
        <CalendarView
          viewType={calendarViewType}
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
        />
      ) : (
        <TasksView
          tasks={tasks}
          onTaskClick={handleTaskClick}
        />
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onOpenInBrowser={handleOpenInBrowser}
        />
      )}

      {selectedTask && (
        <EventModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onOpenInBrowser={handleOpenInBrowser}
        />
      )}
    </div>
  );
}

export default App;
