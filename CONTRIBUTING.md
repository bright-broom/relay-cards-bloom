# Relay Cards への貢献

## 開発フロー

1. `main` から目的別の短命ブランチを作成します。
2. `feat/`、`fix/`、`docs/`、`chore/` のいずれかをブランチ名の先頭に使います。
3. 変更範囲に応じたテストを追加し、`npm run build:vercel` を実行します。
4. Pull Request で変更理由、検証結果、セキュリティー・プライバシーへの影響を説明します。
5. 独立したレビューと必須 CI の成功後に Merge を判断します。Deploy は別の承認対象です。

`main` への直接 Push、Force push、検証を省略するためのテスト・CI の弱体化は禁止します。

## ローカル検証

```bash
npm ci
npm run build:vercel
```

UI 変更では、PC・モバイル、キーボード操作、主要な空・失敗・長文状態を確認してください。

## データと Secret

- 実在人物の氏名、メールアドレス、電話番号、名刺画像、顧客データを Commit、Issue、PR、ログへ含めないでください。
- 画面例とテストには合成データだけを使用してください。
- API Key、Token、接続文字列、秘密鍵は Git 管理外の環境変数または承認済み Secret Manager で扱います。
- 脆弱性は公開 Issue ではなく、[Security Policy](SECURITY.md)に従って非公開で報告してください。

## 保護対象

次の変更には、通常の機能変更より厳しいレビューが必要です。

- `.github/workflows/`、`.github/CODEOWNERS`
- `tests/`、`scripts/`
- `src/shared/security/`、`src/proxy.ts`
- `next.config.ts`、`vercel.json`
- 認証、認可、個人情報、保存、外部送信、ログ、Deploy に関わるコード
