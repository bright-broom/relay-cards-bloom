import type { Company, Person } from "./types";

export const demoPeople: Person[] = [
  {
    id: "akari-mizuno", name: "水野 あかり", kana: "みずの あかり", initials: "MA",
    company: "株式会社アルトワークス", companyId: "altworks", department: "事業開発本部", title: "執行役員 本部長",
    email: "a.mizuno@example.jp", phone: "03-0000-1842", mobile: "090-0000-2496", location: "東京都港区",
    exchangedAt: "2026-08-28", updatedLabel: "昨日", owner: "高橋 直人",
    strength: 86, status: "followup", statusLabel: "フォロー予定", tags: ["重点顧客", "AI 推進", "展示会"],
    note: "AI を活用した問い合わせ分類に関心。まずは小規模な検証条件を整理する。",
    nextAction: "導入条件の整理メモを送る", nextActionDate: "本日 16:00", meetings: 4, sharedBy: 3, cardVersion: "2026.08",
    history: [
      { date: "2026-08-28", title: "展示会で名刺交換", detail: "高橋が登録。AI 推進 Tag を追加" },
      { date: "2026-07-16", title: "オンライン商談", detail: "製品評価の進め方を確認" },
      { date: "2025-11-04", title: "役職変更", detail: "事業開発部 部長から現職へ更新" }
    ]
  },
  {
    id: "shun-kuroda", name: "黒田 俊", kana: "くろだ しゅん", initials: "KS",
    company: "北辰エナジー株式会社", companyId: "hokushin", department: "DX 戦略室", title: "室長",
    email: "s.kuroda@example.jp", phone: "06-0000-8317", mobile: "080-0000-5921", location: "大阪府大阪市",
    exchangedAt: "2026-08-27", updatedLabel: "2 日前", owner: "佐藤 梨沙",
    strength: 72, status: "active", statusLabel: "商談中", tags: ["エネルギー", "DX"],
    note: "現場部門と情報システム部門の合意形成が次の論点。",
    nextAction: "セキュリティー回答票を確認", nextActionDate: "8 月 31 日", meetings: 7, sharedBy: 5, cardVersion: "2026.07",
    history: [
      { date: "2026-08-27", title: "名刺情報を更新", detail: "役職と携帯番号を更新" },
      { date: "2026-08-19", title: "要件整理 Meeting", detail: "セキュリティー確認事項を受領" }
    ]
  },
  {
    id: "mei-takahashi", name: "高橋 芽衣", kana: "たかはし めい", initials: "TM",
    company: "セントラルフーズ株式会社", companyId: "central-foods", department: "マーケティング統括部", title: "マネージャー",
    email: "m.takahashi@example.jp", phone: "052-000-4198", mobile: "070-0000-8134", location: "愛知県名古屋市",
    exchangedAt: "2026-08-26", updatedLabel: "3 日前", owner: "高橋 直人",
    strength: 64, status: "new", statusLabel: "新規", tags: ["マーケティング", "展示会"],
    note: "9 月の新商品発表に向け、顧客問い合わせの集約方法を検討中。",
    nextAction: "展示会資料を共有", nextActionDate: "9 月 1 日", meetings: 1, sharedBy: 2, cardVersion: "2026.08",
    history: [{ date: "2026-08-26", title: "展示会で名刺交換", detail: "高橋が登録" }]
  },
  {
    id: "ren-ishii", name: "石井 蓮", kana: "いしい れん", initials: "IR",
    company: "レイラインロジスティクス株式会社", companyId: "rayline", department: "情報システム部", title: "部長",
    email: "r.ishii@example.jp", phone: "045-000-2905", mobile: "090-0000-1638", location: "神奈川県横浜市",
    exchangedAt: "2026-08-24", updatedLabel: "5 日前", owner: "山本 花",
    strength: 78, status: "active", statusLabel: "商談中", tags: ["物流", "情報システム"],
    note: "既存 CRM との連携方法と Data 保持期間が判断材料。",
    nextAction: "連携方式の比較表を Review", nextActionDate: "本日 14:30", meetings: 5, sharedBy: 4, cardVersion: "2026.08",
    history: [
      { date: "2026-08-24", title: "対面 Meeting", detail: "CRM 連携の要望を記録" },
      { date: "2026-06-11", title: "紹介を受ける", detail: "山本から高橋へ引き継ぎ" }
    ]
  },
  {
    id: "yui-morita", name: "森田 結衣", kana: "もりた ゆい", initials: "MY",
    company: "みなと都市開発株式会社", companyId: "minato", department: "経営企画部", title: "課長",
    email: "y.morita@example.jp", phone: "03-0000-7712", mobile: "080-0000-4066", location: "東京都千代田区",
    exchangedAt: "2026-08-22", updatedLabel: "1 週間前", owner: "高橋 直人",
    strength: 49, status: "stale", statusLabel: "要確認", tags: ["不動産", "経営企画"],
    note: "異動の可能性あり。公開情報だけで確定せず、本人または担当者へ確認する。",
    nextAction: "所属情報を確認", nextActionDate: "9 月 2 日", meetings: 2, sharedBy: 6, cardVersion: "2024.12",
    history: [
      { date: "2026-08-22", title: "人事異動候補を検知", detail: "未確認として Review 待ち" },
      { date: "2024-12-03", title: "名刺交換", detail: "経営企画部 主任として登録" }
    ]
  },
  {
    id: "sota-nagase", name: "長瀬 颯太", kana: "ながせ そうた", initials: "NS",
    company: "フロンティアメディカル株式会社", companyId: "frontier-medical", department: "事業推進部", title: "シニアマネージャー",
    email: "s.nagase@example.jp", phone: "092-000-3810", mobile: "070-0000-7180", location: "福岡県福岡市",
    exchangedAt: "2026-08-21", updatedLabel: "8 日前", owner: "佐藤 梨沙",
    strength: 57, status: "new", statusLabel: "新規", tags: ["ヘルスケア", "事業開発"],
    note: "地方拠点での PoC 実施可否を検討中。",
    nextAction: "PoC 条件をヒアリング", nextActionDate: "9 月 3 日", meetings: 1, sharedBy: 1, cardVersion: "2026.08",
    history: [{ date: "2026-08-21", title: "オンライン名刺交換", detail: "佐藤が登録" }]
  }
];

export const demoCompanies: Company[] = [
  { id: "altworks", name: "株式会社アルトワークス", initials: "AW", industry: "IT・サービス", people: 18, connections: 34, lastActivity: "昨日", owner: "高橋 直人", tone: "accent" },
  { id: "hokushin", name: "北辰エナジー株式会社", initials: "HE", industry: "エネルギー", people: 12, connections: 27, lastActivity: "2 日前", owner: "佐藤 梨沙", tone: "sub" },
  { id: "central-foods", name: "セントラルフーズ株式会社", initials: "CF", industry: "食品", people: 9, connections: 16, lastActivity: "3 日前", owner: "高橋 直人", tone: "primary" },
  { id: "rayline", name: "レイラインロジスティクス株式会社", initials: "RL", industry: "物流", people: 14, connections: 31, lastActivity: "5 日前", owner: "山本 花", tone: "accent" },
  { id: "minato", name: "みなと都市開発株式会社", initials: "MD", industry: "不動産", people: 21, connections: 42, lastActivity: "1 週間前", owner: "高橋 直人", tone: "sub" },
  { id: "frontier-medical", name: "フロンティアメディカル株式会社", initials: "FM", industry: "ヘルスケア", people: 7, connections: 11, lastActivity: "8 日前", owner: "佐藤 梨沙", tone: "primary" }
];
