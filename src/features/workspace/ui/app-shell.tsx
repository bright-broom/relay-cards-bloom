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

const tools: { badge?: string; href: "/import" | "/data-quality"; icon: IconName; label: string }[] = [
  { href: "/import", icon: "scan", label: "名刺取り込み" },
  { href: "/data-quality", icon: "quality", label: "データ品質", badge: "3" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const workspace = useWorkspace();
  const activeItem = [...navigation, ...tools].find(({ href }) => href === pathname) ?? navigation[0]!;

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
        <Link className="brand" href="/" onClick={() => workspace.setMobileNavigationOpen(false)}>
          <span className="brand-mark"><span /><span /></span>
          <span className="brand-copy"><span><strong>Relay</strong><small>cards</small></span><em>Relationship OS</em></span>
        </Link>
        <p className="nav-label">Workspace</p>
        <nav className="nav-stack">{navigation.map((item) => (
          <Link aria-current={pathname === item.href ? "page" : undefined} className={`nav-item ${pathname === item.href ? "active" : ""}`} href={item.href} key={item.href} onClick={() => workspace.setMobileNavigationOpen(false)}>
            <Icon name={item.icon} /><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}</nav>
        <div className="nav-tools"><p className="nav-label">Manage</p><nav className="nav-stack">{tools.map((item) => (
          <Link aria-current={pathname === item.href ? "page" : undefined} className={`nav-item ${pathname === item.href ? "active" : ""}`} href={item.href} key={item.href} onClick={() => workspace.setMobileNavigationOpen(false)}>
            <Icon name={item.icon} /><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}</nav></div>
        <div className="sidebar-footer">
          <div className="demo-boundary"><span className="boundary-icon"><Icon name="lock" size={15} /></span><span><strong>セキュアデモ</strong><small>実在人物・顧客データは使用していません</small></span></div>
          <div className="profile"><span className="avatar avatar-dark">TN</span><span><strong>高橋 直人</strong><small>営業企画</small></span><button aria-label="アカウントメニュー" className="icon-button" onClick={() => workspace.showToast("アカウント設定はデモ対象外です")}><Icon name="more" size={16} /></button></div>
        </div>
      </aside>
      <button aria-label="メニューを閉じる" className={`mobile-scrim ${workspace.mobileNavigationOpen ? "visible" : ""}`} onClick={() => workspace.setMobileNavigationOpen(false)} type="button" />
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-context">
            <button aria-label="メニューを開く" className="icon-button mobile-menu" onClick={() => workspace.setMobileNavigationOpen(true)}><Icon name="menu" /></button>
            <span><small>Workspace</small><strong>{activeItem.label}</strong></span>
          </div>
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
