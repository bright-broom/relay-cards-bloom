"use client";

import { useMemo, useState } from "react";

import { useWorkspace } from "@/features/workspace/state";
import { Icon } from "@/shared/ui/icon";
import { ViewHeading } from "@/shared/ui/view-heading";

import { filterPeople, relationshipLabel } from "../model/contact-policy";
import type { PersonStatus } from "../model/types";
import { PersonAvatar, StatusBadge } from "./contact-primitives";

type Filter = "all" | PersonStatus;

export function PeoplePage() {
  const { openCommand, people, privacyMode, selectPerson, showToast } = useWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const results = useMemo(() => filterPeople(people, query).filter((person) => filter === "all" || person.status === filter), [filter, people, query]);
  const hidden = (value: string) => privacyMode ? "••••••••" : value;
  const filters: { id: Filter; label: string }[] = [{ id: "all", label: "すべて" }, { id: "followup", label: "フォロー予定" }, { id: "active", label: "商談中" }, { id: "new", label: "新規" }, { id: "stale", label: "要確認" }];

  return <>
    <ViewHeading action={<button className="secondary-button" onClick={() => showToast("CSV 出力は権限・監査設計後に接続します")}><Icon name="upload" />CSV 出力</button>} description="所属、接点、関係性、次の行動を一つの画面で確認できます。" kicker="People directory" title="人物" />
    <div className="people-toolbar"><label className="inline-search"><Icon name="search" size={16} /><span className="sr-only">人物を絞り込む</span><input onChange={(event) => setQuery(event.target.value)} placeholder="氏名、会社、部署、役職" value={query} /></label><button className="secondary-button" onClick={() => setFilter("all")}><Icon name="filter" />絞り込み解除</button><button className="primary-button" onClick={openCommand}><Icon name="search" />横断検索</button></div>
    <div className="filter-row">{filters.map((item) => { const count = item.id === "all" ? people.length : people.filter(({ status }) => status === item.id).length; return <button aria-pressed={filter === item.id} className={`filter-chip ${filter === item.id ? "active" : ""}`} key={item.id} onClick={() => setFilter(item.id)}>{item.label}<span>{count}</span></button>; })}</div>
    <section className="table-panel"><div className="table-summary"><span><strong>{results.length}</strong> 人を表示</span><span><Icon name="lock" size={13} /> 合成データ</span></div><div className="table-scroll"><table><thead><tr><th>人物</th><th>会社・役職</th><th>連絡先</th><th>状態</th><th>関係性</th><th>担当</th><th>更新</th></tr></thead><tbody>{results.map((person) => <tr key={person.id} onClick={() => selectPerson(person.id)}><td><span className="person-cell"><PersonAvatar person={person} size="small" /><span><strong>{hidden(person.name)}</strong><small>{hidden(person.kana)}</small></span></span></td><td><span className="company-name">{hidden(person.company)}</span><span className="cell-sub">{hidden(`${person.department}・${person.title}`)}</span></td><td><span className="contact-line"><Icon name="mail" size={12} />{hidden(person.email)}</span><span className="contact-line"><Icon name="phone" size={12} />{hidden(person.phone)}</span></td><td><StatusBadge person={person} /></td><td><span className="strength-cell"><progress aria-label={`${person.name}の関係性`} className="strength-track" max="100" value={person.strength} /><strong>{person.strength}</strong><small>{relationshipLabel(person.strength)}</small></span></td><td>{person.owner}</td><td>{person.updatedLabel}</td></tr>)}</tbody></table>{results.length === 0 && <div className="empty-table">条件に一致する人物はありません。</div>}</div></section>
  </>;
}
