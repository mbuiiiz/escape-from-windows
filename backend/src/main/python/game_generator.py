from __future__ import annotations

import argparse
from dataclasses import dataclass
import json
import random
import secrets
import sys
from typing import Any, Dict, List, Tuple


@dataclass(frozen=True)
class OwnerProfile:
    full_name: str
    alias: str
    traits: Tuple[str, ...]
    emotional_anchor: str
    habit: str
    significant_year: int
    year_clue_a: str
    year_clue_b: str
    ritual_symbol: str


@dataclass(frozen=True)
class GameInstance:
    owner: OwnerProfile
    # Internal only; never render directly
    blocks: Tuple[str, str, str, str, str]

    def render(self) -> str:
        # Keep output plain text only.
        file_text = generate_files(self.owner, self.blocks)
        consistency = generate_consistency_notes(self.blocks)
        return (
            "────────────────────────\n"
            "STEP 1 — OWNER PROFILE\n"
            "────────────────────────\n"
            f"Full name: {self.owner.full_name}\n"
            f"Preferred alias / self-shortened identity: {self.owner.alias}\n"
            f"Personality traits: {', '.join(self.owner.traits)}\n"
            f"Emotional anchor (abstract): {self.owner.emotional_anchor}\n"
            f"Habitual behavior: {self.owner.habit}\n"
            "One significant year (emotionally important): "
            f"{self.owner.year_clue_a} … {self.owner.year_clue_b}\n"
            f"One ritual symbol: {self.owner.ritual_symbol}\n"
            "\n"
            "────────────────────────\n"
            "STEP 2 — PASSWORD (INTERNAL)\n"
            "────────────────────────\n"
            "Internal 4-block structure: block1_block2_block3_block4\n"
            "Do not reveal the blocks explicitly.\n"
            "\n"
            "────────────────────────\n"
            "STEP 3 — FILE CONTENT GENERATION\n"
            "────────────────────────\n"
            f"{file_text}\n"
            "\n"
            "────────────────────────\n"
            "STEP 4 — CONSISTENCY CHECK\n"
            "────────────────────────\n"
            "Consistency Notes (for developer)\n"
            f"{consistency}\n"
        )

    def render_files_only(self) -> str:
        return generate_files(self.owner, self.blocks)


def generate_run_text(seed: str | None = None) -> str:
    """
    Generate a full "game run" output in the [DEV]/[FILE] format expected by the game tooling.
    Includes the full password exactly once in [DEV], and never prints any full block verbatim
    inside file contents.
    """
    if seed is None:
        seed = secrets.token_hex(16)
    rng = random.Random(seed)

    owner = _generate_owner_for_run(rng)
    blocks = _derive_blocks_for_run(rng, owner)
    block1, block2, block3, block4, block5 = blocks

    password = f"{block1}_{block2}_{block3}_{block5}"

    vibe = _pick(
        rng,
        [
            "Private, meticulous, and a little superstitious about routines.",
            "Soft-spoken, stubborn, and protective of small rituals.",
            "Quietly sentimental, allergic to attention, and very methodical.",
            "Restless in daylight, calm only when the world gets quiet.",
        ],
    )

    files = _generate_run_files(rng, owner, blocks)
    out = []
    out.append("[DEV]")
    out.append(f"owner_full_name: {owner.full_name}")
    out.append(f"password: {password}")
    out.append(f"notes: {vibe}")
    out.append("")

    for path, content in files:
        out.append(f"[FILE] {path}")
        out.append(content.rstrip("\n"))
        out.append("")

    return "\n".join(out).rstrip() + "\n"


def generate_run_payload(seed: str | None = None) -> Dict[str, Any]:
    """
    Generate a single run payload as a Python dict for JSON serialization.
    Preserves existing generation logic and outputs the password only at top level.
    """
    if seed is None:
        seed = secrets.token_hex(16)
    rng = random.Random(seed)

    owner = _generate_owner_for_run(rng)
    blocks = _derive_blocks_for_run(rng, owner)
    block1, block2, block3, block4, block5 = blocks
    password = f"{block1}_{block2}_{block3}_{block5}"

    files = _generate_run_files(rng, owner, blocks)
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
            "significant_year": owner.significant_year,
            "year_clue_a": owner.year_clue_a,
            "year_clue_b": owner.year_clue_b,
            "ritual_symbol": owner.ritual_symbol,
        },
        "password": password,
        "files": file_entries,
    }


def generate_run_json(seed: str | None = None) -> str:
    """
    Generate a single run payload as JSON (and nothing else).
    """
    payload = generate_run_payload(seed=seed)
    return json.dumps(payload, ensure_ascii=False)


def _generate_owner_for_run(rng: random.Random) -> OwnerProfile:
    first_names = [
        "Marina",
        "Evelyn",
        "Jonah",
        "Soren",
        "Talia",
        "Noah",
        "Iris",
        "Caleb",
        "Vera",
        "Carmen",
    ]
    middle_names = [
        "Celeste",
        "June",
        "Avery",
        "Rowan",
        "Mira",
        "Hollis",
        "Quinn",
        "Sage",
        "Wren",
        "Dahlia",
    ]
    last_names = [
        "Dorsey",
        "Kline",
        "Navarro",
        "Bishop",
        "Sato",
        "Harper",
        "Lennox",
        "Monroe",
        "Archer",
        "Mercer",
    ]
    aliases = [
        "Rin",
        "Lio",
        "Sam",
        "Nox",
        "Rue",
        "Kit",
        "Jae",
        "Sol",
        "Bee",
        "Ash",
    ]
    traits = [
        "meticulous",
        "avoidant",
        "patient",
        "restless",
        "soft-spoken",
        "stubborn",
        "sentimental",
        "practical",
        "superstitious",
        "wry",
    ]
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
    ritual_symbols = ["!!", "??", "##", "++", "--", "~~", "::", "<>"]

    # Year is stored internally; never printed in any file content.
    year = rng.randint(2000, 2012)

    # Keep split clue fragments in words only (no digits).
    last_two = year % 100
    last_two_words = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
        11: "eleven",
        12: "twelve",
    }
    tail_word = last_two_words.get(last_two, "something small")

    year_clue_a = _pick(
        rng,
        [
            "the front is always ‘two thousand’ when I think it",
            "I only ever write the beginning as words, not numbers",
        ],
    )
    year_clue_b = _pick(
        rng,
        [
            f"the ending is ‘{tail_word}’, but I never put it beside the front",
            f"I leave the tail as ‘{tail_word}’ somewhere else",
        ],
    )

    return OwnerProfile(
        full_name=f"{_pick(rng, first_names)} {_pick(rng, middle_names)} {_pick(rng, last_names)}",
        alias=_pick(rng, aliases),
        traits=_pick_unique(rng, traits, n=4),
        emotional_anchor=_pick(rng, anchors),
        habit=_pick(rng, habits),
        significant_year=year,
        year_clue_a=year_clue_a,
        year_clue_b=year_clue_b,
        ritual_symbol=_pick(rng, ritual_symbols),
    )


def _derive_blocks_for_run(rng: random.Random, owner: OwnerProfile) -> Tuple[str, str, str, str, str]:
    # block1: initials from full name (not used elsewhere; hints point to image "Author" initials).
    initials = "".join([p[:1] for p in owner.full_name.split() if p]).upper()
    block1 = initials[:3]

    # block2: emotional anchor motif (ensure we never print this string in any file content).
    motifs = ["afterhours", "halfwake", "dustlight", "humming", "threshold", "echo"]
    block2 = _pick(rng, motifs)

    # block3: routine fused count+action (ensure we never print it fused).
    habit_lower = owner.habit.lower()
    if "tap" in habit_lower:
        block3 = "threetap"
    elif "check" in habit_lower:
        block3 = "twicecheck"
    elif "pairs" in habit_lower or "pair" in habit_lower:
        block3 = "twosave"
    else:
        block3 = "againread"

    # block4: significant year (digits). Never printed in any in-game text.
    block4 = str(owner.significant_year)

    # block5: ritual symbol reduced to a single character. Never printed in any in-game text.
    block5 = owner.ritual_symbol[:1]

    return (block1, block2, block3, block4, block5)


def _generate_run_files(
    rng: random.Random,
    owner: OwnerProfile,
    blocks: Tuple[str, str, str, str, str],
) -> List[Tuple[str, str]]:
    """
    Generate the in-game files listed by the spec prompt.
    File contents must not contain the full password or any full block verbatim.
    """
    block1, block2, block3, block4, block5 = blocks

    # Helpers for non-verbatim hints.
    def anchor_phrase() -> str:
        # Avoid printing motif tokens (e.g. "afterhours") by using safe paraphrases.
        return {
            "afterhours": "after hours, when the day finally stops looking at me",
            "halfwake": "in that in-between sleep where thoughts feel sharper",
            "dustlight": "when dust hangs in light and time feels slow",
            "humming": "when the room has that low electrical buzz",
            "threshold": "standing in a doorway, not inside and not out",
            "echo": "listening for what comes back after I speak",
        }.get(block2, "when the world gets quiet enough to hear myself")

    def routine_lines() -> Tuple[str, str]:
        habit_lower = owner.habit.lower()
        if "tap" in habit_lower:
            return ("tap the desk", "three times")
        if "check" in habit_lower:
            return ("check the clock", "twice")
        if "pairs" in habit_lower or "pair" in habit_lower:
            return ("save drafts", "in pairs")
        return ("reread the same line", "again")

    routine_action, routine_count = routine_lines()

    # Symbol hint (never print the literal symbol).
    symbol_hint = {
        "!": "the symbol above the one key",
        "?": "the punctuation you use when you don’t know",
        "#": "the fence-like mark people call a ‘hash’",
        "+": "the thing programmers say when they mean ‘add one’",
        "-": "a small dash",
        "~": "a wavy line like a sigh",
        ":": "two dots stacked",
        "<": "a left angle bracket",
        ">": "a right angle bracket",
    }.get(block5, "a small mark")

    # Exactly ONE misleading identity hint: not the real alias.
    handles = ["Rin", "Lio", "Sam", "Nox", "Rue", "Kit", "Jae", "Sol", "Bee", "Ash"]
    mis = _pick(rng, handles)
    if mis == owner.alias:
        mis = handles[(handles.index(mis) + 1) % len(handles)]

    files: List[Tuple[str, str]] = []

    # Notes/
    files.append(
        (
            "C:/My Documents/Notes/todo.txt",
            "\n".join(
                [
                    "- fix the broken script in usb_cracker (in order, no skipping)",
                    "- stop trying to make it work by brute force",
                    f"- I still {routine_action} before I run anything",
                    f"- I still do it {routine_count}",
                    "- the count comes first, then the action, and I always glue it into one thing",
                    "- clean up the drafts folder (too many almost-right scraps)",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Notes/notes.txt",
            "\n".join(
                [
                    "Names get noisy fast.",
                    "",
                    "If you need something that stays consistent, stop reading my words and check what the system remembers.",
                    "Pictures have properties. The “Author” field is just initials. Remove the dots.",
                    "",
                    "Dates don’t lie either.",
                    "Don’t copy the whole date. Take only the year from properties and ignore the rest.",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Notes/syntax_help.txt",
            "\n".join(
                [
                    "JS reminders:",
                    "- cleaning is not decoding",
                    "- decoding is not decrypting",
                    "- “looks readable” is not the same as “is correct”",
                    "",
                    "Also:",
                    "- the last marker is a keyboard thing, not a word",
                    f"- it’s {symbol_hint}",
                    "- I do it because it feels finished",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Notes/passwords_draft.txt",
            "\n".join(
                [
                    "old attempts that felt “safe” (so they were wrong):",
                    "- admin_admin_zero_something_end",
                    "- home_owner_two_words_marker",
                    "- test_user_smallnumber_repeat",
                    "",
                    "and the one that keeps getting brought up by people who don’t know me:",
                    f"- “{mis}” (they’re remembering the wrong account)",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Notes/random_thoughts.txt",
            "\n".join(
                [
                    "I don’t think I’m consistent.",
                    "I think I’m careful.",
                    "",
                    f"There’s a version of me that only exists {anchor_phrase()}.",
                    "That’s the only one that can sit still long enough to fix anything.",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Notes/shopping_list.txt",
            "\n".join(["Coffee", "Batteries", "Sticky notes", "Cheap USB cable", "Pencil (soft lead)"]) + "\n",
        )
    )

    # usb_cracker/
    files.append(
        (
            "C:/My Documents/Projects/usb_cracker/decrypt.js",
            "\n".join(
                [
                    "/*",
                    "  decrypt.js (BROKEN)",
                    "",
                    "  This is not runnable. It’s a shell I left behind.",
                    "",
                    "  What it used to do:",
                    "    - read the protected blob",
                    "    - strip the wrapper",
                    "    - decode what’s inside",
                    "    - rebuild the missing step",
                    "    - reverse the transform",
                    "    - assemble the final output",
                    "",
                    "  What’s missing now:",
                    "    - the part that makes the key correct",
                    "    - the part that reverses the transform correctly",
                    "    - the part that assembles output cleanly",
                    "",
                    "  If you try to guess the order, you’ll get something that looks like it worked.",
                    "  That’s the trap.",
                    "*/",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Projects/usb_cracker/README.md",
            "\n".join(
                [
                    "This used to work.",
                    "",
                    "I fixed it in stages, not all at once.",
                    "What mattered was doing it in the right order:",
                    "- inspect what you have",
                    "- remove what doesn’t belong",
                    "- decode what’s still encoded",
                    "- rebuild what’s missing",
                    "- reverse the protection",
                    "- put the pieces back together",
                    "",
                    "One personal habit I couldn’t remove:",
                    "the ending is repeated, not described.",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Projects/usb_cracker/test_data.txt",
            "\n".join(
                [
                    "SAMPLE A (not from the USB):",
                    "lorem_ipsum_payload_not_real",
                    "",
                    "SAMPLE B (from an older unrelated test):",
                    "deadbeefcafebabe",
                    "",
                    "If this “helps,” you’re probably using the wrong file.",
                ]
            )
            + "\n",
        )
    )

    # old_scripts/
    files.append(
        (
            "C:/My Documents/Projects/old_scripts/decrypt_backup.js",
            "\n".join(
                [
                    "// decrypt_backup.js (PARTIAL)",
                    "//",
                    "// Older snapshot.",
                    "// Cleaning and decoding are still reliable.",
                    "// Anything about key-building here is outdated.",
                    "",
                    "function cleanData(raw) {",
                    "  return raw",
                    "    .split(/\\r?\\n/)",
                    "    .map(l => l.trim())",
                    "    .filter(Boolean)",
                    "    .filter(l => !l.includes(\"BEGIN\") && !l.includes(\"END\"))",
                    "    .join(\"\");",
                    "}",
                    "",
                    "function decodePayload(payload) {",
                    "  if (typeof Buffer !== \"undefined\") {",
                    "    return Buffer.from(payload, \"base64\").toString(\"utf8\");",
                    "  }",
                    "  return atob(payload);",
                    "}",
                    "",
                    "// OUTDATED: this used to be enough",
                    "function buildKey_OLD(meta) {",
                    "  const tag = String(meta && meta.authorTag ? meta.authorTag : \"\");",
                    "  return tag.replace(/[^a-zA-Z]/g, \"\").toLowerCase();",
                    "}",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Projects/old_scripts/old_notes.txt",
            "\n".join(
                [
                    "The cleaning step was fine.",
                    "The decoding step didn’t change.",
                    "",
                    "What broke everything:",
                    "- key building (it’s not “just the label” anymore)",
                    "",
                    "What I remember doing that I wish I didn’t:",
                    "- I put a stupid little habit into the key",
                    "- I always write the count before the action",
                    "- and I always fuse it together like it’s one word",
                ]
            )
            + "\n",
        )
    )

    # experiments/
    files.append(
        (
            "C:/My Documents/Projects/experiments/temp.js",
            "\n".join(
                [
                    "// temp.js",
                    "// random scratch",
                    "// nothing here matches the real data",
                    "",
                    "const fake = \"not-even-close\";",
                    "console.log(fake.split(\"_\").reverse().join(\"_\"));",
                ]
            )
            + "\n",
        )
    )
    files.append(
        (
            "C:/My Documents/Projects/experiments/hello_world.js",
            "\n".join(
                [
                    "// hello_world.js",
                    "// leftover tutorial file",
                    "",
                    "console.log(\"hello world\");",
                ]
            )
            + "\n",
        )
    )

    # Recycle Bin/
    files.append(
        (
            "C:/Recycle Bin/decrypt_old.js",
            "\n".join(
                [
                    "// decrypt_old.js (older snippet)",
                    "//",
                    "// NOTE: this is old. Key logic was changed later.",
                    "// Cleaning and decoding are still usable.",
                    "",
                    "function cleanData(raw) {",
                    "  return raw.replace(/-----.*-----/g, \"\").trim();",
                    "}",
                    "",
                    "function decodePayload(p) {",
                    "  return atob(p);",
                    "}",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/Recycle Bin/note_draft.txt",
            "\n".join(
                [
                    "I deleted this because it sounded dramatic.",
                    "",
                    f"It’s always the same: I only feel like myself {anchor_phrase()}.",
                    "Like the room stops judging me and I can finally breathe.",
                    "",
                    "I hate that I built anything important around that feeling.",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/Recycle Bin/password_old.txt",
            "\n".join(
                [
                    "Old format was predictable.",
                    "Five pieces.",
                    "Same divider every time.",
                    "",
                    "Back then I used the year from file properties, because I trusted the system more than I trusted myself.",
                    "I still do, honestly.",
                ]
            )
            + "\n",
        )
    )

    files.append(
        (
            "C:/My Documents/Images/desktop.jpg",
            "",
        )
    )

    return files


def _pick(rng: random.Random, items: List[str]) -> str:
    return rng.choice(items)


def _pick_unique(rng: random.Random, items: List[str], n: int) -> Tuple[str, ...]:
    pool = list(items)
    rng.shuffle(pool)
    return tuple(pool[:n])


def _split_word(word: str) -> Tuple[str, str]:
    if len(word) < 4:
        return (word[:1], word[1:])
    mid = len(word) // 2
    return (word[:mid], word[mid:])


def _acrostic(lines: List[str]) -> str:
    # First letters only; safe with empty lines stripped.
    return "".join([ln[:1] for ln in lines if ln.strip()]).lower()


def _metadata_for_path(path: str, content: str, owner: OwnerProfile, rng: random.Random) -> Dict[str, str]:
    def initials(name: str) -> str:
        parts = [p for p in name.replace("-", " ").split(" ") if p]
        letters = [p[0].upper() for p in parts[:2]]
        return ".".join(letters) + "."

    year = owner.significant_year
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
        metadata["author"] = initials(owner.full_name)
        metadata["signature"] = f"{owner.alias.lower()}-{year}"

    return metadata


def new_game_instance(seed: str | None = None) -> GameInstance:
    """
    Create a new game instance with internally-derived 5 blocks.
    Blocks must never be rendered directly.
    """
    if seed is None:
        seed = secrets.token_hex(16)
    rng = random.Random(seed)

    first_names = [
        "Marina",
        "Evelyn",
        "Jonah",
        "Soren",
        "Talia",
        "Noah",
        "Iris",
        "Caleb",
        "Vera",
        "Carmen",
    ]
    middle_names = [
        "Celeste",
        "June",
        "Avery",
        "Rowan",
        "Mira",
        "Hollis",
        "Quinn",
        "Sage",
        "Wren",
        "Dahlia",
    ]
    last_names = [
        "Dorsey",
        "Kline",
        "Navarro",
        "Bishop",
        "Sato",
        "Harper",
        "Lennox",
        "Monroe",
        "Archer",
        "Mercer",
    ]
    aliases = [
        "Rin",
        "Lio",
        "Sam",
        "Nox",
        "Rue",
        "Kit",
        "Jae",
        "Sol",
        "Bee",
        "Ash",
    ]
    traits = [
        "meticulous",
        "avoidant",
        "patient",
        "restless",
        "soft-spoken",
        "stubborn",
        "sentimental",
        "practical",
        "superstitious",
        "wry",
    ]
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
    ritual_symbols = ["[][]", "!!", "~~", "::", "<>", "==", "##", "++", "--", "//"]

    # Significant year is stored internally; surfaced only as split clue fragments (no digits).
    # Keep it in the XP-era range for tone and for simple wording.
    year = rng.randint(2000, 2012)
    last_two = year % 100

    last_two_words = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
        11: "eleven",
        12: "twelve",
    }
    tail_word = last_two_words.get(last_two, "something small")

    year_clue_a = _pick(
        rng,
        [
            "the front is always ‘two thousand’ when I think it",
            "I only ever write the beginning as words, not numbers",
            "the first half is the same phrase I start everything with: ‘two thousand’",
        ],
    )
    year_clue_b = _pick(
        rng,
        [
            f"the ending is ‘{tail_word}’, but I never put it beside the front",
            f"I leave the tail as ‘{tail_word}’ somewhere else",
            f"the last bit is ‘{tail_word}’ and it shows up when I’m tired",
        ],
    )

    owner = OwnerProfile(
        full_name=f"{_pick(rng, first_names)} {_pick(rng, middle_names)} {_pick(rng, last_names)}",
        alias=_pick(rng, aliases),
        traits=_pick_unique(rng, traits, n=4),
        emotional_anchor=_pick(rng, anchors),
        habit=_pick(rng, habits),
        significant_year=year,
        year_clue_a=year_clue_a,
        year_clue_b=year_clue_b,
        ritual_symbol=_pick(rng, ritual_symbols),
    )

    blocks = derive_internal_blocks(rng, owner)
    return GameInstance(owner=owner, blocks=blocks)


def derive_internal_blocks(rng: random.Random, owner: OwnerProfile) -> Tuple[str, str, str, str, str]:
    """
    Derive internal blocks from owner details.
    Must not be rendered directly in any output.
    """
    # block1: identity habit — derived from trait initials (not a name or alias directly)
    trait_initials = "".join([t[0] for t in owner.traits if t]).lower()
    block1 = trait_initials[:5]

    # block2: emotional anchor — pick a motif word (not directly written in files; encoded across two)
    anchor_motifs = ["threshold", "echo", "humming", "afterhours", "dustlight", "halfwake"]
    block2 = _pick(rng, anchor_motifs)

    # block3: repetition/routine — count-word + action fused (kept internal; hinted as spacing rule)
    habit_lower = owner.habit.lower()
    if "tap" in habit_lower:
        block3 = "three" + "tap"
    elif "check" in habit_lower:
        block3 = "twice" + "check"
    elif "pairs" in habit_lower or "pair" in habit_lower:
        block3 = "two" + "save"
    else:
        block3 = "again" + "read"

    # block4: regret/past year — year rendered as two pieces in output, joined internally.
    block4 = f"{owner.significant_year}"

    # block5: ritual symbol — conceptualized as a doubled word, not the glyph itself.
    symbol_words = {
        "[][]": "boxesboxes",
        "!!": "bangbang",
        "~~": "wavewave",
        "::": "dotdot",
        "<>": "angleangle",
        "==": "equal equal".replace(" ", ""),
        "##": "hashhash",
        "++": "plusplus",
        "--": "dashdash",
        "//": "slashslash",
    }
    block5 = symbol_words.get(owner.ritual_symbol, "doublemark")

    return (block1, block2, block3, block4, block5)


def generate_files(owner: OwnerProfile, blocks: Tuple[str, str, str, str, str]) -> str:
    block1, block2, block3, block4, block5 = blocks

    # Exactly one acrostic-based hint is permitted: use it for block2 only.
    b2a, _b2b_unused = _split_word(block2)

    # Encode the year block split across two files (no file contains the full year).
    # Year split clue parts (no digits; no single place contains the full year).
    # Keep consistent with the owner profile wording.
    y_front_words = "two thousand"
    y_tail_words = owner.year_clue_b.split("‘")[1].split("’")[0] if "‘" in owner.year_clue_b else "something"

    # Static assets: keep constant between runs (symbolic, not factual).
    desktop_bg = (
        "Visible detail:\n"
        "A Windows XP ‘Bliss’-style hill, but the colors are slightly washed, like it’s been re-saved too many times.\n"
        "Near the bottom edge are faint blank shapes, like someone planned to label things and never did.\n"
        "In the top-left corner, there’s a tiny repeating geometric doodle that looks meaningless until you stare at it.\n"
        "\n"
        "Properties (as shown in XP):\n"
        "Type: Bitmap Image\n"
        "Dimensions: (unknown)\n"
        "Bit depth: (unknown)\n"
        "Artist: (blank)\n"
        "Title: (blank)\n"
        "Comments: “template”\n"
        "Date picture taken: (not available)\n"
    )
    family_photo = (
        "Visible scene:\n"
        "A slightly blurred indoor photo: a kitchen table, two mugs, and a chair pushed back slightly too far.\n"
        "A note card in the background has faint doodles on it—nothing readable.\n"
        "\n"
        "Metadata fields:\n"
        "Camera: (unknown)\n"
        "Author: (blank)\n"
        "Copyright: (blank)\n"
        "Date taken: (blank)\n"
        "Software: (blank)\n"
        "Comment: (blank)\n"
    )
    recording = (
        "“Okay. Slow down.\n"
        "\n"
        "Look first.\n"
        "Then clean.\n"
        "Then make it readable.\n"
        "Then rebuild it.\n"
        "Then undo it.\n"
        "Then put it back.\n"
        "\n"
        "If you skip ahead, you’ll only prove you can guess.”\n"
    )

    # Recycle Bin:
    # - meaningful: max 3
    # - misleading: 2
    # - noise: 1–2

    # Meaningful #1 (acrostic): emotional anchor motif (block2)
    # Keep it human; avoid mangling words by overwriting the first character.
    acrostic_sentence_by_letter = {
        "a": "Alone, the world stops asking questions.",
        "c": "Certain corners feel like a secret you can breathe in.",
        "d": "Dust in the air makes the light look softer than it is.",
        "e": "Even silence has a second sound if you wait.",
        "f": "Fluorescent hum is the only lullaby that never lies.",
        "h": "Hollow rooms feel safer because they don’t answer back.",
        "l": "Late hours make everything feel more honest.",
        "m": "Monitor-noise calm is a stupid thing to miss, but I do.",
        "r": "Rooms with echoes let me pretend I’m not alone.",
        "s": "Some thresholds feel kinder than people.",
        "t": "Thresholds are easier than entrances.",
        "u": "Usually I go back there when I can’t stand myself.",
    }
    recycle_meaningful_anchor_lines = []
    for ch in b2a.lower():
        sentence = acrostic_sentence_by_letter.get(ch, "Somewhere in here is a pattern I don’t want to admit to.")
        # Ensure the first character matches the acrostic letter.
        recycle_meaningful_anchor_lines.append(ch.upper() + sentence[1:])
    recycle_meaningful_anchor_lines.extend(
        [
            "",
            "I wrote that down and immediately regretted it.",
        ]
    )

    # Meaningful #2: routine hint (block3)
    routine_note = (
        "I do the same little thing before I run anything.\n"
        "It’s not a tic. It’s a checkpoint.\n"
        "\n"
        "If you’re reconstructing what I broke, the habit belongs together with itself.\n"
        "No extra gaps.\n"
    )

    # Meaningful #3: year split (block4)
    year_split_note = (
        "I don’t write the year in one place.\n"
        "I leave the front as words somewhere boring,\n"
        f"and the last bit shows up as “{y_tail_words}” somewhere else when I’m tired.\n"
        "\n"
        "It’s not clever. It’s just avoidance.\n"
    )

    # Misleading and noise.
    handles = ["Rin", "Lio", "Sam", "Nox", "Rue", "Kit", "Jae", "Sol", "Bee", "Ash"]
    handle_seed = block1 + block2 + block3 + block4 + block5
    idx = sum(ord(c) for c in handle_seed) % len(handles)
    misleading_alias = handles[idx]
    if misleading_alias == owner.alias:
        misleading_alias = handles[(idx + 1) % len(handles)]

    recycle_misleading_1 = (
        "five parts, same divider. fine.\n"
        "\n"
        f"Someone is going to swear I used to go by “{misleading_alias}”.\n"
        "They can keep that story. It’s not mine.\n"
        "\n"
        "warm_static_window_museum_final\n"
        "paper_lamp_laundry_sunday_end\n"
        "nothing_about_this_is_right\n"
        "\n"
        "(none of these ever felt real)\n"
    )
    recycle_misleading_2 = (
        "FREE RAM DOWNLOAD\n"
        "CLICK HERE FOR SPEED BOOST\n"
        "totally-legit.example (no, really)\n"
        "\n"
        "(why did I even keep this)\n"
    )
    recycle_noise_1 = "[.ShellClassInfo]\nLocalizedResourceName=@shell32.dll,-21770\n"
    recycle_noise_2 = "(binary file)\n"

    anchor_hint_map = {
        "threshold": "I hover at the edge of things, like stepping forward would make it real.",
        "echo": "I keep listening for what comes back after I speak, even when nothing should.",
        "humming": "That steady electrical noise is the closest thing I have to quiet.",
        "afterhours": "Everything feels more honest when the day finally stops looking at me.",
        "dustlight": "Dust in slanted light makes time feel slow enough to hold.",
        "halfwake": "My thoughts make the most sense in the gap between waking and sleeping.",
    }
    anchor_hint_line = anchor_hint_map.get(block2, "There’s a place I keep circling back to when I can’t stand myself.")

    habit_lower = owner.habit.lower()
    if "tap" in habit_lower:
        routine_action_line = "I tap the desk before I run anything."
        routine_count_word = "three"
    elif "check" in habit_lower:
        routine_action_line = "I check the clock before I run anything."
        routine_count_word = "twice"
    elif "pairs" in habit_lower or "pair" in habit_lower:
        routine_action_line = "I save drafts a certain way before I run anything."
        routine_count_word = "two"
    else:
        routine_action_line = "I reread the same line before I run anything."
        routine_count_word = "again"

    routine_count_line = (
        "I do it again, every time"
        if routine_count_word == "again"
        else f"I do it {routine_count_word} times, every time"
    )

    notes_old_text = (
        "What still works:\n"
        "- stripping the wrapper\n"
        "- decoding the payload\n"
        "\n"
        "What does not work anymore:\n"
        "- the easy key\n"
        "- the old reversal\n"
        "\n"
        "Things I remember without wanting to:\n"
        "- the identity tag only matters after you strip what’s cosmetic\n"
        f"- {anchor_hint_line}\n"
        f"- {routine_action_line}\n"
        f"- {routine_count_line}\n"
        f"- the front of the year is always “{y_front_words}” in my head\n"
        "- the year is there, but I never write it in one piece\n"
        "- the ending is how I say it to myself (twice), not how I draw it\n"
    )

    # Avoid printing the alias or name as a key; keep it as characterization only.
    # Also avoid the literal word "password" inside file contents (keep abstract if needed).
    return (
        "usb_decrypt/\n"
        "------------------------------------------------------------\n"
        "usb_decrypt/decrypt.js (BROKEN, comments only)\n"
        "------------------------------------------------------------\n"
        "/*\n"
        "  decrypt.js (BROKEN)\n"
        "\n"
        "  What should happen, in plain terms:\n"
        "    - take the raw blob\n"
        "    - remove the wrapper\n"
        "    - decode what’s inside\n"
        "    - rebuild what was missing\n"
        "    - reverse the protection\n"
        "    - assemble the pieces in the same divider style\n"
        "\n"
        "  Missing on purpose:\n"
        "    - key builder\n"
        "    - reversal logic\n"
        "    - final assembly\n"
        "*/\n"
        "\n"
        "------------------------------------------------------------\n"
        "usb_decrypt/README.md\n"
        "------------------------------------------------------------\n"
        "This script used to work.\n"
        "\n"
        "I fixed it in stages, not all at once.\n"
        "What mattered was doing things in the right order:\n"
        "- inspect what you have\n"
        "- remove what doesn’t belong\n"
        "- turn unreadable into readable\n"
        "- rebuild what was missing\n"
        "- reverse the protection\n"
        "- put everything back together\n"
        "\n"
        "If you jump ahead, it won’t make sense.\n"
        "\n"
        "One more thing:\n"
        "the ending is something I repeat to myself, not something I draw.\n"
        "\n"
        "------------------------------------------------------------\n"
        "usb_decrypt/test_data.txt (irrelevant / misleading)\n"
        "------------------------------------------------------------\n"
        "BEGIN SAMPLE\n"
        "c29tZXRoaW5nLXRoaXMtbG9va3MtbGlrZS1pdC1tZWFucy1zb21ldGhpbmc=\n"
        "END SAMPLE\n"
        "\n"
        "BEGIN SAMPLE\n"
        "b25lX3R3b19maXZlX3NldmVuX3RocmVl\n"
        "END SAMPLE\n"
        "\n"
        "(note: these samples were for a different exercise and do not match the USB format)\n"
        "\n"
        "old_scripts/\n"
        "------------------------------------------------------------\n"
        "old_scripts/decrypt_backup.js (PARTIAL)\n"
        "------------------------------------------------------------\n"
        + (
            "// decrypt_backup.js (PARTIAL)\n"
            "// Older snapshot. Some pieces still behave.\n"
            "\n"
            "function cleanWrapper(raw) {\n"
            "  return raw\n"
            "    .split(/\\r?\\n/)\n"
            "    .map(l => l.trim())\n"
            "    .filter(Boolean)\n"
            "    .filter(l => !/^---/.test(l))\n"
            "    .join(\"\");\n"
            "}\n"
            "\n"
            "function decodePayload(payload) {\n"
            "  // this did NOT change\n"
            "  if (typeof Buffer !== \"undefined\") {\n"
            "    return Buffer.from(payload, \"base64\").toString(\"utf8\");\n"
            "  }\n"
            "  return atob(payload);\n"
            "}\n"
            "\n"
            "// OUTDATED: key logic is not just a visible tag anymore.\n"
            "function buildKey_OLD(meta) {\n"
            "  // old behavior: use a label directly\n"
            "  // labels are only useful after you strip cosmetic marks\n"
            "  return String(meta && meta.tag ? meta.tag : \"\").toLowerCase();\n"
            "}\n"
            "\n"
            "// OUTDATED: transform changed later.\n"
            "function reverseTransform_OLD(text, key) {\n"
            "  let out = \"\";\n"
            "  for (let i = 0; i < text.length; i++) {\n"
            "    const t = text.charCodeAt(i);\n"
            "    const k = key.charCodeAt(i % key.length);\n"
            "    out += String.fromCharCode((t ^ k) & 0xff);\n"
            "  }\n"
            "  return out;\n"
            "}\n"
        )
        + "\n"
        "------------------------------------------------------------\n"
        "old_scripts/notes_old.txt\n"
        "------------------------------------------------------------\n"
        + notes_old_text
        + "\n"
        "Images/ (STATIC assets)\n"
        "------------------------------------------------------------\n"
        "Images/desktop_bg.bmp\n"
        "------------------------------------------------------------\n"
        f"{desktop_bg}\n"
        "------------------------------------------------------------\n"
        "Images/family_photo.jpg\n"
        "------------------------------------------------------------\n"
        f"{family_photo}\n"
        "Audio/ (STATIC assets)\n"
        "------------------------------------------------------------\n"
        "Audio/recording.wav (exact spoken text)\n"
        "------------------------------------------------------------\n"
        f"{recording}\n"
        "Recycle Bin/\n"
        "------------------------------------------------------------\n"
        "Recycle Bin/anchor_draft.txt (meaningful)\n"
        "------------------------------------------------------------\n"
        + "\n".join(recycle_meaningful_anchor_lines)
        + "\n\n"
        "------------------------------------------------------------\n"
        "Recycle Bin/routine_note.txt (meaningful)\n"
        "------------------------------------------------------------\n"
        + routine_note
        + "\n"
        "------------------------------------------------------------\n"
        "Recycle Bin/year_split_note.txt (meaningful)\n"
        "------------------------------------------------------------\n"
        + year_split_note
        + "\n"
        "------------------------------------------------------------\n"
        "Recycle Bin/unlock_tryouts.txt (misleading)\n"
        "------------------------------------------------------------\n"
        + recycle_misleading_1
        + "\n"
        "------------------------------------------------------------\n"
        "Recycle Bin/definitely_not_suspicious.txt (misleading)\n"
        "------------------------------------------------------------\n"
        + recycle_misleading_2
        + "\n"
        "------------------------------------------------------------\n"
        "Recycle Bin/desktop.ini (noise)\n"
        "------------------------------------------------------------\n"
        + recycle_noise_1
        + "\n"
        "------------------------------------------------------------\n"
        "Recycle Bin/Thumbs.db (noise)\n"
        "------------------------------------------------------------\n"
        + recycle_noise_2
    )


def generate_consistency_notes(blocks: Tuple[str, str, str, str, str]) -> str:
    # Do NOT reveal the blocks; describe only how they are supported.
    return (
        "- block1 is supported by old_scripts/notes_old.txt (strip cosmetic marks) and old_scripts/decrypt_backup.js "
        "(old key builder uses a cleaned label).\n"
        "- block2 is supported by Recycle Bin/anchor_draft.txt (single acrostic) and old_scripts/notes_old.txt "
        "(the recurring place).\n"
        "- block3 is supported by Recycle Bin/routine_note.txt (no gaps / fused habit) and old_scripts/notes_old.txt "
        "(routine action + count).\n"
        "- block4 is supported by usb_decrypt/README.md (ending mark) and old_scripts/notes_old.txt (mark described indirectly).\n"
    )


def _main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Generate a new XP game run payload as JSON.")
    parser.add_argument("--seed", default=None, help="Optional RNG seed (hex or any string).")
    args = parser.parse_args(argv[1:])

    print(generate_run_json(seed=args.seed))
    return 0


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv))
