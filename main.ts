// Two Robots in an Elevator — make.fun entry
// Writes one funny line of awkward robot small talk to /output/entry.txt.
// SPDX-License-Identifier: MIT

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The entry: one robot sizes up the elevator silence the only way a
// machine knows how — by computing it, then admitting the math changes
// nothing. Robot logic shows through; the awkwardness is the punchline.
const ENTRY_LINE =
  "I calculated a 97.4% chance this silence is awkward. The remaining 2.6% is also awkward.";

// Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space.
const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 200;

function buildEntryLine(): string {
  return ENTRY_LINE;
}

function validateEntry(line: string): void {
  const length = [...line].length;
  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(
      `Entry must be ${GATE_MIN_CHARS}-${GATE_MAX_CHARS} characters, got ${length}.`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
}

// Resolve where the grader wants the output. The harness sets
// $MAKEFUN_OUTPUT_DIR (or $OUTPUT_PATH); in a bot sandbox /output is
// used when MAKEFUN_BOT_DIR is set; locally we write to ./output/.
// Never a hardcoded /output — the grader filesystem is read-only there.
function resolveOutputPath(): string {
  const envDir =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_PATH ?? null;
  if (envDir) {
    return join(resolve(envDir), "entry.txt");
  }
  if (process.env.MAKEFUN_BOT_DIR) {
    return join("/output", "entry.txt");
  }
  return join(resolve("output"), "entry.txt");
}

function main(): void {
  const line = buildEntryLine();
  validateEntry(line);
  const outPath = resolveOutputPath();
  mkdirSync(join(outPath, ".."), { recursive: true });
  // Byte-identical write: no trailing newline, the entry is the line.
  writeFileSync(outPath, line, "utf8");
  console.log(`Wrote ${[...line].length} characters to ${outPath}`);
}

main();
