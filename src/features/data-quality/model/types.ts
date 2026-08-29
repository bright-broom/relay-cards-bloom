export type QualityIssueType = "duplicate" | "missing" | "stale";

export type QualityIssue = {
  action: string;
  confidence: string;
  detail: string;
  id: string;
  title: string;
  type: QualityIssueType;
};
