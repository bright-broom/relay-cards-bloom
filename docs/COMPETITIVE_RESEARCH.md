# 法人向け名刺管理ツール調査と Relay Cards の製品判断

## 1. 要点

基準日は 2026 年 8 月 29 日、対象は日本国内の法人向け名刺管理です。公開一次情報から比較できる範囲では、Sansan が「一番売れている」に最も近い製品です。Sansan の公式ページは、2026 年 1 月のシード・プランニング調査を根拠として、法人向け名刺管理サービス市場で 85.8%、13 年連続シェア No.1、利用企業 11,000 社と表示しています。

ただし、調査本文と算定方法は今回アクセスできず、Sansan 自身が掲載する Interested-party statement の単一確認です。「日本の全名刺管理ツールで売上・契約数・利用者数のすべてが最大」とまでは断定できません。

「使いやすさ」に普遍的な一位はありません。対象別の推奨は次のとおりです。

| 対象 | 操作負荷が小さい候補 | 根拠と制約 |
|---|---|---|
| 大量名刺を全社管理 | Sansan | 100 枚を 5 分でスキャン、99.9% のデータ化精度を公式表示。ただしデータ化は翌営業日以内という運用条件がある |
| 小規模 Team がすぐ開始 | Eight Team | 約 5 分で利用開始、既存 Eight Account を継続利用、名刺検索・共有メモ・共有タグに機能を絞る |
| Mobile 中心・多言語 | CAMCARD BUSINESS | 最短 5 秒の OCR、AI 補正平均 30 秒以内、17 言語、料金を公開 |
| 名刺から SFA／MA まで一本化 | ホットプロファイル | 名刺管理・SFA・MA を一体提供。画面切り替え削減は期待できるが、名刺管理だけなら機能過多になり得る |

Relay Cards は特定製品の画面や表現を複製せず、次の共通価値を独自に再設計します。

1. 取り込みは速く、登録は人が確認する。
2. 名刺ではなく人物を正本にし、過去の役職を履歴として残す。
3. 社内の誰がつながっているかを可視化する。
4. 名刺交換の直後に、担当・期限付きの次の行動を作る。
5. 重複、古い所属、欠損は自動修正せず、根拠付き候補として確認させる。

## 2. 調査範囲と Evidence status

### P0：一番売れている製品はどこか

Finding：法人向け名刺管理サービスの売上シェアという比較単位では Sansan が首位とする公式表示が最も直接的です。

Evidence status：Verified-single

Evidence：Sansan は 85.8%、13 年連続 No.1、利用企業 11,000 社を表示しています。出典名は「営業支援 DX における名刺管理サービスの最新動向 2026（2026 年 1 月シード・プランニング調査）」です。

Limitation：調査本文、母集団、売上範囲、競合別数値は一次情報で確認できていません。契約社数、個人利用者数、Application download 数とは比較単位が異なります。

### P0：どこが使いやすいか

Finding：利用者属性と作業量によって最適解が変わるため、単一の「使いやすさ No.1」は確定できません。

Evidence status：Inference

Evidence chain：公式に確認できた操作条件を、取り込み、確認、検索、共有、フォローの 5 Flow へ分解しました。Eight Team は約 5 分で開始、CAMCARD BUSINESS は最短 5 秒の読み取り、Sansan は大量スキャン、ホットプロファイルは SFA／MA 統合を訴求しています。これらの優位性は異なる作業を対象にします。

Limitation：独立した同一条件の Usability test、Task completion time、Error rate は公開一次情報で確認できていません。各社の受賞表示は参考であり、Universal ranking には使用しません。

## 3. 主要製品の比較

| 製品 | 公開規模 | 取り込み | 人物・共有 | 営業活用 | Principal view |
|---|---|---|---|---|---|
| Sansan | 85.8% シェア、11,000 社と公式表示 | 99.9%、100 枚 5 分、Mobile 複数枚 | 自動名寄せ、人事異動、全社共有 | Data Hub、Risk check、Digital 名刺 | 大規模運用と Data quality が強い。価格・調査方法は要確認 |
| Eight Team | 利用実績 6,000 社以上、Eight 累計 450 万 User と公式表示 | Smartphone 撮影 | 名寄せ、共有メモ、共有タグ、CSV | HubSpot／kintone 連携 Option | 小規模 Team の導入負荷が低い。個人 Account と会社 Data の境界設計が重要 |
| CAMCARD BUSINESS | 4,000 社以上と公式表示 | 最短 5 秒、AI 補正平均 30 秒、17 言語 | 共有範囲、タグ、Note、名刺統合 | 簡易 SFA、Mail 配信、外部連携 | Mobile・価格・多言語の Balance。AI 補正の枚数上限に注意 |
| ホットプロファイル | 比較可能な契約社数は一次情報で確認できず | 名刺 Data 化 | 人脈可視化、企業 DB、異動情報 | SFA、MA、Task、Risk check | Single suite を求める組織向け。名刺だけを求める場合は Scope が広い |

## 4. Relay Cards の差別化

### 推奨 Positioning

「取り込み精度」だけで競争しません。OCR は Commodity 化しやすく、最終価値は名刺交換後の Follow-through にあります。

Relay Cards の Product metric は登録枚数ではなく、次を推奨します。

- Time to verified contact：取り込みから人が確認して検索可能になるまでの時間
- Follow-up commitment rate：名刺交換 24 時間以内に担当と期限が設定された割合
- Contact freshness：重要人物で確認済み所属が基準期間内にある割合
- Reuse rate：別の社員が既存接点を営業活動に再利用した割合
- Unsafe auto-merge rate：誤った自動統合。目標は 0 とし、自動統合を既定で行わない

### 模倣しないもの

- Sansan、Eight、CAMCARD、ホットプロファイルの商標、Logo、固有 Copy、画面 Layout
- 非公開の OCR、名寄せ、企業 Data、Network graph の実装
- 公開情報だけを使った人物の自動確定
- 個人情報を外部 AI へ暗黙送信する機能

## 5. Options と Trade-off

| Option | Benefit | Cost | Risk | Reversibility | Preconditions |
|---|---|---|---|---|---|
| A. 名刺管理＋Follow-up に集中 | 現場価値が明確、学習負荷を抑えられる | SFA 全面代替はしない | CRM と二重入力になる可能性 | 高い | CRM 連携 Contract を後から追加できる構造 |
| B. 最初から SFA／MA まで内包 | Tool 数を減らせる | Scope と導入負荷が大きい | 競合が強く、価値検証が遅い | 低い | Product owner、Data migration、Sales process の確定 |
| C. 既製品を導入し内製しない | Time to value が短い | License と Vendor lock-in | 独自 Workflow を合わせにくい | 中程度 | Security、Data residency、Contract、TCO 比較 |

推奨は A です。MVP では名刺取り込み、人物履歴、社内接点、フォロー、データ品質に集中し、CRM／MA は API と Event で疎結合にします。

## 6. Risk と Counterevidence

- 「名刺管理が売れている」は、新規開発の成功を意味しません。既存製品の Network effect、入力 Operation、企業 Data、導入 Support は大きな参入障壁です。
- 高精度 OCR は Human operator を含む場合があり、Software model だけで同じ精度・Speed・Cost を再現できるとは限りません。
- 人物の異動・企業属性を自動更新すると、誤情報の確定、本人同意、取得元、削除、目的外利用が問題になります。
- 個人向け Network と会社資産を混ぜると、退職時の Data ownership と共有同意が曖昧になります。
- SFA まで広げると、名刺取り込みの使いやすさより Data migration と営業 Process 変更が主要 Risk になります。

## 7. 要確認事項

| 未確認 | 結論への影響 | 必要な一次情報 | Owner／Gate |
|---|---|---|---|
| 対象顧客が 10 名、100 名、1,000 名規模のどこか | 権限、料金、Support、Scanner 要件が変わる | Pilot 対象組織と名刺枚数 | Product owner／MVP 着手前 |
| 自社開発の目的が販売か社内利用か | Compliance、Tenant、Billing が変わる | Business case | Sponsor／Architecture 承認前 |
| 名刺 Data の正本、保持期間、削除主体 | Data model と運用が変わる | Privacy・Legal requirement | 法務・Security／実 Data 前 |
| CRM／MA の連携先 | API contract と優先順位が変わる | 現行 System inventory | Sales Ops／Integration 着手前 |
| OCR を内製するか外部 Service にするか | Cost、Region、Subprocessor が変わる | Vendor contract と Data flow | Procurement・Security／契約前 |

## 8. Primary source register

取得日はすべて 2026 年 8 月 29 日です。

1. Sansan「名刺管理｜機能」：市場シェア、利用企業数、Data 化精度、大量 Scan、自動名寄せ、人事異動
   https://jp.sansan.com/function/meishi/
2. Sansan「Security 対策」：通信暗号化、画像削除、脆弱性診断、Operator 管理
   https://jp.sansan.com/strengths/security/
3. Eight Team「社内の名刺をいつでも・どこでも・すぐに共有」：6,000 社、450 万 User、Simple function、料金、開始時間
   https://materials.8card.net/lp/eight-team/team-contact-sharing/
4. Eight Team「Eight Team をはじめる」：既存 Account、約 5 分の導入 Flow
   https://materials.8card.net/eight-team/begin/
5. CAMCARD BUSINESS 公式：4,000 社、OCR、AI 補正、多言語、権限、料金
   https://camcard.jp/business/
6. CAMCARD BUSINESS「機能」：名刺管理、簡易 SFA、Security、外部連携
   https://camcard.jp/business/function/
7. ホットプロファイル公式：名刺管理、SFA、MA の統合
   https://www.hammock.jp/hpr/

## 9. Coverage matrix

| Dimension | Status | 理由／Gap | Decision impact |
|---|---|---|---|
| 定義・対象範囲 | Covered | 日本の法人向け、基準日を固定 | 高 |
| 利害関係者・需要 | Covered | 営業、管理者、Security、本人を設計へ反映 | 高 |
| 現状・Baseline | Covered | 主要 4 製品の公式情報を確認 | 高 |
| 代替案・比較 | Covered | 内製集中、Full suite、既製品導入を比較 | 高 |
| 証拠品質・矛盾 | Evidence gap | 独立 Usability test と市場調査本文へ未到達 | 高 |
| 技術・運用 | Covered | 別紙 Architecture で扱う | 高 |
| Security・Privacy | Covered | 実 Data 前 Gate を定義 | 高 |
| 法務・規制 | Evidence gap | 利用目的・提供地域・対象顧客が未確定 | 高 |
| 経済性・TCO | Evidence gap | Sansan・ホットプロファイルの比較可能価格が非公開 | 中 |
| 実装・Change | Covered | MVP と段階導入を定義 | 高 |
| Governance | Covered | Human confirmation と Owner を定義 | 高 |
| Risk・Failure mode | Covered | 誤統合、外部送信、退職時所有権を特定 | 高 |
| 時間軸・依存関係 | Covered | Architecture 文書に Roadmap を定義 | 中 |
| 市場・地域 | Covered | 日本法人向けに限定 | 高 |
| 不明点 | Covered | Decision gate と Owner を明記 | 高 |
