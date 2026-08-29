import { describe, expect, it } from "vitest";

import { demoPeople, filterPeople, relationshipLabel } from "@/features/contacts";

describe("contact policy", () => {
  it("氏名、会社、Tag を横断検索する", () => {
    expect(filterPeople(demoPeople, "みずの")).toHaveLength(1);
    expect(filterPeople(demoPeople, "物流")[0]?.id).toBe("ren-ishii");
    expect(filterPeople(demoPeople, "AI 推進")[0]?.id).toBe("akari-mizuno");
  });

  it("関係性の境界値を分類する", () => {
    expect(relationshipLabel(80)).toBe("強い接点");
    expect(relationshipLabel(60)).toBe("継続接点");
    expect(relationshipLabel(59)).toBe("育成中");
  });
});
