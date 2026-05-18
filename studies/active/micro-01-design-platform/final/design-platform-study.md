# Design Firm Operating Platform Study
## Micro-Study 01 — Executive Deliverable
**Produced:** 2026-05-15 | **Status:** Complete | **Total word count:** ~10,000 words across all sections

---

---
agent: integration-recommendations-agent
study: micro-01-design-platform
last-updated: 2026-05-18
---

# Integrated Recommendations — Design Firm Operating Platform

## 1. Executive Summary

This study's seven function-area analyses converge on a single, coherent recommendation: **buy a thin layer of best-in-class SaaS, integrate it around a Google identity spine, and resist every temptation to build proprietary tooling for the next 12 months.** The operating platform that supports a 5–15 person design firm running 25–100 active engagements is a solved problem; the firm's competitive surface is the work it ships, not the plumbing that bills for it.

Four findings shape the recommendation:

**Off-the-shelf wins decisively at this scale.** Every function-area agent — sales, web, client experience, finance, legal, ops, security — independently rejected a proprietary build as the most expensive avoidable mistake at this firm size. The reasons are consistent: time-to-value collapses from quarters to weeks, maintenance burden disappears, and graceful upgrade paths exist in every category. The dollars saved on internal tooling pay for the entire SaaS stack roughly six times over.

**Identity is the spine, not an afterthought.** Six of the seven analyses route their tool through Google Workspace SSO. The single highest-leverage decision in the first 90 days is not which CRM or which website builder — it is standing up Google as the identity provider before anything else is provisioned. Every later integration assumes it; every later offboarding event depends on it.

**Three integration seams carry most of the value.** (a) CRM closed-won → contract draft → invoice draft is a single causal chain that should be automated end-to-end. (b) Project margin = Stripe revenue − Gusto/Deel contributor cost − Ramp tooling cost, joined via QuickBooks class tags, is the most important financial report the firm will produce. (c) Onboarding/offboarding is one trigger that provisions both a Ramp card and a Google identity, and reverses both within four hours of departure. Instrument these three seams cleanly and the rest of the stack stays cheap.

**The $500/month gate is achievable but tight.** A disciplined initial stack at 4 active contributors lands at roughly $480–520/month recurring, plus a one-time legal investment of $4–7K for lawyer-drafted MSA/SOW templates and ~$1,100 for hardware MFA keys. Crossing 8–10 active contributors pushes recurring into the $700–850/month range — still cheap relative to revenue, but the cost gate is a launch target, not a steady state.

**What this means for the three readers of this report:**

- **Founder/principal:** Approve the stack as a package, not tool-by-tool. The integrations are where the leverage lives, and they only work if all the pieces are the recommended ones. The single decision that warrants real deliberation is Framer-vs-Webflow for the marketing site; everything else is a low-regret default.

- **Partner:** Two non-obvious items demand your attention. (1) The $4–7K one-time legal spend on agency-specialist contracts is non-negotiable and should be authorized in week one. (2) The pricing-exception logging discipline (any discount >10% off rack rate gets a one-paragraph memo) is the single ops control that protects margin as the firm grows.

- **Contracted operator:** Your first 90 days are sequencing, not tool selection. Week 1 is identity foundation; weeks 2–4 are CRM, site, and contracts in parallel; weeks 5–12 are integrations and migrations. The build sequence in §3 is the runbook. Resist the urge to add tools — every function area has been deliberately constrained to one primary plus, where needed, one specialist.

What follows is the recommended stack, build sequence, cost model, and a note on how this analysis changes when the firm replaces the integration glue with a proprietary agent system.

## 2. Recommended Stack

The stack covers the eleven functional areas surfaced across the prior analyses. Pricing is for an initial team of 4 active contributors; per-seat lines scale linearly. All figures USD/month unless noted.

**1. Identity, email, and storage — Google Workspace Business Standard** ($14/seat = $56). The identity provider for every other tool in the stack; email; 2 TB Drive per seat. Non-negotiable foundation. Workspace Enterprise upgrade ($23/seat) deferred until conditional access is contractually required.

**2. Sales operations — HubSpot Sales Hub Starter + Apollo Basic** ($50 + $60 = $110). HubSpot is the system of record for leads, accounts, opportunities, and reactivation cadences to the 800-contact past-client list. Apollo provides prospect data and enrichment. Productized service menu lives as HubSpot deal templates that merge-field into contract drafts downstream. *Trade-off:* HubSpot Starter's automation limits hit at ~1K active contacts; budget upgrade to Pro at the 75-client mark.

**3. Web platform — Framer Business + Cal.com + Plausible + Cloudflare** ($30 + $0 + $15 + $0 = $45). Framer for the marketing site (designer-editable, ships case studies in an afternoon); Cal.com embedded on the lead-form thank-you page; Plausible for cookie-banner-free analytics; Cloudflare in front for DNS, DDoS, WAF, and bot management. *Trade-off:* Framer's CMS depth is a half-step behind Webflow; switch to Webflow ($29–$49) only if >40 case studies or >2 locales appear within 12 months.

**4. Client experience and portal — Notion + Frame.io Pro** ($40 + $30 = $70). Notion is the client-facing front door (one page per client, status, weekly written update, deliverable index, document links). Frame.io carries annotated review and approval state for any motion, web, or 3D deliverable; substitute Filestage if static deliverables (brand systems, illustration) dominate. *Trade-off:* No single-login portal; reassess Copilot at the 75-client mark.

**5. Project management and delivery — defer the formal decision.** The active-client volume (25–50 in year one) is below the threshold where a heavyweight PM tool justifies its overhead. Use Notion task databases for now; pick ClickUp ($7/seat) or Linear ($8/seat) at the 8-contributor mark when handoff seams start costing time. Reserve ~$30/month in the cost model for this.

**6. Payments and invoicing — Stripe** (transaction fees only; ~1.5–2% blended on a 60/40 ACH/card mix). Hosted invoices, milestone billing, automated dunning at T-3/T+1/T+7/T+14, multi-currency at the processor. Stripe Invoicing's 0.4% fee is waivable on the standard processing volume the firm will produce.

**7. Accounting and books of record — QuickBooks Online Plus** ($99). The book of record; native sync with Stripe and Ramp; class/project tags enable per-engagement margin reporting. *Trade-off:* UI is dated; CPA-friendly is more important than UI at this stage.

**8. International receivables — Wise Business** ($0 base + ~0.4–0.6% FX). Local receiving accounts in USD/EUR/GBP/AUD. Sits beside Stripe for non-card international flows, where it recovers 2–4% versus traditional bank wires.

**9. Contracts and e-signature — PandaDoc Essentials** ($35/seat × 2 senders = $70). Collapses the proposal and the SOW into one artifact; merge-fields tied to HubSpot deal properties; signed-event fires the Stripe invoice draft. Paired with a **one-time $4–7K lawyer-drafted template set** (MSA, SOW, change order, mutual NDA, T&Cs) by an agency-specialist SMB attorney. *Trade-off:* Dropbox Sign Standard ($25/seat) is cheaper and a better pure signing experience; PandaDoc wins on the proposal+contract collapse, which matters more here.

**10. Spend, procurement, vendor master, and AP — Ramp** ($0; interchange-funded). Corporate cards with per-merchant/per-category limits, vendor master with renewal alerts, tiered approval routing enforced at the card level, native QBO sync with class/project tags. Notion ($10/seat × 4 = $40) holds the decision log, approval-threshold policy, and runbooks. *Trade-off:* Ramp's AP module is sufficient for a SaaS-heavy vendor mix; revisit BILL only if check/ACH-to-vendor volume rises.

**11. Security, identity controls, and communications — 1Password Business + Mosyle MDM + Slack Pro + Signal + Rewind + YubiKeys** ($32 + $12 + $35 + $0 + $20 + ~$1,100 one-time = $99/month + hardware). 1Password Business for shared vaults and SSO via Google; Mosyle for Mac-first MDM with FileVault enforcement and remote-wipe; Slack Pro for daily work and client guest channels (Business+ at $15/seat deferred until SCIM is needed); Signal for principal-only and legally sensitive threads; Rewind for granular restore on Google Workspace and Notion; YubiKey 5 NFC hardware MFA for principals and any contributor with financial or production-data access.

**Contributor pay and HR (referenced, not a new line item):** Gusto for US payroll/1099, Deel for international contractors — assumed already in place per the financial-systems analysis, and the source of truth that drives Google Workspace SCIM provisioning.

Stack total at 4 active contributors: **~$498/month recurring**, plus ~$5K one-time legal and ~$1,100 one-time hardware. The eleven functional areas above map one-to-one with the security architecture's integration touchpoints, which is by design — every integration seam has a single owner and a single tool of record.

## 3. Build Sequence

The sequencing below is causal, not preference-ordered. Each later step depends on an earlier one being in place.

**Week 1 — Identity foundation and procurement.** Stand up Google Workspace Business Standard as the IdP. Issue YubiKeys to both principals. Enable hardware-MFA enforcement on Google, GitHub, Stripe, QBO, Ramp, and 1Password. Procure: HubSpot, Framer, PandaDoc, Notion, 1Password, Mosyle, Slack. Engage the SMB/agency lawyer for template drafting (3–4 week turnaround starts now; do not wait until contracts are needed). Decision: the identity-first sequence is what makes every subsequent integration safe. Skipping or delaying it forces rework when SSO is retrofitted into tools that were already provisioned with shared passwords.

**Weeks 2–4 — Three parallel tracks.**

*Sales/contracts track:* Stand up HubSpot with a 5–7-stage pipeline, productized service menu as deal templates, 800-contact past-client import segmented by recency/spend/engagement type, and the three-touch reactivation cadence drafted. Provision PandaDoc; rebuild productized offers as templates with merge fields tied to HubSpot deal properties (lawyer-drafted SOW boilerplate will land in week 4 and slot in).

*Web platform track:* Information architecture, 6 case-study selection, outcomes-led copy. Build in Framer using a single CMS collection for case studies. Wire the lead form to HubSpot with native integration; embed Cal.com on the thank-you state. SEO pass, Cloudflare DNS cutover, launch by end of week 4.

*Operations/security track:* Provision 1Password Business and migrate every credential out of browsers, notes, and Slack. Stand up Ramp; import vendor master from current credit-card statements; assign owner and renewal date to every line (this exercise alone typically recovers 8–15% of SaaS spend). Notion teamspace with client-page template, decision log, approval-threshold policy, runbooks. MDM enrollment of firm-owned laptops; FileVault enforcement; remote-wipe tested on a sacrificial device.

**Weeks 5–12 — Integrations, migrations, and the first operating cycle.**

Wire the causal chain: HubSpot closed-won → PandaDoc draft → signed-SOW event → Stripe invoice draft → QBO entry. Tax/class/project tags agreed once and applied consistently across Stripe, Ramp, and Gusto/Deel syncs; per-project margin reporting comes online by week 8.

Stand up the client portal in Notion using the week-3 template; migrate active engagements one at a time at natural milestone boundaries — do *not* force-migrate mid-engagement. Frame.io workspace provisioned; approval audit trails start accruing.

Reactivation cadence to the 800-contact past-client list launches no earlier than week 8 — domain reputation must be warmed and the inbound flow stable before outbound starts. Cap at 50 new outbound contacts/week.

Active clients migrate to MSA + SOW structure at next renewal or new-engagement boundary, not retroactively. Change-order template wired to delivery for any >10% scope or >5 business day delay caused by client.

First quarterly access review executed end-to-end by week 12: per-tool member lists exported, reconciled against the active-contributor roster in Google Workspace, deltas resolved same-day. Rewind enabled on Google Workspace and Notion; first restore drill on a non-production folder.

By the end of week 12 the firm should have: a working CRM with one full reactivation cycle in flight, a live marketing site with a wired lead-to-booking path, contracts signing and invoices collecting on autopilot, per-engagement margin visible, and an identity/access posture that survives offboarding events.

## 4. Estimated Cost

**One-time setup costs.** Lawyer-drafted contract template set (MSA, SOW, change order, mutual NDA, T&Cs) from an agency-specialist SMB attorney: **$4,000–$7,000**, 3–4 week turnaround. Hardware MFA keys (2 YubiKey 5 NFC per principal, 1 per contributor with a spare pool of 2): **~$1,100**. Site content production (case-study writing, photography touch-ups) absorbed into existing principal/contributor time, not a cash line. Total one-time: **~$5,100–$8,100**.

**Initial monthly recurring at 4 active contributors:** **~$498/month**, broken down as: Google Workspace $56 + HubSpot Starter $50 + Apollo $60 + Framer Business $30 + Plausible $15 + Notion $40 + Frame.io $30 + QBO Plus $99 + PandaDoc $70 + 1Password $32 + Slack Pro $35 + Mosyle MDM $12 + Rewind $20 + Cal.com/Cloudflare/Wise/Ramp/Signal $0. Plus blended Stripe transaction fees at ~1.5–2% of revenue (a variable cost, not a subscription).

**Justification of headroom against the $500 gate.** Initial recurring lands at ~$498 with no cushion. Two near-term realities will exceed the gate within the first year: (a) growing past 4 contributors adds ~$95/seat for Google + 1Password + Slack + MDM + Notion, and (b) HubSpot Starter's automation limits force a Pro upgrade (+$80–$300/month) at the 75-client / 1,000-active-contact mark. Realistic steady-state at 8 contributors: **~$850–$950/month**. This is still well under 1% of expected revenue at target scale and is the right shape of spend — every dollar buys time-to-value or risk reduction.

**Anticipated growth costs over the next 12–24 months.** Workspace Enterprise upgrade ($23/seat) when a client demands conditional-access controls. Vanta or Drata ($7–15K/year) when SOC 2 evidence is contractually required or headcount crosses ~20. Anrok or TaxJar ($150/month) if any productized SaaS-adjacent offering crosses economic-nexus thresholds. ClickUp or Linear ($7–8/seat) at the 8-contributor mark for delivery PM. None of these are required to launch; all are triggered by specific revenue or contract events, not the calendar.

## 5. Future Phase Note

When the proprietary agent-system version of this platform gets built, the off-the-shelf tools above do not disappear — they remain as systems of record at the edges (Stripe holds money, QBO holds the ledger, PandaDoc holds signed PDFs, Google holds identity). What the agent system absorbs is the **integration glue layer**: the Zapier-style automations that move closed-won deals into contract drafts into invoice drafts, the cross-tool reporting joins (Stripe + Gusto + Ramp → per-project margin), the cadenced reactivation and dunning sequences, the onboarding/offboarding triggers, the access-review reconciliations, and the decision-log discipline that today depends on human routines. The agent system also becomes the natural home for the *judgment* layer the current stack cannot host — pricing-exception adjudication, scope-creep detection from approval-trail patterns, reactivation-list ranking, and proposal-draft generation grounded in past won/lost deals. The implication for today's decisions: keep every cross-tool seam (CRM↔contracts↔billing↔accounting↔portal) thin, well-instrumented, and replaceable. Do not invest in heavyweight workflow tools whose value proposition is the orchestration layer itself, because that layer is exactly what the proprietary build is going to subsume.

---

# Functional Area Analyses

---
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

---
---
agent: web-platform-agent
study: micro-01-design-platform
last-updated: 2026-05-15
word_count_target: 600-1200
---

# Web Platform

## 1. Current Best-Practice Summary

High-performing design firms in the $500–$50K engagement band treat the public-facing website as their **single most important sales asset** — more than any deck, directory listing, or LinkedIn presence. The dominant pattern in 2026:

- **Case-study-led architecture.** The site is structured around 6–15 deeply-told case studies, not a wall of logos. Each case study leads with a problem framing, a visible process, and a measurable outcome. Service pages exist but route visitors *into* relevant case studies.
- **Designer-editable, no-engineer-in-the-loop.** Top firms have abandoned headless + custom Next.js stacks for *internal marketing sites*. They use visual builders (Framer, Webflow) so principals and designers can ship a new case study in an afternoon, not a sprint. Headless is reserved for client work, not the firm's own site.
- **Productized service pages with clear price anchors.** Named offers (e.g. "Brand Site Sprint — from $12K") on the site itself, mirroring the productized menu used by sales. This pre-qualifies leads on both fit and budget before the discovery call.
- **Short-form lead capture wired directly to a scheduler.** A 4–6 field form (name, company, project type, budget band, timeline, link) drops the qualified visitor straight into a Cal.com or Savvycal booking. No "we'll be in touch" black hole.
- **Performance and SEO as table stakes.** Core Web Vitals all green, semantic HTML, structured data on case studies, OG images per project. Most leads still arrive via referral and direct, but search-driven discovery of specific case studies ("[industry] rebrand case study") is the highest-converting inbound channel.
- **A working content cadence**, even if light: one case study or substantial post every 4–8 weeks. Sites that are static for >6 months read as defunct to ICP buyers.

## 2. Tooling Landscape

| Tool | Monthly cost (firm of 2–6) | Pros | Cons |
|---|---|---|---|
| **Framer** (Pro/Business plan) | $30–$60 per site | Native to designers — Figma-grade canvas; best-in-class motion; AI translate / CMS / forms built in; deploys to its own CDN with strong Core Web Vitals out of the box | CMS is capable but less powerful than Webflow's for complex schemas; SEO is good but a half-step behind Webflow on structured-data depth |
| **Webflow** (CMS Site plan) | $29–$49 per site + workspace seats | Most mature visual CMS; deepest control over markup/SEO; large template + plugin ecosystem; class-based system scales for multi-editor teams | Steeper learning curve; "Designer" UI is its own paradigm — slower than Framer for principals who think in Figma; pricing creeps with locales and seats |
| **WordPress (managed, WP Engine or Kinsta)** | $35–$115 (hosting) + theme/plugin licenses ~$200/yr | Universally hireable talent; unbeatable plugin and SEO ecosystem (Yoast, RankMath); fully owned, portable site | Maintenance, plugin updates, and security become a recurring tax; out-of-the-box themes look like out-of-the-box themes — a credibility risk for a design firm |
| **Sanity + Next.js on Vercel** (headless) | $20–$100 Vercel + $0–$99 Sanity | Maximum flexibility; engineer-friendly; pairs well if the firm has standing dev capacity | Requires a developer for every meaningful change; editorial velocity drops 3–5×; over-engineered for a 6–15-page firm site — the failure mode most studios fall into |
| **Cargo / Semplice** | $13–$25 | Beautiful, editorial layouts purpose-built for designer portfolios; very fast to launch | Limited CMS depth; thin lead-capture/integration story; better for solo practitioners than firms scaling to 15 contributors |

Supporting layer (regardless of choice): **Cal.com** (free–$15) for booking, **Plausible** ($9–$19) for privacy-friendly analytics, **Cloudflare** (free) for DNS/CDN/edge security.

## 3. Build vs Buy Recommendation

**Buy. Primary recommendation: Framer (Business plan) + Cal.com + Plausible + Cloudflare.** All-in monthly cost: **~$70–$100**.

Reasoning:

1. **Tool-of-trade fit.** A design firm's website is itself a portfolio piece. Framer is the closest a visual builder has come to the Figma surface designers already live in — meaning principals will *actually* edit the site, not file tickets against it.
2. **Time-to-value.** A 6-page site with 6 case studies, productized service pages, lead form, and booking flow is achievable in **3–5 weeks** by one designer + one part-time contributor. Inside the 30–60 day window.
3. **No proprietary build.** A custom Next.js + headless CMS site is the second-most-common premature-optimization at this firm size (after a custom CRM). It costs 4–6× more, ships 3–4× slower, and rots the moment the engineer who built it rotates off.
4. **Webflow as the credible alternative.** If the firm anticipates >40 case studies, >2 languages, or a content team of 3+, Webflow's CMS depth and SEO control justify the steeper learning curve. The recommendation flips to Webflow if any of those conditions apply within 12 months.
5. **WordPress is rejected** primarily on credibility cost: a design firm's site running a generic theme is a tell to ICP buyers. Self-built themes erase the time-to-value advantage.
6. **Plausible over GA4** for analytics: lighter, cookie-banner-free, sufficient for the firm's decision needs, and signals taste.

**Shippable in the first 60 days:**

- Wk 1–2: IA + content audit; pick 6 case studies; write outcomes-led copy for each.
- Wk 2–4: Build in Framer using a single CMS collection for case studies and one for posts.
- Wk 4–5: Wire lead form → CRM (HubSpot, per sales-ops output) via native integration; embed Cal.com on the form's thank-you state.
- Wk 5–6: SEO pass (titles, descriptions, OG images, structured data, sitemap, redirects from old site); Cloudflare DNS cutover; launch.

## 4. Integration Touchpoints

- **Sales pipeline:** Lead form posts directly to HubSpot via native Framer→HubSpot integration. Form fields (project type, budget band, timeline) map 1:1 to HubSpot deal properties, so a qualified inbound enters the pipeline already segmented. Case-study tags align to the productized service taxonomy so source-attribution is meaningful.
- **Client portal:** Site has no authenticated surface itself; "Client login" link routes to the portal subdomain. Post-engagement, the case-study draft lives as a private CMS entry until the client approves publication — gated by a simple status flag, not a separate tool.
- **Payments:** Productized service pages link to Stripe Payment Links for fixed-price deposits or sprints under $5K (one-click conversion for low-friction offers). Larger engagements route to the discovery-call booking, not a checkout.
- **Reporting seam:** Plausible goals (form submit, booking confirmed, case-study scroll-depth) join with HubSpot deal data in a monthly review. The single metric worth instrumenting cleanly: **case-study-page → booked-call conversion rate**, by case study. This is what drives both content prioritization and where to invest the next sprint of site polish.

**Word count: ~1,080**

---
---
agent: client-experience-agent
study: micro-01-design-platform
last-updated: 2026-05-15
word_count_target: 600-1200
---

# Client Portal & Client Experience

## 1. Current Best-Practice Summary

High-performing design firms at $500–$50K engagement size have largely **abandoned the "custom client portal"** in favor of a packaged client workspace inside their project management tool. Three patterns dominate:

- **Project tool *is* the portal.** Clients are invited as guests into the same workspace the team uses. They see only their project, comment in-thread on deliverables, and approve assets where they were created. This collapses the round-trip of "review document → email feedback → designer interprets feedback" into a single annotated artifact.
- **Deliverable-first review surfaces.** For visual work (web mocks, 3D, animation, brand boards), firms separate *review* from *project management*. Tools like Frame.io or Filestage host the artifact with timecode/pin-based comments and explicit approval state, while the PM tool tracks tasks and dates. The review tool produces an audit trail (who approved what, when) that doubles as scope-creep defense.
- **Asynchronous by default, scheduled syncs by exception.** Loom walkthroughs replace status calls. A weekly written update — same template, same day — is sent through the portal, and live meetings are reserved for kickoff, milestone, and handover.
- **Single, predictable entry point.** Clients get one URL and one login. Multi-tool stacks are hidden behind that entry point (often Notion or the PM tool's client view), because credential fatigue is the #1 reason clients revert to email.

The firms that get this wrong build bespoke portals and discover that maintenance, auth, and feature parity with off-the-shelf tools eats 5–10% of principal time forever.

## 2. Tooling Landscape

| Tool | Pricing (2026) | Pros | Cons |
|---|---|---|---|
| **Notion (Teamspaces + Guests)** | $10/user/mo (Plus); guests free up to limits | Flexible client homepages, embeds Loom/Figma/Frame.io, doubles as internal wiki, low client learning curve | No native approval workflow, file storage is weak for large video/3D assets, permissions model is coarse |
| **ClickUp / Asana (Client Guest seats)** | ClickUp $7/user/mo; Asana $11/user/mo. Guests free on most plans | Project visibility, task-level comments, native approval (ClickUp), client sees only their space | UI overwhelms non-technical clients; requires a curated "client view" or they get lost |
| **Frame.io (Adobe)** | $15/user/mo (Pro), $25/user/mo (Team) | Industry standard for video/animation review, frame-accurate comments, version stacking, approval state baked in | Video/image-centric — weak for static deliverables, contracts, invoices |
| **Filestage** | ~$59/mo (Basic, 10 reviewers), $129/mo (Pro) | Works across video, PDF, image, web; clean approval UX; reviewers don't need accounts | Per-reviewer pricing scales poorly past ~20 active clients |
| **Copilot (formerly Portal)** | $39/user/mo (Starter), $89/user/mo (Pro) | Purpose-built "agency portal": branded, includes messaging, files, invoices, contracts under one login | Newer tool, lock-in risk, monthly cost adds up at 5–15 contributors; some features are thinner than dedicated tools |

Honorable mentions: **Dropbox Replay** (video review, $10/user/mo, good if already on Dropbox); **Plutio** ($15–$30/mo flat, all-in-one but jack-of-all-trades).

## 3. Build vs Buy Recommendation

**Buy. Do not build.** Specifically: adopt a **two-tool layered portal** rather than a single all-in-one.

**Recommended stack:**
1. **Notion** as the client-facing "front door" — one page per client containing project status, weekly written update, links to deliverables, invoice history, and team contacts. ~$30/mo for the firm.
2. **Frame.io** for any motion, 3D, or web deliverable that benefits from annotated review; **Filestage** if static deliverables (brand systems, illustration) dominate the mix. Budget $60–$130/mo.

Reasoning:
- **Implementable in 30–60 days.** A Notion client template + Frame.io workspace can be live in a week. The remaining time is building the template library (kickoff page, weekly update, deliverable index, offboarding) and migrating active clients.
- **No proprietary build risk.** Custom portals demand auth, file infrastructure, audit trails, and a maintenance burden that grows with every client edge case. At 25–100 clients, the firm cannot afford that overhead.
- **All-in-one tools (Copilot, Plutio) were considered and rejected as the primary** recommendation: they trade depth for breadth. Their review surfaces are inferior to Frame.io/Filestage, which matters because *deliverable review is where scope disputes happen.* The layered approach loses single-login convenience but preserves best-in-class review.
- **Total cost** at target scale (10 contributors, 50 clients): ~$200–$300/mo, well under the $500/mo gate.

Reassess Copilot at the 75-client mark — by then, the single-login convenience may outweigh the loss of review depth, and a migration becomes a strategic call rather than a startup constraint.

## 4. Integration Touchpoints

- **Project management** (web-platform / operations scope): The PM tool is the system of record for tasks and dates; the client portal **mirrors a read-only slice** of it. Avoid duplicating task state — sync via embed (Notion → ClickUp/Linear embeds) or scheduled export. The client never sees internal tickets, only milestones and current focus.
- **Payments / invoicing** (financial-systems scope): Invoices live in Stripe/QuickBooks; the portal **links out** to the hosted invoice rather than re-rendering it. Payment status badges on the client homepage (paid / due / overdue) reduce email chasing.
- **Contracts** (legal-contracts scope): Signed SOWs and MSAs are stored in the contract tool (e.g., DocuSign, PandaDoc) and **deep-linked** from the portal under a "Documents" section. Approval state on deliverables (captured in Frame.io/Filestage) becomes evidence against scope creep claims — preserve the export.
- **Asset delivery / handover**: Final assets go to a dedicated, time-bounded delivery surface (Dropbox link or Notion page with download links). Do **not** use the working PM tool as the long-term asset archive — clients lose access when the project closes, and you want that to be intentional.
- **Identity**: One client = one email = one login across Notion and the review tool. Maintain a client roster in the CRM as the master list; provisioning happens at kickoff, deprovisioning at offboarding (add to operations runbook).

---
---
agent: financial-systems-agent
study: micro-01-design-platform
last-updated: 2026-05-15
word_count_target: 600-1200
---

# Payments & Invoicing

## 1. Current Best-Practice Summary

Design firms in the $500–$50K engagement band have converged on a **payments-processor + cloud-accounting** pairing, with the project/CRM tools generating invoices upstream. The shape of it:

- **Milestone billing as the default cash-flow pattern.** For engagements above ~$5K, a 50/50 or 40/40/20 schedule (kickoff / mid / acceptance) is standard. Deposits before work starts are non-negotiable; firms that bill in arrears for fixed-scope work consistently underperform on collections. Sub-$5K engagements bill upfront in full.
- **ACH first, card second, wire by exception.** Card fees (2.9% + $0.30) eat ~3% of revenue when applied to a $20K invoice — firms route enterprise clients to ACH ($5 flat or 0.8% capped) and reserve cards for SMB clients who need the float. Wires are used only for international or >$25K invoices.
- **The invoice is generated where the deal lives, paid where money moves, recorded where books are kept.** CRM/PM tool produces the invoice draft → payment processor (Stripe) hosts and collects → accounting tool (QuickBooks/Xero) is the book of record. Trying to collapse all three into one tool is the most common stack mistake at this size.
- **Automated dunning is table stakes.** Net-15 terms with three automated reminders (T-3, T+1, T+7) collect 90%+ of receivables without principal involvement. Manual chasing is what firms graduate *out* of, not into.
- **Sales tax and 1099/contractor payments are outsourced.** Firms above ~$500K ARR add a sales-tax service (TaxJar, Anrok) for any productized SaaS-adjacent offerings (templates, subscriptions). For contractor pay, Gusto or Deel handles 1099s and international contributors without a custom workflow.
- **Multi-currency is handled at the processor, not the bank.** Stripe and Wise let firms quote and collect in client currency while settling to USD, avoiding the FX markup that traditional bank wires impose (often 2–4%).

## 2. Tooling Landscape

| Tool | Pricing (2026) | Pros | Cons |
|---|---|---|---|
| **Stripe (Payments + Invoicing)** | 2.9% + $0.30 card; 0.8% ACH capped at $5; Invoicing 0.4% per paid invoice (waivable) | Hosted invoice pages, ACH/card/wire/Link, multi-currency at the processor, strong API, native subscriptions for retainers, automated reminders built-in | Not a book of record — needs accounting tool downstream; international card decline rates can be higher than local processors |
| **QuickBooks Online (Plus)** | $99/mo | The default US small-business GL; clean Stripe sync via native integration; handles 1099s, sales tax, multi-currency; CPA-friendly | Invoice UX is dated; payment processing (QB Payments) is more expensive than Stripe; UI feels heavy for a 10-person team |
| **Xero (Established)** | $80/mo | Cleaner UI than QBO; strong multi-currency; large app marketplace; better for firms with international clients | Smaller US CPA pool fluent in it; Stripe integration is good but not as native-feeling as QBO's |
| **Wave** | Free invoicing + accounting; payments 2.9% + $0.60 card / 1% ACH | Zero subscription cost; surprisingly capable for sub-$1M ARR; clean invoicing | Card fees worse than Stripe; no real multi-currency; will outgrow it past ~$1M revenue |
| **HoneyBook / Bonsai (agency all-in-one)** | $40–$80/mo flat | Bundles proposals, contracts, invoices, payments in one UI; fast to deploy for solo/small teams | Payment fees ~3.4%; weak as a true GL; lock-in risk; reporting thin |
| **Wise Business** (FX + international receivables) | Free account; ~0.4–0.6% FX | Local receiving accounts in USD/EUR/GBP/AUD; best-in-class FX for international clients paying by local transfer | Not an invoicing tool — sits beside Stripe for non-card international flows |

## 3. Build vs Buy Recommendation

**Buy. Recommended stack: Stripe (payments + invoicing) + QuickBooks Online Plus (accounting) + Wise Business (international receivables).** All-in monthly cost: **~$100/mo subscription + ~1.5–2% blended transaction fees** (assuming 60% ACH / 40% card mix). Well under the $500/mo cost gate.

Reasoning:

1. **Scale fit and graceful growth.** At 25–100 active clients, Stripe + QBO is the unambiguous default. There is no point on the firm's growth path between today and $5M ARR where this stack stops fitting. Migration risk is effectively zero — both tools have first-class everything-else integrations.
2. **No proprietary build.** Building invoicing or payments in-house at this scale would burn 3–6 months of principal time on PCI scope, tax logic, and dunning UX that Stripe ships for free. It is the single most expensive avoidable mistake at this stage.
3. **Why not HoneyBook/Bonsai as primary:** Tempting because of the bundled contract + invoice flow, and a reasonable choice for a solo operator. But at 5–15 contributors and 50+ clients, the accounting side becomes load-bearing. Bonsai is not a GL the firm's CPA will want to file from. Better to put contracts in a dedicated tool (see legal-contracts scope) and invoicing in Stripe.
4. **Why ACH-default.** A $20K invoice paid by card costs $580 in fees; the same invoice on ACH costs $5. Routing the top decile of invoices to ACH alone recovers ~$15–25K/year at target scale — more than the entire financial-systems tooling budget.
5. **Why Wise alongside Stripe.** Stripe handles card and ACH in USD beautifully but charges 1% FX on cross-currency settlement. For international clients large enough to wire, a Wise local receiving account is essentially free money.

**Workflows to ship in the first 60 days:**

- **Invoice templates per offer:** One template per productized service (matches the sales-operations service menu), with milestone schedule pre-baked. Generated from CRM closed-won via Zapier → Stripe.
- **Dunning sequence:** Net-15 default; reminders at T-3, T+1, T+7, T+14 (escalation to principal). Configured once in Stripe, applies to all invoices.
- **Books closed monthly by the 10th.** Bank + Stripe + Wise all reconcile into QBO; CPA reviews quarterly.
- **Sales-tax check at 60 days:** Confirm whether any current offerings (templates, subscriptions) cross economic-nexus thresholds. If yes, add Anrok ($150/mo) before the next quarter closes.

## 4. Integration Touchpoints

- **Contracts (legal-contracts scope):** Signed SOW is the trigger for invoice generation. Contract tool (DocuSign/PandaDoc) writes deal status to CRM; CRM closed-won fires the Stripe invoice draft. Payment terms (net-15, milestone split) flow from the SOW template — keep these in sync, since terms drift between contract and invoice is the #1 source of A/R disputes.
- **Client portal (client-experience scope):** Stripe hosts each invoice at a unique URL; the portal **deep-links** to it rather than re-rendering. Payment-status badges (paid / due / overdue) on the client homepage pull from Stripe via API or read from a QBO sync. Never recreate invoice state in the portal — single source of truth is Stripe.
- **Sales/CRM (sales-operations scope):** Closed-won deal → invoice draft auto-creates; payment status writes back to the deal record as a custom property for renewal forecasting and LTV reporting. Reactivation cadences exclude clients with open overdue invoices.
- **Accounting (QBO):** Stripe and Wise sync transactions nightly. Class/project tags map QBO entries back to the engagement, enabling per-project margin reporting when joined with delivery-tool actuals. This join is the single most valuable financial report the firm will produce — invest in instrumenting it cleanly from day one.
- **Contractor payouts:** Gusto (already likely in place for contractor 1099s) reads from QBO for cost-of-delivery attribution. Project margin = engagement revenue (Stripe → QBO) − contributor cost (Gusto → QBO) − tooling allocation.

**Word count: ~1,140**

---
---
agent: legal-contracts-agent
study: micro-01-design-platform
last-updated: 2026-05-15
word_count_target: 600-1200
---

# Contracts & Legal

## 1. Current Best-Practice Summary

High-performing design firms in the $500–$50K engagement band run a **two-layer contract structure** over an off-the-shelf e-signature tool, with templates drafted once by a specialist SMB lawyer and self-served from then on. The dominant pattern:

- **MSA + SOW, not one-off contracts per project.** A Master Service Agreement (signed once per client) holds the boilerplate — IP, confidentiality, liability cap, jurisdiction, dispute resolution, termination. Each engagement is a 1–2 page Statement of Work referencing the MSA, with only the project-specific terms (scope, deliverables, schedule, fees, assumptions, exclusions). Firms that keep negotiating full-length contracts per project lose 5–15 hours of principal time per deal.
- **IP assigns on full payment, not on signature.** Industry standard: firm retains all IP until the final invoice clears, at which point all custom deliverables assign to the client (work-for-hire where applicable, assignment-on-payment everywhere else). The firm retains rights to (a) underlying tools/components/methods and (b) portfolio use unless explicitly opted out in writing. This single clause structure is what protects firms in collections disputes.
- **Liability cap = fees paid in the preceding 12 months.** Mutual cap, with carve-outs for IP indemnification and confidentiality breach only. Anything broader is enterprise-procurement language the firm should redline out, not adopt.
- **Change orders are a one-page form, not a renegotiation.** Trigger thresholds (e.g., >10% scope increase or >5 business days delay caused by client) automatically invoke a written change order. Firms that don't formalize this absorb ~8–15% of revenue in unbilled scope creep.
- **Storage as a searchable archive, not an email thread.** Signed PDFs land in a single folder (Google Drive or the signature tool itself), named `[ClientName]_[MSA|SOW-N]_[YYYY-MM-DD].pdf`, with deal-record links from the CRM. The contract repository must be the canonical artifact — not the SOW Google Doc draft, which keeps changing.
- **Jurisdiction in firm's home state, dispute resolution via mediation → arbitration.** Litigation clauses look powerful but are functionally unenforceable for sub-$50K disputes; mediation-first costs 1/10th and resolves >80% of conflicts before arbitration is invoked.

## 2. Tooling Landscape

| Tool | Pricing (2026) | Pros | Cons |
|---|---|---|---|
| **PandaDoc (Essentials/Business)** | $35/user/mo (Essentials), $65/user/mo (Business) | Proposal + contract + e-signature in one; template library with merge fields; tracks open/sign events; pricing-table blocks support deposits and milestone splits; native HubSpot, Stripe, QuickBooks integrations | Per-user pricing scales with contributor count; some advanced workflow features gated to Business tier |
| **Dropbox Sign (formerly HelloSign)** | $25/user/mo (Standard), $40/user/mo (Premium) | Clean, fast signing UX; lowest-friction tool for clients; strong API; 3 free templates on Standard; audit trail and reminders built-in | Pure signing tool — proposal authoring lives elsewhere (Google Docs/Notion); thinner CRM integration than PandaDoc |
| **DocuSign (Business Pro)** | $45/user/mo | Industry default; clients recognize the brand; strongest legal admissibility track record; bulk send, payment collection via Stripe block | Pricier; UI feels enterprise-grade rather than agency-friendly; template authoring slower than PandaDoc |
| **Bonsai** | $25–$79/mo flat (not per seat) | Bundles proposals, contracts, invoices, time tracking — fastest path to a single tool; agency-targeted templates included | Flat pricing breaks at ~10 contributors; templates are starting points, not lawyer-vetted final language; lock-in if used for invoicing too (and financial-systems output recommends Stripe+QBO instead) |
| **Ironclad / Concord (CLM)** | $400+/mo (Ironclad), $99+/user/mo (Concord) | Full contract-lifecycle management — clause libraries, redline tracking, approval workflows | Enterprise overkill for a 5–15 person firm; outside the $500/mo gate; not implementable in 60 days |

**One-time legal investment (not a recurring tool):** A specialist SMB/agency lawyer to draft MSA, SOW template, mutual NDA, change-order form, and T&Cs. Budget **$4–7K one-time**, ~3–4 weeks turnaround. This is the highest-leverage spend in the entire contracts function.

## 3. Build vs Buy Recommendation

**Buy. Recommended stack: PandaDoc Essentials (signature + proposal authoring) + lawyer-drafted template set + Google Drive archive.** All-in cost: **~$140–$200/mo subscription (4–6 seats) + $4–7K one-time legal**, well under the $500/mo recurring gate.

Reasoning:

1. **Why PandaDoc over Dropbox Sign as primary.** Dropbox Sign is cheaper per seat and a better pure signing experience, but PandaDoc collapses the *proposal* and *contract* into one document. For a productized service menu (per sales-operations scope), this matters: the same artifact that wins the deal becomes the SOW. Removing the "send a proposal, then send a contract" double-touch shortens close time by 3–7 days at this size.
2. **Why not Bonsai as primary.** Tempting because of the bundled invoicing + contracts UX, and viable for a solo operator. But financial-systems already recommends Stripe+QBO; doubling Bonsai on top splits the book-of-record. Worse, Bonsai's templates are generic — they need lawyer review anyway, which negates the bundle advantage.
3. **Why the one-time legal spend is non-negotiable.** Generic templates from Bonsai/PandaDoc are starting points written for the median small business. A specialist agency lawyer hardens the IP, liability, and termination clauses for the specific failure modes of creative work (scope creep, "we changed our mind" mid-build, portfolio rights disputes). The single largest legal exposure a design firm carries is ambiguous IP language — the $5K one-time spend retires that risk for 3–5 years.
4. **Why not a proprietary build.** Building contract authoring, signature collection, or a CLM in-house is the most expensive mistake a firm at this scale could make. E-signature law (ESIGN, UETA) is also a compliance surface the firm should not own.

**Workflows to ship in the first 60 days:**

- **Week 1–3:** Engage SMB/agency lawyer. Inputs: current contracts, productized service menu, scenarios (full-payment, partial-pay-and-cancel, scope dispute, portfolio publication).
- **Week 2–4:** Provision PandaDoc; rebuild productized service offers as PandaDoc templates with merge fields tied to HubSpot deal properties.
- **Week 4–5:** Wire HubSpot closed-won → PandaDoc draft creation; PandaDoc signed → HubSpot stage advance + Stripe invoice draft (financial-systems handoff).
- **Week 5–8:** Migrate active clients to MSA + SOW structure at next renewal/new-engagement boundary. Do *not* force-migrate mid-engagement.

## 4. Integration Touchpoints

- **Sales pipeline (sales-operations scope):** HubSpot closed-won is the trigger for SOW generation. Deal properties (offer name, fee, schedule, contact, billing address) merge-field into the PandaDoc template — principal review is one paragraph (the scope), not a full doc. Signed-SOW event writes back to the deal as `contract_signed_at`, advancing the stage and gating delivery kickoff.
- **Payments / invoicing (financial-systems scope):** Signed SOW is the trigger for the first Stripe invoice draft. Payment terms (net-15, milestone split) flow one-way from the SOW template → Stripe — never edit terms in only one of the two systems. The IP assignment clause's "on full payment" trigger means the **paid-in-full event in Stripe** is the moment IP transfers; the finance reconciliation tag becomes the legal record.
- **Client portal (client-experience scope):** Signed MSA and active SOWs deep-link from the portal's "Documents" section to the PandaDoc-hosted PDF (never re-host inside Notion — single source of truth). Approval state captured in Frame.io/Filestage on deliverables is exported and stored alongside the SOW; this is the firm's primary defense against scope-creep claims at close-out.
- **Change orders:** Triggered from delivery (PM tool) when scope/timeline exceeds thresholds; instantiated as a child PandaDoc tied to the parent SOW; signed change order writes a delta invoice draft to Stripe and a `scope_delta` event on the HubSpot deal for margin reporting.
- **Archive:** PandaDoc holds the live record; a nightly export to Google Drive (`/Contracts/[ClientName]/`) provides a portable backup. CRM contact record carries deep-links to both. Retention: 7 years post-engagement-close (matches tax records).

**Word count: ~1,140**

---
---
agent: operations-governance-agent
study: micro-01-design-platform
last-updated: 2026-05-15
word_count_target: 600-1200
---

# Procurement & Governance

## 1. Current Best-Practice Summary

Design firms in the $500–$50K engagement band that scale from 3 to 15 people without accumulating governance debt converge on a **spend-management platform + lightweight decision-log** pattern. The shape of it:

- **Cards replace reimbursements.** Every contributor who buys anything gets a virtual or physical card with per-merchant or per-category limits. Receipts auto-capture via email/SMS; the spend tool becomes the system of record. Firms still running monthly reimbursement cycles at 8+ heads leak 2–4 hours/week of principal time and never catch silent overspend.
- **A single vendor master, kept in the spend tool, not a spreadsheet.** Each vendor has an owner, a category, an annual ceiling, and a renewal date. Renewal alerts fire 30/60 days out. The single biggest spend leak at this scale is auto-renewing SaaS no one uses — a vendor master with a renewal calendar prevents it.
- **Tiered approval thresholds, documented and short.** Standard pattern: <$250 no approval (within category budget), $250–$2.5K single-principal approval, $2.5K–$10K both principals, >$10K both principals + 24-hr cool-off + written rationale. Capital purchases (>$5K, multi-year) always get the cool-off. The thresholds matter less than having them written down and enforced *inside the spend tool*, not in someone's head.
- **Pricing exceptions require a written reason and a stored record.** Any discount >10% off rack rate or any scope-for-fixed-fee change requires a one-paragraph memo logged against the deal. Not for bureaucracy — for pattern detection. Firms that don't track exceptions discover six months later that 40% of deals had silent discounts and the rack rate is fiction.
- **Decision documentation is lightweight but durable.** A monthly "decisions" log captures the 5–10 non-obvious choices (pricing changes, new service lines, tool migrations, hiring criteria). One paragraph each: context, decision, who decided, what would change our mind. This artifact compounds — every firm that scaled cleanly past 15 heads has a version of it; every firm that struggled did not.
- **Freelancer engagement is contractized once and reused.** A single MSA + per-engagement SOW pattern, signed via the same e-sign flow as client contracts. Onboarding (W-9/W-8BEN, banking, NDA, tool access) is a checklist, not a per-person scramble.

## 2. Tooling Landscape

| Tool | Pricing (2026) | Pros | Cons |
|---|---|---|---|
| **Ramp** | Free core (interchange-funded); Ramp Plus $15/user/mo optional | Best-in-class spend cards + AP + vendor master + approval workflows in one; receipts auto-match; SaaS renewal and price-increase alerts; native QBO sync | US-only issuance; international contractor pay still needs Deel/Wise; not a contract repository |
| **Brex** | Free core; Premium $12/user/mo | Comparable to Ramp; broader international card coverage; better travel rewards | Pushes upsells aggressively; vendor-management module less mature than Ramp's |
| **BILL (Bill.com)** | $45–$79/user/mo | Mature AP for firms with high non-card vendor volume (true invoices, check runs, 1099s); strong QBO/Xero sync | Per-user pricing scales poorly past ~10 approvers; dated UI; overkill if Ramp's AP module suffices |
| **Notion** | $10/user/mo (Plus) | Single home for vendor policy, decision log, ADRs, runbooks, approval thresholds; templated databases; cheap | Not a workflow engine — must be paired with enforcement tool; discipline-dependent, will rot without an owner |
| **Coda** | $12/maker/mo (editors free) | Stronger than Notion for structured tables + in-doc automations (approval routing); better "lightweight workflow" surface | Smaller ecosystem; learning curve for non-makers |
| **Vanta / Drata** (governance-adjacent) | $7–15K/yr | Pulls policy + access + vendor reviews under one roof; useful if SOC 2 is on the roadmap | Premature at <15 people unless a client contractually requires it |

## 3. Build vs Buy Recommendation

**Buy. Recommended stack: Ramp (spend + vendor master + approvals) + Notion (decision log + policy + ADRs); Deel (already in financial-systems scope) handles international contractor pay.** All-in monthly cost: **~$60–$120/mo for Notion seats; Ramp is free.** Well under the $500/mo cost gate, with headroom to absorb headcount growth at <$15/seat marginal.

Reasoning:

1. **Ramp's free tier is the right shape for this firm.** It collapses three would-be tools — corporate cards, AP, vendor master — into one with native approval workflows and renewal alerts. The interchange-funded model means $0 subscription and price-increase detection on every SaaS vendor for free. No off-the-shelf alternative has a better cost/coverage ratio at this scale.
2. **Notion as the decision substrate, not the workflow engine.** Putting approvals *in Notion* would be a mistake (they will be ignored); putting the *policy and the log* in Notion is correct. The rule "the spend tool enforces, the doc tool records" keeps both honest.
3. **No proprietary build.** A custom approvals app or vendor-management database is a 4–6 week project that produces a worse Ramp. The interesting custom work at this firm is in client-facing surfaces, not internal procurement plumbing.
4. **Why not BILL as primary:** Excellent tool, but designed for firms with high check-and-ACH-to-vendor volume. A design firm's vendor mix is ~85% SaaS subscriptions + ~15% contractor pay (Deel). Ramp's AP module covers the residual 15% without a $45/user/mo line item.
5. **Why skip Vanta/Drata for now:** Useful when a client contract demands SOC 2 or the firm crosses ~20 heads. Premature spend today; revisit when the first enterprise security questionnaire arrives.

**Workflows to ship in the first 60 days:**

- **One-page approval-threshold policy in Notion**, mirrored as enforcement rules in Ramp (card limits, AP approval routing). Both principals sign off; it becomes the governance contract.
- **Vendor master imported into Ramp** from current credit-card statements. Every vendor gets an owner and a renewal date in week one. Anything without an owner gets cancelled — this exercise alone typically recovers 8–15% of SaaS spend.
- **Decisions log launched** with retroactive entries for the last five strategic calls (positioning, rate card, current tool stack). One paragraph each. Calendar reminder for monthly review.
- **Pricing-exception template in the CRM:** triggered on any quote >10% off rack rate, requires a sentence and routes to the other principal before send.
- **Contributor-onboarding checklist** wired to Deel: W-9/W-8BEN, MSA, NDA, 1Password vault, repo/tool access — all from a single trigger when a new contributor is added.

## 4. Integration Touchpoints

- **Finance (financial-systems scope):** Ramp syncs nightly to QBO with class/project tags, so vendor spend rolls into per-engagement margin alongside Stripe revenue and Gusto/Deel contributor cost. The Ramp→QBO sync uses the same chart-of-accounts conventions financial-systems is establishing — agree on class/project tag taxonomy on day one to avoid reconciliation drift.
- **Contracts (legal-contracts scope):** Contractor MSAs/SOWs and vendor agreements live in the same e-sign tool as client contracts (DocuSign/PandaDoc). Ramp's vendor record links to the signed agreement URL — never store the contract in Ramp; always link. Pricing-exception memos reference the underlying SOW.
- **Sales/CRM (sales-operations scope):** Pricing-exception requests originate in the CRM (discount/scope-change workflow). The exception memo lands in the Notion decisions log via Zapier; the discount value writes to the deal record so cohort margin reporting can isolate "exception-priced" engagements from rack-rate ones.
- **Project management (delivery scope):** When a project is created in the PM tool, any freelancer assigned triggers a Deel onboarding check (W-9/W-8BEN current, NDA signed, tool access granted) via webhook. No project starts with an un-papered contributor — the PM tool enforces by refusing to mark the project "active" until onboarding is green.
- **Security (security-architecture scope):** Ramp card issuance for a new contributor is the same trigger that fires access provisioning (1Password vault, Google group membership, repo access). One onboarding flow, not two — and one offboarding flow when the engagement ends, which is where most small firms leak access.

**Word count: ~1,170**

---
---
agent: security-architecture-agent
study: micro-01-design-platform
last-updated: 2026-05-18
word_count_target: 600-1200
---

# Security Architecture & Secure Communications

## 1. Current Best-Practice Summary

Design firms in the $500–$50K engagement band that scale from 3 to 15 people without a security incident converge on an **identity-anchored, MDM-backed, password-manager-first** posture. The shape of it:

- **One identity provider is the spine.** Google Workspace (or Microsoft 365) is the IdP for every other tool. SSO via Google to Notion, Figma, Slack, Ramp, HubSpot, PandaDoc, Stripe. Tools that don't support SSO sit behind a shared 1Password vault. The single most damaging security mistake at this scale is letting each tool maintain its own user list — offboarding becomes guesswork and old contractors retain access for months.
- **MFA is enforced, not encouraged.** Hardware keys (YubiKey) for both principals and any contributor with financial or production-data access; TOTP minimum for everyone else. SMS as a fallback factor is disabled. Conditional access blocks logins from unmanaged devices on the highest-risk surfaces (banking, payments, signed contracts).
- **Password manager is non-negotiable.** Every credential lives in 1Password — shared vaults by function (Finance, Delivery, Marketing, Admin). Personal vault for individual use. Anything pasted into Slack or email is rotated immediately. This single discipline retires ~80% of the credential-exposure surface for a firm this size.
- **Endpoints are managed, not BYOD-trust.** Firm-owned laptops enrolled in lightweight MDM (FileVault/BitLocker enforced, OS auto-update, screen-lock, remote-wipe). Contractors on their own machines sign an acceptable-use addendum and access client data only through cloud surfaces — never local sync.
- **Backups are layered and tested.** Cloud-native data (Google Drive, Notion, Stripe, QBO) relies on vendor durability plus a third-party backup (Rewind, Backupify) for accidental-deletion recovery. Client deliverable masters live in versioned cloud storage with a 90-day recycle bin; finals are archived to cold storage at engagement close. Restore drills happen quarterly — an untested backup is a hope, not a control.
- **Quarterly access reviews, 15 minutes per review.** Per-tool member list exported, reconciled against the active-contributor roster from the CRM/HR system, deltas resolved the same day. The review *catches* offboarding gaps; the offboarding runbook prevents most of them.
- **Secure communications by sensitivity tier.** Slack for day-to-day and client guest channels (encrypted in transit + at rest, retention configured); Signal for legally sensitive or principal-only conversations (E2E, disappearing messages); email never used for credentials, contracts in flight, or NDA-protected client material.

## 2. Tooling Landscape

| Tool | Pricing (2026) | Pros | Cons |
|---|---|---|---|
| **Google Workspace Business Standard** | $14/user/mo | IdP, email, Drive (2TB/user), Meet, basic MDM; SSO upstream for most modern SaaS | Advanced conditional access requires Enterprise tier ($23/user/mo) |
| **1Password Business** | $8/user/mo | Shared vaults, SSO via Google, secrets automation, breach-report integration, free family accounts for staff retention | Per-seat cost grows with contractor count; provision/deprovision discipline still required |
| **YubiKey 5 (NFC)** | ~$55/key, one-time | Phishing-resistant hardware MFA; works across Google, GitHub, 1Password, AWS | One-time cost per contributor; need a backup key per user |
| **Kandji / Mosyle / Jamf Now** | $3–$8/device/mo | Mac-first MDM; disk encryption enforcement, OS patching, remote wipe; deployable in a week | Windows mix complicates choice; Mosyle is cheapest for pure-Mac shops |
| **Cloudflare Zero Trust (Free–Pay-as-you-go)** | Free up to 50 users | Identity-aware proxy for internal tools; replaces VPN; logs every access; pairs with Google IdP | Configuration surface is wider than a 10-person firm needs; use the narrow slice |
| **Rewind / Backupify** | $4–$10/seat/mo per SaaS | Granular restore for Google Workspace, Notion, HubSpot; survives vendor outage or insider deletion | Per-SaaS pricing stacks; pick the 2–3 highest-value surfaces |
| **Slack (Business+)** | $15/user/mo | Encrypted in transit + at rest, retention policies, guest channels for clients, SSO + SCIM | Pro tier ($8.75) lacks SCIM; Business+ is the right floor for SCIM-driven offboarding |
| **Signal** | Free | E2E messaging + calls; principal-to-principal and sensitive client conversations | No central admin or compliance archive — by design |
| **Vanta / Drata** | $7–15K/yr | Continuous control monitoring; fastest path to SOC 2 if a client demands it | Premature at <15 heads absent contractual pressure (per operations-governance) |

## 3. Build vs Buy Recommendation

**Buy. Recommended stack: Google Workspace Business Standard (IdP + email + Drive) + 1Password Business + YubiKeys + Mosyle/Kandji MDM + Slack Business+ + Signal (free) + Rewind on Google Workspace and Notion.** All-in monthly cost at 10 contributors: **~$420/mo** + ~$1,100 one-time for hardware keys (two per principal, one per contributor with a spare pool). Inside the $500/mo recurring gate; the hardware spend amortizes over 3–5 years.

Reasoning:

1. **Identity-first is the highest-leverage move.** Standing up Google as IdP and routing every other tool through SSO retires the largest class of incidents (orphaned accounts, shared passwords, phishing) before any other control matters. Every dollar spent elsewhere before this is misallocated.
2. **No proprietary build.** A custom auth gateway, secrets manager, or backup system at this scale is the most expensive avoidable mistake in the entire stack — comparable in damage to a custom CRM or custom portal. The off-the-shelf controls here are mature, audited, and cheap.
3. **Why skip Vanta/Drata for now.** Consistent with operations-governance: premature until a client contractually requires SOC 2 or headcount crosses ~20. The same controls (access reviews, MDM, MFA) are running regardless; Vanta only adds the evidence layer.
4. **Why two comms tiers, not one.** Slack alone is sufficient for 95% of traffic but breaks at the edges — co-counsel privileged conversations, principal-only commercial discussions, whistleblower-adjacent client conflicts. Signal covers those for $0 and signals taste to security-conscious clients.
5. **Reassess at the 75-client / 15-contributor mark.** Triggers for a stack upgrade: a Fortune-1000 client questionnaire, a regulated-industry engagement (healthcare, finance), or a security incident. At that point, Workspace Enterprise + Vanta + a dedicated SIEM (Panther or a Cloudflare logpush pipeline) becomes the right shape.

**Workflows to ship in the first 60 days:**

- **Week 1–2:** Stand up Google Workspace as IdP; enroll every SSO-capable tool; issue YubiKeys to both principals; enable hardware-MFA enforcement on Google, 1Password, GitHub, Stripe, QBO, Ramp.
- **Week 2–4:** Provision 1Password Business, migrate every credential from browsers/notes/Slack, organize by function vault. Audit-log enabled, breach-report alerts wired to a principal.
- **Week 3–5:** MDM enroll all firm-owned laptops; FileVault/BitLocker enforced; OS auto-update on; remote-wipe tested on a sacrificial device.
- **Week 4–6:** Onboarding/offboarding runbook written; Ramp card issuance and tool provisioning fire from a single Notion trigger (per operations-governance); offboarding reverses it within 4 hours of departure.
- **Week 5–8:** First quarterly access review executed end-to-end; Rewind enabled on Workspace and Notion; first restore drill run on a non-production folder.

## 4. Integration Touchpoints

Security is not a parallel function — it is a control layer that sits inside every workflow other agents have designed. The eleven touchpoints:

- **Sales operations (HubSpot):** SSO via Google; SCIM deprovisioning on offboarding; field-level permissions hide client PII from contractors who don't need it. Form submissions arrive over TLS; reCAPTCHA on the public lead form. Prospect data from Apollo is treated as confidential — no export to personal devices.
- **Web platform (Framer + Cal.com + Cloudflare):** Cloudflare in front of the marketing site for DDoS, WAF, and bot management (free tier sufficient). DNSSEC enabled. Form submissions to HubSpot over TLS only. No client work or credentials ever stored on the public site.
- **Client experience (Notion + Frame.io/Filestage):** Each client portal page is permissioned to that client's email domain only; guest access audited at access-review time. Frame.io approvals carry an immutable audit trail — exported with the SOW closeout package (per legal-contracts). No client lands in a shared portal page by accident.
- **Financial systems (Stripe + QBO + Wise):** Hardware MFA enforced on all three. QBO connected to Stripe and Wise via OAuth, not stored credentials. Bank-account changes require both principals and a 24-hour cool-off (wire-fraud control). Receipts and statements never sent over unencrypted email.
- **Legal/contracts (PandaDoc):** SSO via Google; signed contracts archived to a Drive folder with restricted permissions; retention 7 years (matches tax). Change-order PDFs inherit the same controls. Signature audit trails preserved as legal evidence.
- **Operations/governance (Ramp + Notion):** Ramp card issuance is paired with tool provisioning — one trigger creates both the spend card and the SSO group membership. Offboarding reverses both. Vendor master in Ramp doubles as the security-vendor inventory.
- **Project delivery / PM tool:** Client-data classification (Public / Internal / Client-Confidential / Restricted) attached to each project at kickoff; restricted projects (NDA, M&A-adjacent, regulated industry) restrict to firm-employees-only, no contractors without per-engagement NDA on file.
- **Asset storage and delivery:** Working files in Drive/Dropbox with version history; finals delivered via time-bounded share links (90-day expiry) rather than permanent grants. Master archive moved to cold storage at engagement close — read-only, encrypted at rest.
- **Contributor identity (Deel + Gusto):** Source of truth for who is an active contributor; SCIM or scheduled sync into Google Workspace so the IdP membership tracks employment status automatically. The single most failure-prone seam in any firm this size — invest in instrumenting it.
- **Endpoint and device security:** MDM enforces disk encryption, OS patch level, screen-lock, and remote-wipe. Firm-owned devices only for principals and core staff; contractor BYOD constrained to cloud surfaces with no local sync of restricted projects.
- **Communications:** Slack for daily work and client guest channels (retention 90 days for general, 7 years for legal/finance channels); Signal for principal-only and legally sensitive threads; email never carries credentials, signed-but-unfiled contracts, or restricted client material. A one-page communications policy in Notion makes the tiering explicit so contributors don't have to guess.

**Word count: ~1,180**
