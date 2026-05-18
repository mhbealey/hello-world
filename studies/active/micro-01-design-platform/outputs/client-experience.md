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
