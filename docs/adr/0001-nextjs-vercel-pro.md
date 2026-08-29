# ADR 0001：Next.js App Router と Vercel Pro を採用する

| 項目 | 内容 |
|---|---|
| Status | Accepted for prototype／Production は別 Gate |
| Date | 2026 年 8 月 29 日 |
| Owner | Principal Engineer |
| Decision scope | Frontend、Web BFF の配置、Build、Hosting |

## Context

HTML、CSS、JavaScript 中心の Local prototype を、継続的に機能追加、Test、Review、Preview できる構造へ移行する必要があります。将来は認証、Tenant 認可、Private storage、OCR Queue、監査、CRM Connector を追加しますが、現在は合成データによる UI 検証が Scope です。

## Decision

1. Next.js 16 の App Router を Routing、Metadata、Server／Client boundary の基盤にします。
2. React 19 と TypeScript strict mode を採用します。TypeScript 7 と ESLint 10 は Next.js の解析 Plugin 対応後に更新し、現時点は互換性が検証できた TypeScript 6.0.3／ESLint 9.39.5 に固定します。
3. `src/app` は Route composition に限定し、業務機能は `src/features`、業務非依存要素は `src/shared` が所有します。
4. Feature は `model` と `ui` を内部に持ち、Feature 間は明示した公開 Entry point だけで連携します。依存方向を Script で検証します。
5. 現在の横断状態は `WorkspaceProvider` の Browser memory が所有します。Reload で消えることを仕様として明示し、Server state の代用にはしません。
6. Hosting は Vercel Pro を前提とし、Fluid compute と `kix1` を Code で固定します。Git integration、Protection、Domain、Production branch は Vercel Project 側で別に承認します。
7. Request ごとに nonce を発行する strict CSP を適用します。nonce が必要なため、現在の全 Route は動的 Render です。
8. Vercel Build は `verify → next build` の順序を固定し、Lint、型、Test、Architecture／Client security fitness を迂回させません。

## Runtime boundary

```text
Browser
  └─ Client feature UI
       └─ Workspace state（現在は合成データ／Browser memory）

Next.js on Vercel
  ├─ Proxy：nonce、CSP
  ├─ App Router：Route、Metadata、Server rendering
  └─ 将来の BFF：認証、Tenant 認可、Use case

将来の Private boundary
  ├─ PostgreSQL／Outbox
  ├─ Private object storage／Quarantine
  └─ Queue／OCR・CRM Worker
```

Browser から OCR、CRM、Database、Object storage へ直接接続しません。外部連携の Secret と認可は将来の Server boundary が所有します。

## Consequences

### Positive

- Route 単位の Code splitting、Metadata、Preview deployment を標準化できます。
- Domain model を React／Next.js から分離し、将来の BFF や Worker でも再利用しやすくなります。
- Git の Pull request ごとに Vercel Preview と同じ Build gate を実行できます。
- CSP、Security header、Node version、Region、Build command を Code review の対象にできます。

### Cost／Trade-off

- nonce CSP は動的 Render を必要とし、静的配信だけの場合より Compute と Cache の設計が重要です。
- React Context は Server state、並行更新、Offline queue の解決策ではありません。本番接続時に Server state 管理へ置換します。
- `kix1` の指定だけでは、CDN、Log、Backup、Support、外部 Vendor を含む Japan-only を証明できません。
- Vercel Pro の Team 設定は Repository だけでは強制できません。Runbook と定期監査が必要です。

## Rejected alternatives

| 選択肢 | 見送った理由 |
|---|---|
| 静的 HTML を継続 | Route、状態、型、Preview、Server boundary の拡張性が不足 |
| 初日から Microservice | Domain と運用境界が未確定で、Failure mode と Cost を増やす |
| Browser から OCR API へ直接接続 | Secret、認可、PII、Retry、監査の境界を守れない |
| nonce なしの緩い CSP | Inline script の許可範囲が広くなり、将来の PII Application に不適切 |

## Revisit conditions

- Next.js の公式 Toolchain が TypeScript 7／ESLint 10 に対応したとき
- nonce CSP の Compute cost が SLO／Budget を満たさないとき
- 認証、Database、OCR Provider の Decision gate が承認されたとき
- `kix1` 単一 Region では可用性要件を満たせないと判明したとき
