-- 004_tracking.sql: Step Completions, Resolutions, Audit Log

-- Step completions
CREATE TABLE step_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES action_steps(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE (user_id, step_id)
);

-- Resolutions
CREATE TABLE resolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  resolved_at timestamptz DEFAULT now(),
  undone boolean DEFAULT false,
  undone_at timestamptz
);

CREATE INDEX idx_resolutions_action_undone ON resolutions(action_id, undone);

-- Audit log
CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_log_org_id ON audit_log(org_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Audit log trigger function
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF TG_OP = 'DELETE' THEN
    -- Try to get org_id from old record
    IF TG_TABLE_NAME = 'resolutions' OR TG_TABLE_NAME = 'step_completions' THEN
      SELECT org_id INTO v_org_id FROM users WHERE id = OLD.user_id;
    END IF;
    INSERT INTO audit_log (org_id, user_id, table_name, record_id, action, old_data)
    VALUES (COALESCE(v_org_id, '00000000-0000-0000-0000-000000000000'), v_user_id, TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF TG_TABLE_NAME = 'resolutions' OR TG_TABLE_NAME = 'step_completions' THEN
      SELECT org_id INTO v_org_id FROM users WHERE id = NEW.user_id;
    END IF;
    INSERT INTO audit_log (org_id, user_id, table_name, record_id, action, old_data, new_data)
    VALUES (COALESCE(v_org_id, '00000000-0000-0000-0000-000000000000'), v_user_id, TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'resolutions' OR TG_TABLE_NAME = 'step_completions' THEN
      SELECT org_id INTO v_org_id FROM users WHERE id = NEW.user_id;
    END IF;
    INSERT INTO audit_log (org_id, user_id, table_name, record_id, action, new_data)
    VALUES (COALESCE(v_org_id, '00000000-0000-0000-0000-000000000000'), v_user_id, TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit triggers
CREATE TRIGGER audit_resolutions
  AFTER INSERT OR UPDATE OR DELETE ON resolutions
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_step_completions
  AFTER INSERT OR UPDATE OR DELETE ON step_completions
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- RLS
ALTER TABLE step_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own step completions" ON step_completions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own resolutions" ON resolutions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Advisors can view org step completions" ON step_completions
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'advisor')
    ))
  );

CREATE POLICY "Advisors can view org resolutions" ON resolutions
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'advisor')
    ))
  );

CREATE POLICY "Admins can view org audit log" ON audit_log
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'admin')
  );
