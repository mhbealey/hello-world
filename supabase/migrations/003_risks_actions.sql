-- 003_risks_actions.sql: Risks, Actions, Steps, Links

-- Urgency enum
CREATE TYPE urgency_level AS ENUM ('critical', 'high', 'medium', 'low');

-- Risks
CREATE TABLE risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  ale_cents bigint NOT NULL DEFAULT 0,
  plain_english text,
  recommended_response text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Actions
CREATE TABLE actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'medium',
  why_it_matters text,
  scope text,
  cost_range text,
  timeline text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Action steps
CREATE TABLE action_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  step_text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

-- Action-Risk links (M2M)
CREATE TABLE action_risk_links (
  action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  risk_id uuid NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
  PRIMARY KEY (action_id, risk_id)
);

-- Fund actions
CREATE TABLE fund_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  action_id uuid REFERENCES actions(id) ON DELETE SET NULL,
  text text NOT NULL,
  target_date text,
  sort_order int NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX idx_risks_org_id ON risks(org_id);
CREATE INDEX idx_actions_org_id ON actions(org_id);
CREATE INDEX idx_action_steps_action_id ON action_steps(action_id);
CREATE INDEX idx_action_risk_links_risk_id ON action_risk_links(risk_id);
CREATE INDEX idx_action_risk_links_action_id ON action_risk_links(action_id);
CREATE INDEX idx_fund_actions_fund_id ON fund_actions(fund_id);

-- RLS
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_risk_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org risks" ON risks
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org actions" ON actions
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org action steps" ON action_steps
  FOR SELECT USING (action_id IN (SELECT id FROM actions WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can view own org action risk links" ON action_risk_links
  FOR SELECT USING (action_id IN (SELECT id FROM actions WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can view own org fund actions" ON fund_actions
  FOR SELECT USING (fund_id IN (SELECT id FROM funds WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())));
