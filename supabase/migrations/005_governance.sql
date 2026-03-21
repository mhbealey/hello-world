-- 005_governance.sql: Controls, Policies, IR, Framework Assessments

-- Control status enum
CREATE TYPE control_status AS ENUM ('pass', 'fail');

-- Controls
CREATE TABLE controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  framework text,
  status control_status NOT NULL DEFAULT 'pass',
  risk_amount text,
  linked_action_id uuid REFERENCES actions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Policies
CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  area text NOT NULL,
  covered boolean DEFAULT true,
  document_name text,
  document_url text,
  last_reviewed date,
  overdue boolean DEFAULT false,
  owner_email text,
  created_at timestamptz DEFAULT now()
);

-- IR Checklist
CREATE TABLE ir_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  item text NOT NULL,
  completed boolean DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);

-- Framework Assessments
CREATE TABLE framework_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  framework_name text NOT NULL,
  total_controls int NOT NULL DEFAULT 0,
  effective_controls int NOT NULL DEFAULT 0,
  effectiveness_pct int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_controls_org_id ON controls(org_id);
CREATE INDEX idx_policies_org_id ON policies(org_id);
CREATE INDEX idx_ir_checklist_org_id ON ir_checklist(org_id);
CREATE INDEX idx_framework_assessments_org_id ON framework_assessments(org_id);

-- RLS
ALTER TABLE controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ir_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org controls" ON controls
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org policies" ON policies
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org IR checklist" ON ir_checklist
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org framework assessments" ON framework_assessments
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
