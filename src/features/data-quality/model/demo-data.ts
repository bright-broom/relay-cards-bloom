import type { QualityIssue } from "./types";

export const demoQualityIssues: QualityIssue[] = [
  { id: "q1", type: "duplicate", title: "同一人物の可能性", detail: "水野 あかり／水野 朱莉", confidence: "高", action: "比較する" },
  { id: "q2", type: "stale", title: "所属情報が古い可能性", detail: "森田 結衣・最終確認 2024 年 12 月", confidence: "要確認", action: "確認する" },
  { id: "q3", type: "missing", title: "Mail address が未入力", detail: "新規取り込み 3 件", confidence: "不明", action: "補完する" }
];
