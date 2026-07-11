# ふわふわ.みんな

[ふわふわ.みんな](https://xn--19ja1fb.xn--q9jyb4c/) は、岡 海摩の写真、ラーメン記録、好きな音楽、リンクをまとめたポートフォリオサイトです。

## 技術構成

- Node.js 24 LTS
- Next.js 16 / React 19
- TypeScript
- styled-components
- 静的HTMLエクスポート

## セットアップ

Node.jsとnpmのバージョンは `.nvmrc` と `package.json` に固定しています。

```sh
nvm install
nvm use
npm install -g npm@11.17.0
npm ci
```

開発サーバーを起動します。

```sh
npm run dev
```

## 環境変数

音楽ページへYouTubeプレイリストを含める場合のみ、`.env.example` を参考に `.env.local` を作成します。

```dotenv
YOUTUBE_API_KEY=
PLAYLIST_ID=
```

プレイリストは `next build` 時に取得され、静的HTMLへ埋め込まれます。環境変数がない場合やYouTube APIを取得できない場合もビルドは継続し、音楽ページには案内文が表示されます。

## コマンド

```sh
npm run dev          # 開発サーバー
npm run check        # TypeScript・ESLint・Stylelint・Prettier
npm run build        # out/ へ静的サイトを生成
npm run preview      # out/ をローカル配信
npm run deploy:cloudflare # Cloudflare Pagesへデプロイ
npm run format       # コードを整形
```

## データと画像

- 写真情報: `src/data/photos.ts`
- ラーメン情報: `src/data/ramen.ts`
- 写真・ラーメンの本体画像: 外部の静的配信先
- サイト共通画像とフォント: `public/`

写真・ラーメンのIDは配列位置から生成しているため、既存項目の並べ替えや途中への挿入は公開URLを変える可能性があります。新しい項目は原則として配列末尾へ追加してください。

## デプロイ

`next.config.ts` の `output: "export"` により、成果物は `out/` に生成されます。Node.jsサーバーは不要で、任意の静的ホスティングへ配置できます。URLは末尾スラッシュを前提としています。

Cloudflare Pagesへは、ダッシュボードのドラッグ＆ドロップではなくWranglerを使用します。ドラッグ＆ドロップには1,000ファイルの上限があり、静的書き出しのファイル数が上限を超えるためです。アップロード対象は必ず`out/`とし、`.next/`やリポジトリ全体は指定しません。

初回のみCloudflareへログインします。デプロイ先は、独自ドメインに接続済みの`portfolio-site`プロジェクトへ固定しています。プロジェクト一覧を確認する場合は`npm run cloudflare:projects`を使用します。

```sh
npm run cloudflare:login
npm run cloudflare:projects
```

次のコマンドでデプロイします。静的解析と本番ビルドも先に実行します。

```sh
npm run deploy:cloudflare
```

Wranglerは現在のGitブランチを自動判定します。Cloudflare Pagesで設定したProduction branch以外から実行するとプレビューデプロイになるため、本番更新はProduction branchへマージしてから実行してください。意図的にブランチを指定する場合は、末尾へ`--branch=<BRANCH_NAME>`を追加します。

Issueは自由に作成して構いません。
