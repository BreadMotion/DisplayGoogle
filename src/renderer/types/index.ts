export interface CalendarListItem {
  id: string;
  summary: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  colorId?: string;
}

export interface TaskList {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: string;
  due?: string;
  completed?: string;
  parent?: string;
  links?: Array<{ type: string; link: string }>;
}

export type ViewMode = "calendar" | "tasks";
export type CalendarViewType = "month" | "week" | "day";

export interface ElectronAPI {
  checkAuth: () => Promise<boolean>;
  login: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  getCalendarList: () => Promise<CalendarListItem[]>;
  getCalendarEvents: (
    calendarId: string,
    timeMin: string,
    timeMax: string,
  ) => Promise<CalendarEvent[]>;
  getTaskLists: () => Promise<TaskList[]>;
  getTasks: (taskListId: string) => Promise<Task[]>;
  openBrowser: (url: string) => Promise<void>;
  toggleMouseEvents: (ignore: boolean) => Promise<void>;
  openSettings: () => Promise<void>;

  // 設定の読み書き
  getSettings: () => Promise<{
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }>;
  saveSettings: (settings: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  }) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
