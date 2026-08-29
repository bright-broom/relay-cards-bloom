import type { Metadata } from "next";

import { FollowUpsPage } from "@/features/follow-ups/ui";

export const metadata: Metadata = { title: "フォローアップ" };

export default function Page() {
  return <FollowUpsPage />;
}
