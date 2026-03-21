-- 008b_seed_empty.sql: Empty org for testing empty states
-- Run this INSTEAD of 008_seed.sql to test empty states

INSERT INTO organizations (id, name, slug, primary_color) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Empty Test Org', 'empty-test', '#E87425');
