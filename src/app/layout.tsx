import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { AppShell, WorkspaceProvider } from "@/features/workspace";

import "./globals.css";

export const metadata: Metadata = {
  description: "名刺を次の行動へつなぐ法人向け人脈ワークスペース",
  robots: { follow: false, index: false },
  title: { default: "Relay Cards", template: "%s | Relay Cards" }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  await connection();
  return <html lang="ja"><body><WorkspaceProvider><AppShell>{children}</AppShell></WorkspaceProvider></body></html>;
}
