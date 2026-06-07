import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as fs from "fs";
import * as path from "path";
import { app, BrowserWindow } from "electron";
import Store from "electron-store";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/tasks.readonly",
];

export class GoogleAuthService {
  private oauth2Client: OAuth2Client | null = null;
  private tokenPath: string;

  constructor() {
    const userDataPath = app.getPath("userData");
    this.tokenPath = path.join(
      userDataPath,
      "google-tokens.json",
    );
  }

  async isAuthenticated(): Promise<boolean> {
    if (this.oauth2Client) {
      return true;
    }

    if (fs.existsSync(this.tokenPath)) {
      try {
        const tokens = JSON.parse(
          fs.readFileSync(this.tokenPath, "utf-8"),
        );
        this.oauth2Client = this.createOAuth2Client();
        this.oauth2Client.setCredentials(tokens);
        return true;
      } catch (error) {
        console.error("トークンの読み込みに失敗:", error);
        return false;
      }
    }

    return false;
  }

  async authenticate(): Promise<boolean> {
    try {
      this.oauth2Client = this.createOAuth2Client();
    } catch (error) {
      console.error(
        "認証用クライアントの作成に失敗:",
        error,
      );
      return false;
    }

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    const authCode =
      await this.getAuthCodeFromUser(authUrl);
    if (!authCode) {
      return false;
    }

    try {
      const { tokens } =
        await this.oauth2Client.getToken(authCode);
      this.oauth2Client.setCredentials(tokens);
      fs.writeFileSync(
        this.tokenPath,
        JSON.stringify(tokens),
      );
      return true;
    } catch (error) {
      console.error("認証に失敗:", error);
      return false;
    }
  }

  async logout(): Promise<void> {
    if (fs.existsSync(this.tokenPath)) {
      fs.unlinkSync(this.tokenPath);
    }
    this.oauth2Client = null;
  }

  getClient(): OAuth2Client {
    if (!this.oauth2Client) {
      throw new Error("認証されていません");
    }
    return this.oauth2Client;
  }

  private createOAuth2Client(): OAuth2Client {
    const store = new Store();

    const CLIENT_ID =
      process.env.GOOGLE_CLIENT_ID ||
      (store.get("google.clientId") as string) ||
      "";
    const CLIENT_SECRET =
      process.env.GOOGLE_CLIENT_SECRET ||
      (store.get("google.clientSecret") as string) ||
      "";
    const REDIRECT_URI =
      process.env.GOOGLE_REDIRECT_URI ||
      (store.get("google.redirectUri") as string) ||
      "http://localhost:3000/oauth2callback";

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error(
        "Google API のクライアント情報が設定されていません。設定画面から Client ID / Client Secret を設定してください。",
      );
    }

    return new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    );
  }

  private async getAuthCodeFromUser(
    authUrl: string,
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const authWindow = new BrowserWindow({
        width: 600,
        height: 700,
        webPreferences: {
          nodeIntegration: false,
        },
      });

      authWindow.loadURL(authUrl);

      authWindow.webContents.on(
        "will-redirect",
        (event, url) => {
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get("code");

          if (code) {
            authWindow.close();
            resolve(code);
          }
        },
      );

      authWindow.on("closed", () => {
        resolve(null);
      });
    });
  }
}
