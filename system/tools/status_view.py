"""Phone-friendly HTML view of system/state/status.yaml.

Serves a single-page auto-refreshing dashboard at localhost:8080.

Usage:
    python -m system.tools.status_view [--port 8080] [--once]

    --once: write HTML to stdout and exit (no server)
"""

import argparse
import html
import json
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

import yaml

_STATUS_FILE = Path("system/state/status.yaml")
_REFRESH_SECONDS = 10

_SEVERITY_COLORS = {
    "cycle_start": "#4caf50",
    "cycle_close": "#4caf50",
    "agent_dispatch": "#2196f3",
    "agent_complete": "#2196f3",
    "agent_error": "#f44336",
    "gate_pass": "#4caf50",
    "gate_fail": "#f44336",
    "finding_added": "#ff9800",
    "finding_resolved": "#4caf50",
    "cc_param_set": "#9c27b0",
    "assumption_added": "#9c27b0",
    "handback_generated": "#00bcd4",
    "helper_spawned": "#607d8b",
    "helper_complete": "#607d8b",
    "helper_timeout": "#f44336",
    "checkpoint_reached": "#4caf50",
    "info": "#607d8b",
}


def _load_status() -> dict:
    if not _STATUS_FILE.exists():
        return {"last_updated": "—", "current_study": None, "current_cycle": None, "events": []}
    with open(_STATUS_FILE, encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def _event_row(e: dict) -> str:
    etype = e.get("type", "info")
    color = _SEVERITY_COLORS.get(etype, "#607d8b")
    ts = html.escape(str(e.get("ts", "—")))
    agent = html.escape(str(e.get("agent", "")))
    study = html.escape(str(e.get("study", "")))
    details = html.escape(str(e.get("details", "")))
    badge = f'<span class="badge" style="background:{color}">{html.escape(etype)}</span>'
    meta_parts = []
    if agent:
        meta_parts.append(f"<em>{agent}</em>")
    if study:
        meta_parts.append(f"study={study}")
    if e.get("cycle") is not None:
        meta_parts.append(f"cycle={html.escape(str(e['cycle']))}")
    meta = " &nbsp;·&nbsp; ".join(meta_parts)
    return f"""
    <tr>
      <td class="ts">{ts}</td>
      <td>{badge}</td>
      <td>{meta}</td>
      <td class="details">{details}</td>
    </tr>"""


def render_html(data: dict, n_events: int = 50) -> str:
    last_updated = html.escape(str(data.get("last_updated", "—")))
    current_study = html.escape(str(data.get("current_study") or "—"))
    current_cycle = html.escape(str(data.get("current_cycle") or "—"))
    all_events = data.get("events", [])
    recent = all_events[-n_events:][::-1]  # newest first
    total = len(all_events)
    rows = "".join(_event_row(e) for e in recent)
    now = datetime.now(timezone.utc).strftime("%H:%M:%S UTC")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="{_REFRESH_SECONDS}">
  <title>System Status</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #111; color: #eee; font-size: 14px; padding: 12px; }}
    h1 {{ font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #fff; }}
    .header-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 8px; margin-bottom: 16px; }}
    .card {{ background: #1e1e1e; border-radius: 8px; padding: 10px 14px; }}
    .card .label {{ font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: .5px; }}
    .card .value {{ font-size: 16px; font-weight: 600; margin-top: 2px; color: #fff; word-break: break-all; }}
    table {{ width: 100%; border-collapse: collapse; }}
    th {{ text-align: left; font-size: 11px; color: #888; text-transform: uppercase;
          letter-spacing: .5px; padding: 6px 8px; border-bottom: 1px solid #333; }}
    td {{ padding: 6px 8px; border-bottom: 1px solid #1e1e1e; vertical-align: top; }}
    .ts {{ font-size: 11px; color: #888; white-space: nowrap; }}
    .badge {{ display: inline-block; padding: 2px 6px; border-radius: 4px;
              font-size: 11px; font-weight: 600; color: #fff; white-space: nowrap; }}
    .details {{ color: #ccc; font-size: 12px; word-break: break-word; }}
    .footer {{ margin-top: 12px; font-size: 11px; color: #555; text-align: right; }}
    @media (max-width: 600px) {{
      td:nth-child(3) {{ display: none; }}
    }}
  </style>
</head>
<body>
  <h1>System Status</h1>
  <div class="header-grid">
    <div class="card"><div class="label">Study</div><div class="value">{current_study}</div></div>
    <div class="card"><div class="label">Cycle</div><div class="value">{current_cycle}</div></div>
    <div class="card"><div class="label">Last Updated</div><div class="value" style="font-size:12px">{last_updated}</div></div>
    <div class="card"><div class="label">Total Events</div><div class="value">{total}</div></div>
  </div>
  <table>
    <thead><tr>
      <th>Time</th><th>Type</th><th>Context</th><th>Details</th>
    </tr></thead>
    <tbody>{rows}</tbody>
  </table>
  <div class="footer">Showing last {min(n_events, total)} of {total} events &nbsp;·&nbsp; Rendered {now} &nbsp;·&nbsp; Auto-refresh {_REFRESH_SECONDS}s</div>
</body>
</html>"""


class _Handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802
        if self.path not in ("/", "/status"):
            self.send_response(404)
            self.end_headers()
            return
        data = _load_status()
        body = render_html(data).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):  # noqa: ANN001
        pass  # suppress request logs


def main() -> None:
    parser = argparse.ArgumentParser(description="Phone-friendly status dashboard")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--once", action="store_true", help="Write HTML to stdout and exit")
    args = parser.parse_args()

    if args.once:
        data = _load_status()
        print(render_html(data))
        return

    server = HTTPServer(("localhost", args.port), _Handler)
    print(f"Status dashboard: http://localhost:{args.port}/")
    print("Ctrl-C to stop. Auto-refreshes every {_REFRESH_SECONDS}s.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
