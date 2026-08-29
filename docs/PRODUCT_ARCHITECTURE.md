# Relay Cards Principal Engineering 設計

## 文書情報

| 項目 | 内容 |
|---|---|
| Status | Draft for Review |
| Version | 0.2 |
| 基準日 | 2026 年 8 月 29 日 |
| 対象 | 法人向け名刺管理・人脈活用 Application |
| 現在の実装 | Next.js 16／React 19／TypeScript 6 の合成 Data prototype |
| 本番化に必要な承認 | Product、Security、Privacy／法務、Sales Ops、運用責任者 |

## 1. 結論

Relay Cards は「名刺画像の保管 Application」ではなく、確認済みの人物情報、社内接点、次の行動を管理する独立した Bounded context とします。

- 正本は Card ではなく Person と Organization に置く。Card は Source evidence として Version 付きで残す。
- OCR と名寄せは Candidate を返し、人が確認するまで検索・共有の正本へ昇格させない。
- Browser から OCR、CRM、AI、Storage へ直接接続しない。BFF と Queue を通す。
- すべての Business record に tenant_id を持たせ、Server-side Resource authorization を強制する。
- 次の行動は Owner、Due date、Status、Source contact を必須にし、名刺交換後の Follow-through を Product value にする。
- CRM／MA は外部 System of Record とし、初期 Release で全面代替しない。
- AI は自由文の要約候補に限定し、人物情報の確定、統合、送信、Risk 判定を自動実行しない。

### 現在の Code architecture

```text
src/app                 Route composition／Metadata
    ↓
src/features/*/ui       Use case ごとの React UI
    ↓
src/features/*/model    Framework 非依存の Domain policy／type
    ↓
src/shared              Security policy／UI primitive
```

- App Router を Routing と Server／Client boundary に使い、`src/app` に業務 Logic を置きません。
- Feature は contacts、follow-ups、imports、data-quality、workspace で分け、公開 Entry point 以外の Feature 内部 import を禁止します。
- Domain model は React、Next.js、UI に依存しません。
- `scripts/check-architecture.mjs` を Vercel Build 前の必須 Fitness test とし、依存方向の Regression を止めます。
- Request ごとの nonce CSP を `src/proxy.ts` で生成します。このため、現在の Route は動的 Server rendering です。
- Vercel Pro の Fluid compute と大阪 `kix1` は `vercel.json` に固定します。ただし、実 Project／Deploy／公開は未実施です。

## 2. Scope

### In scope

- Mobile／Web からの名刺画像取り込み、Manual entry、CSV import
- OCR candidate の Review queue と差分確認
- Person、Organization、Card version、Contact method、Tag、Note
- 社内の Contact owner と紹介経路
- Follow-up の作成、担当、期限、完了
- Duplicate candidate、Stale candidate、Missing field の Data quality queue
- Tenant／Role／Resource authorization、Audit、Export control
- CRM／MA への承認済み Outbound connector

### Out of scope for MVP

- CRM、SFA、MA、契約、請求の全面的な代替
- 公開 Web からの人物 Profile の無断収集
- 本人未確認情報の自動上書き
- AI による自動 Email、紹介依頼、Merge、削除
- 顔認識、行動 Tracking、Relationship score による人事評価
- 個人向け Social network

## 3. Architecture invariants

次の条件は UI ではなく Server／Database で強制します。

1. Tenant を跨ぐ Query、Export、Search index、Cache key を禁止する。
2. Client が送る tenant_id、user_id、role を認可根拠として信用しない。
3. Person merge、Export、Bulk delete、Permission change は Step-up authentication と Audit を要求する。
4. Original card image は Private object storage に置き、短時間の Signed URL でのみ表示する。
5. OCR provider へ送る前に Region、Retention、Training use、Subprocessor、Deletion contract を確認する。
6. OCR result、Public source candidate、Human verified fact を同じ Field へ保存しない。
7. Auto-merge しない。Candidate は比較理由と Confidence を持ち、人が確定する。
8. Card の新しい Version を受け取っても旧 Data を消さず、History と Provenance を保持する。
9. Audit failure 時に重要 Mutation を成功させない。Mutation と Audit outbox を同一 Transaction に置く。
10. Search index や CRM sync の失敗を「保存失敗」と混同しない。Source of truth と Projection の状態を分離する。
11. PII を Application log、Trace attribute、Error body、AI prompt log に含めない。
12. Export file は期限、Owner、Purpose、Row count、Digest を持ち、自動失効させる。

## 4. Trust boundary と Component

    User device
      Web／Mobile application
             |
             | HTTPS + OIDC session
             v
    Application boundary
      Web BFF
        Authentication
        Tenant and resource authorization
        Import／Search／Follow-up use case
             |
      Modular domain core
        Identity and access
        Contact graph
        Follow-up
        Data quality
        Audit
             |
      PostgreSQL + Transactional outbox
             |
      Queue and Workers
        OCR orchestrator
        Search projector
        CRM connector
        Retention worker
             |
    External boundary
      Approved OCR provider／CRM／Identity provider

最初は Modular monolith と Worker で十分です。Microservice は独立した Security boundary、Scale、Release cadence、Failure isolation が必要になった Component だけを分離します。

## 5. Domain model と所有権

| Aggregate／Entity | Owns | Invariant |
|---|---|---|
| Tenant | Policy、Plan、Region、Retention | すべての Record の Scope root |
| Person | Display name、Verified contact、Current affiliation | Current fact は Human verified source を参照 |
| Organization | Legal／display name、Domain、External binding | Domain だけで自動確定しない |
| CardEvidence | Image reference、OCR candidate、Exchange context | Immutable version、Source hash を持つ |
| Affiliation | Person、Organization、Department、Title、Valid period | 履歴を上書き削除しない |
| ContactOwnership | Person、Employee、Exchange date、Visibility | 退職時移管 Policy を適用 |
| FollowUp | Person、Owner、Due date、Status、Outcome | Owner と Due date は Active 時に必須 |
| MergeCandidate | Left／Right Person、Reason、Confidence、Decision | Decision 前は Person を変更しない |
| AuditEvent | Actor、Action、Target、Result、Correlation ID | Append-only、PII 本文を含めない |

### Fact state

Field ごとに次を保持します。

- value
- status：candidate／verified／rejected／superseded
- source_type：card／user_input／approved_provider／crm
- source_id
- observed_at
- verified_at
- verified_by
- valid_from／valid_to

これにより「名刺に書いてあった」「OCR が読んだ」「人が確認した」「現在有効」を分離します。

## 6. Import flow

1. Client は Upload intent を BFF に要求する。
2. BFF は MIME、Extension、Size、Tenant quota、Rate limit を確認し、短時間の Upload URL を返す。
3. Object storage は Private、Malware scan 前は quarantine prefix に置く。
4. Worker は File signature、Image dimension、Decompression bomb、Malware result を確認する。
5. Approved OCR provider へ最小 Data を送り、Deadline と Idempotency key を付ける。
6. OCR result を Strict schema と Size limit で検証し、candidate として保存する。
7. Duplicate candidate を検索するが、Person record はまだ作成・更新しない。
8. User が原画像と Candidate の差分を確認する。
9. Confirm command で Person／CardEvidence／Affiliation／Audit outbox を同一 Transaction に保存する。
10. Search projection と CRM sync は非同期に更新し、UI に各状態を表示する。

### Resource limit

- Image：最大 10 MB、Pixel 数上限を別途 Code policy で強制
- Batch：Tenant と Plan ごとの件数上限
- OCR deadline：Provider SLO を確認して設定。無制限 Retry は禁止
- Note：最大 2,000 文字を初期案とし、要件確認後に確定
- CSV：Row、Column、File size を制限し、Formula injection を Export／Import の両方で防ぐ

## 7. Identity と Authorization

### Role は粗い入口、最終判断は Resource policy

| Role | Default scope | 高 Risk action |
|---|---|---|
| Member | 自分と共有範囲内の Contact | Export 不可 |
| Manager | 部門内 Contact、Follow-up assignment | 部門 Export は承認付き |
| Data steward | Duplicate、Stale、Correction queue | Merge／Correction を実施可能 |
| Tenant admin | User、Policy、Connector | Bulk export／Retention change は Step-up |
| Auditor | Audit metadata の Read only | PII 本文は別権限 |

Policy 判定順は authenticate → audience → tenant membership → load resource → relationship／visibility policy → action です。URL や Request body の organization_id だけで判断しません。

## 8. Privacy と Data lifecycle

### Data minimization

- MVP は名刺記載情報、交換 Context、社内 Note、Follow-up に限定する。
- 生年月日、自宅住所、私用 SNS、推測属性は取得しない。
- Relationship score は営業支援用で、人事評価や本人の信用評価へ転用しない。
- AI を使う場合、既定で PII を送らず、利用目的と Provider contract を別 Gate にする。

### Lifecycle

| State | Retention／Action |
|---|---|
| Quarantine upload | Scan／OCR 失敗後の短期削除。期間は Privacy owner が確定 |
| Original card | Tenant policy に従い暗号化保存。不要なら Image を削除して Fact と Provenance のみ保持 |
| Active person | Purpose と Employment／Contract に基づき定期 Review |
| Former employee ownership | Organization asset policy に基づき移管。個人 Account へ自動持ち出ししない |
| Deletion request | Legal hold を確認し、Primary、Projection、Object、Backup の削除状態を追跡 |
| Export | 期限付き、暗号化、Download 回数制限、Audit、失効 |

法的根拠、通知、開示・訂正・削除、委託先、国外移転は対象顧客と提供地域が確定してから法務確認します。この文書だけで適法性を断定しません。

## 9. API contract の骨格

    POST /v1/imports
    POST /v1/imports/{import_id}/confirm
    GET  /v1/people?query=&cursor=
    GET  /v1/people/{person_id}
    POST /v1/people/{person_id}/follow-ups
    POST /v1/merge-candidates/{candidate_id}/decisions
    POST /v1/exports

共通要件：

- Server-generated request_id と correlation_id
- Idempotency-Key for POST
- Cursor pagination と maximum page size
- Stable error code。PII、SQL、Provider response body を返さない
- Versioned schema と additive change を優先
- ETag／version による optimistic concurrency control

## 10. Search と名寄せ

### Search

- Tenant 別 Index／Document filter を二重で強制する。
- 氏名、会社、部署、役職、Tag の Normalization rule を Version 管理する。
- Search result に Source status と Freshness を表示する。
- Index lag がある場合、最終 Projection time を表示する。

### Duplicate candidate

Candidate score は説明可能な Signal だけで構成します。

- Exact：Normalized email、電話番号
- Strong：氏名＋同一会社＋部署
- Supporting：旧会社、交換者、住所、Card image hash
- Conflict：異なる Verified email、同時期の異なる所属、本人が別人と確認

Threshold を超えても自動 Merge はしません。Data steward が左右の Field、Source、履歴、Conflict を確認します。Merge は Reversible link として記録し、一定期間 Undo を可能にします。

## 11. Failure mode と回復

| Failure | User experience | Control／Recovery |
|---|---|---|
| Upload 後に OCR timeout | 「処理中」から「再試行可能」へ | Idempotency key、Retry budget、DLQ |
| OCR が別人を認識 | Candidate のみ、正本へ反映しない | Original comparison、Human confirm |
| Search index delay | 保存済みだが検索反映待ちを表示 | Outbox replay、Projection lag alert |
| Duplicate confirm の競合 | 後発を Conflict として拒否 | Version check、Transaction lock |
| CRM が停止 | Local save を維持し Sync pending | Queue、Circuit breaker、Manual replay |
| Audit store 障害 | 重要 Mutation を fail-closed | Transactional outbox、Alert |
| Export URL 漏えい | 短期・Single use で被害を限定 | Step-up、Expiry、Download audit |
| Tenant filter regression | Data を返さない | DB row-level policy＋Application test |

## 12. Observability と SLO proposal

数値は Pilot 前の提案であり、承認済み SLO ではありません。

- Verified contact creation latency：p95 5 分以内。ただし人手確認時間を別表示
- Search availability：99.9% 月次を初期目標
- Search projection lag：p95 60 秒以内
- OCR queue age、Failure rate、Retry exhausted、Quarantine age
- Duplicate decision reversal rate
- Cross-tenant authorization denial と anomalous export
- Audit outbox lag は zero tolerance alert

Metrics、Logs、Traces に氏名、Email、電話、画像 URL、Note 本文を載せません。Identifier は必要最小限の内部 ID と correlation_id を使います。

## 13. Test strategy

### Domain／Contract

- Person、Affiliation、FollowUp、MergeCandidate の State transition
- Tenant scope、Resource authorization、IDOR、Role downgrade
- File signature、MIME mismatch、Oversize、Malformed image、Decompression bomb
- Duplicate／Retry／Out-of-order／Timeout after success
- Optimistic concurrency、Partial failure、Rollback
- CSV formula injection、Unicode normalization、Long field、Invalid date

### Integration／End-to-end

- Upload → Quarantine → OCR candidate → Human confirm → Search projection
- 別 Tenant の Person ID を URL／body／cursor へ混ぜても情報を返さない
- Export は権限、Step-up、Expiry、Audit を満たさなければ拒否
- OCR／CRM outage 中も Verified contact と Follow-up を閲覧できる
- Deletion が Primary、Search、Object、Export cache へ伝播する

### Architecture fitness

- Browser bundle に OCR／CRM Secret または direct endpoint がない
- Domain package が Web framework、Database client、OCR SDK へ依存しない
- Business record schema は tenant_id を必須にする
- Audit 対象 command が outbox event を同一 Transaction で作る
- PII field が log schema／trace attribute allowlist に入らない

## 14. Delivery roadmap

### 0〜30 日：Problem／Risk validation

- 対象組織、名刺枚数、Follow-up process、既存 CRM を確認
- 20〜30 User の Usability test で 5 Flow の completion time と Error を測る
- Privacy、Retention、Data owner、Region、OCR vendor の Decision gate
- Domain model と Authorization matrix を承認

### 31〜60 日：Thin vertical slice

- SSO、Tenant scope、Private upload、Quarantine、OCR sandbox
- Candidate review、Person／Card history、Search、Audit
- Synthetic／approved test Data だけで Security test
- Pilot rollback と Support playbook

### 61〜90 日：Controlled pilot

- 1 部門、限定 User、限定枚数で Pilot
- Follow-up commitment rate、Correction rate、Time to verified contact を測定
- Data deletion／Export／Incident drill
- CRM read-only／one-way connector を必要時だけ追加

Production Release は Pilot の成績、Security／Privacy review、運用 Owner、Rollback、Support readiness を確認して別承認します。

## 15. Decision gates と Owner

| Gate | 必要な判断 | Owner | 未決時の扱い |
|---|---|---|---|
| Product gate | 販売／社内、対象規模、主要 Persona | Sponsor／Product | 本番 Scope を確定しない |
| Data gate | 正本、保持、削除、退職時所有権 | Privacy／Legal | 実 Data を入れない |
| Vendor gate | OCR／AI の Region、Retention、Training、Subprocessor | Security／Procurement | 外部送信しない |
| Identity gate | IdP、Tenant、Role、Step-up | Identity owner | Local prototype に留める |
| Integration gate | CRM 正本、Direction、Conflict policy | Sales Ops | Connector を実装しない |
| Release gate | SLO、Support、Incident、Rollback | Engineering／Operations | Deploy しない |

## 16. 現在の Prototype と本番との差

現在の Prototype は UI／Interaction／Information architecture の検証用です。

- 合成 Data のみ
- Browser memory のみ。Reload で変更は消える
- File content は読み取らず、File name と形式・Size だけを確認
- 外部 Network request、OCR、AI、CRM 連携なし
- Authentication、Authorization、Server、Database なし
- Local build と Test は実行済みでも、Security review、Deploy、運用は未実施

この差を埋めずに「Sansan と同等の本番製品」と表現してはいけません。
