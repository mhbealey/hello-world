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
