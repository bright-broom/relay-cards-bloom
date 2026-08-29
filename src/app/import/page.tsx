import type { Metadata } from "next";

import { ImportPage } from "@/features/imports/ui";

export const metadata: Metadata = { title: "名刺取り込み" };

export default function Page() {
  return <ImportPage />;
}
