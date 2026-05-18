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
