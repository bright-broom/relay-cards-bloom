"use client";

import { relationshipLabel } from "@/features/contacts";
import { PersonAvatar, StatusBadge } from "@/features/contacts/primitives";
import { Icon } from "@/shared/ui/icon";
import { ModalSurface } from "@/shared/ui/modal-surface";

import { useWorkspace } from "./workspace-provider";

export function ContactDrawer() {
  const { privacyMode, selectedPerson: person, selectPerson, showToast } = useWorkspace();
  if (!person) return null;

  const hidden = (value: string) => privacyMode ? "••••••••" : value;

  return (
    <ModalSurface className="person-drawer" label={`${person.name}の詳細`} onClose={() => selectPerson(null)}>
      <button aria-label="詳細を閉じる" className="icon-button drawer-close" onClick={() => selectPerson(null)}><Icon name="close" /></button>
      <div className="drawer-hero">
        <PersonAvatar person={person} size="large" />
        <div>
          <StatusBadge person={person} />
          <h2>{hidden(person.name)}</h2>
          <p>{hidden(person.company)}<br />{hidden(`${person.department}・${person.title}`)}</p>
        </div>
      </div>
      <div className="drawer-actions">
        <button className="primary-button" onClick={() => showToast("メール送信は接続前です。デモでは送信されません")}><Icon name="mail" />メール</button>
        <button className="secondary-button" onClick={() => showToast("通話機能は接続前です。デモでは発信されません")}><Icon name="phone" />電話</button>
        <button aria-label="共有" className="icon-button bordered" onClick={() => showToast("共有リンクをデモ生成しました")}><Icon name="share" /></button>
      </div>
      <section className="drawer-section contact-details">
        <h3>連絡先</h3>
        <dl>
          <div><dt>メール</dt><dd>{hidden(person.email)}</dd></div>
          <div><dt>電話</dt><dd>{hidden(person.phone)}</dd></div>
          <div><dt>携帯</dt><dd>{hidden(person.mobile)}</dd></div>
          <div><dt>所在地</dt><dd>{hidden(person.location)}</dd></div>
          <div><dt>名刺交換</dt><dd>{person.exchangedAt}</dd></div>
        </dl>
      </section>
      <section className="drawer-section">
        <div className="drawer-title-row"><h3>関係性</h3><strong>{person.strength}<small> / 100</small></strong></div>
        <progress aria-label="関係性の強さ" className="drawer-strength" max="100" value={person.strength} />
        <div className="relationship-facts">
          <span><strong>{relationshipLabel(person.strength)}</strong><small>関係性</small></span>
          <span><strong>{person.meetings} 回</strong><small>接点</small></span>
          <span><strong>{person.sharedBy} 人</strong><small>社内共有</small></span>
        </div>
      </section>
      <section className="drawer-section next-action-box">
        <h3>次のアクション</h3>
        <strong>{person.nextAction}</strong>
        <p><Icon name="calendar" size={14} />{person.nextActionDate}</p>
        <button className="text-button" onClick={() => showToast("予定連携は接続前です")}><Icon name="arrow" size={14} />予定に追加</button>
      </section>
      <section className="drawer-section">
        <h3>メモ</h3>
        <p className="person-note">{person.note}</p>
        <div className="tag-list">{person.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </section>
      <section className="drawer-section">
        <h3>履歴</h3>
        <ol className="history-list">{person.history.map((entry) => (
          <li key={`${entry.date}-${entry.title}`}><time>{entry.date}</time><i /><div><strong>{entry.title}</strong><p>{entry.detail}</p></div></li>
        ))}</ol>
      </section>
      <footer className="drawer-footer"><span><Icon name="lock" size={13} />合成データのみ</span><span>名刺版 {person.cardVersion}</span></footer>
    </ModalSurface>
  );
}
