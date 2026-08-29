"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { filterPeople } from "@/features/contacts";
import { PersonAvatar } from "@/features/contacts/primitives";
import { Icon } from "@/shared/ui/icon";
import { ModalSurface } from "@/shared/ui/modal-surface";

import { useWorkspace } from "./workspace-provider";

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, people, selectPerson, setCommandOpen } = useWorkspace();
  const [query, setQuery] = useState("");

  if (!commandOpen) return null;

  function close() {
    setQuery("");
    setCommandOpen(false);
  }

  const matches = filterPeople(people, query).slice(0, 5);
  function navigate(path: "/people" | "/companies" | "/follow-ups" | "/import" | "/data-quality") {
    close();
    router.push(path);
  }

  return (
    <ModalSurface className="command-palette" label="検索と移動" onClose={close} overlayClassName="command-overlay">
      <label className="command-input"><Icon name="search" /><span className="sr-only">検索</span><input autoComplete="off" onChange={(event) => setQuery(event.target.value)} placeholder="氏名、会社名、役職で検索" value={query} /><kbd>Esc</kbd></label>
      <div className="command-results">
        <span className="command-label">連絡先</span>
        {matches.length ? matches.map((person) => (
          <button key={person.id} onClick={() => { close(); selectPerson(person.id); router.push("/people"); }}>
            <PersonAvatar person={person} size="small" /><span><strong>{person.name}</strong><small>{person.company}・{person.title}</small></span><Icon name="chevron" size={15} />
          </button>
        )) : <div className="command-empty">一致する連絡先はありません</div>}
        {!query && <><span className="command-label">移動</span>
          <button onClick={() => navigate("/companies")}><Icon name="building" /><span><strong>企業</strong><small>企業ごとの関係性を見る</small></span></button>
          <button onClick={() => navigate("/follow-ups")}><Icon name="calendar" /><span><strong>フォローアップ</strong><small>次のアクションを確認する</small></span></button>
          <button onClick={() => navigate("/import")}><Icon name="scan" /><span><strong>名刺を取り込む</strong><small>安全なデモ取り込み</small></span></button>
        </>}
      </div>
      <footer className="command-foot"><span>↑↓ 移動</span><span>Enter 選択</span><span>合成データのみ</span></footer>
    </ModalSurface>
  );
}
