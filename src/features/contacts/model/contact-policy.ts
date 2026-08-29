import type { Person } from "./types";

export function filterPeople(items: Person[], query: string) {
  const normalized = query.trim().toLocaleLowerCase("ja-JP");
  if (!normalized) return items;
  return items.filter((person) =>
    [person.name, person.kana, person.company, person.department, person.title, person.tags.join(" ")]
      .join(" ")
      .toLocaleLowerCase("ja-JP")
      .includes(normalized)
  );
}

export function relationshipLabel(score: number) {
  if (score >= 80) return "強い接点";
  if (score >= 60) return "継続接点";
  return "育成中";
}
