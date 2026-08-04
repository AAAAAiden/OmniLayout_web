#!/usr/bin/env python3
"""Merge the reference and eight OmniRouting model GIFs into one horizontal GIF."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT_DIR = PROJECT_ROOT / "routing" / "gifs"
DEFAULT_OUTPUT_PATH = DEFAULT_INPUT_DIR / "exp0--reference-and-all-models-9x1.gif"
PANELS = (
    ("ground-truth.png", "Human Engineer Reference"),
    ("exp0--gpt-5-5.gif", "GPT-5.5"),
    ("exp0--gpt-5-mini.gif", "GPT-5-mini"),
    ("exp0--claude-opus-4-8.gif", "Claude Opus 4.8"),
    ("exp0--gemini-3-1-pro-preview.gif", "Gemini 3.1 Pro"),
    ("exp0--gemini-2-5-flash-lite.gif", "Gemini 2.5 Flash-lite"),
    ("exp0--llama-4-maverick.gif", "LLaMA 4 Maverick"),
    ("exp0--ministral-14b.gif", "Ministral 14B"),
    ("exp0--qwen3-5-9b.gif", "Qwen3.5-9B"),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--panel-width", type=int, default=360)
    parser.add_argument("--frame-ms", type=int, default=800)
    parser.add_argument("--final-ms", type=int, default=10_000)
    return parser.parse_args()


def load_title_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = (
        Path(r"C:\Windows\Fonts\segoeuib.ttf"),
        Path(r"C:\Windows\Fonts\seguisb.ttf"),
        Path(r"C:\Windows\Fonts\segoeui.ttf"),
    )
    for path in candidates:
        if path.is_file():
            return ImageFont.truetype(str(path), size=size)
    try:
        return ImageFont.truetype("DejaVuSans-Bold.ttf", size=size)
    except OSError:
        return ImageFont.load_default(size=size)


def load_resized_timeline(
    path: Path,
    panel_size: tuple[int, int],
) -> tuple[list[Image.Image], list[int]]:
    frames: list[Image.Image] = []
    end_times: list[int] = []
    elapsed = 0
    with Image.open(path) as source:
        for frame_index in range(source.n_frames):
            source.seek(frame_index)
            frames.append(
                source.convert("RGB").resize(panel_size, Image.Resampling.LANCZOS)
            )
            elapsed += int(source.info.get("duration", 0))
            end_times.append(elapsed)
    return frames, end_times


def frame_at(
    frames: list[Image.Image],
    end_times: list[int],
    elapsed_ms: int,
) -> Image.Image:
    for frame, end_time in zip(frames, end_times):
        if elapsed_ms < end_time:
            return frame
    return frames[-1]


def draw_legend(
    draw: ImageDraw.ImageDraw,
    canvas_width: int,
    legend_height: int,
    font: ImageFont.FreeTypeFont | ImageFont.ImageFont,
) -> None:
    items = (
        ("outline", "Board outline"),
        ("holes", "Through-hole pads"),
        ("top", "Top-side pads / components"),
        ("back", "Back-side pads / components"),
        ("traces", "Routed traces"),
    )
    marker_width = 34
    marker_gap = 9
    item_gap = 30
    measurements = []
    for kind, label in items:
        box = draw.textbbox((0, 0), label, font=font)
        measurements.append((kind, label, box, marker_width + marker_gap + box[2] - box[0]))

    total_width = sum(item[3] for item in measurements) + item_gap * (len(items) - 1)
    x = (canvas_width - total_width) // 2
    marker_y = (legend_height - 20) // 2

    for kind, label, box, item_width in measurements:
        if kind == "outline":
            draw.rectangle(
                (x, marker_y + 1, x + 31, marker_y + 18),
                outline="black",
                width=3,
            )
        elif kind == "holes":
            for offset in (0, 14):
                draw.ellipse(
                    (x + offset, marker_y + 1, x + offset + 18, marker_y + 19),
                    fill=(145, 145, 145),
                )
                draw.ellipse(
                    (x + offset + 5, marker_y + 6, x + offset + 13, marker_y + 14),
                    fill="white",
                )
        elif kind == "top":
            draw.rectangle(
                (x, marker_y + 2, x + 31, marker_y + 17),
                fill=(185, 90, 203),
                outline=(132, 61, 146),
                width=2,
            )
        elif kind == "back":
            draw.rectangle(
                (x, marker_y + 2, x + 31, marker_y + 17),
                fill=(102, 197, 190),
                outline=(52, 154, 147),
                width=2,
            )
        else:
            draw.line(
                (x, marker_y + 10, x + 31, marker_y + 10),
                fill=(204, 85, 0),
                width=5,
            )

        text_height = box[3] - box[1]
        draw.text(
            (
                x + marker_width + marker_gap - box[0],
                (legend_height - text_height) // 2 - box[1],
            ),
            label,
            fill="black",
            font=font,
        )
        x += item_width + item_gap


def main() -> None:
    args = parse_args()
    input_dir = args.input_dir.resolve()
    output_path = args.output.resolve()
    if args.panel_width <= 0 or args.frame_ms <= 0 or args.final_ms <= 0:
        raise SystemExit("Panel width and frame durations must be positive.")

    input_paths = [input_dir / filename for filename, _ in PANELS]
    missing = [path for path in input_paths if not path.is_file()]
    if missing:
        raise FileNotFoundError(
            "Missing input GIFs: " + ", ".join(str(path) for path in missing)
        )

    with Image.open(input_paths[0]) as first:
        source_width, source_height = first.size
    panel_height = round(source_height * args.panel_width / source_width)
    panel_size = (args.panel_width, panel_height)
    legend_height = 64
    title_height = 58
    header_height = legend_height + title_height
    gutter = 8
    composite_width = len(PANELS) * args.panel_width + (len(PANELS) - 1) * gutter
    composite_height = header_height + panel_height
    title_font = load_title_font(size=27)
    legend_font = load_title_font(size=19)

    timelines = [
        load_resized_timeline(path, panel_size)
        for path in input_paths
    ]
    cycle_ms = max(end_times[-1] for _, end_times in timelines)
    shared_slots = (cycle_ms - args.final_ms) // args.frame_ms
    if shared_slots <= 0:
        raise ValueError(f"Invalid synchronized cycle duration: {cycle_ms} ms")

    composites: list[Image.Image] = []
    for slot in range(shared_slots):
        elapsed_ms = slot * args.frame_ms
        composite = Image.new(
            "RGB",
            (composite_width, composite_height),
            "white",
        )
        draw = ImageDraw.Draw(composite)
        draw_legend(draw, composite_width, legend_height, legend_font)
        for panel_index, ((_, label), (frames, end_times)) in enumerate(
            zip(PANELS, timelines)
        ):
            panel_x = panel_index * (args.panel_width + gutter)
            text_box = draw.textbbox((0, 0), label, font=title_font)
            text_width = text_box[2] - text_box[0]
            text_height = text_box[3] - text_box[1]
            draw.text(
                (
                    panel_x + (args.panel_width - text_width) // 2 - text_box[0],
                    legend_height
                    + (title_height - text_height) // 2
                    - text_box[1],
                ),
                label,
                fill="black",
                font=title_font,
            )
            composite.paste(
                frame_at(frames, end_times, elapsed_ms),
                (panel_x, header_height),
            )
        composites.append(composite)

    durations = [args.frame_ms] * len(composites)
    durations[-1] += args.final_ms
    palette_frame = composites[0].quantize(
        colors=256,
        method=Image.Quantize.MEDIANCUT,
    )
    paletted = [palette_frame]
    paletted.extend(
        frame.quantize(
            palette=palette_frame,
            dither=Image.Dither.NONE,
        )
        for frame in composites[1:]
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    paletted[0].save(
        output_path,
        save_all=True,
        append_images=paletted[1:],
        duration=durations,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(
        f"Generated {output_path} at {composite_width}x{composite_height}, "
        f"{len(paletted)} frames, {sum(durations)} ms per loop"
    )


if __name__ == "__main__":
    main()
