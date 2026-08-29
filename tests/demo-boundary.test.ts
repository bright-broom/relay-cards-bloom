import { describe, expect, it } from "vitest";

import { demoCompanies, demoPeople } from "@/features/contacts";

describe("demo data boundary", () => {
  it("連絡先は予約済みの example.jp と 000 番号だけを使う", () => {
    for (const person of demoPeople) {
      expect(person.email.endsWith("@example.jp")).toBe(true);
      expect(`${person.phone} ${person.mobile}`).toContain("000");
    }
  });

  it("fixture ID は一意で参照先企業が存在する", () => {
    expect(new Set(demoPeople.map(({ id }) => id)).size).toBe(demoPeople.length);
    const companyIds = new Set(demoCompanies.map(({ id }) => id));
    expect(demoPeople.every(({ companyId }) => companyIds.has(companyId))).toBe(true);
  });
});
