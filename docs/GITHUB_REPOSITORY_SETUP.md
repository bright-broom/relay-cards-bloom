# GitHub Repository 初期設計

作成日：2026 年 8 月 30 日

## 決定事項

| 項目 | 設定 |
|---|---|
| Repository | `bright-broom/relay-cards-bloom` |
| 表示名 | Relay Cards |
| 説明 | 名刺を次の行動へつなぐ、法人向け人脈・フォローアップ管理ツール |
| Visibility | Private |
| Default branch | 初回 Push 後に `main` |
| Issue | 有効 |
| Wiki | 無効。設計文書は `docs/` を正本にする |
| Projects | 無効。必要になった時点で用途と Owner を決める |
| Discussions | 無効 |
| Merge 方針 | Squash merge のみ |
| Merge 後の branch | 自動削除 |
| License | 付与しない。Private／Proprietary として扱う |
| Hosting | Vercel Pro。GitHub 作成・Merge・Deploy を別の状態として管理する |

GitHub 上の Private Repository は作成済みです。初期化用の空 Commit で `main` を確立し、Application と運用設定は Pull Request 経由で追加します。現在の Pull Request、CI、Merge、Deploy 状態は GitHub と Vercel の Live state を確認してください。

GitHub 側で README、`.gitignore`、License は自動生成しません。ローカルにある検証済みファイルを正本として、履歴の衝突を避けます。

## 初回 Push 前の必須確認

- `npm run build:vercel` が成功している
- `npm audit` で既知の脆弱性を確認している
- Secret、Credential、実在人物の情報、顧客データ、名刺画像が含まれていない
- `.env*`、`.vercel/`、`.next/`、`node_modules/` が Git 管理外である
- Git の author 名・メールアドレスが、公開してよい情報か本人が確認している
- 初回 Commit の内容と Commit message を本人が承認している

## `main` Ruleset の推奨値

初回 Push と CI 名の確定後に、GitHub 上で別承認を得て設定します。

- Pull Request 経由を必須化
- 独立 Reviewer 1 名以上の承認を必須化
- 新しい Commit で古い承認を無効化
- Review conversation の解決を必須化
- Required check：`CI / Verify and build`
- Force push と branch 削除を禁止
- CODEOWNERS 対象変更の承認を必須化
- Bypass actor を最小化し、通常作業では使用しない

Repository owner が唯一の Contributor である期間は、独立レビュー要件を満たせません。その場合も自己承認を完了条件とせず、レビュー未実施として明示します。

## GitHub Actions

- Workflow 権限は `contents: read` のみ
- Vercel Credential や Production Secret を CI に渡さない
- Lock file に基づいて `npm ci` を実行
- `npm run build:vercel` で Lint、型、Unit test、Architecture、Security、Production build を一括検証
- GitHub Actions は release tag だけでなく Commit SHA に固定
- Dependabot で npm と GitHub Actions を週次確認

## Vercel 連携時の Gate

1. Vercel Team と Project owner を決定する
2. Production branch を `main` に固定する
3. Preview と Production の環境変数・権限を分離する
4. Deployment Protection と承認者を設定する
5. GitHub CI の成功、対象 Commit SHA、Vercel build 対象を照合する
6. Preview の確認後も、自動的に Production Deploy の承認とは扱わない

詳細は [Vercel Pro 運用手順](VERCEL_PRO_RUNBOOK.md)を参照してください。
