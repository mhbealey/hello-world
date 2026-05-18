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
