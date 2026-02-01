from __future__ import annotations

import argparse
import json
import random
import secrets
import sys
from dataclasses import dataclass
from typing import Any, Dict, List, Tuple


@dataclass(frozen=True)
class OwnerProfile:
    full_name: str
    alias: str
    traits: Tuple[str, ...]
    emotional_anchor: str
    habit: str
    dob_month: int
    dob_day: int
    birth_year: int
    identity_keyword: str
    ritual_symbol: str


def _pick(rng: random.Random, items: List[str]) -> str:
    return rng.choice(items)


def _pick_unique(rng: random.Random, items: List[str], n: int) -> Tuple[str, ...]:
    pool = list(items)
    rng.shuffle(pool)
    return tuple(pool[:n])


def _generate_owner_for_run(rng: random.Random) -> OwnerProfile:
    first_names = ["Marina", "Evelyn", "Jonah", "Soren", "Talia", "Noah", "Iris", "Caleb", "Vera", "Carmen"]
    middle_names = ["Celeste", "June", "Avery", "Rowan", "Mira", "Hollis", "Quinn", "Sage", "Wren", "Dahlia"]
    last_names = ["Dorsey", "Kline", "Navarro", "Bishop", "Sato", "Harper", "Lennox", "Monroe", "Archer", "Mercer"]
    aliases = ["Rin", "Lio", "Sam", "Nox", "Rue", "Kit", "Jae", "Sol", "Bee", "Ash"]
    traits = ["meticulous", "avoidant", "patient", "restless", "soft-spoken", "stubborn", "sentimental", "practical", "superstitious", "wry"]
    anchors = [
        "a dim hallway where the air hums like an old monitor",
        "a place that smells like dust and warmed plastic",
        "a corner of the world that only feels real after midnight",
        "a quiet threshold where footsteps echo and nobody asks questions",
    ]
    habits = [
        "taps the desk three times before running anything",
        "rewrites the same line until it looks 'even'",
        "checks the clock twice, even when it's already obvious",
        "saves drafts in pairs and deletes the third",
    ]
    symbols = ["!!", "??", "##", "++", "--", "~~", "::", "<>", "//"]

    dob_month = rng.randint(1, 12)
    dob_day = rng.randint(1, 28)
    birth_year = rng.randint(2000, 2012)

    identity_source = [_pick(rng, aliases), _pick(rng, traits), _pick(rng, first_names)]
    identity_keyword = rng.choice(identity_source).lower()[:10]
    if len(identity_keyword) < 3:
        identity_keyword = (identity_keyword + "self")[:3]

    return OwnerProfile(
        full_name=f"{_pick(rng, first_names)} {_pick(rng, middle_names)} {_pick(rng, last_names)}",
        alias=_pick(rng, aliases),
        traits=_pick_unique(rng, traits, 4),
        emotional_anchor=_pick(rng, anchors),
        habit=_pick(rng, habits),
        dob_month=dob_month,
        dob_day=dob_day,
        birth_year=birth_year,
        identity_keyword=identity_keyword,
        ritual_symbol=_pick(rng, symbols),
    )


def _derive_blocks_for_run(owner: OwnerProfile) -> Tuple[str, str, str, str]:
    block1 = owner.identity_keyword
    block2 = f"{owner.dob_month:02d}{owner.dob_day:02d}"
    habit_lower = owner.habit.lower()
    if "tap" in habit_lower:
        block3 = "3taps"
    elif "check" in habit_lower:
        block3 = "2checks"
    elif "pairs" in habit_lower or "pair" in habit_lower:
        block3 = "pairsave"
    elif "rewrite" in habit_lower:
        block3 = "rewrite7"
    else:
        block3 = "twicerun"
    block4 = owner.ritual_symbol[:2]
    return block1, block2, block3, block4


def _generate_run_files(owner: OwnerProfile, blocks: Tuple[str, str, str, str]) -> List[Tuple[str, str]]:
    block1, block2, block3, block4 = blocks
    files: List[Tuple[str, str]] = []

    # Notes
    files.append(("C:/My Documents/Notes/identity.txt",
                  "One short word (3-10 letters) I keep for myself.\nIt always comes first.\n"))
    files.append(("C:/My Documents/Notes/dates.txt",
                  "Four digits: month then day.\nTwo each, no slashes.\n"))
    files.append(("C:/My Documents/Notes/habit.txt",
                  "My routine is fused into one token.\nWord+count, medium length, always third.\n"))
    files.append(("C:/My Documents/Notes/symbol.txt",
                  f"I end with a double mark.\nThink of {block4}.\n"))
    files.append(("C:/My Documents/Notes/todo.txt",
                  "- clean, decode, extract, build, then run\n- don’t shuffle the steps when you’re tired\n"))
    files.append(("C:/My Documents/Notes/random_thoughts.txt",
                  "When the fan hums, I can hear the order in my head.\nI hate that I need ritual to think.\n"))
    files.append(("C:/My Documents/Notes/shopping_list.txt",
                  "Coffee\nBatteries\nBlank CDs\nZip ties\nDust cloth\n"))

    # Projects / usb_cracker
    files.append(("C:/My Documents/Projects/usb_cracker/README.txt",
                  "# usb_cracker\n\nPipeline: clean → decode → extract → build → run.\nGet the order wrong and the output lies.\n"))
    files.append(("C:/My Documents/Projects/usb_cracker/run.js",
                  "\n".join([
                      "// run.js",
                      "const steps = [",
                      "  require('./steps/03_extract'),",
                      "  require('./steps/01_clean'),",
                      "  require('./steps/04_build_key'),",
                      "];",
                      "  require('./steps/02_decode'),",
                      "",
                      "async function main() {",
                      "  let data = await steps[0]('payload');",
                      "  data = await steps[1](data);",
                      "  data = await steps[3](data);",
                      "  data = await steps[2](data);",
                      "main();",
                      "  console.log('Done.');",
                      "}",
                  ]) + "\n"))
    files.append(("C:/My Documents/Projects/usb_cracker/decrypt.js",
                  "// decrypt.js (BROKEN / PARTIAL)\nmodule.exports = function decrypt(raw) {\n  return raw;\n};\n"))
    files.append(("C:/My Documents/Projects/usb_cracker/steps/01_clean.js",
                  "// 01_clean.js\nmodule.exports = async (input) => input.trim();\n"))
    files.append(("C:/My Documents/Projects/usb_cracker/steps/02_decode.js",
                  "// 02_decode.js\nmodule.exports = async (input) => input + '::decode';\n"))
    files.append(("C:/My Documents/Projects/usb_cracker/steps/03_extract.js",
                  "// 03_extract.js\nmodule.exports = async (input) => input + '::extract';\n"))
    files.append(("C:/My Documents/Projects/usb_cracker/steps/04_build_key.js",
                  "// 04_build_key.js\nmodule.exports = async (input) => input + '::build';\n"))

    # Projects / old_scripts
    files.append(("C:/My Documents/Projects/old_scripts/decrypt_backup.js",
                  "// decrypt_backup.js (older snapshot)\n"
                  "function cleanData(raw) { return raw.replace(/-----.*-----/g, '').trim(); }\n"
                  "function decodePayload(p) { return p; }\n"
                  "module.exports = { cleanData, decodePayload };\n"))
    files.append(("C:/My Documents/Projects/old_scripts/old_notes.txt",
                  "Cleaning and decoding still work.\nKey building changed; habit got fused with a count.\n"))

    # Projects / experiments
    files.append(("C:/My Documents/Projects/experiments/temp.js",
                  "// temp.js\nconst fake = 'not-even-close';\nconsole.log(fake.split('_').reverse().join('_'));\n"))
    files.append(("C:/My Documents/Projects/experiments/hello_world.js",
                  "// hello_world.js\nconsole.log('hello world');\n"))

    # Images and Audio
    files.append(("C:/My Documents/Images/desktop.jpg", ""))
    files.append(("C:/My Documents/Audio/recording.wav",
                  "Static recording: clean, decode, extract, build, then run.\n"))

    # Recycle Bin
    files.append(("C:/Recycle Bin/run_fixed_order.txt",
                  "Correct order:\n1) CLEAN\n2) DECODE\n3) EXTRACT\n4) BUILD\n"))
    files.append(("C:/Recycle Bin/usb_cracker_steps_backup.txt",
                  "backup-01_clean.js\nbackup-02_decode.js\nbackup-03_extract.js\nbackup-04_build_key.js\nfirst is clean, last is build.\n"))
    files.append(("C:/Recycle Bin/decrypt_old.js",
                  "// decrypt_old.js\nfunction cleanData(raw){return raw.trim();}\nfunction decodePayload(p){return p;}\nmodule.exports={cleanData,decodePayload};\n"))
    files.append(("C:/Recycle Bin/note_draft.txt",
                  "I only feel calm when the fan hums.\nOrder keeps me from guessing.\n"))
    files.append(("C:/Recycle Bin/password_old.txt",
                  "Old format was five parts.\nNew one is four and ends with a double mark.\n"))

    return files


def _metadata_for_path(path: str, content: str, owner: OwnerProfile, rng: random.Random) -> Dict[str, str]:
    year = owner.birth_year
    month = rng.randint(1, 12)
    day = rng.randint(1, 28)
    hour = rng.randint(1, 12)
    minute = rng.randint(0, 59)
    ampm = "AM" if rng.random() < 0.5 else "PM"
    created = f"{month:02d}/{day:02d}/{year} {hour:02d}:{minute:02d} {ampm}"
    modified = f"{month:02d}/{day:02d}/{year} {((hour % 12) + 1):02d}:{minute:02d} {ampm}"

    size = f"{max(0, len(content))} bytes"
    metadata = {"created": created, "modified": modified, "size": size}

    if path.endswith("desktop.jpg"):
        parts = [p[:1].upper() for p in owner.full_name.split() if p]
        metadata["author"] = ".".join(parts) + "."

    return metadata


def generate_run_payload(seed: str | None = None) -> Dict[str, Any]:
    if seed is None:
        seed = secrets.token_hex(16)
    rng = random.Random(seed)

    owner = _generate_owner_for_run(rng)
    blocks = _derive_blocks_for_run(owner)
    password = "_".join(blocks)

    files = _generate_run_files(owner, blocks)
    file_entries = [
        {"path": path, "content": content, "metadata": _metadata_for_path(path, content, owner, rng)}
        for (path, content) in files
    ]

    return {
        "seed": seed,
        "owner": {
            "full_name": owner.full_name,
            "alias": owner.alias,
            "traits": list(owner.traits),
            "emotional_anchor": owner.emotional_anchor,
            "habit": owner.habit,
            "dob_month": owner.dob_month,
            "dob_day": owner.dob_day,
            "birth_year": owner.birth_year,
            "identity_keyword": owner.identity_keyword,
            "ritual_symbol": owner.ritual_symbol,
        },
        "password": password,
        "files": file_entries,
    }


def generate_run_json(seed: str | None = None) -> str:
    payload = generate_run_payload(seed=seed)
    return json.dumps(payload, ensure_ascii=False)


def _main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Generate a new XP game run payload as JSON.")
    parser.add_argument("--seed", default=None, help="Optional RNG seed (hex or any string).")
    args = parser.parse_args(argv[1:])
    print(generate_run_json(seed=args.seed))
    return 0


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv))
