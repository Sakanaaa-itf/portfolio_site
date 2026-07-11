# Refactor progress

最終更新: 2026-07-11

## 目的

- Node.js / Next.js / React と開発ツールを、互換性を確認した安定版へ更新する。
- 全画面の実装を型安全性、保守性、パフォーマンス、アクセシビリティの観点でリファクタする。
- `output: "export"` の静的サイトとして、本番ビルドと実際のブラウザ操作が成立する状態にする。
- lint、Stylelint、Prettier、TypeScript、本番ビルドをすべて通す。

## 採用方針とバージョン

- Node.js: `24.18.0` LTS
  - Node.js 26はCurrentのため採用しない。
- npm: `11.17.0`
- Next.js: `16.2.10`
- React / React DOM: `19.2.7`
- TypeScript: `5.9.3`
  - TypeScript 7は現行のtypescript-eslint互換範囲外なので採用しない。
- ESLint: `9.39.5`
  - ESLint 10はNext.js同梱のReactプラグインが実行時エラーになるため、互換性のある9系を採用する。
- Stylelint: `17.14.0`
- styled-components: `6.4.3`

## 完了済みの変更

### ツールチェーン・設定

- `.nvmrc` をNode 24.18.0へ更新。
- `package.json` を整理。
  - 不要な `react-router-dom`、`react-icons`、`@cloudflare/next-on-pages` などを削除。
  - `typecheck`、`check`、`format:check`、静的出力用 `preview` スクリプトを追加。
  - Node/npmのenginesとpackageManagerを明示。
- `package-lock.json` をGit管理対象に変更。
- Next.js 16向けに `next.config.ts` を更新。
  - Turbopack既定化に合わせて `--turbopack` を削除。
  - `typedRoutes`、`reactStrictMode` を有効化。
  - 静的出力先と競合していた `distDir: "out"` を削除。
- ESLintをlegacy `.eslintrc` からflat configの `eslint.config.mjs` へ移行。
- TypeScript設定をES2022・strict寄りに更新。
- Stylelint 17向けに設定と依存を更新。

### アプリ全体

- Google Fontsへのビルド時ネットワーク依存を削除し、ローカルUDEV Gothicへ統一。
- styled-componentsのSSRレジストリを追加し、初期HTMLへスタイルを埋め込むよう修正。
- `src/app/globals.css` を実際のグローバルスタイルとして再構成。
- `layout.tsx` のmetadata、OGP、viewportを拡充。
- ページごとのcanonical・OG・Twitter metadata、404ページ、sitemapを追加。
- `robots.txt` にsitemapを追加。
- フォントを実使用文字だけのWOFF2へ変換し、約92MBから約272KBへ削減。
- 背景・プロフィール・OG画像を正規WebPへ再エンコードし、約20MBから約488KBへ削減。
- 未使用のテンプレートSVG、フォント、旧画像を削除。

### トップ・共通ナビゲーション

- ローダーをフェード完了後にアンマウントするよう修正。
- スクロール処理をRAF + passive listener + CSS変数へ変更。
- 背景スライドをキャンセル可能な単一ループへ整理。
  - Strict Mode、タイマーcleanup、画像fallback、非表示タブ、reduced motionに対応。
- ハンバーガーメニューへARIA、Escape、フォーカストラップ、body cleanupを追加。
- プロフィール反転UIを正しいbutton/link構造へ変更。

### 写真画面

- 一覧の疑似ローディングを削除。
- サムネイルをNext Image化し、sizes/loadingを改善。
- 詳細画面の端末判定をCSS中心へ変更。
- 一覧と詳細の前後移動順を日付順に統一。
- EXIF取得へabort、HTTPエラー処理、型安全化を追加。
- コメント中URLと改行処理の不具合を修正。
- 共通sort関数を型安全・非破壊に変更。

### ラーメン・リンク・音楽画面

- ラーメン一覧の破壊的 `sort()` を解消し、意味的HTMLと画像sizesを改善。
- 詳細の日付表示を決定的にし、情報構造を改善。
- Links画面の不要な端末判定とスクロール処理を削減し、画像fallbackを改善。
- Album Artwork画面をレスポンシブグリッドとアクセシブルなモーダルへ再構成。
- 静的exportで動作しない実行時 `/api/playlist` 依存を廃止し、ビルド時取得へ変更。
- YouTube環境変数がない場合も空状態を表示してビルドできる設計へ変更。

## 最終検証結果

- `npm ci`: 成功。追跡したlockfileから507パッケージをクリーンインストール。
- `npm run check`: 成功。
  - TypeScript
  - ESLint（warning 0）
  - Stylelint
  - Prettier
- `npm run build`: 成功。
  - Next.js 16.2.10 / Turbopack
  - 118ページを静的生成
  - 写真詳細35件、ラーメン詳細75件、sitemapを含む
- `npm audit --audit-level=moderate`: 既知の脆弱性0件。
- `out/`: 約9.8MB。変更前の約135MBから大幅に削減。
- ローカルHTTP確認:
  - `/`、一覧4画面、写真・ラーメン詳細、`/sitemap.xml` は200。
  - 存在しないパスは404。
  - WebPは `image/webp`、フォントは `font/woff2` で配信。
  - 各画面のcanonical、OG URL、タイトル、説明が画面固有の値。
  - YouTube環境変数なしでは、音楽画面に設定案内を静的出力。
  - 初期HTMLにstyled-componentsのCSSが含まれることを確認。

## 残っている確認

- このセッションではブラウザ操作用インターフェースが利用できなかったため、実ブラウザでのスクリーンショット比較とクリック操作の自動検証は未実施。
- メニュー、プロフィール反転、音楽モーダルはコード・型・静的HTML・ARIA構造まで確認済み。必要なら実ブラウザで最終目視する。

## 最終検証コマンド

```sh
npm ci
npm run check
npm run build
npm run preview
```

## 注意事項

- 現在の実行環境はNode 24.11.1で、目標の24.18.0より古い。最終的な利用時は `nvm install && nvm use` で `.nvmrc` に合わせる。
- YouTubeの実データをビルドへ含めるには `.env.local` に `YOUTUBE_API_KEY` と `PLAYLIST_ID` が必要。値はリポジトリへコミットしない。
- 写真・ラーメンのIDは配列位置由来のため、大規模な並べ替えは既存URLを変える。今回はURL互換性を優先してID方式自体は維持する。
