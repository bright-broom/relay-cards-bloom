import type { Person, PersonStatus } from "../model/types";

export function PersonAvatar({ person, size = "default" }: { person: Person; size?: "default" | "large" | "small" | "tiny" }) {
  return <span aria-hidden="true" className={`person-avatar ${size === "default" ? "" : size}`}>{person.initials}</span>;
}

const statusClass: Record<PersonStatus, string> = {
  active: "status-active",
  followup: "status-followup",
  new: "status-new",
  stale: "status-stale"
};

export function StatusBadge({ person }: { person: Person }) {
  return <span className={`status-badge ${statusClass[person.status]}`}><i />{person.statusLabel}</span>;
}
