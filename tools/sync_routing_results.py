"""Synchronize OmniRouting website data with the latest manuscript tables."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
PAPER = ROOT.parent / "_AAAI_2027__OmniRouting.pdf"
APP_JS = ROOT / "routing" / "app.js"
TABLES_JS = ROOT / "routing" / "tables.js"
ROUTING_PDF = ROOT / "routing" / "OmniRouting.pdf"

MODEL_IDS = [
    "gpt-5-5",
    "gpt-5-mini",
    "claude-opus-4-8",
    "gemini-3-1-pro-preview",
    "gemini-2-5-flash-lite",
    "llama-4-maverick",
    "ministral-14b",
    "qwen3-5-9b",
    "qwen3-235b-a22b",
]

ONE_SHOT_LABELS = [
    "Base",
    "Netclass detail",
    "Unlimited layer",
    "Fewshot",
    "Prerouter",
]

AGENT_LABEL_TO_SETUP = {
    "No Tools": "exp0",
    "Visualization": "exp2",
    "Routing Score": "exp1",
    "Semantic Input": "exp3",
    "Prerouting/Remake": "exp4",
    "All Tools": "exp5",
}

FRAME_COUNTS = {
    "exp0": {
        "claude-opus-4-8": 10,
        "gemini-3-1-pro-preview": 3,
        "gpt-5-5": 11,
        "gpt-5-mini": 17,
        "llama-4-maverick": 10,
        "ministral-14b": 8,
        "qwen3-5-9b": 14,
    },
}

def parse_value(token: str) -> str | None:
    return None if token == "-" else token


def extract_rows(text: str, labels: list[str], expected_values: int) -> list[tuple[str, list[str | None]]]:
    label_pattern = "|".join(re.escape(label) for label in sorted(labels, key=len, reverse=True))
    value_pattern = r"(?:-|\d+(?:\.\d+)?)"
    pattern = re.compile(
        rf"(?:^|\s)({label_pattern})\s+"
        rf"({value_pattern}(?:\s+{value_pattern}){{{expected_values - 1}}})(?:\s|$)"
    )
    rows: list[tuple[str, list[str | None]]] = []
    for raw_line in text.splitlines():
        match = pattern.search(raw_line.strip())
        if not match:
            continue
        label, values_text = match.groups()
        values = [parse_value(token) for token in values_text.split()]
        rows.append((label, values))
    return rows


def js_array(values: list[str | None]) -> str:
    return "[" + ", ".join("null" if value is None else json.dumps(value) for value in values) + "]"


def update_app(agent_rows: list[tuple[str, list[str | None]]]) -> None:
    if len(agent_rows) != 54:
        raise ValueError(f"Expected 54 Table 2 rows, found {len(agent_rows)}")

    results: dict[str, dict[str, list[str | None]]] = {
        setup_id: {} for setup_id in AGENT_LABEL_TO_SETUP.values()
    }
    for model_index, model_id in enumerate(MODEL_IDS):
        for label, values in agent_rows[model_index * 6 : model_index * 6 + 6]:
            results[AGENT_LABEL_TO_SETUP[label]][model_id] = values

    app = APP_JS.read_text(encoding="utf-8")
    app = app.replace(
        '{ id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", type: "Commercial" }',
        '{ id: "claude-opus-4-8", label: "Claude Opus 4.8", type: "Commercial" }',
    )
    app = app.replace("claude-sonnet-4-6", "claude-opus-4-8")

    frame_block = "const frameCounts = " + json.dumps(FRAME_COUNTS, indent=2) + ";\n\n"
    app, frame_replacements = re.subn(
        r"const frameCounts = \{.*?\};\r?\n\r?\n",
        frame_block,
        app,
        count=1,
        flags=re.S,
    )
    if frame_replacements != 1:
        raise ValueError("Could not replace frameCounts")

    setup_order = ["exp0", "exp1", "exp2", "exp3", "exp4", "exp5"]
    lines = ["const results = {"]
    for setup_id in setup_order:
        lines.append(f"  {setup_id}: {{")
        for model_id in MODEL_IDS:
            lines.append(f'    "{model_id}": {js_array(results[setup_id][model_id])},')
        lines.append("  },")
    lines.append("};")
    results_block = "\n".join(lines) + "\n\n"
    app, result_replacements = re.subn(
        r"const results = \{.*?\};\r?\n\r?\nlet activeSetup",
        results_block + "let activeSetup",
        app,
        count=1,
        flags=re.S,
    )
    if result_replacements != 1:
        raise ValueError("Could not replace results")

    app = app.replace("?v=omnilayout-format", "?v=healthypi-v1-1")
    APP_JS.write_text(app, encoding="utf-8")


def update_tables(one_shot_rows: list[tuple[str, list[str | None]]]) -> None:
    if len(one_shot_rows) != 45:
        raise ValueError(f"Expected 45 Table 1 rows, found {len(one_shot_rows)}")

    tables = TABLES_JS.read_text(encoding="utf-8")
    row_pattern = re.compile(
        r'\["(?:Base|Netclass detail|Unlimited layer|Fewshot|Prerouter)",\s*'
        r'(?:\[[^\]]*\]|unavailableOneShot\(\))\]'
    )
    matches = list(row_pattern.finditer(tables))
    if len(matches) != 45:
        raise ValueError(f"Expected 45 website Table 1 rows, found {len(matches)}")

    replacements = [
        f'["{label}", {js_array(values)}]' for label, values in one_shot_rows
    ]
    for match, replacement in reversed(list(zip(matches, replacements))):
        tables = tables[: match.start()] + replacement + tables[match.end() :]

    tables = tables.replace("claude-sonnet-4-6", "claude-opus-4-8")
    TABLES_JS.write_text(tables, encoding="utf-8")


def main() -> None:
    with pdfplumber.open(PAPER) as pdf:
        one_shot_text = pdf.pages[5].extract_text(x_tolerance=1, y_tolerance=3) or ""
        agent_text = pdf.pages[6].extract_text(x_tolerance=1, y_tolerance=3) or ""

    one_shot_rows = extract_rows(one_shot_text, ONE_SHOT_LABELS, 14)
    agent_rows = extract_rows(agent_text, list(AGENT_LABEL_TO_SETUP), 15)

    if [label for label, _ in one_shot_rows] != ONE_SHOT_LABELS * 9:
        raise ValueError("Unexpected Table 1 experiment order")
    expected_agent_order = list(AGENT_LABEL_TO_SETUP)
    if [label for label, _ in agent_rows] != expected_agent_order * 9:
        raise ValueError("Unexpected Table 2 configuration order")

    update_app(agent_rows)
    update_tables(one_shot_rows)
    shutil.copy2(PAPER, ROUTING_PDF)

    print(f"Updated {APP_JS}")
    print(f"Updated {TABLES_JS}")
    print(f"Copied {PAPER.name} to {ROUTING_PDF}")
    print(f"Table 1: {len(one_shot_rows)} rows; Table 2: {len(agent_rows)} rows")


if __name__ == "__main__":
    main()
