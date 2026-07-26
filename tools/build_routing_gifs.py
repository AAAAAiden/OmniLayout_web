#!/usr/bin/env python3
"""Generate synchronized No Tools OmniRouting GIFs from top/bottom frames."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT_DIR = (
    PROJECT_ROOT.parent
    / "Adafruit DRV8833##1_baseline_no_tools (3)"
    / "Adafruit DRV8833##1_baseline_no_tools"
)
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "routing" / "gifs"
GROUND_TRUTH_FILENAME = "ground-truth.png"
FRAME_RE = re.compile(r"^iter_(?P<iteration>\d+)_current\.png$", re.IGNORECASE)
STEP_METRIC_RE = re.compile(
    r"^step\s+(?P<iteration>\d+)\s+"
    r"Net RR=\s*(?P<net_rr>\d+(?:\.\d+)?)%.*?"
    r"Pin RR=\s*(?P<pin_rr>\d+(?:\.\d+)?)%"
)
SETUP_IDS = {
    "agent_no_tools": "exp0",
    "agent_score_only": "exp1",
    "agent_visualization_only": "exp2",
    "agent_semantic_only": "exp3",
    "agent_prerouting_remake": "exp4",
    "agent_all_tools": "exp5",
}
MODEL_ALIASES = {
    "llama4-maverick": "llama-4-maverick",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_dir", nargs="?", type=Path, default=DEFAULT_INPUT_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--frame-ms", type=int, default=800)
    parser.add_argument(
        "--final-ms",
        type=int,
        default=10_000,
        help="Static hold after the shared final iteration (default: 10000 ms).",
    )
    parser.add_argument("--max-width", type=int, default=1080)
    parser.add_argument(
        "--no-frame-metadata",
        action="store_true",
        help="Do not draw iteration and routability metrics inside each GIF frame.",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove existing GIFs in the output directory before regeneration.",
    )
    return parser.parse_args()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return MODEL_ALIASES.get(slug, slug)


def setup_id(name: str) -> str | None:
    for marker, value in SETUP_IDS.items():
        if marker in name:
            return value
    return None


def collect_side_frames(side_dir: Path) -> dict[int, Path]:
    frames: dict[int, Path] = {}
    for path in side_dir.glob("*.png"):
        match = FRAME_RE.match(path.name)
        if match:
            frames[int(match.group("iteration"))] = path
    return frames


def collect_jobs(input_dir: Path) -> list[tuple[str, str, list[tuple[int, Path, Path]]]]:
    jobs: list[tuple[str, str, list[tuple[int, Path, Path]]]] = []
    model_root = input_dir / "models"
    if not model_root.is_dir():
        model_root = input_dir

    for model_dir in sorted(path for path in model_root.iterdir() if path.is_dir()):
        model_slug = slugify(model_dir.name)
        for top_dir in sorted(path for path in model_dir.rglob("top") if path.is_dir()):
            bottom_dir = top_dir.parent / "bottom"
            setup = None
            for ancestor in top_dir.parents:
                setup = setup_id(ancestor.name)
                if setup is not None or ancestor == model_dir:
                    break
            if setup != "exp0" or not bottom_dir.is_dir():
                continue
            top_frames = collect_side_frames(top_dir)
            bottom_frames = collect_side_frames(bottom_dir)
            if not top_frames and not bottom_frames:
                continue
            if set(top_frames) != set(bottom_frames):
                raise ValueError(
                    f"Top/bottom iteration mismatch for {model_dir.name}/{top_dir.parent.name}: "
                    f"top={sorted(top_frames)}, bottom={sorted(bottom_frames)}"
                )
            paired = [
                (iteration, top_frames[iteration], bottom_frames[iteration])
                for iteration in sorted(top_frames)
            ]
            jobs.append((setup, model_slug, paired))
    jobs.sort(key=lambda item: (item[0], item[1]))
    return jobs


def load_step_metrics(input_dir: Path) -> dict[tuple[str, int], tuple[float, float]]:
    manifest_path = input_dir / "render_manifest.json"
    if not manifest_path.is_file():
        raise FileNotFoundError(f"Missing render manifest: {manifest_path}")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    run_root = Path(manifest["run_root"])
    board = str(manifest["board"])
    model_root = input_dir / "models"
    metrics: dict[tuple[str, int], tuple[float, float]] = {}

    for model_dir in sorted(path for path in model_root.iterdir() if path.is_dir()):
        model_slug = slugify(model_dir.name)
        report_path = (
            run_root
            / model_dir.name
            / "agent_no_tools"
            / f"{board}_rr_pr_by_step.txt"
        )
        if not report_path.is_file():
            continue

        for line in report_path.read_text(encoding="utf-8-sig").splitlines():
            match = STEP_METRIC_RE.match(line)
            if not match:
                continue
            metrics[(model_slug, int(match.group("iteration")))] = (
                float(match.group("net_rr")),
                float(match.group("pin_rr")),
            )

    return metrics


def remove_bottom_left_text(image: Image.Image) -> None:
    width, height = image.size
    left = round(width * 0.143)
    right = round(width * 0.196)
    top = round(height * 0.860)
    bottom = round(height * 0.890)
    board_left = round(width * 0.169)
    board_bottom = round(height * 0.8688)
    line_width = max(2, round(width * 0.0046))

    draw = ImageDraw.Draw(image)
    draw.rectangle((left, top, right, bottom), fill="white")
    draw.rectangle(
        (board_left, top, board_left + line_width - 1, board_bottom + line_width - 1),
        fill="black",
    )
    draw.rectangle(
        (board_left, board_bottom, right, board_bottom + line_width - 1),
        fill="black",
    )


def open_on_white(path: Path, clean_bottom_left_text: bool = False) -> Image.Image:
    with Image.open(path) as source:
        rgba = source.convert("RGBA")
    canvas = Image.new("RGBA", rgba.size, "white")
    canvas.alpha_composite(rgba)
    image = canvas.convert("RGB")
    if clean_bottom_left_text:
        remove_bottom_left_text(image)
    return image


def compose_sides(
    top_path: Path,
    bottom_path: Path,
    clean_bottom_left_text: bool = False,
) -> Image.Image:
    top = open_on_white(top_path, clean_bottom_left_text)
    bottom = open_on_white(bottom_path, clean_bottom_left_text)
    gap = 24
    width = max(top.width, bottom.width)
    composite = Image.new("RGB", (width, top.height + gap + bottom.height), "white")
    composite.paste(top, ((width - top.width) // 2, 0))
    composite.paste(bottom, ((width - bottom.width) // 2, top.height + gap))
    return composite


def load_metadata_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_candidates = (
        Path(r"C:\Windows\Fonts\seguisb.ttf"),
        Path(r"C:\Windows\Fonts\segoeui.ttf"),
    )
    for font_path in font_candidates:
        if font_path.is_file():
            return ImageFont.truetype(str(font_path), size=size)

    try:
        return ImageFont.truetype("DejaVuSans-Bold.ttf", size=size)
    except OSError:
        return ImageFont.load_default(size=size)


def draw_metadata_bar(frame: Image.Image, label: str) -> None:
    draw = ImageDraw.Draw(frame)
    font = load_metadata_font(size=34)
    box = draw.textbbox((0, 0), label, font=font)
    margin = 16
    padding_x = 17
    padding_y = 11
    label_width = box[2] - box[0]
    label_height = box[3] - box[1]
    background = (
        margin,
        margin,
        margin + label_width + 2 * padding_x,
        margin + label_height + 2 * padding_y,
    )
    draw.rounded_rectangle(
        background,
        radius=11,
        fill=(24, 30, 48),
        outline=(65, 76, 105),
        width=1,
    )
    draw.text(
        (margin + padding_x - box[0], margin + padding_y - box[1]),
        label,
        fill=(248, 250, 252),
        font=font,
    )


def prepare_frame(
    top_path: Path,
    bottom_path: Path,
    iteration: int,
    net_rr: float,
    pin_rr: float,
    max_width: int,
    show_frame_metadata: bool,
) -> Image.Image:
    frame = compose_sides(top_path, bottom_path, clean_bottom_left_text=True)
    if max_width > 0 and frame.width > max_width:
        height = round(frame.height * max_width / frame.width)
        frame = frame.resize((max_width, height), Image.Resampling.LANCZOS)

    if show_frame_metadata:
        label = (
            f"Iteration {iteration}   \u2022   "
            f"Net RR {net_rr:.2f}%   \u2022   "
            f"Pin RR {pin_rr:.2f}%"
        )
        draw_metadata_bar(frame, label)
    else:
        color = ((iteration * 73) % 256, (iteration * 151) % 256, (iteration * 199) % 256)
        ImageDraw.Draw(frame).rectangle(
            (frame.width - 4, frame.height - 4, frame.width - 1, frame.height - 1),
            fill=color,
        )
    return frame


def write_ground_truth(input_dir: Path, output_dir: Path, max_width: int) -> Path:
    ground_truth_paths: list[Path] = []
    for side in ("top", "bottom"):
        side_dir = input_dir / "ground_truth" / side
        preferred_path = side_dir / "ground_truth.png"
        if preferred_path.is_file():
            ground_truth_paths.append(preferred_path)
            continue

        candidates = sorted(side_dir.glob("*.png"))
        if len(candidates) != 1:
            raise FileNotFoundError(
                f"Expected exactly one ground-truth PNG in {side_dir.relative_to(input_dir)}; "
                f"found {len(candidates)}"
            )
        ground_truth_paths.append(candidates[0])

    top_path, bottom_path = ground_truth_paths

    ground_truth = compose_sides(top_path, bottom_path)
    if max_width > 0 and ground_truth.width > max_width:
        height = round(ground_truth.height * max_width / ground_truth.width)
        ground_truth = ground_truth.resize(
            (max_width, height),
            Image.Resampling.LANCZOS,
        )

    draw_metadata_bar(ground_truth, "Net RR 100%   \u2022   Pin RR 100%")

    output_path = output_dir / GROUND_TRUTH_FILENAME
    ground_truth.save(output_path, optimize=True)
    return output_path


def main() -> None:
    args = parse_args()
    input_dir = args.input_dir.resolve()
    output_dir = args.output_dir.resolve()
    if args.frame_ms <= 0 or args.final_ms <= 0 or args.max_width < 0:
        raise SystemExit("Durations must be positive and --max-width cannot be negative.")
    if not input_dir.is_dir():
        raise SystemExit(f"Input directory does not exist: {input_dir}")

    jobs = collect_jobs(input_dir)
    if not jobs:
        raise SystemExit(f"No paired top/bottom iterations found in {input_dir}")
    step_metrics = load_step_metrics(input_dir)
    missing_metrics = [
        f"{model}/iteration {iteration}"
        for _, model, frame_paths in jobs
        for iteration, _, _ in frame_paths
        if (model, iteration) not in step_metrics
    ]
    if missing_metrics:
        raise SystemExit(
            "Missing Net RR / Pin RR metrics for: " + ", ".join(missing_metrics)
        )

    output_dir.mkdir(parents=True, exist_ok=True)
    if args.clean:
        removed = 0
        for path in output_dir.glob("*.gif"):
            path.unlink()
            removed += 1
        ground_truth_path = output_dir / GROUND_TRUTH_FILENAME
        if ground_truth_path.exists():
            ground_truth_path.unlink()
        print(f"Removed {removed} existing GIFs from {output_dir}")

    ground_truth_path = write_ground_truth(input_dir, output_dir, args.max_width)
    print(f"Generated {ground_truth_path.name}")

    manifest: dict[str, dict[str, int]] = {}
    total_frames = 0
    shared_iterations = max(len(frame_paths) for _, _, frame_paths in jobs)
    for index, (setup, model, frame_paths) in enumerate(jobs, start=1):
        images = [
            prepare_frame(
                top,
                bottom,
                iteration,
                *step_metrics[(model, iteration)],
                args.max_width,
                not args.no_frame_metadata,
            )
            for iteration, top, bottom in frame_paths
        ]
        durations = [args.frame_ms] * len(images)
        remaining_iteration_slots = shared_iterations - len(images)
        durations[-1] = (remaining_iteration_slots + 1) * args.frame_ms + args.final_ms
        output_path = output_dir / f"{setup}--{model}.gif"
        images[0].save(
            output_path,
            save_all=True,
            append_images=images[1:],
            duration=durations,
            loop=0,
            optimize=False,
            disposal=2,
        )
        manifest.setdefault(setup, {})[model] = len(images)
        total_frames += len(images)
        print(f"[{index:03d}/{len(jobs):03d}] {output_path.name}: {len(images)} frames")

    (output_dir / "manifest.json").write_bytes(
        (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode("utf-8")
    )
    cycle_ms = shared_iterations * args.frame_ms + args.final_ms
    print(
        f"Generated {len(jobs)} synchronized GIFs from {total_frames} paired frames in {output_dir}; "
        f"{shared_iterations} shared iteration slots, {cycle_ms} ms per loop"
    )


if __name__ == "__main__":
    main()
