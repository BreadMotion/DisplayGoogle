import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import "./Settings.css";

function Settings() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState(
    "http://localhost:3000/oauth2callback",
  );
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated =
        await window.electronAPI.checkAuth();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error("認証チェックエラー:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings =
        await window.electronAPI.getSettings();
      setClientId(settings.clientId || "");
      setClientSecret(settings.clientSecret || "");
      setRedirectUri(
        settings.redirectUri ||
          "http://localhost:3000/oauth2callback",
      );
    } catch (error) {
      console.error("設定の読み込みエラー:", error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await window.electronAPI.saveSettings({
        clientId,
        clientSecret,
        redirectUri,
      });
      setSaveMessage("設定を保存しました");
    } catch (error) {
      console.error("設定保存エラー:", error);
      setSaveMessage("保存に失敗しました");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
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

  const handleLogout = async () => {
    try {
      await window.electronAPI.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  const handleOpenCalendar = () => {
    window.electronAPI.openBrowser(
      "https://calendar.google.com",
    );
  };

  const handleOpenTasks = () => {
    window.electronAPI.openBrowser(
      "https://tasks.google.com",
    );
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Display Google 設定</h1>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h2>アカウント</h2>
          {isAuthenticated ? (
            <div className="auth-status">
              <div className="status-indicator connected">
                <span className="status-dot"></span>
                <span>Googleアカウントに接続済み</span>
              </div>
              <button
                onClick={handleLogout}
                className="button button-secondary"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="auth-status">
              <div className="status-indicator disconnected">
                <span className="status-dot"></span>
                <span>未接続</span>
              </div>
              <button
                onClick={handleLogin}
                className="button button-primary"
              >
                Googleアカウントでログイン
              </button>
            </div>
          )}
        </section>

        <section className="settings-section">
          <h2>Google API クレデンシャル</h2>
          <p className="section-description">
            Client ID / Client Secret / Redirect URI
            を入力して保存してください。ローカルに
            <code>.env</code>{" "}
            がある場合はそちらが優先されます。
          </p>

          <div className="form-row">
            <label>Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Client Secret</label>
            <input
              type="text"
              value={clientSecret}
              onChange={(e) =>
                setClientSecret(e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label>Redirect URI</label>
            <input
              type="text"
              value={redirectUri}
              onChange={(e) =>
                setRedirectUri(e.target.value)
              }
            />
          </div>

          <div className="button-group">
            <button
              onClick={handleSaveSettings}
              className="button button-primary"
              disabled={saving}
            >
              保存
            </button>
          </div>

          {saveMessage && (
            <p className="save-message">{saveMessage}</p>
          )}
        </section>

        <section className="settings-section">
          <h2>クイックアクセス</h2>
          <p className="section-description">
            ブラウザでGoogleサービスを開きます
          </p>
          <div className="button-group">
            <button
              onClick={handleOpenCalendar}
              className="button button-primary"
            >
              📅 Google カレンダーを開く
            </button>
            <button
              onClick={handleOpenTasks}
              className="button button-primary"
            >
              ✓ Google タスクを開く
            </button>
          </div>
        </section>
        <section className="settings-section">
          <h2>表示設定</h2>
          <p className="section-description">
            壁紙の表示設定はメイン画面の上部パネルから変更できます
          </p>
          <ul className="feature-list">
            <li>カレンダーとタスクの切り替え</li>
            <li>月/週/日表示の切り替え</li>
            <li>複数カレンダーの同時表示</li>
            <li>10分ごとの自動同期</li>
          </ul>
        </section>
        <section className="settings-section">
          <h2>使い方</h2>
          <ul className="feature-list">
            <li>
              上部のパネルにマウスを合わせると操作メニューが表示されます
            </li>
            <li>
              イベントやタスクをクリックすると詳細が表示されます
            </li>
            <li>
              モーダル内の「ブラウザで開く」ボタンで編集画面へ移動できます
            </li>
            <li>
              システムトレイのアイコンから設定画面を開けます
            </li>
          </ul>
        </section>
        <section className="settings-section">
          <h2>バージョン情報</h2>
          <p className="version-info">
            Display Google v1.0.0
          </p>
          <p className="version-info">
            Wallpaper application for Google Calendar and
            TODO
          </p>
        </section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
);
