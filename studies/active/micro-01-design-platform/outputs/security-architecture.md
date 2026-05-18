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
