import dotenv from "dotenv";
import Store from "electron-store";
import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  shell,
  screen,
  nativeImage,
} from "electron";
import * as path from "path";
import { GoogleAuthService } from "./services/google-auth";
import { GoogleCalendarService } from "./services/google-calendar";
import { GoogleTasksService } from "./services/google-tasks";

// .env を読み込む（存在すれば process.env に展開される）
dotenv.config();

// 永続設定ストア
const store = new Store();

let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const googleAuth = new GoogleAuthService();
const calendarService = new GoogleCalendarService(
  googleAuth,
);
const tasksService = new GoogleTasksService(googleAuth);

function createMainWindow() {
  const { width, height } =
    screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    alwaysOnTop: false,
    type: "desktop",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 最背面に配置
  mainWindow.setAlwaysOnTop(false);
  mainWindow.setSkipTaskbar(true);

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "renderer", "index.html"),
    );
  }

  // クリックスルー設定（初期状態：クリックスルー）
  // forward: true により mousemove はレンダラにフォワードされますが、クリックは
  // OS 側に透過されます。認証や UI 操作時にレンダラで入力を受け取りたい場合は
  // レンダラから `window.electronAPI.toggleMouseEvents(false)` を呼んでください。
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  console.log(
    "[main] mainWindow initialized: setIgnoreMouseEvents(true, { forward: true })",
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: 700,
    title: "設定",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    settingsWindow.loadURL(
      "http://localhost:3000/settings.html",
    );
  } else {
    settingsWindow.loadFile(
      path.join(
        __dirname,
        "renderer",
        "public",
        "settings.html",
      ),
    );
  }

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

function createTray() {
  // トレイアイコンの作成（アイコンファイルは後で追加）
  const iconCandidates = [
    path.join(__dirname, "renderer", "public", "icon.png"),
    path.join(__dirname, "public", "icon.png"),
    path.join(__dirname, "renderer", "icon.png"),
    path.join(__dirname, "icon.png"),
  ];

  let trayIcon = null;
  for (const p of iconCandidates) {
    const img = nativeImage.createFromPath(p);
    if (!img.isEmpty()) {
      trayIcon = img;
      break;
    }
  }
  if (!trayIcon) {
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "設定を開く",
      click: () => {
        createSettingsWindow();
      },
    },
    {
      label: "再読み込み",
      click: () => {
        if (mainWindow) {
          mainWindow.reload();
        }
      },
    },
    { type: "separator" },
    {
      label: "終了",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Display Google");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    createSettingsWindow();
  });
}

// IPC Handlers
ipcMain.handle("auth:check", async () => {
  return await googleAuth.isAuthenticated();
});

ipcMain.handle("auth:login", async () => {
  return await googleAuth.authenticate();
});

ipcMain.handle("auth:logout", async () => {
  await googleAuth.logout();
  return true;
});

ipcMain.handle("calendar:list", async () => {
  return await calendarService.getCalendarList();
});

ipcMain.handle(
  "calendar:events",
  async (
    _,
    calendarId: string,
    timeMin: string,
    timeMax: string,
  ) => {
    return await calendarService.getEvents(
      calendarId,
      timeMin,
      timeMax,
    );
  },
);

ipcMain.handle("tasks:lists", async () => {
  return await tasksService.getTaskLists();
});

ipcMain.handle(
  "tasks:items",
  async (_, taskListId: string) => {
    return await tasksService.getTasks(taskListId);
  },
);

ipcMain.handle("open:browser", async (_, url: string) => {
  await shell.openExternal(url);
});

ipcMain.handle(
  "window:toggle-mouse",
  async (_, ignore: boolean) => {
    console.log(
      `[main] IPC window:toggle-mouse -> ${ignore}`,
    );
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(ignore, {
        forward: true,
      });
      console.log(
        `[main] mainWindow.setIgnoreMouseEvents(${ignore}) called`,
      );
    }
    return true;
  },
);

ipcMain.handle("settings:open", async () => {
  createSettingsWindow();
});

// 設定の取得（.env の値が優先され、未設定なら永続ストアを参照）
ipcMain.handle("settings:get", async () => {
  return {
    clientId:
      process.env.GOOGLE_CLIENT_ID ||
      (store.get("google.clientId") as string) ||
      "",
    clientSecret:
      process.env.GOOGLE_CLIENT_SECRET ||
      (store.get("google.clientSecret") as string) ||
      "",
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      (store.get("google.redirectUri") as string) ||
      "http://localhost:3000/oauth2callback",
  };
});

// 設定の保存（永続ストアに書き込む）
ipcMain.handle(
  "settings:set",
  async (
    _,
    settings: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
    },
  ) => {
    if (settings.clientId !== undefined) {
      store.set("google.clientId", settings.clientId);
    }
    if (settings.clientSecret !== undefined) {
      store.set(
        "google.clientSecret",
        settings.clientSecret,
      );
    }
    if (settings.redirectUri !== undefined) {
      store.set("google.redirectUri", settings.redirectUri);
    }
    return true;
  },
);

app.whenReady().then(() => {
  createMainWindow();
  createTray();
});

app.on("window-all-closed", () => {
  // トレイアイコンがあるので、ウィンドウが全て閉じてもアプリは終了しない
  if (process.platform !== "darwin" && !tray) {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

app.on("before-quit", () => {
  if (tray) {
    tray.destroy();
  }
});
