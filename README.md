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

#### 方法1: `.env` ファイルを使用する（推奨，開発為け）

機密情報を安全に管理したい場合、この方法を使用してください。

1. プロジェクトルートで `.env.example` をコピーして `.env` を作成:
   ```bash
   cp .env.example .env
   ```

2. `.env` ファイルを編集し、Google Cloud Console で取得した Client ID と Client Secret を入力:
   ```
   GOOGLE_CLIENT_ID=97759291881-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
   ```

3. `.env` ファイルを保存

**⚠️ 重要な注意**: 
- `.env` ファイルは `.gitignore` に登録されているため、Git で管理されません。これにより機密情報の漏洞の低減を実現しました。
- アプリ起動時に dotenv が `.env` を自動的に読み込みます。

#### 方法2: 設定画面から設定する（ユーザー向け）

ローカルに `.env` ファイルがない場合、またはアプリ実行中に値を更新したい場合は以下の手順に従います:

1. アプリケーションを起動
2. 画面下部右のシステムトレイアイコンをクリック
3. 窙口メニューから「設定を開く」を選択
4. 設定画面で「Google API クレデンシャル」セクションを下スクロール
5. Client ID, Client Secret, Redirect URI を入力
6. 「保存」ボタンをクリック

設定や値は OS のユーザーデータ領域に永続化されます。

#### 優先順位

認証情報は以下の順序でロードされます（上から優先）:

1. **開発時の `.env` ファイルによる環境変数** - 最も高い优先度
2. **アプリケーション設定画面で保存した値** - `.env` がない場合に使用

**例：** `.env` が存在している場合、設定画面で入力した値は使用されません。`.env` がない場合に、アプリ設定画面で保存した値が使用されます。

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
1. アプリケーションを起動します
2. 初回起動時に認証情報が未設定の場合は、設定画面を開くよう案内されます（またはシステムトレイから手動で開く）
3. 設定画面で Google API クレデンシャル（Client ID / Client Secret）を入力して保存するか、`.env` ファイルを事前に作成してください
4. 認証情報が設定されたら、「Googleアカウントでログイン」ボタンをクリック
5. ブラウザウィンドウが開き、Googleログイン画面が表示されます
6. Googleアカウントでログイン
7. アクセス許可を確認し、「許可」をクリック
8. 認証が完了すると、アプリにカレンダーとタスクが表示されます

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
