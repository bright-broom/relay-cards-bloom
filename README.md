# Relay Cards

Relay Cards は、名刺を保管するだけでなく、社内の接点と次のフォローへつなげる法人向け人脈ワークスペースです。現在は、合成データのみで UI、操作、情報設計を検証する高忠実度プロトタイプです。

## 技術スタック

- Next.js 16.3.3／App Router／Turbopack
- React 19.2.8
- TypeScript 6.0.3／strict mode
- ESLint 9.39.5／Next.js Core Web Vitals／TypeScript rules
- Vitest 4.1.0
- Node.js 24.x
- Vercel Pro 対応構成／Fluid compute／大阪 `kix1`

TypeScript 7 と ESLint 10 は 2026 年 8 月 29 日時点で Next.js の解析 Plugin が未対応のため、品質ゲートが正常に機能する最新の互換版へ固定しています。依存更新は CI の全検証通過後に行います。

## 実装済みの画面

| URL | 機能 |
|---|---|
| `/` | 今日のフォロー、最近の人物、紹介候補 |
| `/people` | 横断検索、状態フィルター、人物詳細 |
| `/companies` | 企業別の人物数、社内接点、最新活動 |
| `/follow-ups` | 期限別ボード、完了／未完了の切り替え |
| `/import` | 形式・容量検証、人手確認後のデモ登録 |
| `/data-quality` | 重複、古い所属、欠損候補の確認 |

横断検索は `⌘ K` または `/`、連絡先の伏せ字表示は画面上部の「プライバシー」から操作できます。

## 3 色のカラーシステム

画面面積の目安を `Primary 70%／Sub 20%／Accent 10%` に統一しています。

| 役割 | 色 | 使用範囲 |
|---|---|---|
| Primary 70% | アイボリー `#F4F5EF` | 背景、パネル、フォーム、余白 |
| Sub 20% | ディープフォレスト `#10231D` | ナビゲーション、本文、主要ボタン |
| Accent 10% | ライム `#C8F07E` | 選択状態、注目情報、限定的な CTA |

枠線、ホバー、補助文字、状態表示は、この 3 色の混色と透明度だけで表現します。青、赤、黄、紫などの追加色は使用しません。

## ディレクトリ設計

```text
relay-cards/
├── docs/                         # Architecture decision と運用手順
├── scripts/
│   ├── check-architecture.mjs   # 依存方向を強制する Fitness test
│   ├── check-client-security-boundary.mjs # Client の送信・危険 API を禁止
│   └── check-repository-governance.mjs # CI 権限と Repository 運用を検査
├── src/
│   ├── app/                     # Route と Metadata の組み立てだけ
│   ├── features/
│   │   ├── contacts/            # 人物・企業の Domain と UI
│   │   ├── data-quality/        # 品質候補の Domain と UI
│   │   ├── follow-ups/          # 次の行動の Domain と UI
│   │   ├── imports/             # 取り込みと Human review
│   │   └── workspace/           # Navigation と画面横断状態
│   ├── shared/
│   │   ├── security/            # CSP など Framework 非依存の Policy
│   │   └── ui/                  # Domain 非依存の UI primitive
│   └── proxy.ts                 # Request ごとの nonce と CSP
└── tests/                       # Domain、Security、Vercel 構成 Test
```

依存方向は `app → feature UI → feature model／shared` です。`shared` から `feature` への逆依存、Domain model から React／Next.js への依存、他 Feature の内部ファイルへの直接依存、App／Proxy から到達できない Source file を自動検出します。Feature 間の連携は公開 Entry point だけを使います。

## ローカル起動

Node.js 24.x と npm 11.x を使用します。

```bash
npm ci
npm run dev
```

ブラウザーで `http://127.0.0.1:4174` を開きます。

## 検証

```bash
npm run verify        # Lint、型、Unit test、Architecture／Security／Repository fitness
npm run build:vercel # 上記の全検証後に Production build
```

`vercel.json` の Build command も `npm run build:vercel` へ固定しているため、Vercel 上だけ検証を迂回することはできません。

## Security とデータ境界

- 表示データは、予約済み Domain と架空の電話番号を使った合成データです。
- 名刺画像は形式と容量だけを Browser で確認し、画像本体を読み取り、保存、外部送信しません。
- Request ごとに nonce を生成し、Production では `unsafe-inline`／`unsafe-eval` のない CSP を返します。
- Camera、Microphone、位置情報、Payment、USB を Permissions Policy で拒否します。
- OCR、認証、認可、Database、CRM、実データ保管は未接続です。

## Vercel Pro

Code と構成は Vercel Pro 向けに準備済みです。Team、Project、Production branch、Domain、Deployment Protection の選択には Vercel Account 側の決定が必要なため、実 Deploy と公開はまだ行っていません。手順と承認 Gate は [Vercel Pro 運用手順](docs/VERCEL_PRO_RUNBOOK.md)を参照してください。

## 設計文書

- [競合調査](docs/COMPETITIVE_RESEARCH.md)
- [Principal Engineering 設計](docs/PRODUCT_ARCHITECTURE.md)
- [ADR：Next.js と Vercel Pro](docs/adr/0001-nextjs-vercel-pro.md)
- [GitHub Repository 初期設計](docs/GITHUB_REPOSITORY_SETUP.md)
- [Vercel Pro 運用手順](docs/VERCEL_PRO_RUNBOOK.md)

## 状態

Local 実装・検証済みです。Source は GitHub の Private Repository `bright-broom/relay-cards-bloom` で Pull Request を通して管理します。Merge、Vercel Project 作成、Deploy、公開、本番運用は別の承認対象です。
