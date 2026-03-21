-- 006_ai.sql: AI Governance Tables

-- AI tool status enum
CREATE TYPE ai_tool_status AS ENUM ('approved', 'under_review', 'not_evaluated');

-- AI usage level enum
CREATE TYPE ai_usage_level AS ENUM ('high', 'medium', 'low', 'none');

-- AI risk level enum
CREATE TYPE ai_risk_level AS ENUM ('high', 'medium', 'low', 'unknown');

-- AI Tools
CREATE TABLE ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  status ai_tool_status DEFAULT 'not_evaluated',
  usage_level ai_usage_level DEFAULT 'none',
  risk_level ai_risk_level DEFAULT 'unknown',
  in_use boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- AI Use Cases
CREATE TABLE ai_use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  area text NOT NULL,
  risk_level ai_risk_level DEFAULT 'unknown',
  description text,
  linked_action_id uuid REFERENCES actions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- AI Use Case Items
CREATE TABLE ai_use_case_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  use_case_id uuid NOT NULL REFERENCES ai_use_cases(id) ON DELETE CASCADE,
  item_text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

-- AI Governance Items (roadmap)
CREATE TABLE ai_governance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  item text NOT NULL,
  completed boolean DEFAULT false,
  target text,
  linked_action_id uuid REFERENCES actions(id) ON DELETE SET NULL,
  sort_order int NOT NULL DEFAULT 0
);

-- AI Frameworks
CREATE TABLE ai_frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  score int DEFAULT 0,
  prior_score int,
  description text,
  linked_action_id uuid REFERENCES actions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ai_tools_org_id ON ai_tools(org_id);
CREATE INDEX idx_ai_use_cases_org_id ON ai_use_cases(org_id);
CREATE INDEX idx_ai_use_case_items_use_case_id ON ai_use_case_items(use_case_id);
CREATE INDEX idx_ai_governance_items_org_id ON ai_governance_items(org_id);
CREATE INDEX idx_ai_frameworks_org_id ON ai_frameworks(org_id);

-- RLS
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_use_case_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_governance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_frameworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org AI tools" ON ai_tools
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org AI use cases" ON ai_use_cases
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org AI use case items" ON ai_use_case_items
  FOR SELECT USING (use_case_id IN (SELECT id FROM ai_use_cases WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can view own org AI governance items" ON ai_governance_items
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org AI frameworks" ON ai_frameworks
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
