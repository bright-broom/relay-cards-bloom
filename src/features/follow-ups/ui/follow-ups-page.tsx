"use client";

import { PersonAvatar } from "@/features/contacts/primitives";
import { useWorkspace } from "@/features/workspace/state";
import { Icon } from "@/shared/ui/icon";
import { ViewHeading } from "@/shared/ui/view-heading";

import type { FollowUpUrgency } from "../model/types";

const columns: { id: FollowUpUrgency; label: string; tone: string }[] = [
  { id: "today", label: "本日", tone: "accent" },
  { id: "soon", label: "今週", tone: "sub" },
  { id: "normal", label: "今後", tone: "primary" }
];

export function FollowUpsPage() {
  const { completedFollowUps, followUps, people, selectPerson, showToast, toggleFollowUp } = useWorkspace();
  const open = followUps.filter(({ id }) => !completedFollowUps.has(id)).length;
  return <>
    <ViewHeading action={<button className="primary-button" onClick={() => showToast("新規タスク作成は永続化接続後に利用できます")}><Icon name="plus" />フォローを追加</button>} description="名刺交換後の次の行動を期限別に整理します。" kicker="Follow-up board" title="フォローアップ" />
    <section className="followup-summary"><article><span className="summary-orb accent"><Icon name="alert" /></span><div><strong>{followUps.filter(({ urgency, id }) => urgency === "today" && !completedFollowUps.has(id)).length}</strong><span>本日期限</span></div></article><article><span className="summary-orb sub"><Icon name="calendar" /></span><div><strong>{open}</strong><span>未完了</span></div></article><article><span className="summary-orb primary"><Icon name="check" /></span><div><strong>{completedFollowUps.size}</strong><span>完了</span></div></article></section>
    <section className="followup-board">{columns.map((column) => { const tasks = followUps.filter(({ urgency }) => urgency === column.id); return <div className="followup-column" key={column.id}><header className="column-heading"><span><i className={`dot ${column.tone}`} /><strong>{column.label}</strong></span><b>{tasks.length}</b></header>{tasks.map((task) => { const person = people.find(({ id }) => id === task.personId); if (!person) return null; const done = completedFollowUps.has(task.id); return <article className={`followup-card ${done ? "done" : ""}`} key={task.id}><div className="followup-card-head"><span className={`due-label ${task.urgency}`}><Icon name="clock" size={12} />{task.due}</span><button aria-label="その他" className="icon-button" onClick={() => showToast("追加操作はデモ対象外です")}><Icon name="more" size={14} /></button></div><button className="followup-card-body" onClick={() => selectPerson(person.id)}><strong>{task.title}</strong><span><PersonAvatar person={person} size="tiny" /><span>{person.name}<small>{person.company}</small></span></span></button><footer className="followup-card-foot"><span className="verified-label">担当：{person.owner}</span><button className="check-pill" onClick={() => toggleFollowUp(task.id)}><Icon name="check" size={11} />{done ? "未完了へ戻す" : "完了"}</button></footer></article>; })}</div>; })}</section>
  </>;
}
