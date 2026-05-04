#!/usr/bin/env python3
"""
Generate three matplotlib charts for the Humanoid-Forward Space Study.
Output: site/charts/autonomy-trl-curve.png
        site/charts/comms-latency-by-destination.png
        site/charts/section-word-count.png
"""

import os
import sys
from pathlib import Path
from datetime import date
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / "site" / "charts"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FOOTER = f"Humanoid-Forward Space Study — Auto-generated {date.today()}"


# ---------------------------------------------------------------------------
# Chart 1: Autonomy TRL Maturity Curve
# ---------------------------------------------------------------------------

def chart_autonomy_trl():
    fig, ax = plt.subplots(figsize=(1200/150, 800/150), dpi=150)
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')

    # Stepped line: TRL 3.5 (2024) → TRL 6 (2029) → TRL 7 (2035) → TRL 8 (2040)
    # Use numpy interpolate for the ramp segments
    years = [2024, 2029, 2035, 2040]
    trls  = [3.5,  6.0,  7.0,  8.0]

    # Build a smooth stepped series with fine resolution
    x_fine = np.linspace(2024, 2042, 1000)
    y_fine = np.interp(x_fine, years, trls)

    ax.plot(x_fine, y_fine, color='#6ea8ff', linewidth=2.5, label='Autonomy TRL', zorder=3)

    # Shaded band TRL 7–9
    ax.axhspan(7, 9, alpha=0.2, color='#10b981', label='Full teaming model enabled', zorder=1)

    # Band label — placed inside the band
    ax.text(2042.3, 8.0, 'Full teaming\nmodel enabled',
            color='#10b981', fontsize=7, va='center', ha='left', zorder=4,
            clip_on=False)

    # Vertical dashed gate lines
    gates = {
        2029: '2029: TRL 6 gate',
        2035: '2035: TRL 7+ gate',
        2040: '2040: TRL 8 gate',
    }
    for year, label in gates.items():
        ax.axvline(x=year, color='#f59e0b', linestyle='--', linewidth=1.5, zorder=2)
        ax.text(year + 0.15, 1.25, label, color='#f59e0b', fontsize=7.5,
                rotation=90, va='bottom', ha='left', zorder=4)

    # Axis formatting
    ax.set_xlim(2024, 2042)
    ax.set_ylim(1, 9)
    ax.set_xlabel('Year', fontsize=11)
    ax.set_ylabel('Technology Readiness Level (TRL)', fontsize=11)
    ax.set_xticks(range(2024, 2043, 2))
    ax.set_yticks(range(1, 10))
    ax.tick_params(axis='both', labelsize=9)
    ax.grid(axis='y', linestyle=':', color='#cccccc', zorder=0)

    # Title
    ax.set_title('Humanoid Autonomy TRL Maturity Curve (§A1)', fontsize=13, pad=12)

    # Legend
    line_patch = mpatches.Patch(color='#6ea8ff', label='Autonomy TRL projection')
    band_patch = mpatches.Patch(color='#10b981', alpha=0.4, label='Full teaming model enabled')
    gate_patch = mpatches.Patch(color='#f59e0b', label='Go/no-go gates')
    ax.legend(handles=[line_patch, band_patch, gate_patch], loc='upper left', fontsize=8)

    # Footer
    fig.text(0.5, 0.01, FOOTER, ha='center', va='bottom', fontsize=7, color='#888888')

    plt.tight_layout(rect=[0, 0.03, 1, 1])
    out_path = OUTPUT_DIR / 'autonomy-trl-curve.png'
    fig.savefig(out_path, dpi=150, facecolor='white')
    plt.close(fig)
    print(f'Saved: {out_path}')


# ---------------------------------------------------------------------------
# Chart 2: Round-Trip Comms Latency by Destination
# ---------------------------------------------------------------------------

def chart_comms_latency():
    destinations = [
        ('ISS / LEO',               0.003),
        ('Moon (near side)',         2.6),
        ('Moon (far side + relay)',  3.0),
        ('Mars (opposition)',        560.0),
        ('Mars (average)',           1200.0),
        ('Mars (conjunction)',       2880.0),
        ('Jupiter (minimum)',        4200.0),
        ('Jupiter (maximum)',        6200.0),
    ]

    def regime_color(val):
        if val < 2:
            return '#10b981'   # direct teleoperation
        elif val <= 600:
            return '#f59e0b'   # supervised autonomy
        else:
            return '#ef4444'   # full autonomy required

    labels = [d[0] for d in destinations]
    values = [d[1] for d in destinations]
    colors = [regime_color(v) for v in values]

    fig, ax = plt.subplots(figsize=(1200/150, 800/150), dpi=150)
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')

    y_pos = range(len(labels))
    bars = ax.barh(list(y_pos), values, color=colors, height=0.6, zorder=2)

    # Log scale
    ax.set_xscale('log')
    ax.set_xlim(0.001, 20000)
    ax.set_xlabel('Round-Trip Light Travel Time (seconds, log scale)', fontsize=10)
    ax.set_yticks(list(y_pos))
    ax.set_yticklabels(labels, fontsize=9)

    # Reference lines
    for ref_x, ref_label in [(2, '2 s'), (600, '600 s')]:
        ax.axvline(x=ref_x, color='#555555', linestyle='--', linewidth=1.2, zorder=3)
        ax.text(ref_x * 1.08, len(labels) - 0.3, ref_label,
                color='#555555', fontsize=7.5, va='top', ha='left', zorder=4)

    # Value labels on right side of bars
    for i, (val, bar) in enumerate(zip(values, bars)):
        if val < 1:
            label_str = f'{val*1000:.0f} ms'
        elif val < 60:
            label_str = f'{val:.1f} s'
        else:
            label_str = f'{val:.0f} s'
        ax.text(val * 1.15, i, label_str, va='center', ha='left', fontsize=7.5, color='#333333')

    # Grid
    ax.xaxis.grid(True, linestyle=':', color='#cccccc', zorder=0)
    ax.set_axisbelow(True)

    # Title
    ax.set_title('Round-Trip Comms Latency by Destination', fontsize=13, pad=12)

    # Legend
    legend_patches = [
        mpatches.Patch(color='#10b981', label='< 2 s — Direct teleoperation feasible'),
        mpatches.Patch(color='#f59e0b', label='2–600 s — Supervised autonomy'),
        mpatches.Patch(color='#ef4444', label='> 600 s — Full autonomy required'),
    ]
    ax.legend(handles=legend_patches, loc='lower right', fontsize=8)

    # Footer
    fig.text(0.5, 0.01, FOOTER, ha='center', va='bottom', fontsize=7, color='#888888')

    plt.tight_layout(rect=[0, 0.03, 1, 1])
    out_path = OUTPUT_DIR / 'comms-latency-by-destination.png'
    fig.savefig(out_path, dpi=150, facecolor='white')
    plt.close(fig)
    print(f'Saved: {out_path}')


# ---------------------------------------------------------------------------
# Chart 3: Study Section Word Counts by Status
# ---------------------------------------------------------------------------

def parse_study_files():
    study_dir = REPO_ROOT / "study"
    results = []
    for md_file in sorted(study_dir.rglob("*.md")):
        content = md_file.read_text(encoding='utf-8')
        # Parse YAML frontmatter
        status = 'not-started'
        parts = content.split('---')
        if len(parts) >= 3:
            fm = parts[1]
            for line in fm.splitlines():
                if line.startswith('status:'):
                    status = line.split(':', 1)[1].strip()
                    break
            body = '---'.join(parts[2:])
        else:
            body = content
        word_count = len(body.split())
        short_name = md_file.stem.replace('-', ' ')
        results.append((short_name, word_count, status))
    return results


def chart_word_counts():
    data = parse_study_files()
    # Sort descending by word count
    data.sort(key=lambda x: x[1], reverse=True)

    status_colors = {
        'draft':       '#3b82f6',
        'in-progress': '#f59e0b',
        'not-started': '#9ca3af',
        'reviewed':    '#8b5cf6',
        'final':       '#10b981',
    }

    labels = [d[0] for d in data]
    values = [d[1] for d in data]
    colors = [status_colors.get(d[2], '#9ca3af') for d in data]

    fig, ax = plt.subplots(figsize=(1200/150, 800/150), dpi=150)
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')

    y_pos = range(len(labels))
    bars = ax.barh(list(y_pos), values, color=colors, height=0.65, zorder=2)

    # Labels on right side of bars
    for i, (val, bar) in enumerate(zip(values, bars)):
        ax.text(val + 30, i, str(val), va='center', ha='left', fontsize=7.5, color='#333333')

    ax.set_yticks(list(y_pos))
    ax.set_yticklabels(labels, fontsize=8)
    ax.set_xlabel('Word Count', fontsize=10)
    ax.set_xlim(0, max(values) * 1.18)
    ax.xaxis.grid(True, linestyle=':', color='#cccccc', zorder=0)
    ax.set_axisbelow(True)

    ax.set_title('Study Section Word Counts by Status', fontsize=13, pad=12)

    # Legend — only show statuses that appear in data
    seen_statuses = list(dict.fromkeys(d[2] for d in data))  # preserve insertion order
    legend_patches = [
        mpatches.Patch(color=status_colors.get(s, '#9ca3af'), label=s)
        for s in sorted(status_colors.keys())
        if s in seen_statuses
    ]
    ax.legend(handles=legend_patches, loc='lower right', fontsize=8)

    fig.text(0.5, 0.01, FOOTER, ha='center', va='bottom', fontsize=7, color='#888888')

    plt.tight_layout(rect=[0, 0.03, 1, 1])
    out_path = OUTPUT_DIR / 'section-word-count.png'
    fig.savefig(out_path, dpi=150, facecolor='white')
    plt.close(fig)
    print(f'Saved: {out_path}')


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == '__main__':
    chart_autonomy_trl()
    chart_comms_latency()
    chart_word_counts()
    print('All charts generated.')
