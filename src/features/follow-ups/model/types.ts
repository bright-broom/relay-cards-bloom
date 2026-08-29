export type FollowUpUrgency = "normal" | "soon" | "today";

export type FollowUpTask = {
  due: string;
  id: string;
  personId: string;
  title: string;
  urgency: FollowUpUrgency;
};
