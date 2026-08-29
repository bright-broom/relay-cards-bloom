import Link from "next/link";

export default function NotFound() {
  return <section className="quality-empty"><strong>ページが見つかりません</strong><p>URL を確認するか、ホームへ戻ってください。</p><Link className="primary-button" href="/">ホームへ戻る</Link></section>;
}
