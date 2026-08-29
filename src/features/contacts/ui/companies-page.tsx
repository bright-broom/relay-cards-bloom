"use client";

import { useState } from "react";

import { useWorkspace } from "@/features/workspace/state";
import { Icon } from "@/shared/ui/icon";
import { ViewHeading } from "@/shared/ui/view-heading";

export function CompaniesPage() {
  const { companies, people, privacyMode, selectPerson, showToast } = useWorkspace();
  const [query, setQuery] = useState("");
  const results = companies.filter((company) => `${company.name} ${company.industry}`.toLowerCase().includes(query.trim().toLowerCase()));
  const hidden = (value: string) => privacyMode ? "••••••••" : value;
  return <>
    <ViewHeading action={<button className="secondary-button" onClick={() => showToast("企業データ追加は管理者承認後に接続します")}><Icon name="plus" />企業を追加</button>} description="社内の接点数と最新活動から、組織との関係を確認します。" kicker="Company network" title="企業" />
    <div className="people-toolbar"><label className="inline-search"><Icon name="search" size={16} /><span className="sr-only">企業を検索</span><input onChange={(event) => setQuery(event.target.value)} placeholder="企業名、業種で検索" value={query} /></label></div>
    <section className="company-grid">{results.map((company) => { const lead = people.find(({ companyId }) => companyId === company.id); return <button className="company-card" key={company.id} onClick={() => lead ? selectPerson(lead.id) : showToast("人物情報はまだありません")}><div className="company-card-top"><span className={`company-logo tone-${company.tone}`}>{company.initials}</span><span className="industry-label">{company.industry}</span></div><h2>{hidden(company.name)}</h2><p>担当：{company.owner}</p><div className="company-stats"><span><strong>{company.people}</strong><small>人物</small></span><span><strong>{company.connections}</strong><small>社内接点</small></span><span><strong>{company.lastActivity}</strong><small>最新活動</small></span></div><span className="company-card-link">代表連絡先を見る<Icon name="arrow" size={14} /></span></button>; })}</section>
  </>;
}
