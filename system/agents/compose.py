"""Agent prompt composer.

Merges a base agent file with an optional domain overlay to produce
the effective agent prompt used at dispatch time.

Usage:
    from system.agents.compose import compose_agent_prompt, compose_for_domain

    # Returns merged string
    prompt = compose_agent_prompt("system/agents/base/teleoperation-latency.md",
                                  "system/agents/domain/orbital-platform/teleoperation-latency.md")

    # Or use the convenience function
    prompt = compose_for_domain("teleoperation-latency", "orbital-platform")

CLI:
    python -m system.agents.compose teleoperation-latency orbital-platform
    python -m system.agents.compose teleoperation-latency --base-only
"""

import argparse
import sys
from pathlib import Path

_BASE_DIR = Path(__file__).parent / "base"
_DOMAIN_DIR = Path(__file__).parent / "domain"

_FM_SENTINEL = "---"


def _strip_frontmatter(text: str) -> str:
    """Remove YAML frontmatter block from overlay content."""
    if not text.startswith(_FM_SENTINEL):
        return text
    parts = text.split(_FM_SENTINEL, 2)
    if len(parts) < 3:
        return text
    return parts[2].lstrip("\n")


def compose_agent_prompt(
    base_path: str | Path,
    overlay_path: str | Path | None = None,
) -> str:
    """Merge base agent file with optional domain overlay.

    Args:
        base_path: Path to the base agent .md file.
        overlay_path: Path to the domain overlay .md file, or None for base-only.

    Returns:
        Merged agent prompt as a string.
    """
    base_path = Path(base_path)
    if not base_path.exists():
        raise FileNotFoundError(f"Base agent not found: {base_path}")

    base_text = base_path.read_text(encoding="utf-8")

    if overlay_path is None:
        return base_text

    overlay_path = Path(overlay_path)
    if not overlay_path.exists():
        return base_text  # Overlay missing = base-only, not an error

    overlay_text = overlay_path.read_text(encoding="utf-8")
    overlay_body = _strip_frontmatter(overlay_text)

    return base_text.rstrip("\n") + "\n\n---\n\n" + overlay_body.strip() + "\n"


def compose_for_domain(
    agent_name: str,
    domain: str,
    base_dir: str | Path = _BASE_DIR,
    domain_dir: str | Path = _DOMAIN_DIR,
) -> str:
    """Compose agent prompt for a specific domain by name.

    Args:
        agent_name: Agent stem name (e.g. 'teleoperation-latency').
        domain: Domain name (e.g. 'orbital-platform', 'lunar-surface').
        base_dir: Root of base agent files.
        domain_dir: Root of domain overlay directories.

    Returns:
        Merged agent prompt as a string.
    """
    base_dir = Path(base_dir)
    domain_dir = Path(domain_dir)

    base_path = base_dir / f"{agent_name}.md"
    overlay_path = domain_dir / domain / f"{agent_name}.md"

    return compose_agent_prompt(base_path, overlay_path)


def list_agents(base_dir: str | Path = _BASE_DIR) -> list[str]:
    """Return list of agent names available in the base directory."""
    base_dir = Path(base_dir)
    return sorted(p.stem for p in base_dir.glob("*.md"))


def list_overlays(domain: str, domain_dir: str | Path = _DOMAIN_DIR) -> list[str]:
    """Return list of overlay names available for a domain."""
    domain_dir = Path(domain_dir)
    overlay_dir = domain_dir / domain
    if not overlay_dir.exists():
        return []
    return sorted(p.stem for p in overlay_dir.glob("*.md"))


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="compose",
        description="Compose agent prompt from base + domain overlay",
    )
    parser.add_argument("agent", help="Agent name (stem, e.g. teleoperation-latency)")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("domain", nargs="?", help="Domain name (e.g. orbital-platform)")
    group.add_argument("--base-only", action="store_true", help="Output base agent only")
    parser.add_argument("--list", action="store_true", help="List available agents")
    args = parser.parse_args()

    if args.list:
        print("Base agents:")
        for name in list_agents():
            print(f"  {name}")
        sys.exit(0)

    if args.base_only or not args.domain:
        base_path = _BASE_DIR / f"{args.agent}.md"
        print(compose_agent_prompt(base_path))
    else:
        print(compose_for_domain(args.agent, args.domain))


if __name__ == "__main__":
    main()
