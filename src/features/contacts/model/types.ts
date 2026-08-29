export type PersonStatus = "active" | "followup" | "new" | "stale";

export type ContactHistory = {
  date: string;
  detail: string;
  title: string;
};

export type Person = {
  cardVersion: string;
  company: string;
  companyId: string;
  department: string;
  email: string;
  exchangedAt: string;
  history: ContactHistory[];
  id: string;
  initials: string;
  kana: string;
  location: string;
  meetings: number;
  mobile: string;
  name: string;
  nextAction: string;
  nextActionDate: string;
  note: string;
  owner: string;
  phone: string;
  sharedBy: number;
  status: PersonStatus;
  statusLabel: string;
  strength: number;
  tags: string[];
  title: string;
  updatedLabel: string;
};

export type CompanyTone = "accent" | "primary" | "sub";

export type Company = {
  connections: number;
  id: string;
  industry: string;
  initials: string;
  lastActivity: string;
  name: string;
  owner: string;
  people: number;
  tone: CompanyTone;
};
