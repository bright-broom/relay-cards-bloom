"use client";

import Link from "next/link";

import { PersonAvatar, StatusBadge } from "@/features/contacts/primitives";
import { Icon, type IconName } from "@/shared/ui/icon";

import { useWorkspace } from "./workspace-provider";

const metrics: { delta: string; icon: IconName; label: string; tone: "accent" | "primary" | "sub"; value: string }[] = [
  { delta: "+ 12 今月", icon: "people", label: "登録人物", tone: "sub", value: "1,284" },
  { delta: "+ 4 今月", icon: "building", label: "企業", tone: "primary", value: "326" },
  { delta: "5 件", icon: "calendar", label: "フォロー予定", tone: "accent", value: "5" },
  { delta: "要確認 3", icon: "quality", label: "データ品質", tone: "primary", value: "92%" }
];

export function HomeDashboard() {
  const { completedFollowUps, followUps, people, selectPerson, toggleFollowUp } = useWorkspace();
  return <>
    <section className="welcome">
      <div className="welcome-copy">
        <span className="eyebrow">Relationship intelligence</span>
        <span className="welcome-greeting">おはようございます、高橋さん</span>
        <h1>今日、つなぐべき<br /><em>関係が見える。</em></h1>
        <p>散らばった名刺と接点を、次の一手が見えるワークスペースへ。</p>
      </div>
      <div className="welcome-stamp"><span><Icon name="spark" size={22} /></span><span><small>Today&apos;s focus</small><strong>期限内のフォロー <b>2</b> 件</strong><em>優先度の高い関係を確認</em></span></div>
    </section>
    <section aria-label="概要" className="metrics">{metrics.map((metric, index) => <article className="metric-card" key={metric.label}><div className="metric-top"><span className={`metric-icon ${metric.tone}`}><Icon name={metric.icon} /></span><span className="metric-index">0{index + 1}</span></div><div className="metric-value"><strong>{metric.value}</strong><span className={`metric-delta ${metric.tone}`}>{metric.delta}</span></div><span>{metric.label}</span></article>)}</section>
    <section className="home-grid">
      <article className="panel focus-panel"><div className="panel-heading"><div><span className="eyebrow">Next actions</span><h2>今日のフォローアップ</h2><p>関係を前に進める、次の 4 アクション</p></div><Link className="text-button" href="/follow-ups">すべて見る<Icon name="arrow" size={15} /></Link></div><div className="followup-list">{followUps.slice(0, 4).map((task) => { const person = people.find(({ id }) => id === task.personId); if (!person) return null; const done = completedFollowUps.has(task.id); return <div className={`followup-row ${done ? "done" : ""}`} key={task.id}><button aria-label={`${task.title}を${done ? "未完了" : "完了"}にする`} className="check-button" onClick={() => toggleFollowUp(task.id)}>{done && <Icon name="check" size={13} />}</button><PersonAvatar person={person} size="small" /><button className="followup-person" onClick={() => selectPerson(person.id)}><strong>{task.title}</strong><span>{person.name}・{person.company}</span></button><span className={`due-label ${task.urgency}`}><Icon name="clock" size={13} />{task.due}</span></div>; })}</div></article>
      <article className="capture-card"><div className="capture-art" aria-hidden="true"><span className="capture-card-back" /><span className="capture-card-front"><i /><i /><i /></span><span className="scan-line" /></div><div><span className="capture-kicker">SAFE CAPTURE</span><h2>名刺を、<br />次の行動へ。</h2><p>画像はこのデモでは外部へ送信しません。内容確認後に、合成データ領域へ追加できます。</p><Link className="light-button" href="/import"><Icon name="scan" />名刺を取り込む</Link></div></article>
      <article className="panel recent-panel"><div className="panel-heading"><div><span className="eyebrow">Recently updated</span><h2>最近更新された人物</h2><p>動きのあった関係を、見逃さない</p></div><Link className="text-button" href="/people">人物一覧へ<Icon name="arrow" size={15} /></Link></div><div className="mini-person-grid">{people.slice(0, 4).map((person, index) => <button className="mini-person-card" key={person.id} onClick={() => selectPerson(person.id)}><div className="mini-card-top"><PersonAvatar person={person} size="small" /><span className="mini-card-index">0{index + 1}</span></div><span className="company-chip">{person.company}</span><div><strong>{person.name}</strong><p>{person.department}<br />{person.title}</p></div><div className="mini-card-bottom"><StatusBadge person={person} /><span>{person.updatedLabel}</span></div></button>)}</div></article>
      <article className="panel opportunity-panel"><div className="panel-heading"><div><span className="eyebrow">Connection insight</span><h2>紹介の可能性</h2></div><span className="explain-badge">根拠を表示</span></div><div className="opportunity-content"><div className="connection-visual"><PersonAvatar person={people[0]!} /><span className="line" /><PersonAvatar person={people[3]!} /><span className="line" /><span className="avatar avatar-soft">TN</span></div><div><strong>水野さんと石井さんをつなぐと、CRM 連携の検討が進む可能性があります。</strong><p>両名の公開済みメモ内に「CRM 連携」があり、担当者である高橋さんが共通接点です。自動送信は行いません。</p><button className="secondary-button" onClick={() => selectPerson(people[0]!.id)}>関係を確認する</button></div></div></article>
    </section>
  </>;
}
