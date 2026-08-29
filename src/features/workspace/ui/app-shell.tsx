"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Icon, type IconName } from "@/shared/ui/icon";

import { CommandPalette } from "./command-palette";
import { ContactDrawer } from "./contact-drawer";
import { useWorkspace } from "./workspace-provider";

const navigation: { badge?: string; href: "/" | "/people" | "/companies" | "/follow-ups" | "/import" | "/data-quality"; icon: IconName; label: string }[] = [
  { href: "/", icon: "home", label: "ホーム" },
  { href: "/people", icon: "people", label: "人物", badge: "6" },
  { href: "/companies", icon: "building", label: "企業", badge: "6" },
  { href: "/follow-ups", icon: "calendar", label: "フォローアップ", badge: "5" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const workspace = useWorkspace();

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const element = event.target;
      const typing = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        workspace.openCommand();
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        workspace.openCommand();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [workspace]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">本文へ移動</a>
      <aside aria-label="主ナビゲーション" className={`sidebar ${workspace.mobileNavigationOpen ? "mobile-open" : ""}`}>
        <button aria-label="メニューを閉じる" className="icon-button mobile-close" onClick={() => workspace.setMobileNavigationOpen(false)}><Icon name="close" /></button>
        <Link className="brand" href="/" onClick={() => workspace.setMobileNavigationOpen(false)}><span className="brand-mark"><span /><span /></span><span><strong>Relay</strong><small>cards</small></span></Link>
        <nav className="nav-stack">{navigation.map((item) => (
          <Link aria-current={pathname === item.href ? "page" : undefined} className={`nav-item ${pathname === item.href ? "active" : ""}`} href={item.href} key={item.href} onClick={() => workspace.setMobileNavigationOpen(false)}>
            <Icon name={item.icon} /><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}</nav>
        <div className="nav-tools"><p className="nav-label">Tools</p><nav className="nav-stack">
          <Link className={`nav-item ${pathname === "/import" ? "active" : ""}`} href="/import"><Icon name="scan" /><span>名刺取り込み</span></Link>
          <Link className={`nav-item ${pathname === "/data-quality" ? "active" : ""}`} href="/data-quality"><Icon name="quality" /><span>データ品質</span><span className="nav-badge">3</span></Link>
        </nav></div>
        <div className="demo-boundary"><span className="boundary-icon"><Icon name="lock" size={14} /></span><span><strong>デモ環境</strong><small>実在人物・顧客データは使用していません</small></span></div>
        <div className="profile"><span className="avatar avatar-dark">TN</span><span><strong>高橋 直人</strong><small>営業企画</small></span><button aria-label="アカウントメニュー" className="icon-button" onClick={() => workspace.showToast("アカウント設定はデモ対象外です")}><Icon name="more" size={15} /></button></div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button aria-label="メニューを開く" className="icon-button mobile-menu" onClick={() => workspace.setMobileNavigationOpen(true)}><Icon name="menu" /></button>
          <button className="global-search" onClick={workspace.openCommand}><Icon name="search" /><span>人物・企業・役職を検索</span><kbd>⌘ K</kbd></button>
          <div className="top-actions">
            <button aria-pressed={workspace.privacyMode} className={`privacy-button ${workspace.privacyMode ? "active" : ""}`} onClick={workspace.togglePrivacy}><Icon name={workspace.privacyMode ? "eyeOff" : "eye"} size={15} /><span>プライバシー</span></button>
            <button aria-label="通知" className="icon-button top-icon" onClick={() => workspace.showToast("未読通知はありません")}><Icon name="bell" /><span className="notification-dot" /></button>
            <Link className="primary-button" href="/import"><Icon name="plus" size={15} />名刺を追加</Link>
          </div>
        </header>
        <main className="main-content" id="main-content">{children}</main>
      </div>
      <ContactDrawer />
      <CommandPalette />
      {workspace.toast && <div aria-live="polite" className="toast" role="status"><Icon name="check" size={15} />{workspace.toast}</div>}
    </div>
  );
}
