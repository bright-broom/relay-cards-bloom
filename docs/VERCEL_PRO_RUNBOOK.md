# Relay Cards Vercel Pro 運用手順

## 要点

Repository 側の Vercel Pro 対応は完了しています。実際の Project 作成、Git 接続、Domain 設定、Deploy は未実施です。以下の Owner と Gate を確定してから、人が Vercel Pro Team 上で実行します。

## 1. Deploy 前の Decision gate

| Gate | 決めること | Owner | 未決時 |
|---|---|---|---|
| Account | 利用する Vercel Pro Team と Billing owner | Sponsor／CorpIT | Project を作らない |
| Repository | Git Repository、Production branch、Review rule | Engineering owner | Git 接続しない |
| Identity | Preview／Production の閲覧者、SSO 方針 | Identity owner | 公開しない |
| Domain | Production Domain、DNS owner、証明書監視 | CorpIT | Vercel Domain のみで限定検証 |
| Data | 実データ可否、保持、Log、Region、委託条件 | Privacy／Security | 合成データのみ |
| Release | Approver、Rollback owner、Support 窓口 | Engineering／Operations | Production Deploy しない |

## 2. Repository で固定済みの設定

| 項目 | 設定 |
|---|---|
| Framework | Next.js |
| Node.js | `package.json` で 24.x |
| Build command | `npm run build:vercel` |
| Build gate | Lint → Type check → Unit test → Architecture check → Client security check → Next build |
| Compute | Fluid compute |
| Function Region | 大阪 `kix1` |
| CSP | Request ごとの nonce、Production は `unsafe-eval` なし |
| Search indexing | Prototype は `noindex, nofollow` |

Vercel Dashboard で Build command を上書きしません。上書きが必要な場合は、理由、期限、Owner を ADR に記録し、同等以上の Gate を維持します。

## 3. Vercel Pro Project の設定

1. 承認済み Pro Team 内に新規 Project を作成します。
2. 承認済み Git Repository を接続します。
3. Root directory は Repository 全体がこの Application の場合 `.`、Monorepo の場合 `relay-cards` を選択します。
4. Production branch を保護済み Branch に設定します。
5. Framework preset が Next.js、Build command が `npm run build:vercel` であることを確認します。
6. Node.js 24.x、Fluid compute、Function Region `kix1` が反映されていることを Deploy log で確認します。
7. Preview deployment は Vercel Authentication で Team／許可 User に限定します。
8. Password Protection は必要性と Pro add-on を確認してから使用します。Trusted IPs は Pro 標準機能と仮定せず、必要なら Enterprise を評価します。
9. Production Domain と DNS は CorpIT owner が設定し、証明書発行後に HSTS、CSP、Redirect を確認します。

## 4. Environment variable

現在の Prototype に Secret は不要です。将来追加するときは次を守ります。

- Secret は Vercel Environment Variables で Preview／Production を分離し、`NEXT_PUBLIC_` を付けません。
- Browser に必要な Public value だけを `NEXT_PUBLIC_` にします。Secret、Internal endpoint、Tenant key は禁止です。
- Pull request、Log、Screenshot、Test fixture に実 Secret を含めません。
- Rotation owner、期限、利用先、削除手順を Secret ごとに持ちます。
- Preview へ Production の Credential／実データを渡しません。

## 5. Release check

```bash
npm ci
npm run build:vercel
npm audit --omit=dev
```

Preview で次を確認します。

- 6 つの業務 URL と Not Found が表示される
- `⌘ K`／`/`、人物詳細、プライバシー表示、Filter、完了切り替えが動く
- 名刺画像が外部 Network へ送信されない
- `Content-Security-Policy`、HSTS、`X-Content-Type-Options`、`Permissions-Policy` が返る
- Browser console に CSP 違反、Hydration error、Unhandled error がない
- Mobile／Keyboard／Reduced motion で主要 Flow を完了できる
- Preview URL が未認証 User から見えない

Production promotion 前に、Preview の Deploy ID、Git commit、Test evidence、Approver を Release record に残します。

## 6. Observability と PII

- Log、Trace、Analytics に氏名、メール、電話、名刺画像 URL、Note 本文を送らない Allowlist 方式にします。
- Vercel Log／Drain／Analytics の Region、Retention、Subprocessor、閲覧権限は実データ投入前に Security／Privacy が確認します。
- `kix1` は Function 実行場所の指定です。CDN、Build、Log、Backup、Support access、外部 OCR を含む Data residency の証明にはなりません。
- Error は内部 ID と correlation ID で追跡し、利用者へ Provider response や Stack trace を返しません。

## 7. Rollback

1. Incident owner が新規 Production promotion を停止します。
2. 直前の確認済み Deployment を特定し、Vercel の Rollback／Promote 操作を人が実行します。
3. Schema migration を伴う場合は Application rollback と DB compatibility を別々に確認します。破壊的 Migration は Expand／Contract 方式にします。
4. CSP や Deployment Protection を一時的に弱めて復旧しません。
5. Incident timeline、影響、Deploy ID、復旧確認、再発防止を記録します。

## 8. 現在の未実施事項

- Vercel Pro Team／Project の選択
- Git Repository との接続
- Preview／Production deployment
- Deployment Protection の適用確認
- Custom Domain／DNS／証明書
- Vercel 上の Response header と Browser E2E 確認
- 実データを扱うための Security／Privacy／Legal review

これらが完了するまでは「Vercel Pro に Deploy 済み」「公開済み」「本番運用中」と表現しません。
