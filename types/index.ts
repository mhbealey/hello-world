// Database entity types

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  org_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  notification_prefs: NotificationPrefs;
  last_active_at: string | null;
  created_at: string;
}

export type UserRole = "admin" | "advisor" | "viewer" | "lp_readonly";

export interface NotificationPrefs {
  email_digest: boolean;
  overdue_alerts: boolean;
  deadline_alerts: boolean;
}

export type OddStatus = "complete" | "in_progress" | "not_started";

export interface Fund {
  id: string;
  org_id: string;
  name: string;
  vintage: number;
  aum_cents: number;
  nav_cents: number;
  moic: number | null;
  irr: number | null;
  deployed_pct: number;
  cyber_score: number | null;
  prior_cyber_score: number | null;
  odd_status: OddStatus;
  exit_companies: number;
  created_at: string;
  updated_at: string;
}

export interface FundMilestone {
  id: string;
  fund_id: string;
  phase: string;
  year_range: string | null;
  finance_activity: string | null;
  cyber_overlay: string | null;
  completed: boolean;
  sort_order: number;
}

export interface Assessment {
  id: string;
  org_id: string;
  fund_id: string | null;
  score: number | null;
  prior_score: number | null;
  as_of_date: string;
  next_lp_review: string | null;
  days_to_lp: number | null;
  overdue_count: number;
  total_ale_cents: number;
  created_at: string;
}

export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface Risk {
  id: string;
  org_id: string;
  name: string;
  ale_cents: number;
  plain_english: string | null;
  recommended_response: string | null;
  sort_order: number;
  created_at: string;
}

export interface Action {
  id: string;
  org_id: string;
  title: string;
  urgency: UrgencyLevel;
  why_it_matters: string | null;
  scope: string | null;
  cost_range: string | null;
  timeline: string | null;
  sort_order: number;
  created_at: string;
}

export interface ActionStep {
  id: string;
  action_id: string;
  step_text: string;
  sort_order: number;
}

export interface ActionRiskLink {
  action_id: string;
  risk_id: string;
}

export interface FundAction {
  id: string;
  fund_id: string;
  action_id: string | null;
  text: string;
  target_date: string | null;
  sort_order: number;
}

export interface StepCompletion {
  id: string;
  user_id: string;
  action_id: string;
  step_id: string;
  completed_at: string;
}

export interface Resolution {
  id: string;
  user_id: string;
  action_id: string;
  resolved_at: string;
  undone: boolean;
  undone_at: string | null;
}

export interface AuditLogEntry {
  id: string;
  org_id: string;
  user_id: string | null;
  table_name: string;
  record_id: string | null;
  action: "INSERT" | "UPDATE" | "DELETE";
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
}

export type ControlStatus = "pass" | "fail";

export interface Control {
  id: string;
  org_id: string;
  name: string;
  framework: string | null;
  status: ControlStatus;
  risk_amount: string | null;
  linked_action_id: string | null;
  created_at: string;
}

export interface Policy {
  id: string;
  org_id: string;
  area: string;
  covered: boolean;
  document_name: string | null;
  document_url: string | null;
  last_reviewed: string | null;
  overdue: boolean;
  owner_email: string | null;
  created_at: string;
}

export interface IRChecklistItem {
  id: string;
  org_id: string;
  item: string;
  completed: boolean;
  sort_order: number;
}

export interface FrameworkAssessment {
  id: string;
  org_id: string;
  framework_name: string;
  total_controls: number;
  effective_controls: number;
  effectiveness_pct: number;
  created_at: string;
}

export type AIToolStatus = "approved" | "under_review" | "not_evaluated";
export type AIUsageLevel = "high" | "medium" | "low" | "none";
export type AIRiskLevel = "high" | "medium" | "low" | "unknown";

export interface AITool {
  id: string;
  org_id: string;
  name: string;
  status: AIToolStatus;
  usage_level: AIUsageLevel;
  risk_level: AIRiskLevel;
  in_use: boolean;
  created_at: string;
}

export interface AIUseCase {
  id: string;
  org_id: string;
  area: string;
  risk_level: AIRiskLevel;
  description: string | null;
  linked_action_id: string | null;
  created_at: string;
}

export interface AIUseCaseItem {
  id: string;
  use_case_id: string;
  item_text: string;
  sort_order: number;
}

export interface AIGovernanceItem {
  id: string;
  org_id: string;
  item: string;
  completed: boolean;
  target: string | null;
  linked_action_id: string | null;
  sort_order: number;
}

export interface AIFramework {
  id: string;
  org_id: string;
  name: string;
  score: number;
  prior_score: number | null;
  description: string | null;
  linked_action_id: string | null;
  created_at: string;
}

export type AdvisorRequestStatus = "pending" | "confirmed" | "completed";

export interface AdvisorRequest {
  id: string;
  user_id: string;
  org_id: string;
  selected_action_ids: string[];
  source_context: string | null;
  selected_time: string | null;
  status: AdvisorRequestStatus;
  created_at: string;
}

export type NotificationType =
  | "overdue_policy"
  | "deadline_approaching"
  | "lp_review"
  | "advisor_confirmed";

export interface Notification {
  id: string;
  user_id: string;
  org_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  read: boolean;
  link_to: string | null;
  created_at: string;
}

// Composite types for screens

export interface HomeData {
  assessment: Assessment | null;
  topRisks: Risk[];
  controlStats: {
    total: number;
    passing: number;
  };
  policyStats: {
    total: number;
    covered: number;
    overdue: number;
  };
  irStats: {
    total: number;
    completed: number;
  };
  frameworkAssessments: FrameworkAssessment[];
}

export interface RiskWithActions extends Risk {
  linked_action_ids: string[];
  addressed: boolean;
  days_since_update?: number;
}

export interface ActionWithDetails extends Action {
  steps: ActionStep[];
  linked_risk_ids: string[];
  steps_completed: number;
  is_resolved: boolean;
}

export interface FundWithDetails extends Fund {
  milestones: FundMilestone[];
  fund_actions: FundAction[];
}

export interface AIData {
  tools: AITool[];
  useCases: (AIUseCase & { items: AIUseCaseItem[] })[];
  governanceItems: AIGovernanceItem[];
  frameworks: AIFramework[];
}
