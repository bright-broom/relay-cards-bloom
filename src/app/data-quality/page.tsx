import type { Metadata } from "next";

import { DataQualityPage } from "@/features/data-quality/ui";

export const metadata: Metadata = { title: "データ品質" };

export default function Page() {
  return <DataQualityPage />;
}
