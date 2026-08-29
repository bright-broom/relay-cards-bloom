import type { Metadata } from "next";

import { PeoplePage } from "@/features/contacts/ui";

export const metadata: Metadata = { title: "人物" };

export default function Page() {
  return <PeoplePage />;
}
