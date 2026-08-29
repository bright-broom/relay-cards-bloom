"use client";

import { useWorkspace } from "@/features/workspace/state";
import { Icon, type IconName } from "@/shared/ui/icon";
import { ViewHeading } from "@/shared/ui/view-heading";

import type { QualityIssueType } from "../model/types";

const issueIcon: Record<QualityIssueType, IconName> = { duplicate: "duplicate", missing: "alert", stale: "update" };

export function DataQualityPage() {
  const { dismissQualityIssue, qualityIssues, showToast } = useWorkspace();
  return <>
    <ViewHeading action={<span className="safe-chip"><Icon name="lock" size={13} />自動上書きなし</span>} description="候補を提示し、人が根拠を確認してから更新します。" kicker="Data quality" title="データ品質" />
    <section className="quality-hero"><div><span className="quality-score">92<small> / 100</small></span><span><strong>良好</strong><p>3 件の確認候補があります</p></span></div><div className="quality-breakdown"><span><small>完全性</small><strong>96%</strong><progress max="100" value="96" /></span><span><small>鮮度</small><strong>88%</strong><progress max="100" value="88" /></span><span><small>重複なし</small><strong>93%</strong><progress max="100" value="93" /></span></div></section>
    <section className="panel quality-panel"><div className="panel-heading"><div><span className="eyebrow">Review queue</span><h2>確認が必要な候補</h2></div><span className="count-chip">{qualityIssues.length} 件</span></div>{qualityIssues.length ? <div className="quality-list">{qualityIssues.map((issue) => <article className="quality-row" key={issue.id}><span className={`quality-type type-${issue.type}`}><Icon name={issueIcon[issue.type]} /></span><div className="quality-copy"><strong>{issue.title}</strong><p>{issue.detail}</p></div><div className="confidence"><small>確度</small><strong>{issue.confidence}</strong></div><button className="secondary-button" onClick={() => { showToast(`${issue.title}の比較画面をデモ表示しました`); dismissQualityIssue(issue.id); }}>{issue.action}</button></article>)}</div> : <div className="quality-empty"><Icon name="quality" size={32} /><strong>確認候補はありません</strong><p>自動更新は行わず、確認済み候補のみ除外しました。</p></div>}</section>
    <section className="quality-principles"><article><span><Icon name="eye" /></span><div><strong>根拠を見せる</strong><p>推測を確定情報として扱わず、候補と判断材料を分けます。</p></div></article><article><span><Icon name="lock" /></span><div><strong>人が確定する</strong><p>所属や連絡先を自動で上書きせず、承認操作を必須にします。</p></div></article><article><span><Icon name="update" /></span><div><strong>変更履歴を残す</strong><p>誰がいつ何を変更したかを追跡できる設計にします。</p></div></article></section>
  </>;
}
