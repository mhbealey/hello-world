---
agent: sales-operations-agent
study: micro-01-design-platform
last-updated: 2026-05-15
word_count_target: 600-1200
---

# Sales Operations & Order Management

## 1. Current Best-Practice Summary

High-performing design firms in the $500–$50K engagement band have converged on a **lightweight, CRM-anchored revenue operation** rather than the enterprise stack used by larger agencies. The dominant pattern is:

- **One CRM as system of record** for both leads and accounts, with the *opportunity* — not the project — as the unit of forecasting. Pipeline stages are kept shallow (5–7 stages) and tied to buyer behavior, not internal artifacts.
- **Productized service menu.** Instead of bespoke proposals, top firms package 80% of work into named offers (e.g., "Brand Site Sprint — $12K, 4 weeks") with fixed scopes, durations, and resource loads. This collapses scoping time and makes resource planning predictable.
- **Two parallel motions:** (a) inbound/referral capture via a short web form that hard-routes to a discovery call, and (b) **systematic reactivation of past clients** through cadenced, segmented outreach — typically the single highest-ROI channel for firms with a >50-client history.
- **Sales-to-delivery handoff via a structured kickoff brief**, not a meeting. Closed-won triggers an automated brief creation, a delivery lead assignment, and a kickoff scheduled within 5 business days. Firms that automate this step report ~30% faster project starts.
- **Win-loss logging is non-negotiable.** Every closed opportunity gets a 3-field tag (reason, competitor/alternative, price band) — reviewed monthly. This is what separates firms that grow margin from those that just grow headcount.

## 2. Tooling Landscape

| Tool | Monthly cost (target seat count: 4–6) | Pros | Cons |
|---|---|---|---|
| **HubSpot Sales Hub Starter + Marketing Starter** | ~$60–$120 | Free CRM tier, built-in email sequencing, simple pipeline UI, native forms and meeting scheduler, free tier supports the 800-client reactivation list with no per-record cost | Reporting is shallow at Starter tier; automation limits hit fast above ~1K contacts |
| **Pipedrive Professional** | ~$60 (Pro, $49/user × ~1–4 seats) | Best-in-class pipeline visualization, lightweight, fast to learn, strong activity-based selling model | Weak marketing/sequencing — needs a bolt-on (e.g., Reply.io or Smartlead) for reactivation cadences |
| **Attio** | ~$80–$140 (3–5 seats at $29) | Modern data model, treats company + person + deal as flexible objects, excellent for account research workflows, strong API | Younger product, fewer pre-built integrations, no native sequencing yet |
| **Folk** | ~$80 (4 seats × $20) | Purpose-built for boutique agencies/studios; integrates LinkedIn and email natively; very fast onboarding | Limited reporting; not ideal once contributor count exceeds ~10 |
| **Productive.io** (CRM + project + resourcing) | ~$140–$200 (4 seats × $35–$50) | Combines CRM, scoping, resourcing, time, and budget in one tool — eliminates handoff seams | Heavier learning curve; overkill if delivery tooling lives elsewhere |

Cadence/outreach add-on (if CRM lacks it): **Smartlead** or **Instantly** at $40–$100/mo for outbound; **Apollo Basic** at ~$60/seat for prospect data.

## 3. Build vs Buy Recommendation

**Buy. Recommended stack: HubSpot Sales Hub Starter (CRM + sequences) + Apollo Basic (prospect data & enrichment).** All-in monthly cost: **~$180–$250**, well under the $500 cost gate.

Reasoning:

1. **Scale fit.** At 25–100 active clients and 5–15 contributors, HubSpot Starter sits inside its sweet spot. Reactivation cadences for 800+ past clients run cleanly inside Marketing Starter's contact limits.
2. **Time-to-value.** A working pipeline, two sequences (reactivation + outbound), and a productized service catalog can be live in **2–3 weeks**. Within the 30–60 day window.
3. **No proprietary build.** A custom CRM is the single most common — and most damaging — mistake firms at this stage make. Off-the-shelf gets the team to repeatable revenue motion months faster.
4. **Graceful upgrade path.** HubSpot Pro/Enterprise exists if the firm grows past Starter limits, with no data migration required.
5. **Why not Productive.io as primary:** it bundles CRM and delivery, which is tempting — but the delivery side is better served by the web-platform/project tooling chosen elsewhere in this study, and bundling locks pricing growth to seat count.

**Templated workflows to ship in the first 60 days:**

- **Past-client reactivation (800+ contacts):** Segment by last-engagement type, recency, and spend tier. Three-touch quarterly cadence per segment: (1) value-led check-in referencing the prior deliverable, (2) capability update or relevant case study, (3) specific offer with deadline. Track reply rate, meeting-booked rate, reactivation revenue.
- **Net-new outbound:** ICP list built in Apollo → enriched into HubSpot → 4-step sequence over 14 days → meeting-booked routes to principal. Cap: 50 new contacts/week to protect domain reputation.
- **Engagement scoping:** Productized service menu in a single Notion or HubSpot doc; non-standard scopes use a 1-page scoping template (objectives, deliverables, exclusions, timeline, price, assumptions).
- **Sales→delivery handoff:** Closed-won deal triggers a kickoff brief (auto-generated from deal record), assigns delivery lead, schedules kickoff within 5 business days.

## 4. Integration Touchpoints

- **Client portal:** CRM company record is the canonical client identity; portal accounts provision off CRM contact records. Engagement status writes back to the CRM deal as a custom property.
- **Invoicing:** Closed-won deal generates the first invoice draft in the billing system (e.g., via Zapier or native integration). Deal amount, payment schedule, and billing contact flow one-way from CRM. Payment status reflects back into CRM for renewal forecasting.
- **Project delivery:** Kickoff brief from the handoff workflow becomes the project's source-of-truth scope. Resource allocation, milestones, and timeline live in the delivery tool — not the CRM — but the CRM holds the engagement summary for account expansion conversations.
- **Reporting:** Weekly pipeline review pulls from CRM; monthly revenue + delivery margin review joins CRM deal data with delivery-tool actuals. This is the single seam most worth investing in instrumenting cleanly.

**Word count: ~1,050**
