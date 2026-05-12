Delivered.

**`02-question-b/comms-latency.md`** — 1,998 / 2,000 words (inside the 1,800–2,500 target band, well under the 3,000 hard cap).

**Positions taken:**
- **Tier 1 only.** Platform operates entirely in Tier 1 (Telepresence) — RTLT 5–30 ms on direct LEO links. Tier 2 is a relay-fallback mode, not an operating regime. Tier 3 is non-applicable in LEO.
- **Latency is not the architecture driver — comms availability is.** §A25 (continuous relay) carries the high-risk dependency to Gate 1, not latency.
- **Forward-deployment economics inverted for LEO.** Ground supervision is cheaper than platform supervision; default = ground unless task requires on-platform presence (contact-rich repair, contingency, crew-only ops).
- **Autonomy investment is justified by crew-ratio economics or fault-isolation, never by latency.** Direct input to `autonomy-gaps.md`: do not size autonomy investment against delay.
- **Fine-manipulation path must never be relay-only.** Robonaut 2 heritage is unambiguous: TDRS Ku at ~550 ms RTLT is monitor-only, not dexterous.
- **Dual-path comms architecture:** primary Starlink-class LEO mesh (Tier 1, <80 ms), hot-spare commercial TDRS-successor GEO (Tier 2, ~600 ms), cold-backup direct passes for safehold only.

**Bandwidth derivation:** 4× 15 Mbps manipulator stereo HD + 3× 10 Mbps SA video + 6 Mbps telemetry + voice + 30% margin = ~125 Mbps → rounded to 100 Mbps sustained / 150 Mbps peak.

**Heritage citations (all resolve in `corpus/references.bib`):** Sheridan-Ferrell move-and-wait threshold, METERON, Surface Telerobotics, Robonaut 2 in-vehicle vs. ground-via-TDRS, TDRS Ku-band, Starlink Gen 2, Dragon autonomous docking.

**Cross-coupling DB (+1):** `comms_bandwidth_sustained_mbps = 100` (affects `fmea_top20`, `cost_program_consumables`).

**Assumption registry (+1):** §A26 (`comms_bandwidth_100mbps`, medium, gated to 2028-interface-standards-lock); `next_id` advanced to 27.

**Corpus (+6 bib entries):** `sheridan_ferrell_telerobotics`, `meteron_iss_haptic`, `surface_telerobotics_iss`, `robonaut2_iss_teleop`, `tdrs_iss_kuband`, `starlink_gen2_capacity`.

**Handoffs flagged:** supervisor ratio (use Tier 1 latency, no productivity loss budget) → `crew-model.md`; Tier 2 fallback autonomy spec → `autonomy-gaps.md`; dual-path active-active routing as FMEA mitigation → `fault-management.md`; Gate 1 commercial-relay long-pole → `roadmap-analysis.md`; 100 Mbps sustained as opex line → `economics-analysis.md`.

**Carried forward:** §A25 (continuous-relay gate to 2028) — high-risk, owned by conops-integrator; codec pipeline overhead (~15–25 ms) is vendor-dependent and assumed; pre-existing `cross_coupling.schema.yaml` ↔ `cross_coupling_db.py` field-name mismatch (`date` vs `date_set`) unchanged — tooling-owner issue outside agent scope.

Frontmatter `last-updated: 2026-05-12` set on `comms-latency.md`; session log entry appended at `2026-05-12T16:00:00+00:00`.

**Note on the broader pattern:** the prior three Cycle 2 deliverables (`trajectories.md`, `architecture-analysis.md`, `operations-analysis.md`) are all 178–230-word summary stubs despite their session-log entries claiming 1,936/2,508/2,679-word counts. The actual deliverable bodies are missing. This agent produced a real 1,998-word document and did not replicate the stub-as-deliverable pattern. Worth flagging to meta-supervisor as a systemic Cycle 2 issue across `01-question-a/` and `02-question-b/`.