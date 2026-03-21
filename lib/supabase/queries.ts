import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  HomeData,
  RiskWithActions,
  ActionWithDetails,
  AIData,
  FundWithDetails,
  Notification,
} from "@/types";

export async function getHomeData(
  supabase: SupabaseClient,
  orgId: string
): Promise<HomeData | null> {
  try {
    const [
      assessmentRes,
      risksRes,
      controlsRes,
      policiesRes,
      irRes,
      fwRes,
    ] = await Promise.all([
      supabase
        .from("assessments")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("risks")
        .select("*")
        .eq("org_id", orgId)
        .order("ale_cents", { ascending: false })
        .limit(3),
      supabase.from("controls").select("id, status").eq("org_id", orgId),
      supabase
        .from("policies")
        .select("id, covered, overdue")
        .eq("org_id", orgId),
      supabase
        .from("ir_checklist")
        .select("id, completed")
        .eq("org_id", orgId),
      supabase
        .from("framework_assessments")
        .select("*")
        .eq("org_id", orgId),
    ]);

    const controls = controlsRes.data ?? [];
    const policies = policiesRes.data ?? [];
    const irItems = irRes.data ?? [];

    return {
      assessment: assessmentRes.data ?? null,
      topRisks: risksRes.data ?? [],
      controlStats: {
        total: controls.length,
        passing: controls.filter((c) => c.status === "pass").length,
      },
      policyStats: {
        total: policies.length,
        covered: policies.filter((p) => p.covered).length,
        overdue: policies.filter((p) => p.overdue).length,
      },
      irStats: {
        total: irItems.length,
        completed: irItems.filter((i) => i.completed).length,
      },
      frameworkAssessments: fwRes.data ?? [],
    };
  } catch {
    return null;
  }
}

export async function getRiskData(
  supabase: SupabaseClient,
  orgId: string
): Promise<RiskWithActions[] | null> {
  try {
    const [risksRes, linksRes, resolutionsRes] = await Promise.all([
      supabase
        .from("risks")
        .select("*")
        .eq("org_id", orgId)
        .order("ale_cents", { ascending: false }),
      supabase
        .from("action_risk_links")
        .select("action_id, risk_id"),
      supabase
        .from("resolutions")
        .select("action_id, undone")
        .eq("undone", false),
    ]);

    const risks = risksRes.data ?? [];
    const links = linksRes.data ?? [];
    const resolutions = resolutionsRes.data ?? [];

    const resolvedActionIds = new Set(
      resolutions.map((r) => r.action_id)
    );

    return risks.map((risk) => {
      const riskLinks = links.filter((l) => l.risk_id === risk.id);
      const linkedActionIds = riskLinks.map((l) => l.action_id);
      const addressed =
        linkedActionIds.length > 0 &&
        linkedActionIds.every((id) => resolvedActionIds.has(id));

      return {
        ...risk,
        linked_action_ids: linkedActionIds,
        addressed,
      };
    });
  } catch {
    return null;
  }
}

export async function getActionData(
  supabase: SupabaseClient,
  orgId: string,
  userId: string
): Promise<ActionWithDetails[] | null> {
  try {
    const [actionsRes, stepsRes, linksRes, completionsRes, resolutionsRes] =
      await Promise.all([
        supabase
          .from("actions")
          .select("*")
          .eq("org_id", orgId)
          .order("sort_order"),
        supabase.from("action_steps").select("*").order("sort_order"),
        supabase.from("action_risk_links").select("action_id, risk_id"),
        supabase
          .from("step_completions")
          .select("action_id, step_id")
          .eq("user_id", userId),
        supabase
          .from("resolutions")
          .select("action_id, undone")
          .eq("user_id", userId)
          .eq("undone", false),
      ]);

    const actions = actionsRes.data ?? [];
    const steps = stepsRes.data ?? [];
    const links = linksRes.data ?? [];
    const completions = completionsRes.data ?? [];
    const resolutions = resolutionsRes.data ?? [];

    const completedStepIds = new Set(completions.map((c) => c.step_id));
    const resolvedActionIds = new Set(
      resolutions.map((r) => r.action_id)
    );

    return actions.map((action) => {
      const actionSteps = steps.filter((s) => s.action_id === action.id);
      const actionLinks = links.filter((l) => l.action_id === action.id);

      return {
        ...action,
        steps: actionSteps,
        linked_risk_ids: actionLinks.map((l) => l.risk_id),
        steps_completed: actionSteps.filter((s) =>
          completedStepIds.has(s.id)
        ).length,
        is_resolved: resolvedActionIds.has(action.id),
      };
    });
  } catch {
    return null;
  }
}

export async function getAIData(
  supabase: SupabaseClient,
  orgId: string
): Promise<AIData | null> {
  try {
    const [toolsRes, useCasesRes, itemsRes, govRes, fwRes] =
      await Promise.all([
        supabase.from("ai_tools").select("*").eq("org_id", orgId),
        supabase.from("ai_use_cases").select("*").eq("org_id", orgId),
        supabase
          .from("ai_use_case_items")
          .select("*")
          .order("sort_order"),
        supabase
          .from("ai_governance_items")
          .select("*")
          .eq("org_id", orgId)
          .order("sort_order"),
        supabase.from("ai_frameworks").select("*").eq("org_id", orgId),
      ]);

    const useCases = useCasesRes.data ?? [];
    const items = itemsRes.data ?? [];

    return {
      tools: toolsRes.data ?? [],
      useCases: useCases.map((uc) => ({
        ...uc,
        items: items.filter((i) => i.use_case_id === uc.id),
      })),
      governanceItems: govRes.data ?? [],
      frameworks: fwRes.data ?? [],
    };
  } catch {
    return null;
  }
}

export async function getFundData(
  supabase: SupabaseClient,
  orgId: string
): Promise<FundWithDetails[] | null> {
  try {
    const [fundsRes, milestonesRes, fundActionsRes] = await Promise.all([
      supabase
        .from("funds")
        .select("*")
        .eq("org_id", orgId)
        .order("vintage"),
      supabase
        .from("fund_milestones")
        .select("*")
        .order("sort_order"),
      supabase
        .from("fund_actions")
        .select("*")
        .order("sort_order"),
    ]);

    const funds = fundsRes.data ?? [];
    const milestones = milestonesRes.data ?? [];
    const fundActions = fundActionsRes.data ?? [];

    return funds.map((fund) => ({
      ...fund,
      milestones: milestones.filter((m) => m.fund_id === fund.id),
      fund_actions: fundActions.filter((fa) => fa.fund_id === fund.id),
    }));
  } catch {
    return null;
  }
}

export async function getNotifications(
  supabase: SupabaseClient,
  userId: string,
  unreadOnly = false
): Promise<Notification[] | null> {
  try {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq("read", false);
    }

    const { data } = await query;
    return data ?? [];
  } catch {
    return null;
  }
}
