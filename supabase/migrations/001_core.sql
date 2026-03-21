-- 001_core.sql: Organizations and Users

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#E87425',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'advisor', 'viewer', 'lp_readonly')),
  notification_prefs jsonb DEFAULT '{"email_digest": true, "overdue_alerts": true, "deadline_alerts": true}',
  last_active_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org" ON organizations
  FOR SELECT USING (id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own org members" ON users
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can insert users in own org" ON users
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update users in own org" ON users
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete users in own org" ON users
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'admin')
  );
