-- 008_seed.sql: Complete seed data matching prototype

-- Organization
INSERT INTO organizations (id, name, slug, primary_color) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Crestview Partners', 'crestview', '#E87425');

-- Funds
INSERT INTO funds (id, org_id, name, vintage, aum_cents, nav_cents, moic, irr, deployed_pct, cyber_score, prior_cyber_score, odd_status, exit_companies) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Fund I', 2018, 120000000000, 98000000000, 1.82, 14.2, 98, 86, 82, 'complete', 3),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Fund II', 2021, 280000000000, 245000000000, 1.56, 18.6, 87, 81, 76, 'in_progress', 0),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Fund III', 2024, 85000000000, 82000000000, 1.04, NULL, 22, 74, NULL, 'not_started', 0);

-- Assessment
INSERT INTO assessments (id, org_id, score, prior_score, as_of_date, next_lp_review, days_to_lp, overdue_count, total_ale_cents) VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', 81, 77, '2026-03-17', '2026-04-28', 42, 6, 4680000000);

-- Fund Milestones (4 per fund)
-- Fund I milestones
INSERT INTO fund_milestones (fund_id, phase, year_range, finance_activity, cyber_overlay, completed, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000001', 'Fundraising', '2017-2018', 'Capital commitments, LP agreements', 'Cyber due diligence framework established', true, 1),
  ('00000000-0000-0000-0001-000000000001', 'Investment', '2018-2021', 'Deal sourcing, portfolio construction', 'Pre-acquisition cyber assessments', true, 2),
  ('00000000-0000-0000-0001-000000000001', 'Value Creation', '2021-2025', 'Operational improvements, growth', 'Continuous monitoring, incident response', true, 3),
  ('00000000-0000-0000-0001-000000000001', 'Harvest', '2025-2028', 'Exit preparation, distributions', 'Exit-ready cyber posture validation', false, 4);

-- Fund II milestones
INSERT INTO fund_milestones (fund_id, phase, year_range, finance_activity, cyber_overlay, completed, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000002', 'Fundraising', '2020-2021', 'Capital commitments, LP agreements', 'Cyber governance framework design', true, 1),
  ('00000000-0000-0000-0001-000000000002', 'Investment', '2021-2024', 'Deal sourcing, portfolio construction', 'Pre-acquisition cyber assessments', true, 2),
  ('00000000-0000-0000-0001-000000000002', 'Value Creation', '2024-2027', 'Operational improvements, growth', 'Continuous monitoring, remediation', false, 3),
  ('00000000-0000-0000-0001-000000000002', 'Harvest', '2027-2031', 'Exit preparation, distributions', 'Exit-ready cyber posture validation', false, 4);

-- Fund III milestones
INSERT INTO fund_milestones (fund_id, phase, year_range, finance_activity, cyber_overlay, completed, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000003', 'Fundraising', '2023-2024', 'Capital commitments, LP agreements', 'Cyber governance framework design', true, 1),
  ('00000000-0000-0000-0001-000000000003', 'Investment', '2024-2027', 'Deal sourcing, portfolio construction', 'Pre-acquisition cyber assessments', false, 2),
  ('00000000-0000-0000-0001-000000000003', 'Value Creation', '2027-2030', 'Operational improvements, growth', 'Continuous monitoring, remediation', false, 3),
  ('00000000-0000-0000-0001-000000000003', 'Harvest', '2030-2034', 'Exit preparation, distributions', 'Exit-ready cyber posture validation', false, 4);

-- Risks (6)
INSERT INTO risks (id, org_id, name, ale_cents, plain_english, recommended_response, sort_order) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 'Exit Value Erosion', 1980000000,
    'Without proper cyber governance at portfolio companies, exit valuations could be reduced by $15-25M due to unaddressed security gaps discovered during buyer due diligence.',
    'Implement comprehensive cyber governance framework across all portfolio companies before exit preparation begins.', 1),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 'Data Breach', 680000000,
    'A data breach at any portfolio company could result in regulatory fines, legal costs, and reputational damage averaging $6.8M per incident.',
    'Deploy continuous monitoring and ensure all portfolio companies maintain current incident response plans.', 2),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000001', 'AI Exposure', 650000000,
    'Unmonitored AI tool usage across portfolio companies creates data leakage risk, regulatory exposure, and potential IP compromise.',
    'Establish AI governance policy and deploy monitoring tools across the portfolio.', 3),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000001', 'SEC Enforcement', 580000000,
    'SEC cybersecurity disclosure rules require documented governance. Non-compliance risks enforcement actions and LP confidence erosion.',
    'Close open audit findings and ensure all required documentation is current.', 4),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000001', 'Vendor Compromise', 420000000,
    'Third-party vendor breaches can cascade across portfolio companies sharing common service providers.',
    'Deploy AI-powered vendor monitoring and establish third-party risk management program.', 5),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0000-000000000001', 'Ransomware', 370000000,
    'Ransomware attacks can halt portfolio company operations for weeks, destroying value and triggering insurance claims.',
    'Implement business continuity and disaster recovery testing program across the portfolio.', 6);

-- Actions (5)
INSERT INTO actions (id, org_id, title, urgency, why_it_matters, scope, cost_range, timeline, sort_order) VALUES
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0000-000000000001', 'Establish AI Governance Policy', 'critical',
    'AI tools are being adopted across portfolio companies without oversight. This creates data leakage, regulatory, and IP risks that could materially impact fund returns.',
    'All portfolio companies using or evaluating AI tools',
    '$50K - $150K', 'Q2 2026', 1),
  ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0000-000000000001', 'Close Open Audit Findings', 'high',
    'Seven open control failures across SOC 2, NIST, and CIS frameworks create regulatory exposure and weaken LP confidence ahead of the April review.',
    'All frameworks with open findings',
    '$25K - $75K', 'Q2 2026', 2),
  ('00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0000-000000000001', 'Review Cyber Insurance Coverage', 'high',
    'Current coverage may not account for AI-related incidents or supply chain attacks. Gaps could leave the fund exposed to uninsured losses.',
    'Fund-level and portfolio company cyber insurance policies',
    '$10K - $30K', 'Q2 2026', 3),
  ('00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0000-000000000001', 'Implement BC/DR Testing Program', 'medium',
    'Only 3 of 7 incident readiness items are complete. Without tested backup and recovery procedures, a ransomware event could cause extended downtime.',
    'All portfolio companies',
    '$30K - $80K', 'Q3 2026', 4),
  ('00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0000-000000000001', 'Deploy AI Monitoring Tools', 'medium',
    'Unmonitored AI usage is the fastest-growing risk vector. Real-time monitoring can detect data leakage and unauthorized tool usage before it becomes a material event.',
    'All portfolio companies with AI tool usage',
    '$40K - $120K', 'Q3 2026', 5);

-- Action Steps (5 + 5 + 4 + 5 + 5 = 24 steps)
-- a0: AI Governance Policy (5 steps)
INSERT INTO action_steps (id, action_id, step_text, sort_order) VALUES
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0004-000000000001', 'Draft AI acceptable use policy', 1),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0004-000000000001', 'Inventory all AI tools in use across portfolio', 2),
  ('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0004-000000000001', 'Classify AI use cases by risk level', 3),
  ('00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0004-000000000001', 'Establish AI vendor evaluation criteria', 4),
  ('00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0004-000000000001', 'Roll out policy to all portfolio companies', 5);

-- a1: Close Audit Findings (5 steps)
INSERT INTO action_steps (id, action_id, step_text, sort_order) VALUES
  ('00000000-0000-0000-0005-000000000006', '00000000-0000-0000-0004-000000000002', 'Prioritize findings by risk severity', 1),
  ('00000000-0000-0000-0005-000000000007', '00000000-0000-0000-0004-000000000002', 'Assign remediation owners for each finding', 2),
  ('00000000-0000-0000-0005-000000000008', '00000000-0000-0000-0004-000000000002', 'Implement technical controls for critical items', 3),
  ('00000000-0000-0000-0005-000000000009', '00000000-0000-0000-0004-000000000002', 'Schedule re-assessment with auditor', 4),
  ('00000000-0000-0000-0005-000000000010', '00000000-0000-0000-0004-000000000002', 'Document evidence of remediation', 5);

-- a2: Insurance Review (4 steps)
INSERT INTO action_steps (id, action_id, step_text, sort_order) VALUES
  ('00000000-0000-0000-0005-000000000011', '00000000-0000-0000-0004-000000000003', 'Gather current policy documents', 1),
  ('00000000-0000-0000-0005-000000000012', '00000000-0000-0000-0004-000000000003', 'Identify coverage gaps for AI and supply chain', 2),
  ('00000000-0000-0000-0005-000000000013', '00000000-0000-0000-0004-000000000003', 'Request quotes from 3+ carriers', 3),
  ('00000000-0000-0000-0005-000000000014', '00000000-0000-0000-0004-000000000003', 'Present recommendations to investment committee', 4);

-- a3: BC/DR Testing (5 steps)
INSERT INTO action_steps (id, action_id, step_text, sort_order) VALUES
  ('00000000-0000-0000-0005-000000000015', '00000000-0000-0000-0004-000000000004', 'Inventory critical systems and RTOs', 1),
  ('00000000-0000-0000-0005-000000000016', '00000000-0000-0000-0004-000000000004', 'Design tabletop exercise scenarios', 2),
  ('00000000-0000-0000-0005-000000000017', '00000000-0000-0000-0004-000000000004', 'Conduct first tabletop exercise', 3),
  ('00000000-0000-0000-0005-000000000018', '00000000-0000-0000-0004-000000000004', 'Test backup restoration procedures', 4),
  ('00000000-0000-0000-0005-000000000019', '00000000-0000-0000-0004-000000000004', 'Document results and remediation plan', 5);

-- a4: AI Monitoring (5 steps)
INSERT INTO action_steps (id, action_id, step_text, sort_order) VALUES
  ('00000000-0000-0000-0005-000000000020', '00000000-0000-0000-0004-000000000005', 'Evaluate AI monitoring platforms', 1),
  ('00000000-0000-0000-0005-000000000021', '00000000-0000-0000-0004-000000000005', 'Select and procure monitoring solution', 2),
  ('00000000-0000-0000-0005-000000000022', '00000000-0000-0000-0004-000000000005', 'Deploy to highest-risk portfolio companies first', 3),
  ('00000000-0000-0000-0005-000000000023', '00000000-0000-0000-0004-000000000005', 'Configure alerting and reporting dashboards', 4),
  ('00000000-0000-0000-0005-000000000024', '00000000-0000-0000-0004-000000000005', 'Roll out to remaining portfolio companies', 5);

-- Action-Risk Links
-- r0 (Exit Value) → a1 (Close Findings)
-- r1 (Data Breach) → a0 (AI Governance) + a4 (AI Monitoring)
-- r2 (AI Exposure) → a1 (Close Findings)
-- r3 (SEC) → a0 (AI Governance)
-- r4 (Vendor) → a4 (AI Monitoring)
-- r5 (Ransomware) → a3 (BC/DR)
INSERT INTO action_risk_links (risk_id, action_id) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0004-000000000002'),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0004-000000000002'),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0004-000000000004');

-- Controls (12: 5 pass, 7 fail)
INSERT INTO controls (org_id, name, framework, status, risk_amount, linked_action_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Access Control Policy', 'SOC 2', 'pass', NULL, NULL),
  ('00000000-0000-0000-0000-000000000001', 'Encryption at Rest', 'SOC 2', 'pass', NULL, NULL),
  ('00000000-0000-0000-0000-000000000001', 'Incident Response Plan', 'NIST CSF', 'pass', NULL, NULL),
  ('00000000-0000-0000-0000-000000000001', 'Vulnerability Scanning', 'CIS', 'pass', NULL, NULL),
  ('00000000-0000-0000-0000-000000000001', 'Network Segmentation', 'NIST CSF', 'pass', NULL, NULL),
  ('00000000-0000-0000-0000-000000000001', 'AI Tool Inventory', 'NIST CSF', 'fail', '$6.5M', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0000-000000000001', 'Data Classification', 'SOC 2', 'fail', '$4.2M', '00000000-0000-0000-0004-000000000002'),
  ('00000000-0000-0000-0000-000000000001', 'Vendor Risk Assessment', 'CIS', 'fail', '$4.2M', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0000-000000000001', 'BC/DR Testing', 'NIST CSF', 'fail', '$3.7M', '00000000-0000-0000-0004-000000000004'),
  ('00000000-0000-0000-0000-000000000001', 'AI Governance Framework', 'NIST CSF', 'fail', '$6.5M', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0000-000000000001', 'Third-Party Monitoring', 'CIS', 'fail', '$4.2M', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0000-000000000001', 'Cyber Insurance Review', 'SOC 2', 'fail', '$5.8M', '00000000-0000-0000-0004-000000000003');

-- Policies (10: 9 covered, 1 gap, 3 overdue)
INSERT INTO policies (org_id, area, covered, document_name, last_reviewed, overdue, owner_email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Information Security', true, 'InfoSec Policy v3.2', '2026-02-15', false, 'ciso@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Acceptable Use', true, 'AUP v2.1', '2026-01-20', false, 'ciso@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Data Privacy', true, 'Privacy Policy v4.0', '2025-12-10', true, 'dpo@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Incident Response', true, 'IR Plan v2.5', '2026-03-01', false, 'ciso@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Business Continuity', true, 'BCP v1.8', '2025-11-05', true, 'coo@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Vendor Management', true, 'Vendor Policy v2.0', '2026-02-28', false, 'procurement@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Access Control', true, 'Access Control v3.0', '2026-01-15', false, 'it@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Change Management', true, 'Change Mgmt v2.3', '2025-10-20', true, 'it@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'Encryption', true, 'Encryption Standards v1.5', '2026-03-10', false, 'ciso@crestview.com'),
  ('00000000-0000-0000-0000-000000000001', 'AI Governance', false, NULL, NULL, false, NULL);

-- IR Checklist (7: 3 done, 4 not)
INSERT INTO ir_checklist (org_id, item, completed, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Incident response team identified', true, 1),
  ('00000000-0000-0000-0000-000000000001', 'Communication plan documented', true, 2),
  ('00000000-0000-0000-0000-000000000001', 'Escalation procedures defined', true, 3),
  ('00000000-0000-0000-0000-000000000001', 'Tabletop exercise conducted', false, 4),
  ('00000000-0000-0000-0000-000000000001', 'Backup restoration tested', false, 5),
  ('00000000-0000-0000-0000-000000000001', 'Forensics retainer in place', false, 6),
  ('00000000-0000-0000-0000-000000000001', 'Regulatory notification process documented', false, 7);

-- Framework Assessments (3)
INSERT INTO framework_assessments (org_id, framework_name, total_controls, effective_controls, effectiveness_pct) VALUES
  ('00000000-0000-0000-0000-000000000001', 'SOC 2', 68, 62, 91),
  ('00000000-0000-0000-0000-000000000001', 'NIST CSF', 52, 44, 85),
  ('00000000-0000-0000-0000-000000000001', 'CIS v8.1', 43, 36, 84);

-- AI Tools (7: 5 in use, 2 not evaluated)
INSERT INTO ai_tools (org_id, name, status, usage_level, risk_level, in_use) VALUES
  ('00000000-0000-0000-0000-000000000001', 'GitHub Copilot', 'approved', 'high', 'medium', true),
  ('00000000-0000-0000-0000-000000000001', 'ChatGPT Enterprise', 'approved', 'high', 'medium', true),
  ('00000000-0000-0000-0000-000000000001', 'Grammarly', 'approved', 'medium', 'low', true),
  ('00000000-0000-0000-0000-000000000001', 'Jasper AI', 'under_review', 'low', 'medium', true),
  ('00000000-0000-0000-0000-000000000001', 'Midjourney', 'under_review', 'low', 'low', true),
  ('00000000-0000-0000-0000-000000000001', 'Claude for Business', 'not_evaluated', 'none', 'unknown', false),
  ('00000000-0000-0000-0000-000000000001', 'Stable Diffusion', 'not_evaluated', 'none', 'unknown', false);

-- AI Use Cases (6)
INSERT INTO ai_use_cases (id, org_id, area, risk_level, description, linked_action_id) VALUES
  ('00000000-0000-0000-0006-000000000001', '00000000-0000-0000-0000-000000000001', 'Code Generation', 'medium', 'AI-assisted code writing and review across development teams', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0006-000000000002', '00000000-0000-0000-0000-000000000001', 'Customer Support', 'medium', 'AI chatbots and automated response systems for client interactions', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0006-000000000003', '00000000-0000-0000-0000-000000000001', 'Clinical Analysis', 'high', 'AI-powered analysis of healthcare data in portfolio companies', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0006-000000000004', '00000000-0000-0000-0000-000000000001', 'Fraud Detection', 'high', 'Machine learning models for financial fraud detection', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0006-000000000005', '00000000-0000-0000-0000-000000000001', 'Identity Verification', 'high', 'AI-based KYC and identity verification systems', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0006-000000000006', '00000000-0000-0000-0000-000000000001', 'Content Generation', 'low', 'Marketing and communications content creation', NULL);

-- AI Use Case Items
INSERT INTO ai_use_case_items (use_case_id, item_text, sort_order) VALUES
  ('00000000-0000-0000-0006-000000000001', 'Source code exposure through AI prompts', 1),
  ('00000000-0000-0000-0006-000000000001', 'Intellectual property leakage via training data', 2),
  ('00000000-0000-0000-0006-000000000001', 'Dependency on AI-generated code quality', 3),
  ('00000000-0000-0000-0006-000000000002', 'Customer data exposure in AI processing', 1),
  ('00000000-0000-0000-0006-000000000002', 'Inaccurate responses creating liability', 2),
  ('00000000-0000-0000-0006-000000000003', 'PHI/PII exposure in AI models', 1),
  ('00000000-0000-0000-0006-000000000003', 'HIPAA compliance risks', 2),
  ('00000000-0000-0000-0006-000000000003', 'Clinical decision support accuracy', 3),
  ('00000000-0000-0000-0006-000000000004', 'Model bias in fraud detection', 1),
  ('00000000-0000-0000-0006-000000000004', 'False positive impact on customers', 2),
  ('00000000-0000-0000-0006-000000000005', 'Biometric data handling compliance', 1),
  ('00000000-0000-0000-0006-000000000005', 'Deepfake vulnerability in verification', 2),
  ('00000000-0000-0000-0006-000000000006', 'Brand reputation from AI-generated content', 1),
  ('00000000-0000-0000-0006-000000000006', 'Copyright and IP considerations', 2);

-- AI Governance Roadmap Items (8)
INSERT INTO ai_governance_items (org_id, item, completed, target, linked_action_id, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Draft AI acceptable use policy', false, 'Q2 2026', '00000000-0000-0000-0004-000000000001', 1),
  ('00000000-0000-0000-0000-000000000001', 'Complete AI tool inventory', false, 'Q2 2026', '00000000-0000-0000-0004-000000000001', 2),
  ('00000000-0000-0000-0000-000000000001', 'Classify all AI use cases by risk', false, 'Q2 2026', '00000000-0000-0000-0004-000000000001', 3),
  ('00000000-0000-0000-0000-000000000001', 'Deploy AI monitoring solution', false, 'Q3 2026', '00000000-0000-0000-0004-000000000005', 4),
  ('00000000-0000-0000-0000-000000000001', 'Establish AI vendor evaluation criteria', false, 'Q2 2026', '00000000-0000-0000-0004-000000000001', 5),
  ('00000000-0000-0000-0000-000000000001', 'Conduct AI risk assessment', false, 'Q3 2026', NULL, 6),
  ('00000000-0000-0000-0000-000000000001', 'Train staff on AI governance', false, 'Q3 2026', NULL, 7),
  ('00000000-0000-0000-0000-000000000001', 'Achieve ISO 42001 readiness', false, 'Q4 2026', NULL, 8);

-- AI Frameworks (4)
INSERT INTO ai_frameworks (org_id, name, score, prior_score, description, linked_action_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NIST AI RMF', 35, 28, 'AI Risk Management Framework for identifying and mitigating AI-specific risks', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0000-000000000001', 'NIST CSF 2.0 AI', 58, 52, 'Cybersecurity Framework extensions for AI system governance', '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0000-000000000001', 'CIS v8.1 AI', 45, 40, 'Center for Internet Security controls adapted for AI environments', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0000-000000000001', 'ISO 42001', 15, 10, 'International standard for AI management systems', NULL);

-- Fund Actions
-- Fund I
INSERT INTO fund_actions (fund_id, action_id, text, target_date, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0004-000000000002', 'Close audit findings before exit', 'Q2 2026', 1),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0004-000000000003', 'Update cyber insurance for exit', 'Q2 2026', 2),
  ('00000000-0000-0000-0001-000000000001', NULL, 'Conduct buyer-ready cyber assessment', 'Q3 2026', 3),
  ('00000000-0000-0000-0001-000000000001', NULL, 'Prepare cyber disclosure package', 'Q3 2026', 4);

-- Fund II
INSERT INTO fund_actions (fund_id, action_id, text, target_date, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0004-000000000001', 'Implement AI governance across portfolio', 'Q2 2026', 1),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0004-000000000004', 'Establish BC/DR testing program', 'Q3 2026', 2),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0004-000000000005', 'Deploy AI monitoring tools', 'Q3 2026', 3),
  ('00000000-0000-0000-0001-000000000002', NULL, 'Complete ODD cyber assessment', 'Q2 2026', 4);

-- Fund III
INSERT INTO fund_actions (fund_id, action_id, text, target_date, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0004-000000000001', 'Establish baseline AI governance', 'Q2 2026', 1),
  ('00000000-0000-0000-0001-000000000003', NULL, 'Conduct initial cyber assessment', 'Q2 2026', 2),
  ('00000000-0000-0000-0001-000000000003', NULL, 'Set up monitoring infrastructure', 'Q3 2026', 3),
  ('00000000-0000-0000-0001-000000000003', NULL, 'Define cyber governance roadmap', 'Q2 2026', 4);
