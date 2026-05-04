#!/usr/bin/env python3
"""
Generate Q(b) charts:
  1. q2_latency_effectiveness.png  — Operator effectiveness vs. RTLT latency
  2. q2_supervisor_ratio.png       — Humanoid supervisor ratio 2026–2045
"""

from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "site" / "charts"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.lines import Line2D
from datetime import date

# ---------------------------------------------------------------------------
# Style palette matching viewer
# ---------------------------------------------------------------------------
COLOR_PRIMARY  = "#6ea8ff"
COLOR_SUCCESS  = "#10b981"
COLOR_WARNING  = "#f59e0b"
COLOR_ERROR    = "#ef4444"
COLOR_MUTED    = "#9ca3af"
COLOR_BG       = "#ffffff"
COLOR_GRID     = "#f3f4f6"

TODAY = date.today().strftime("%Y-%m-%d")
WATERMARK = f"Humanoid-Forward Space Study — Auto-generated {TODAY}"

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["DejaVu Sans", "Arial", "Helvetica", "sans-serif"],
    "axes.facecolor": COLOR_BG,
    "figure.facecolor": COLOR_BG,
    "axes.grid": True,
    "grid.color": COLOR_GRID,
    "grid.linewidth": 0.8,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.spines.left": True,
    "axes.spines.bottom": True,
    "xtick.direction": "out",
    "ytick.direction": "out",
})

# ===========================================================================
# CHART 1 — Latency vs. Operator Effectiveness
# ===========================================================================

fig1, ax1 = plt.subplots(figsize=(12, 8))

# --- Latency domain (log) ---
lat = np.logspace(np.log10(0.01), np.log10(100), 1000)   # 10 ms … 100 s

# --- Curve helper functions ---
def sigmoid_decay(x, x_half, k, floor, ceiling):
    """Logistic decay: starts near ceiling, falls to floor."""
    return floor + (ceiling - floor) / (1.0 + np.exp(k * (np.log10(x) - np.log10(x_half))))

# Curve 1: Direct teleoperation
# ~100% at 10 ms, sharp roll-off above ~250 ms, ~30% at 2.8 s, ~5% at 20 s
eff_direct = sigmoid_decay(lat, x_half=0.25, k=4.5, floor=0.0, ceiling=1.0)
# Clip to reasonable floor and apply a slight additional attenuation at high latency
eff_direct = np.clip(eff_direct, 0.0, 1.0)
# Push high-latency values down further
eff_direct = np.where(lat > 5, eff_direct * 0.6, eff_direct)
eff_direct = np.clip(eff_direct, 0.0, 1.0)

# Curve 2: Predictive display / model-mediated
# ~95% at 10 ms, degrades more slowly, ~60% at 2.8 s, ~20% at 20 s
eff_pred = sigmoid_decay(lat, x_half=1.5, k=3.0, floor=0.05, ceiling=0.95)
eff_pred = np.clip(eff_pred, 0.05, 0.95)

# Curve 3: Shared autonomy (periodic supervision)
# Flat until ~1 s, ~75% at 2.8 s, ~55% at 20 s — slow linear-ish decay
eff_shared = 0.85 - 0.30 * (np.log10(lat) - np.log10(0.01)) / (np.log10(100) - np.log10(0.01))
eff_shared = np.clip(eff_shared, 0.50, 0.85)
# Tweak: force it flat in Tier A zone, then gentle slope
flat_mask = lat < 1.0
eff_shared = np.where(flat_mask, 0.85, eff_shared)
# Ramp from 0.85 at 1 s down to 0.55 at 20 s, then to 0.50 at 100 s
ramp_mask = lat >= 1.0
ramp_vals  = 0.85 - 0.30 * (np.log10(lat) - 0.0) / (np.log10(100) - 0.0)
eff_shared = np.where(ramp_mask, ramp_vals, eff_shared)
eff_shared = np.clip(eff_shared, 0.50, 0.85)

# Curve 4: Full autonomy (on-demand supervision)
# Flat at ~60% with slight upward trend at high latency
eff_auto = 0.58 + 0.04 * (np.log10(lat) - np.log10(0.01)) / (np.log10(100) - np.log10(0.01))
eff_auto = np.clip(eff_auto, 0.55, 0.65)

# --- Convert to percentage ---
eff_direct  *= 100
eff_pred    *= 100
eff_shared  *= 100
eff_auto    *= 100

# --- Plot curves ---
ax1.plot(lat, eff_direct, color="#3b82f6", linewidth=2.5, label="Direct teleoperation")
ax1.plot(lat, eff_pred,   color="#f59e0b", linewidth=2.5, label="Predictive display / model-mediated")
ax1.plot(lat, eff_shared, color="#10b981", linewidth=2.5, label="Shared autonomy (periodic supervision)")
ax1.plot(lat, eff_auto,   color="#ef4444", linewidth=2.5, linestyle="--", label="Full autonomy (on-demand supervision)")

# --- Shaded tier regions ---
ax1.axvspan(0.01, 0.05, alpha=0.18, color="#10b981", zorder=0)
ax1.axvspan(2.78, 2.92, alpha=0.18, color="#f59e0b", zorder=0)

# --- Vertical dashed lines ---
ax1.axvline(x=0.25, color=COLOR_MUTED, linestyle=":", linewidth=1.5)
ax1.axvline(x=2.85, color="#f59e0b",   linestyle=":", linewidth=1.8)

# --- X-axis landmark markers ---
special_x = {
    0.01:   "10 ms\n(Tier A floor)",
    0.05:   "50 ms\n(Tier A ceil.)",
    0.8:    "800 ms\n(METERON)",
    2.56:   "2.56 s\n(Earth–Moon)",
    2.85:   "2.85 s\n(Queqiao-2)",
    20.0:   "20 s\n(Mars min.)",
}
for xv, label in special_x.items():
    ax1.axvline(x=xv, color=COLOR_MUTED, linestyle=":", linewidth=0.7, alpha=0.5)

# --- Tier region text labels ---
ax1.text(0.025, 92, "Tier A\n(on-base)", ha="center", va="top",
         fontsize=7.5, color="#065f46", fontweight="bold")
ax1.text(2.85, 92, "Tier B\nEarth-relay\nfloor", ha="center", va="top",
         fontsize=7.5, color="#92400e", fontweight="bold")

# --- "Human reaction-cycle limit" annotation ---
ax1.annotate("Human reaction-\ncycle limit (~250 ms)",
             xy=(0.25, 50), xytext=(0.05, 60),
             fontsize=8, color=COLOR_MUTED,
             arrowprops=dict(arrowstyle="->", color=COLOR_MUTED, lw=1.2),
             ha="left")

# --- Lunokhod NIP-10 annotation on the direct teleoperation curve ---
# At 2.5 s the direct curve value
idx_lunokhod = np.argmin(np.abs(lat - 2.5))
y_luno = eff_direct[idx_lunokhod]
ax1.annotate("Lunokhod NIP-10\nregime",
             xy=(2.5, y_luno), xytext=(0.9, 22),
             fontsize=8, color="#3b82f6",
             arrowprops=dict(arrowstyle="->", color="#3b82f6", lw=1.2),
             ha="left")

# --- METERON annotation on predictive display curve ---
idx_meteron = np.argmin(np.abs(lat - 0.82))
y_met = eff_pred[idx_meteron]
ax1.annotate("METERON SUPVIS Justin\n(~820 ms, predictive display)",
             xy=(0.82, y_met), xytext=(1.5, 80),
             fontsize=8, color="#d97706",
             arrowprops=dict(arrowstyle="->", color="#d97706", lw=1.2),
             ha="left")

# --- Axes formatting ---
ax1.set_xscale("log")
ax1.set_xlim(0.01, 100)
ax1.set_ylim(0, 105)
ax1.set_xlabel("RTLT Latency (seconds, log scale)", fontsize=11)
ax1.set_ylabel("Normalized Operator Effectiveness (%)", fontsize=11)
ax1.set_title("Operator Effectiveness vs. RTLT Latency — Q(b)",
              fontsize=13, fontweight="bold", pad=14)

# Custom x-tick labels
ax1.set_xticks([0.01, 0.05, 0.1, 0.25, 0.8, 2.56, 2.85, 5, 20, 100])
ax1.set_xticklabels(
    ["0.01 s\n(10 ms)", "0.05 s\n(50 ms)", "0.1 s", "0.25 s",
     "0.8 s", "2.56 s", "2.85 s", "5 s", "20 s", "100 s"],
    fontsize=7.5
)
ax1.set_yticks(range(0, 101, 10))
ax1.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"{int(v)}%"))

ax1.legend(loc="lower left", fontsize=9, framealpha=0.9,
           edgecolor=COLOR_MUTED)

# Watermark
fig1.text(0.5, 0.01, WATERMARK, ha="center", va="bottom",
          fontsize=7.5, color=COLOR_MUTED, style="italic")

fig1.tight_layout(rect=[0, 0.03, 1, 1])
out1 = OUTPUT_DIR / "q2_latency_effectiveness.png"
fig1.savefig(out1, dpi=150, bbox_inches="tight", facecolor=COLOR_BG)
print(f"Saved: {out1}")
plt.close(fig1)


# ===========================================================================
# CHART 2 — Supervisor Ratio Over Time
# ===========================================================================

fig2, ax2 = plt.subplots(figsize=(12, 8))

# --- Year domain ---
years = np.array([2026, 2029, 2032, 2035, 2038, 2040, 2045], dtype=float)
ratios = np.array([0.2, 0.5, 1.0, 2.5, 4.0, 5.0, 6.0])

# Interpolate smooth curve through data points
years_fine = np.linspace(2026, 2045, 500)
ratios_fine = np.interp(years_fine, years, ratios)

# Uncertainty band ±50%
ratio_low  = ratios_fine * 0.50
ratio_high = ratios_fine * 1.50

# Plot uncertainty band
ax2.fill_between(years_fine, ratio_low, ratio_high,
                 alpha=0.18, color=COLOR_PRIMARY, label="±50% uncertainty band")

# Plot primary curve
ax2.plot(years_fine, ratios_fine, color=COLOR_PRIMARY, linewidth=2.8,
         label="Projected supervisor ratio")

# --- Hard ceiling ---
ax2.axhline(y=9, color=COLOR_MUTED, linestyle="--", linewidth=1.6, alpha=0.85)
ax2.text(2045.2, 9, "Hard ceiling\n(human value\nfloor saturation,\n4-person crew)",
         va="center", ha="left", fontsize=8, color=COLOR_MUTED)

# --- Heritage point: NIP-10 ---
ax2.plot(2026, 0.2, marker="*", markersize=14, color="#f59e0b",
         zorder=5, linestyle="none")
ax2.annotate("NIP-10 heritage\nbaseline",
             xy=(2026, 0.2), xytext=(2026.4, 0.30),
             fontsize=8.5, color="#92400e",
             arrowprops=dict(arrowstyle="->", color="#92400e", lw=1.2))

# --- IOC point: 2035, 2.5 ---
ax2.plot(2035, 2.5, marker="o", markersize=11, color="#10b981",
         zorder=5, linestyle="none")
ax2.annotate("§A18: 1:2–3 IOC",
             xy=(2035, 2.5), xytext=(2035.5, 1.7),
             fontsize=8.5, color="#065f46",
             arrowprops=dict(arrowstyle="->", color="#065f46", lw=1.2))

# --- TRL gate vertical annotations ---
gates = {
    2029: "TRL 5 gate",
    2032: "TRL 6 gate",
    2035: "IOC\n(TRL 7)",
    2040: "Full ops\n(TRL 8)",
}
gate_colors = {
    2029: COLOR_MUTED,
    2032: COLOR_MUTED,
    2035: "#10b981",
    2040: "#3b82f6",
}
for yr, label in gates.items():
    ratio_at_yr = np.interp(yr, years, ratios)
    ax2.axvline(x=yr, color=gate_colors[yr], linestyle=":", linewidth=1.4, alpha=0.7)
    # Arrow annotation pointing upward from the curve value
    ax2.annotate(label,
                 xy=(yr, ratio_at_yr),
                 xytext=(yr + 0.3, ratio_at_yr * 1.45),
                 fontsize=8, color=gate_colors[yr],
                 ha="left",
                 arrowprops=dict(arrowstyle="->", color=gate_colors[yr], lw=1.0))

# --- Axes formatting ---
ax2.set_yscale("log")
ax2.set_xlim(2025.5, 2046.5)
ax2.set_ylim(0.1, 25)
ax2.set_xlabel("Year", fontsize=11)
ax2.set_ylabel("Humanoids per Active Supervisor (log scale)", fontsize=11)
ax2.set_title("Humanoid Supervisor Ratio Projection — Q(b)",
              fontsize=13, fontweight="bold", pad=14)

ax2.set_xticks([2026, 2029, 2032, 2035, 2038, 2040, 2042, 2045])
ax2.set_xticklabels(["2026", "2029", "2032", "2035", "2038", "2040", "2042", "2045"],
                    fontsize=9)

# Y-tick labels: 0.1, 0.2, 0.5, 1, 2, 5, 10, 20
ax2.set_yticks([0.1, 0.2, 0.5, 1, 2, 5, 10, 20])
ax2.get_yaxis().set_major_formatter(
    matplotlib.ticker.FuncFormatter(lambda v, _: f"{v:g}")
)

# Legend with custom entries
legend_elements = [
    Line2D([0], [0], color=COLOR_PRIMARY, linewidth=2.8, label="Projected supervisor ratio"),
    mpatches.Patch(facecolor=COLOR_PRIMARY, alpha=0.3, label="±50% uncertainty band"),
    Line2D([0], [0], marker="*", color="w", markerfacecolor="#f59e0b",
           markersize=12, label="NIP-10 heritage baseline (2026)"),
    Line2D([0], [0], marker="o", color="w", markerfacecolor="#10b981",
           markersize=10, label="§A18 IOC (2035, 2.5:1)"),
]
ax2.legend(handles=legend_elements, loc="upper left", fontsize=9,
           framealpha=0.9, edgecolor=COLOR_MUTED)

# Watermark
fig2.text(0.5, 0.01, WATERMARK, ha="center", va="bottom",
          fontsize=7.5, color=COLOR_MUTED, style="italic")

fig2.tight_layout(rect=[0, 0.03, 1, 1])
out2 = OUTPUT_DIR / "q2_supervisor_ratio.png"
fig2.savefig(out2, dpi=150, bbox_inches="tight", facecolor=COLOR_BG)
print(f"Saved: {out2}")
plt.close(fig2)

print("Done.")
