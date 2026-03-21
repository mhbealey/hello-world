-- 007_communication.sql: Advisor Requests and Notifications

-- Advisor request status enum
CREATE TYPE advisor_request_status AS ENUM ('pending', 'confirmed', 'completed');

-- Advisor Requests
CREATE TABLE advisor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  selected_action_ids uuid[] DEFAULT '{}',
  source_context text,
  selected_time text,
  status advisor_request_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('overdue_policy', 'deadline_approaching', 'lp_review', 'advisor_confirmed')),
  title text NOT NULL,
  body text,
  read boolean DEFAULT false,
  link_to text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_advisor_requests_org_id ON advisor_requests(org_id);
CREATE INDEX idx_advisor_requests_user_id ON advisor_requests(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_org_id ON notifications(org_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- RLS
ALTER TABLE advisor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own advisor requests" ON advisor_requests
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Advisors can view org advisor requests" ON advisor_requests
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'advisor'))
  );

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
