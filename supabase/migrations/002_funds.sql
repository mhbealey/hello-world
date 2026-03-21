-- 002_funds.sql: Funds, Milestones, Assessments

-- ODD status enum
CREATE TYPE odd_status AS ENUM ('complete', 'in_progress', 'not_started');

-- Funds
CREATE TABLE funds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  vintage int NOT NULL,
  aum_cents bigint NOT NULL DEFAULT 0,
  nav_cents bigint NOT NULL DEFAULT 0,
  moic decimal(5,2),
  irr decimal(5,2),
  deployed_pct int DEFAULT 0,
  cyber_score int CHECK (cyber_score >= 0 AND cyber_score <= 100),
  prior_cyber_score int,
  odd_status odd_status DEFAULT 'not_started',
  exit_companies int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fund milestones
CREATE TABLE fund_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  phase text NOT NULL,
  year_range text,
  finance_activity text,
  cyber_overlay text,
  completed boolean DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);

-- Assessments
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  fund_id uuid REFERENCES funds(id) ON DELETE SET NULL,
  score int CHECK (score >= 0 AND score <= 100),
  prior_score int,
  as_of_date date NOT NULL DEFAULT CURRENT_DATE,
  next_lp_review date,
  days_to_lp int,
  overdue_count int DEFAULT 0,
  total_ale_cents bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_funds_org_id ON funds(org_id);
CREATE INDEX idx_fund_milestones_fund_id ON fund_milestones(fund_id);
CREATE INDEX idx_assessments_org_id ON assessments(org_id);
CREATE INDEX idx_assessments_fund_id ON assessments(fund_id);

-- Updated_at trigger for funds
CREATE TRIGGER funds_updated_at
  BEFORE UPDATE ON funds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org funds" ON funds
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org milestones" ON fund_milestones
  FOR SELECT USING (fund_id IN (SELECT id FROM funds WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can view own org assessments" ON assessments
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
