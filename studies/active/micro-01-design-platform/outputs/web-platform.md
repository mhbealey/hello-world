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
