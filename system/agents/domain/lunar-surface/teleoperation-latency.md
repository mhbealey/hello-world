---
name: teleoperation-latency
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Latency regime:** Earth-to-lunar-far-side is a supervised-autonomy regime, not a telepresence regime.

**Computed latency values:**
- Direct Earth–Moon RTLT (near side): 2.56 s (based on mean Earth-Moon distance 384,400 km)
- Via Queqiao-2 relay (far side): 2.56–2.92 s depending on satellite position in frozen orbit
- Worst-case usable: 2.92 s RTLT upper bound for planning (§A17 uncertainty note applies)

**§A17 note:** Queqiao-2 orbital geometry is confirmed as 119.25° retrograde (not the originally planned 62.4° inclination). The 2.78–2.92 s RTLT upper bound may be overstated by up to ~0.3 s. The architectural conclusion (supervised autonomy required) is not affected regardless of correction.

**Latency tier model for this study:**
| Tier | RTLT | Implication |
|------|------|-------------|
| 1 — Telepresence | < 0.5 s | Full real-time teleoperation feasible |
| 2 — Supervised autonomy | 0.5–3.0 s | Pre-command sequences; operator corrects deviations |
| 3 — High autonomy required | > 3.0 s | Operator sets objectives; robot executes independently |

Far-side via relay falls at the Tier 2/3 boundary: supervised autonomy is the operating mode. This locks the humanoid autonomy requirement.

**Relay availability (§A17):** Queqiao-2 provides ~75–85% availability in its confirmed retrograde orbit. The IOC requirement is ≥95% continuous availability — this requires at minimum a two-satellite relay architecture. Flag as an open question until second relay satellite is confirmed.

**Heritage:**
- Lunokhod 1 & 2: operated under ~8 s round-trip delay via pre-command macro sequences. Demonstrated productivity in constrained latency regime; MTBF limited by dust, not latency.
- MER: latency 6–42 minutes one-way; full planning autonomy, daily command sequences. This is the outer bound of what high-autonomy implies.
- ISS Robonaut 2: sub-500ms relay; real-time teleoperation feasible. This is what Tier 1 looks like.
