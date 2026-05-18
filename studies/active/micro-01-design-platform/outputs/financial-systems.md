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
