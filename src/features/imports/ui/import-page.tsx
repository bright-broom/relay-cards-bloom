"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import type { Person } from "@/features/contacts";
import { useWorkspace } from "@/features/workspace/state";
import { Icon } from "@/shared/ui/icon";
import { ViewHeading } from "@/shared/ui/view-heading";

const allowedTypes = new Set(["image/jpeg", "image/png"]);
const maximumBytes = 10 * 1024 * 1024;

type Draft = { company: string; department: string; email: string; name: string; note: string; phone: string; title: string };
const initialDraft: Draft = { company: "株式会社サンプルテック", department: "事業開発部", email: "demo.contact@example.jp", name: "青山 ひなた", note: "名刺画像からの読み取り候補。登録前に内容を確認してください。", phone: "03-0000-4521", title: "マネージャー" };

export function ImportPage() {
  const { addPerson, showToast } = useWorkspace();
  const [reviewing, setReviewing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(initialDraft);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!allowedTypes.has(file.type)) { showToast("JPEG または PNG の画像を選択してください"); return; }
    if (file.size > maximumBytes) { showToast("ファイルサイズは 10 MB 以下にしてください"); return; }
    setFileName(file.name);
    setReviewing(true);
    showToast("画像本体は読み込まず、デモ確認画面へ進みました");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = `demo-${crypto.randomUUID()}`;
    const person: Person = { id, name: draft.name, kana: "あおやま ひなた", initials: "AH", company: draft.company, companyId: "sample-tech", department: draft.department, title: draft.title, email: draft.email, phone: draft.phone, mobile: "未入力", location: "要確認", exchangedAt: "2026-08-29", updatedLabel: "たった今", owner: "高橋 直人", strength: 20, status: "new", statusLabel: "新規", tags: ["手動確認済み"], note: draft.note, nextAction: "登録内容を確認", nextActionDate: "未設定", meetings: 0, sharedBy: 1, cardVersion: "2026.08", history: [{ date: "2026-08-29", title: "デモ領域へ登録", detail: "ユーザーが候補内容を確認して登録" }] };
    addPerson(person);
    setReviewing(false);
    setFileName(null);
  }

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft((current) => ({ ...current, [key]: value })); }

  if (reviewing) return <>
    <ViewHeading action={<span className="prototype-chip">LOCAL DEMO</span>} description="候補を確認し、必要な箇所を修正してから登録してください。" kicker="Human review" title="読み取り内容の確認" />
    <section className="review-layout"><article className="panel card-preview-panel"><div className="panel-heading"><h2>名刺プレビュー</h2><span className="confidence-chip">確認必須</span></div><div className="business-card-preview"><div className="preview-brand"><i />SAMPLE TECH</div><div className="preview-person"><strong>{draft.name || "氏名未入力"}</strong><span>{draft.title || "役職未入力"}</span><p>{draft.company}<br />{draft.department}</p></div><div className="preview-contact"><span>{draft.email}</span><span>{draft.phone}</span></div></div><p className="file-caption"><Icon name="lock" size={13} />{fileName ?? "手動入力"}：画像本体は送信・保存していません</p></article><article className="panel review-form-panel"><div className="review-form-head"><div><span className="eyebrow">Review fields</span><h2>登録内容</h2></div><span className="confidence-chip">人による確認</span></div><p className="review-notice">この画面の値はデモ候補です。実運用では OCR の確度、原画像、既存データとの差分を並べて確認します。</p><form className="review-form" onSubmit={submit}><div className="form-row"><label><span>氏名 <b>必須</b></span><input maxLength={80} onChange={(event) => updateDraft("name", event.target.value)} required value={draft.name} /></label><label><span>会社名 <b>必須</b></span><input maxLength={120} onChange={(event) => updateDraft("company", event.target.value)} required value={draft.company} /></label></div><div className="form-row"><label><span>部署</span><input maxLength={100} onChange={(event) => updateDraft("department", event.target.value)} value={draft.department} /></label><label><span>役職</span><input maxLength={100} onChange={(event) => updateDraft("title", event.target.value)} value={draft.title} /></label></div><div className="form-row"><label><span>メール</span><input maxLength={254} onChange={(event) => updateDraft("email", event.target.value)} type="email" value={draft.email} /></label><label><span>電話</span><input maxLength={30} onChange={(event) => updateDraft("phone", event.target.value)} value={draft.phone} /></label></div><label><span>メモ</span><textarea maxLength={1000} onChange={(event) => updateDraft("note", event.target.value)} value={draft.note} /></label><div className="review-actions"><button className="secondary-button" onClick={() => setReviewing(false)} type="button">戻る</button><button className="primary-button" type="submit"><Icon name="check" />確認して登録</button></div></form></article></section>
  </>;

  return <>
    <ViewHeading action={<span className="prototype-chip">LOCAL DEMO</span>} description="このデモは画像を外部送信・永続保存しません。" kicker="Secure import" title="名刺取り込み" />
    <section className="import-layout"><article className="panel import-main"><div className="import-method-tabs"><button className="active"><Icon name="scan" />画像から取り込む</button><button onClick={() => { setFileName(null); setReviewing(true); }}><Icon name="note" />手動入力</button><button disabled><Icon name="inbox" />一括取り込み <small>設計中</small></button></div><label className="dropzone"><input accept="image/jpeg,image/png" onChange={chooseFile} type="file" /><span className="upload-orb"><Icon name="upload" size={25} /></span><strong>名刺画像を選択</strong><p>JPEG または PNG、10 MB 以下</p><small>画像本体を読み取らず、デモ候補画面だけを開きます</small><span className="secondary-button">ファイルを選ぶ</span></label><div className="import-rules"><span><Icon name="lock" /><span><strong>外部送信なし</strong><small>画像を API や解析サービスへ送信しません。</small></span></span><span><Icon name="eye" /><span><strong>登録前に確認</strong><small>候補を人が確認するまで連絡先に反映しません。</small></span></span></div></article><aside className="panel import-guide"><h2>きれいに取り込むコツ</h2><div className="card-guide-art"><span /></div><ol><li><span>1</span><p><strong>明るい場所で撮影</strong><small>影や反射を避けます。</small></p></li><li><span>2</span><p><strong>名刺全体を枠内へ</strong><small>四隅が見える状態にします。</small></p></li><li><span>3</span><p><strong>登録前に内容確認</strong><small>所属と連絡先を重点的に確認します。</small></p></li></ol></aside></section>
  </>;
}
