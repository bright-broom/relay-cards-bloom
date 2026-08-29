import type { FollowUpTask } from "./types";

export const demoFollowUps: FollowUpTask[] = [
  { id: "f1", personId: "akari-mizuno", title: "導入条件の整理メモを送る", due: "本日 16:00", urgency: "today" },
  { id: "f2", personId: "ren-ishii", title: "連携方式の比較表を Review", due: "本日 14:30", urgency: "today" },
  { id: "f3", personId: "shun-kuroda", title: "セキュリティー回答票を確認", due: "8 月 31 日", urgency: "soon" },
  { id: "f4", personId: "mei-takahashi", title: "展示会資料を共有", due: "9 月 1 日", urgency: "soon" },
  { id: "f5", personId: "yui-morita", title: "所属情報を本人または担当者へ確認", due: "9 月 2 日", urgency: "normal" }
];
