import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // 認証
  checkAuth: () => ipcRenderer.invoke("auth:check"),
  login: () => ipcRenderer.invoke("auth:login"),
  logout: () => ipcRenderer.invoke("auth:logout"),

  // カレンダー
  getCalendarList: () =>
    ipcRenderer.invoke("calendar:list"),
  getCalendarEvents: (
    calendarId: string,
    timeMin: string,
    timeMax: string,
  ) =>
    ipcRenderer.invoke(
      "calendar:events",
      calendarId,
      timeMin,
      timeMax,
    ),

  // タスク
  getTaskLists: () => ipcRenderer.invoke("tasks:lists"),
  getTasks: (taskListId: string) =>
    ipcRenderer.invoke("tasks:items", taskListId),

  // ブラウザ
  openBrowser: (url: string) =>
    ipcRenderer.invoke("open:browser", url),

  // ウィンドウ
  toggleMouseEvents: (ignore: boolean) =>
    ipcRenderer.invoke("window:toggle-mouse", ignore),
  openSettings: () => ipcRenderer.invoke("settings:open"),

  // 設定の読み書き
  getSettings: () => ipcRenderer.invoke("settings:get"),
  saveSettings: (settings: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  }) => ipcRenderer.invoke("settings:set", settings),
});
