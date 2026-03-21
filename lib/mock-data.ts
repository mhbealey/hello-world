import type {
  HomeData,
  RiskWithActions,
  ActionWithDetails,
  AIData,
  FundWithDetails,
} from "@/types";

export const MOCK_HOME: HomeData = {
  assessment: {
    id: "mock-assessment",
    org_id: "mock-org",
    fund_id: null,
    score: 81,
    prior_score: 77,
    as_of_date: "2026-03-17",
    next_lp_review: "2026-04-28",
    days_to_lp: 42,
    overdue_count: 6,
    total_ale_cents: 4_680_000_000,
    created_at: "2026-03-17",
  },
  topRisks: [
    { id: "r0", org_id: "mock-org", name: "Exit Value Erosion", ale_cents: 1_980_000_000, plain_english: null, recommended_response: null, sort_order: 0, created_at: "" },
    { id: "r1", org_id: "mock-org", name: "Data Breach", ale_cents: 680_000_000, plain_english: null, recommended_response: null, sort_order: 1, created_at: "" },
    { id: "r2", org_id: "mock-org", name: "AI Exposure", ale_cents: 650_000_000, plain_english: null, recommended_response: null, sort_order: 2, created_at: "" },
  ],
  controlStats: { total: 12, passing: 5 },
  policyStats: { total: 10, covered: 9, overdue: 3 },
  irStats: { total: 7, completed: 3 },
  frameworkAssessments: [
    { id: "fw0", org_id: "mock-org", framework_name: "SOC 2", total_controls: 68, effective_controls: 62, effectiveness_pct: 91, created_at: "" },
    { id: "fw1", org_id: "mock-org", framework_name: "NIST CSF", total_controls: 52, effective_controls: 44, effectiveness_pct: 85, created_at: "" },
    { id: "fw2", org_id: "mock-org", framework_name: "CIS v8.1", total_controls: 43, effective_controls: 36, effectiveness_pct: 84, created_at: "" },
  ],
};

export const MOCK_RISKS: RiskWithActions[] = [
  { id: "r0", org_id: "mock-org", name: "Exit Value Erosion", ale_cents: 1_980_000_000, plain_english: "Without proper cyber governance at portfolio companies, exit valuations could be reduced by $15-25M due to unaddressed security gaps discovered during buyer due diligence.", recommended_response: "Implement comprehensive cyber governance framework across all portfolio companies before exit preparation begins.", sort_order: 0, created_at: "", linked_action_ids: ["a1"], addressed: false },
  { id: "r1", org_id: "mock-org", name: "Data Breach", ale_cents: 680_000_000, plain_english: "A data breach at any portfolio company could result in regulatory fines, legal costs, and reputational damage averaging $6.8M per incident.", recommended_response: "Deploy continuous monitoring and ensure all portfolio companies maintain current incident response plans.", sort_order: 1, created_at: "", linked_action_ids: ["a0", "a4"], addressed: false },
  { id: "r2", org_id: "mock-org", name: "AI Exposure", ale_cents: 650_000_000, plain_english: "Unmonitored AI tool usage across portfolio companies creates data leakage risk, regulatory exposure, and potential IP compromise.", recommended_response: "Establish AI governance policy and deploy monitoring tools across the portfolio.", sort_order: 2, created_at: "", linked_action_ids: ["a1"], addressed: false },
  { id: "r3", org_id: "mock-org", name: "SEC Enforcement", ale_cents: 580_000_000, plain_english: "SEC cybersecurity disclosure rules require documented governance. Non-compliance risks enforcement actions and LP confidence erosion.", recommended_response: "Close open audit findings and ensure all required documentation is current.", sort_order: 3, created_at: "", linked_action_ids: ["a0"], addressed: false },
  { id: "r4", org_id: "mock-org", name: "Vendor Compromise", ale_cents: 420_000_000, plain_english: "Third-party vendor breaches can cascade across portfolio companies sharing common service providers.", recommended_response: "Deploy AI-powered vendor monitoring and establish third-party risk management program.", sort_order: 4, created_at: "", linked_action_ids: ["a4"], addressed: false },
  { id: "r5", org_id: "mock-org", name: "Ransomware", ale_cents: 370_000_000, plain_english: "Ransomware attacks can halt portfolio company operations for weeks, destroying value and triggering insurance claims.", recommended_response: "Implement business continuity and disaster recovery testing program across the portfolio.", sort_order: 5, created_at: "", linked_action_ids: ["a3"], addressed: false },
];

const makeSteps = (actionId: string, texts: string[]) =>
  texts.map((step_text, i) => ({ id: `${actionId}-s${i}`, action_id: actionId, step_text, sort_order: i }));

export const MOCK_ACTIONS: ActionWithDetails[] = [
  { id: "a0", org_id: "mock-org", title: "Establish AI Governance Policy", urgency: "critical", why_it_matters: "AI tools are being adopted across portfolio companies without oversight. This creates data leakage, regulatory, and IP risks that could materially impact fund returns.", scope: "All portfolio companies using or evaluating AI tools", cost_range: "$50K - $150K", timeline: "Q2 2026", sort_order: 0, created_at: "", steps: makeSteps("a0", ["Draft AI acceptable use policy", "Inventory all AI tools in use across portfolio", "Classify AI use cases by risk level", "Establish AI vendor evaluation criteria", "Roll out policy to all portfolio companies"]), linked_risk_ids: ["r1", "r3"], steps_completed: 0, is_resolved: false },
  { id: "a1", org_id: "mock-org", title: "Close Open Audit Findings", urgency: "high", why_it_matters: "Seven open control failures across SOC 2, NIST, and CIS frameworks create regulatory exposure and weaken LP confidence ahead of the April review.", scope: "All frameworks with open findings", cost_range: "$25K - $75K", timeline: "Q2 2026", sort_order: 1, created_at: "", steps: makeSteps("a1", ["Prioritize findings by risk severity", "Assign remediation owners for each finding", "Implement technical controls for critical items", "Schedule re-assessment with auditor", "Document evidence of remediation"]), linked_risk_ids: ["r0", "r2"], steps_completed: 0, is_resolved: false },
  { id: "a2", org_id: "mock-org", title: "Review Cyber Insurance Coverage", urgency: "high", why_it_matters: "Current coverage may not account for AI-related incidents or supply chain attacks. Gaps could leave the fund exposed to uninsured losses.", scope: "Fund-level and portfolio company cyber insurance policies", cost_range: "$10K - $30K", timeline: "Q2 2026", sort_order: 2, created_at: "", steps: makeSteps("a2", ["Gather current policy documents", "Identify coverage gaps for AI and supply chain", "Request quotes from 3+ carriers", "Present recommendations to investment committee"]), linked_risk_ids: [], steps_completed: 0, is_resolved: false },
  { id: "a3", org_id: "mock-org", title: "Implement BC/DR Testing Program", urgency: "medium", why_it_matters: "Only 3 of 7 incident readiness items are complete. Without tested backup and recovery procedures, a ransomware event could cause extended downtime.", scope: "All portfolio companies", cost_range: "$30K - $80K", timeline: "Q3 2026", sort_order: 3, created_at: "", steps: makeSteps("a3", ["Inventory critical systems and RTOs", "Design tabletop exercise scenarios", "Conduct first tabletop exercise", "Test backup restoration procedures", "Document results and remediation plan"]), linked_risk_ids: ["r5"], steps_completed: 0, is_resolved: false },
  { id: "a4", org_id: "mock-org", title: "Deploy AI Monitoring Tools", urgency: "medium", why_it_matters: "Unmonitored AI usage is the fastest-growing risk vector. Real-time monitoring can detect data leakage and unauthorized tool usage before it becomes a material event.", scope: "All portfolio companies with AI tool usage", cost_range: "$40K - $120K", timeline: "Q3 2026", sort_order: 4, created_at: "", steps: makeSteps("a4", ["Evaluate AI monitoring platforms", "Select and procure monitoring solution", "Deploy to highest-risk portfolio companies first", "Configure alerting and reporting dashboards", "Roll out to remaining portfolio companies"]), linked_risk_ids: ["r1", "r4"], steps_completed: 0, is_resolved: false },
];

export const MOCK_AI: AIData = {
  tools: [
    { id: "t0", org_id: "mock-org", name: "GitHub Copilot", status: "approved", usage_level: "high", risk_level: "medium", in_use: true, created_at: "" },
    { id: "t1", org_id: "mock-org", name: "ChatGPT Enterprise", status: "approved", usage_level: "high", risk_level: "medium", in_use: true, created_at: "" },
    { id: "t2", org_id: "mock-org", name: "Grammarly", status: "approved", usage_level: "medium", risk_level: "low", in_use: true, created_at: "" },
    { id: "t3", org_id: "mock-org", name: "Jasper AI", status: "under_review", usage_level: "low", risk_level: "medium", in_use: true, created_at: "" },
    { id: "t4", org_id: "mock-org", name: "Midjourney", status: "under_review", usage_level: "low", risk_level: "low", in_use: true, created_at: "" },
    { id: "t5", org_id: "mock-org", name: "Claude for Business", status: "not_evaluated", usage_level: "none", risk_level: "unknown", in_use: false, created_at: "" },
    { id: "t6", org_id: "mock-org", name: "Stable Diffusion", status: "not_evaluated", usage_level: "none", risk_level: "unknown", in_use: false, created_at: "" },
  ],
  useCases: [
    { id: "uc0", org_id: "mock-org", area: "Code Generation", risk_level: "medium", description: "AI-assisted code writing and review", linked_action_id: "a4", created_at: "", items: [{ id: "i0", use_case_id: "uc0", item_text: "Source code exposure through AI prompts", sort_order: 0 }, { id: "i1", use_case_id: "uc0", item_text: "IP leakage via training data", sort_order: 1 }] },
    { id: "uc1", org_id: "mock-org", area: "Clinical Analysis", risk_level: "high", description: "AI-powered analysis of healthcare data", linked_action_id: "a0", created_at: "", items: [{ id: "i2", use_case_id: "uc1", item_text: "PHI/PII exposure in AI models", sort_order: 0 }, { id: "i3", use_case_id: "uc1", item_text: "HIPAA compliance risks", sort_order: 1 }] },
    { id: "uc2", org_id: "mock-org", area: "Fraud Detection", risk_level: "high", description: "ML models for financial fraud detection", linked_action_id: "a0", created_at: "", items: [{ id: "i4", use_case_id: "uc2", item_text: "Model bias in fraud detection", sort_order: 0 }] },
  ],
  governanceItems: [
    { id: "g0", org_id: "mock-org", item: "Draft AI acceptable use policy", completed: false, target: "Q2 2026", linked_action_id: "a0", sort_order: 0 },
    { id: "g1", org_id: "mock-org", item: "Complete AI tool inventory", completed: false, target: "Q2 2026", linked_action_id: "a0", sort_order: 1 },
    { id: "g2", org_id: "mock-org", item: "Classify all AI use cases by risk", completed: false, target: "Q2 2026", linked_action_id: "a0", sort_order: 2 },
    { id: "g3", org_id: "mock-org", item: "Deploy AI monitoring solution", completed: false, target: "Q3 2026", linked_action_id: "a4", sort_order: 3 },
  ],
  frameworks: [
    { id: "af0", org_id: "mock-org", name: "NIST AI RMF", score: 35, prior_score: 28, description: "AI Risk Management Framework", linked_action_id: "a0", created_at: "" },
    { id: "af1", org_id: "mock-org", name: "NIST CSF 2.0 AI", score: 58, prior_score: 52, description: "Cybersecurity Framework extensions for AI", linked_action_id: "a0", created_at: "" },
    { id: "af2", org_id: "mock-org", name: "CIS v8.1 AI", score: 45, prior_score: 40, description: "CIS controls adapted for AI", linked_action_id: "a4", created_at: "" },
    { id: "af3", org_id: "mock-org", name: "ISO 42001", score: 15, prior_score: 10, description: "AI management systems standard", linked_action_id: null, created_at: "" },
  ],
};

export const MOCK_FUNDS: FundWithDetails[] = [
  {
    id: "f0", org_id: "mock-org", name: "Fund I", vintage: 2018, aum_cents: 120_000_000_000, nav_cents: 98_000_000_000, moic: 1.82, irr: 14.2, deployed_pct: 98, cyber_score: 86, prior_cyber_score: 82, odd_status: "complete", exit_companies: 3, created_at: "", updated_at: "",
    milestones: [
      { id: "m0", fund_id: "f0", phase: "Fundraising", year_range: "2017-2018", finance_activity: "Capital commitments, LP agreements", cyber_overlay: "Cyber due diligence framework established", completed: true, sort_order: 0 },
      { id: "m1", fund_id: "f0", phase: "Investment", year_range: "2018-2021", finance_activity: "Deal sourcing, portfolio construction", cyber_overlay: "Pre-acquisition cyber assessments", completed: true, sort_order: 1 },
      { id: "m2", fund_id: "f0", phase: "Value Creation", year_range: "2021-2025", finance_activity: "Operational improvements, growth", cyber_overlay: "Continuous monitoring, incident response", completed: true, sort_order: 2 },
      { id: "m3", fund_id: "f0", phase: "Harvest", year_range: "2025-2028", finance_activity: "Exit preparation, distributions", cyber_overlay: "Exit-ready cyber posture validation", completed: false, sort_order: 3 },
    ],
    fund_actions: [
      { id: "fa0", fund_id: "f0", action_id: "a1", text: "Close audit findings before exit", target_date: "Q2 2026", sort_order: 0 },
      { id: "fa1", fund_id: "f0", action_id: "a2", text: "Update cyber insurance for exit", target_date: "Q2 2026", sort_order: 1 },
    ],
  },
  {
    id: "f1", org_id: "mock-org", name: "Fund II", vintage: 2021, aum_cents: 280_000_000_000, nav_cents: 245_000_000_000, moic: 1.56, irr: 18.6, deployed_pct: 87, cyber_score: 81, prior_cyber_score: 76, odd_status: "in_progress", exit_companies: 0, created_at: "", updated_at: "",
    milestones: [
      { id: "m4", fund_id: "f1", phase: "Fundraising", year_range: "2020-2021", finance_activity: "Capital commitments", cyber_overlay: "Cyber governance framework design", completed: true, sort_order: 0 },
      { id: "m5", fund_id: "f1", phase: "Investment", year_range: "2021-2024", finance_activity: "Deal sourcing", cyber_overlay: "Pre-acquisition assessments", completed: true, sort_order: 1 },
      { id: "m6", fund_id: "f1", phase: "Value Creation", year_range: "2024-2027", finance_activity: "Operational improvements", cyber_overlay: "Continuous monitoring, remediation", completed: false, sort_order: 2 },
      { id: "m7", fund_id: "f1", phase: "Harvest", year_range: "2027-2031", finance_activity: "Exit preparation", cyber_overlay: "Exit-ready validation", completed: false, sort_order: 3 },
    ],
    fund_actions: [
      { id: "fa2", fund_id: "f1", action_id: "a0", text: "Implement AI governance across portfolio", target_date: "Q2 2026", sort_order: 0 },
      { id: "fa3", fund_id: "f1", action_id: "a3", text: "Establish BC/DR testing program", target_date: "Q3 2026", sort_order: 1 },
    ],
  },
  {
    id: "f2", org_id: "mock-org", name: "Fund III", vintage: 2024, aum_cents: 85_000_000_000, nav_cents: 82_000_000_000, moic: 1.04, irr: null, deployed_pct: 22, cyber_score: 74, prior_cyber_score: null, odd_status: "not_started", exit_companies: 0, created_at: "", updated_at: "",
    milestones: [
      { id: "m8", fund_id: "f2", phase: "Fundraising", year_range: "2023-2024", finance_activity: "Capital commitments", cyber_overlay: "Framework design", completed: true, sort_order: 0 },
      { id: "m9", fund_id: "f2", phase: "Investment", year_range: "2024-2027", finance_activity: "Deal sourcing", cyber_overlay: "Pre-acquisition assessments", completed: false, sort_order: 1 },
      { id: "m10", fund_id: "f2", phase: "Value Creation", year_range: "2027-2030", finance_activity: "Operational improvements", cyber_overlay: "Continuous monitoring", completed: false, sort_order: 2 },
      { id: "m11", fund_id: "f2", phase: "Harvest", year_range: "2030-2034", finance_activity: "Exit preparation", cyber_overlay: "Exit-ready validation", completed: false, sort_order: 3 },
    ],
    fund_actions: [
      { id: "fa4", fund_id: "f2", action_id: "a0", text: "Establish baseline AI governance", target_date: "Q2 2026", sort_order: 0 },
    ],
  },
];
