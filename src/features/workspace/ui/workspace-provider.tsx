"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { demoCompanies, demoPeople, type Company, type Person } from "@/features/contacts";
import { demoQualityIssues, type QualityIssue } from "@/features/data-quality";
import { demoFollowUps, type FollowUpTask } from "@/features/follow-ups";

type WorkspaceContextValue = {
  addPerson: (person: Person) => void;
  commandOpen: boolean;
  companies: Company[];
  completedFollowUps: ReadonlySet<string>;
  dismissQualityIssue: (id: string) => void;
  followUps: FollowUpTask[];
  mobileNavigationOpen: boolean;
  openCommand: () => void;
  people: Person[];
  privacyMode: boolean;
  qualityIssues: QualityIssue[];
  selectedPerson: Person | null;
  selectPerson: (id: string | null) => void;
  setCommandOpen: (open: boolean) => void;
  setMobileNavigationOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  toggleFollowUp: (id: string) => void;
  togglePrivacy: () => void;
  toast: string | null;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>(demoPeople);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [completedFollowUps, setCompletedFollowUps] = useState<ReadonlySet<string>>(new Set());
  const [dismissedQualityIssues, setDismissedQualityIssues] = useState<ReadonlySet<string>>(new Set());
  const [privacyMode, setPrivacyMode] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedPerson = people.find(({ id }) => id === selectedPersonId) ?? null;
  const qualityIssues = demoQualityIssues.filter(({ id }) => !dismissedQualityIssues.has(id));
  const showToast = useCallback((message: string) => setToast(message), []);

  const value = useMemo<WorkspaceContextValue>(() => ({
    addPerson(person) {
      setPeople((current) => [person, ...current]);
      setSelectedPersonId(person.id);
      showToast("連絡先をデモ領域へ登録しました");
    },
    commandOpen,
    companies: demoCompanies,
    completedFollowUps,
    dismissQualityIssue(id) {
      setDismissedQualityIssues((current) => new Set(current).add(id));
      showToast("確認済みとしてデモ領域から除外しました");
    },
    followUps: demoFollowUps,
    mobileNavigationOpen,
    openCommand: () => setCommandOpen(true),
    people,
    privacyMode,
    qualityIssues,
    selectedPerson,
    selectPerson: setSelectedPersonId,
    setCommandOpen,
    setMobileNavigationOpen,
    showToast,
    toggleFollowUp(id) {
      setCompletedFollowUps((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    togglePrivacy: () => setPrivacyMode((current) => !current),
    toast
  }), [commandOpen, completedFollowUps, mobileNavigationOpen, people, privacyMode, qualityIssues, selectedPerson, showToast, toast]);

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return context;
}
