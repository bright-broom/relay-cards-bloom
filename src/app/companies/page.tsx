import type { Metadata } from "next";

import { CompaniesPage } from "@/features/contacts/ui";

export const metadata: Metadata = { title: "企業" };

export default function Page() {
  return <CompaniesPage />;
}
