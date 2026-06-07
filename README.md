# Display Google

Wallpaper Engine風のデスクトップ壁紙アプリケーションで、GoogleカレンダーとGoogle TODOをWindows 11のデスクトップに表示します。

## 機能

### 壁紙表示
- **Googleカレンダー表示**: 週表示/月表示/日表示の切り替え可能
- **Google TODO表示**: タスクリスト表示、完了/未完了の切り替え
- **複数カレンダー対応**: 複数のGoogleカレンダーを統合表示
- **自動同期**: 10分ごとに自動更新 + 手動同期ボタン
- **透過表示**: デスクトップアイコンを操作可能なクリックスルー機能

### インタラクション
- **イベント/タスクの詳細表示**: クリックでモーダル表示
- **ブラウザで開く**: 編集画面へ素早くアクセス
- **コントロールパネル**: マウスホバーで表示される操作パネル

### 設定画面
- **アカウント管理**: Google認証のログイン/ログアウト
- **クイックアクセス**: GoogleカレンダーとTODOをブラウザで開く
- **システムトレイ**: インジケーターからいつでもアクセス可能

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Cloud Consoleでの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. **APIとサービス** > **認証情報**を開く
4. **OAuth 2.0クライアントIDを作成**:
   - アプリケーションの種類: デスクトップアプリ
   - リダイレクトURI: `http://localhost:3000/oauth2callback`
5. クライアントIDとクライアントシークレットを取得
6. **APIとサービス** > **ライブラリ**で以下のAPIを有効化:
   - Google Calendar API
   - Google Tasks API

### 3. 認証情報の設定

`src/main/services/google-auth.ts`の以下の部分を編集:

```typescript
const CLIENT_ID = 'YOUR_CLIENT_ID'; // ここに取得したクライアントID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // ここに取得したクライアントシークレット
```

### 4. トレイアイコンの準備

`public/icon.png`にアプリケーションアイコン(16x16または32x32)を配置してください。

## 開発

### 開発モードで起動

```bash
npm run dev
```

これにより、以下が実行されます:
- TypeScriptのコンパイル(メインプロセス)
- Vite開発サーバー起動(レンダラープロセス)
- Electronアプリの起動

### ビルド

```bash
npm run build
```

## 使い方

### 初回起動
1. アプリケーションを起動すると、Google認証画面が表示されます
2. Googleアカウントでログインし、カレンダーとタスクへのアクセスを許可します

### 壁紙の操作
- **上部パネル**: マウスを画面上部に合わせるとコントロールパネルが表示されます
  - カレンダー/タスクの切り替え
  - 表示形式の変更(月/週/日)
  - カレンダーやタスクリストの選択
  - 日付のナビゲーション
  - 手動同期ボタン

- **イベント/タスクのクリック**: 詳細をモーダルで表示
  - 「ブラウザで開く」ボタンでGoogle Calendar/Tasksへジャンプ

### 設定画面
- システムトレイ(画面右下)のアイコンをクリック
- 「設定を開く」を選択
- アカウント管理やクイックアクセス機能を利用可能

## プロジェクト構造

```
DisplayGoogle/
├── src/
│   ├── main/              # Electronメインプロセス
│   │   ├── main.ts        # メインエントリーポイント
│   │   ├── preload.ts     # プリロードスクリプト
│   │   └── services/      # Google APIサービス
│   │       ├── google-auth.ts
│   │       ├── google-calendar.ts
│   │       └── google-tasks.ts
│   └── renderer/          # Reactレンダラープロセス
│       ├── App.tsx        # メインアプリ
│       ├── settings.tsx   # 設定画面
│       ├── components/    # Reactコンポーネント
│       ├── types/         # TypeScript型定義
│       └── utils/         # ユーティリティ関数
├── public/                # 静的ファイル
├── dist/                  # ビルド出力
├── package.json
└── README.md
```

## 技術スタック

- **Electron**: デスクトップアプリケーションフレームワーク
- **React**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Vite**: 高速ビルドツール
- **Google APIs**: Calendar API v3, Tasks API
- **OAuth 2.0**: Google認証

## トラブルシューティング

### 認証エラー
- Google Cloud Consoleで正しいクライアントIDとシークレットが設定されているか確認
- APIが有効化されているか確認
- リダイレクトURIが正しく設定されているか確認

### 壁紙が表示されない
- Electronの起動ログを確認
- TypeScriptのコンパイルエラーがないか確認

### イベントが表示されない
- インターネット接続を確認
- Google Calendarに実際にイベントが登録されているか確認
- コンソールログでエラーを確認

## ライセンス

MIT

## 作者

Display Google - Wallpaper application for Google Calendar and TODO
